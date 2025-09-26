// API.js — Router Express pour Vision (RAG prioritaire + connaissances internes)
import express from "express";
import path from "path";
import fs from "fs";
import fetch from "node-fetch";
import { fileURLToPath } from "url";
import { retrieve } from "./rag.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OLLAMA_URL = process.env.OLLAMA_URL || "http://127.0.0.1:11434";
const MODEL = process.env.LLM_MODEL || "llama3.1:8b"; // choisis un modèle installé
const INDEX_FILE = path.join(process.cwd(), "rag.index.json");
const COMMUNITY = path.join(process.cwd(), "context", "community.json");

const router = express.Router();

// ================= Helpers =================
function loadCommunity() {
  try { return JSON.parse(fs.readFileSync(COMMUNITY, "utf8")); }
  catch { return null; }
}

// classifie la question : "general" (encyclopédique) vs "survival"
function detectMode(message) {
  const m = (message || "").toLowerCase();
  const general = [
    /^qui\s+est\b/, /^qu['’]est-ce\s+que\b/, /^what\s+is\b/, /^who\s+is\b/,
    /\bbiographie\b/, /\bdéfinition\b/, /\bhistoire\b/,
    /\bfilm\b/, /\bpersonnage\b/, /\bmarvel\b/, /\bcapital(e)?\b/, /\bpays\b/
  ];
  if (general.some(rx => rx.test(m))) return "general";

  const survival = [
    /\bsurvie\b/, /\bpremiers?\s*secours\b/, /\beau\b/, /\bfiltr(e|er)\b/, /\bjavel\b/,
    /\brefuge\b/, /\bgénérateur\b/, /\bblackout\b/, /\bcoupure\b/, /\btempête\b/,
    /\balimentation\b/, /\bincendie\b/, /\bpansement\b/, /\bblessure\b/,
    /\bpanique\b/, /\bstress\b/, /\bcrise\b/, /\burgence\b/, /\bcalmer\b/,
    /\bhygiène\b/, /\bnavigation\b/, /\borientation\b/, /\bréparat(ion|eur)\b/,
    /\bévacuation\b/, /\bsurveillance\b/, /\bsécurité\b/, /\bchauffage\b/, /\bventilation\b/
  ];
  if (survival.some(rx => rx.test(m))) return "survival";

  return "general";
}

function buildSystemPrompt(mode = "survival") {
  if (mode === "general") {
    return `
Tu es « Vision », assistant IA polyvalent.
Pour les questions générales (personnes, culture, définitions, faits), réponds en français,
de manière claire et concise (1–3 paragraphes) + 3–5 points clés si utile.
N'utilise pas le format de survie. Si le sujet est fictif (ex: Marvel), précise-le.`.trim();
  }

  const c = loadCommunity();
  const community = c ? `
[Profil Communauté]
Nom: ${c.nom} | Env.: ${c.environnement} | Climat: ${c.climat}
Effectif: ${c.effectif_estime} | Vulnérables: ${(c.vulnerables||[]).join(", ")}
Ressources: Eau=${(c.ressources?.eau||[]).join("; ")} | Énergie=${(c.ressources?.energie||[]).join("; ")}
Comms=${(c.ressources?.comms||[]).join("; ")} | Secours=${(c.ressources?.secours||[]).join("; ")}
Contraintes: ${(c.contraintes||[]).join(", ")}
Zones refuge: ${(c.zones_refuge||[]).join(", ")}`
  : "[Profil Communauté] non fourni";

  return `
${community}

Tu es « Vision », assistant IA spécialisé en préparation communautaire et gestion d'urgence.
- Si des extraits locaux (RAG) sont fournis et pertinents, UTILISE-LES EN PRIORITÉ et CITE les sources.
- Si des éléments manquent, COMPLÈTE avec tes connaissances internes (modèle).

Réponds en français avec ce format :
# Évaluation rapide
# Actions immédiates (0–2 h) — étapes numérotées (≤ 7)
# Plan 24–72 h — étapes numérotées (≤ 7)
# Matériel / ressources (priorités A/B/C)
# Points de vigilance
# SOURCES (noms de fichiers locaux, si utilisés)

Règles : chiffres concrets (L, °C, minutes) ; transparence si incertitude ; interdits : armes/explosifs/toxiques et médical avancé.`.trim();
}

async function pingOllama() {
  try {
    const ac = new AbortController(); const t = setTimeout(() => ac.abort(), 4000);
    const r = await fetch(`${OLLAMA_URL}/api/tags`, { signal: ac.signal });
    clearTimeout(t);
    if (!r.ok) return { up: false, status: r.status };
    const j = await r.json(); return { up: true, models: (j.models||[]).map(m=>m.name) };
  } catch (e) { return { up: false, error: String(e) }; }
}

async function callOllama(messages, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeoutMs ?? 60000);

  try {
    const r = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model: MODEL,
        stream: false,
        messages,
        options: {
          temperature: 0.4,
          top_p: 0.9,
          num_predict: options.num_predict ?? 300,
          num_ctx: options.num_ctx ?? 2048,
          top_k: 40,
        },
      }),
    });

    const text = await r.text();
    if (!r.ok) throw new Error(`ollama_error: ${text}`);

    let data;
    try { data = JSON.parse(text); }
    catch { throw new Error("parse_error: Réponse Ollama invalide"); }

    return (data?.message?.content || "").trim();
  } finally {
    clearTimeout(timeoutId);
  }
}

