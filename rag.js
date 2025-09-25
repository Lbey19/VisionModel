// rag.js — top-k passages pertinents
import fs from "fs";
import fetch from "node-fetch";

const OLLAMA = "http://127.0.0.1:11434";
const EMBED = "nomic-embed-text";

function cosine(a, b) {
  let dot = 0, as = 0, bs = 0;
  for (let i = 0; i < a.length; i++) { dot += a[i] * b[i]; as += a[i] * a[i]; bs += b[i] * b[i]; }
  return dot / (Math.sqrt(as) * Math.sqrt(bs));
}

async function embed(txt) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);
  
  try {
    const r = await fetch(`${OLLAMA}/api/embeddings`, {
      method: "POST", 
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({ model: EMBED, prompt: txt })
    });
    clearTimeout(timeoutId);
    
    if (!r.ok) {
      throw new Error(`Embedding API error: ${r.status} ${await r.text()}`);
    }
    
    const j = await r.json();
    if (!j.embedding) {
      throw new Error("No embedding in response");
    }
    return j.embedding;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error("Embedding timeout après 15s");
    }
    throw error;
  }
}

// Cache simple pour embeddings
const embedCache = new Map();
const MAX_CACHE = 30;

async function embedWithCache(txt) {
  // Nettoyer et normaliser la query
  const clean = txt.trim().toLowerCase().substring(0, 100);
  
  if (embedCache.has(clean)) {
    return embedCache.get(clean);
  }
  
  const embedding = await embed(txt);
  
  // Gérer taille du cache
  if (embedCache.size >= MAX_CACHE) {
    const firstKey = embedCache.keys().next().value;
    embedCache.delete(firstKey);
  }
  
  embedCache.set(clean, embedding);
  return embedding;
}

export async function retrieve(indexFile, query, k = 4) {
  const idx = JSON.parse(fs.readFileSync(indexFile, "utf8"));
  const qv = await embedWithCache(query);  // Utiliser le cache
  const scored = idx.map(e => ({ ...e, score: cosine(qv, e.vec) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
  const context = scored.map(s => `# Source: ${s.file}\n${s.text.substring(0, 400)}`).join("\n\n---\n\n");  // Limiter taille
  const sources = [...new Set(scored.map(s => s.file))];
  return { context, sources };
}
