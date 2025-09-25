// ingest.js — docs -> chunks -> embeddings -> rag.index.json
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import mammoth from "mammoth";

const OLLAMA = process.env.OLLAMA_URL || "http://127.0.0.1:11434";
const EMBED = process.env.EMBED_MODEL || "nomic-embed-text";
const DOCS = path.join(process.cwd(), "docs");
const OUT = path.join(process.cwd(), "rag.index.json");

function split(text, size = 800, overlap = 120) {
  const words = text.split(/\s+/);
  const chunks = [];
  for (let i = 0; i < words.length; i += (size - overlap)) {
    const chunk = words.slice(i, i + size).join(" ");
    if (chunk.trim().length > 0) chunks.push(chunk);
    if (i + size >= words.length) break;
  }
  return chunks;
}

async function toText(p) {
  const ext = path.extname(p).toLowerCase();
  if (ext === ".txt" || ext === ".md") return fs.readFileSync(p, "utf8");
  // PDF ignoré par défaut pour éviter des soucis de dépendances.
  // Convertissez-les d'abord en .txt/.md si possible.
  if (ext === ".pdf") { console.log("ℹ️ PDF ignoré (convertir en .txt/.md):", p); return ""; }
  if (ext === ".docx") {
    const buf = fs.readFileSync(p);
    const out = await mammoth.extractRawText({ buffer: buf });
    return out.value;
  }
  console.log("⚠️ format ignoré:", p);
  return "";
}

async function embed(txt) {
  const r = await fetch(`${OLLAMA}/api/embeddings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: EMBED, prompt: txt })
  });
  const j = await r.json();
  if (!j.embedding) throw new Error("Erreur embeddings");
  return j.embedding;
}

async function main() {
  if (!fs.existsSync(DOCS)) throw new Error(`Dossier docs introuvable: ${DOCS}`);
  const files = fs.readdirSync(DOCS).filter(f => /(txt|md|pdf|docx)$/i.test(f));
  const entries = [];
  for (const f of files) {
    const p = path.join(DOCS, f);
    const raw = (await toText(p)).replace(/\s+\n/g, "\n").trim();
    if (!raw) continue;
    for (const chunk of split(raw)) {
      const vec = await embed(chunk);
      entries.push({ file: f, text: chunk, vec });
    }
  }
  fs.writeFileSync(OUT, JSON.stringify(entries));
  console.log("✅ Index créé:", OUT, "| chunks:", entries.length);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
