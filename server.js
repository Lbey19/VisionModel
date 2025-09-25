// server.js — API Vision (offline, avec contexte système dynamique)
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";
import fs from "fs";
import { retrieve } from "./rag.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OLLAMA_URL = process.env.OLLAMA_URL || "http://127.0.0.1:11434";
const MODEL = process.env.LLM_MODEL || "gemma3:1b"; // Modèle plus rapide par défaut
const INDEX_FILE = path.join(process.cwd(), "rag.index.json");
const COMMUNITY = path.join(process.cwd(), "context", "community.json");

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

// Cache simple pour les embeddings (évite recalculs)
const EMBED_CACHE = new Map();
const MAX_CACHE_SIZE = 50;

/* ---------- Contexte SYSTÈME (profil + règles + format) ---------- */
function loadCommunity() {
  try {
    const raw = fs.readFileSync(COMMUNITY, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function buildSystemPrompt() {
  const c = loadCommunity();

  const communityBlock = c
    ? `
[Profil Communauté]
Nom: ${c.nom} | Env.: ${c.environnement} | Climat: ${c.climat}
Effectif: ${c.effectif_estime} | Vulnérables: ${(c.vulnerables || []).join(", ")}
Ressources: Eau=${(c.ressources?.eau || []).join("; ")} | Énergie=${(c.ressources?.energie || []).join("; ")}
Comms=${(c.ressources?.comms || []).join("; ")} | Secours=${(c.ressources?.secours || []).join("; ")}
Contraintes: ${(c.contraintes || []).join(", ")}
Zones refuge: ${(c.zones_refuge || []).join(", ")}
`
    : "[Profil Communauté] non fourni";

  return `
${communityBlock}

Tu es « Vision », assistant IA spécialisé dans la gestion d'urgence et la préparation communautaire.

Mission : fournir des réponses **pratiques, précises et utiles** adaptées au contexte fourni.

Instructions :
- Réponds TOUJOURS en français de manière claire et structurée
- Adapte le format selon le type de question :
  * Questions techniques → réponse directe avec chiffres précis
  * Questions d'urgence → plan d'action étapes par étapes
  * Questions générales → explication complète avec conseils pratiques
- Utilise des chiffres concrets (quantités, durées, températures)
- Si tu n'es pas certain, propose des fourchettes prudentes
- Base-toi sur les documents fournis quand c'est pertinent
- Évite les conseils médicaux avancés ou dangereux
`.trim();
}
/* ----------------------------------------------------------------- */

async function pingOllama() {
  try {
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), 4000);
    const r = await fetch(`${OLLAMA_URL}/api/tags`, { signal: ac.signal });
    clearTimeout(t);
    if (!r.ok) return { up: false, status: r.status };
    const j = await r.json();
    const models = Array.isArray(j.models) ? j.models.map(m => m.name) : [];
    return { up: true, models };
  } catch (e) {
    return { up: false, error: String(e) };
  }
}

app.get("/health", async (_req, res) => {
  const ollama = await pingOllama();
  res.json({ ok: true, model: MODEL, ollama: { url: OLLAMA_URL, ...ollama } });
});

app.post("/ai", async (req, res) => {
  try {
    const message = (req.body?.message || "").trim();
    if (!message) return res.status(400).json({ error: "message requis" });



    // 1) RAG local (top-k extraits depuis rag.index.json) - RÉDUIT POUR VITESSE
    let contextBlock = "", sources = [];
    if (fs.existsSync(INDEX_FILE)) {
      const r = await retrieve(INDEX_FILE, message, 3);  // Réduit de 4 à 3
      contextBlock = r.context;   // passages concaténés
      sources = r.sources;        // noms de fichiers utilisés
    }

    // 2) Prompt utilisateur (question + contexte documentaire)
    const userPrompt = `
${contextBlock ? `Contexte local (extraits fiables):\n${contextBlock}\n\n` : ""}Question: ${message}
Réponds en respectant strictement le format demandé dans le message système.
`.trim();

    // 3) Prompt système dynamique (profil + règles + format)
    const systemPrompt = buildSystemPrompt();

    // 4) Appel au LLM Vision avec timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s
    
    let r;
    try {
      r = await fetch(`${OLLAMA_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          model: MODEL,
          stream: false,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          options: {
            temperature: 0.4,    // Plus de créativité pour de meilleures réponses
            top_p: 0.9,
            num_predict: 300,    // Réponses plus complètes
            num_ctx: 2048,       // Plus de contexte pour comprendre
            top_k: 40
          }
        })
      });
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === "AbortError") {
        return res.status(408).json({ error: "timeout", detail: "Ollama: génération > 60s" });
      }
      return res.status(502).json({ error: "connection_error", detail: String(err) });
    }

    clearTimeout(timeoutId);
    const text = await r.text();
    if (!r.ok) return res.status(502).json({ error: "ollama_error", detail: text });

    let chatData;
    try {
      chatData = JSON.parse(text);
    } catch {
      return res.status(502).json({ error: "parse_error", detail: "Réponse Ollama invalide" });
    }

    const reply = chatData?.message?.content || "Pas de réponse.";
    return res.json({ reply: reply.trim(), sources, modelUsed: MODEL });

    // Fallback si le modèle personnalisé n'existe pas (non utilisé maintenant)
    if (false && /not\s*found|no\s*such\s*model|model .* not found/i.test(text)) {
      const fallbackModel = "llama3.1:8b";
      const controller2 = new AbortController();
      const timeoutId2 = setTimeout(() => controller2.abort(), 30000);
      
      try {
        const r2 = await fetch(`${OLLAMA_URL}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller2.signal,
          body: JSON.stringify({
            model: fallbackModel,
            stream: false,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt }
            ],
            options: {
              num_predict: 32,     // Extrêmement court
              temperature: 0.1,    // Quasi-déterministe
              top_k: 3,
              top_p: 0.3,
              repeat_penalty: 1.5,
              stop: ["\n", ".", "!", "?"],
              seed: 123,
              num_ctx: 512         // Contexte minimal
            }
          })
        });
        clearTimeout(timeoutId2);
        
        const text2 = await r2.text();
        if (!r2.ok) return res.status(502).json({ error: "ollama_error", detail: text2 });
        const data2 = JSON.parse(text2);
        return res.json({
          reply: data2?.message?.content ?? "Pas de réponse.",
          sources,
          modelUsed: fallbackModel
        });
      } catch (fallbackError) {
        clearTimeout(timeoutId2);
        return res.status(502).json({ error: "fallback_error", detail: String(fallbackError) });
      }
    }

    if (!r.ok) return res.status(502).json({ error: "ollama_error", detail: text });

    const data = JSON.parse(text);
    return res.json({
      reply: data?.message?.content ?? "Pas de réponse.",
      sources,
      modelUsed: MODEL
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "server_error", detail: String(e) });
  }
});

const PORT = process.env.PORT || 3001;

// Warm-up Ollama au démarrage (accélère le 1er appel)
async function warmUpOllama() {
  try {
    console.log("🔥 Warm-up Ollama...");
    await fetch(`${OLLAMA_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        stream: false,
        messages: [{ role: "user", content: "Hi" }],
        options: { num_predict: 1 }  // Très court
      })
    });
    console.log("✅ Ollama prêt!");
  } catch (e) {
    console.log("⚠️ Warm-up échoué (normal si modèle manquant)");
  }
}

app.listen(PORT, () => {
  console.log(`✅ Vision API: http://localhost:${PORT}`);
  warmUpOllama().catch(() => {}); // Réactivé
});