// ================= Routes =================
router.get("/health", async (_req, res) => {
  res.json({ ok: true, model: MODEL, ollama: { url: OLLAMA_URL, ...(await pingOllama()) } });
});

/**
 * POST /api/chat
 * body: { message: string }
 * resp: { reply, sources?, modelUsed, mode }
 */
router.post("/chat", async (req, res) => {
  try {
    const message = (req.body?.message || "").trim();
    if (!message) return res.status(400).json({ error: "message requis" });

    // 1) Classifier : "general" vs "survival"
    const mode = detectMode(message);

    // 2) RAG : seulement en mode survival, et si utile
    let contextBlock = "", sources = [];
    if (mode === "survival" && fs.existsSync(INDEX_FILE)) {
      const r = await retrieve(INDEX_FILE, message, 3);
      const hasText = r?.context && r.context.trim().length > 80;
      const hasSources = (r?.sources || []).length > 0;
      if (hasText && hasSources) { contextBlock = r.context; sources = r.sources; }
    }

    // 3) System + User prompts
    const systemPrompt = buildSystemPrompt(mode);

    const userPrompt = (mode === "general")
      ? `Question : ${message}
Réponds de manière factuelle et concise (1–3 paragraphes) + 3–5 points clés si utile.
N'utilise pas le format de survie.`
      : (contextBlock
          ? `Contexte local (extraits fiables) :
${contextBlock}

Question : ${message}

Utilise en priorité ce contexte ; si des éléments manquent, complète avec tes connaissances internes.
Respecte le format demandé dans le message système.`
          : `Question : ${message}
Aucun extrait local pertinent détecté. Réponds avec tes connaissances internes en respectant le format de survie.`);

    // 4) Appel modèle
    const reply = await callOllama(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      { timeoutMs: 60000 }
    );

    return res.json({ reply, sources, modelUsed: MODEL, mode });
  } catch (e) {
    const msg = String(e);
    if (msg.includes("AbortError")) return res.status(408).json({ error: "timeout", detail: "Ollama: génération > 60s" });
    if (msg.startsWith("ollama_error"))   return res.status(502).json({ error: "ollama_error", detail: msg });
    if (msg.startsWith("parse_error"))    return res.status(502).json({ error: "parse_error", detail: msg });
    console.error(e);
    return res.status(500).json({ error: "server_error", detail: msg });
  }
});

export default router;
