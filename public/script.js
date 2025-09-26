const API_URL = "/ai";
const HEALTH_URL = "/health";

class VisionUI {
  constructor() {
    this.el = {
      messages: document.getElementById("messages"),
      composer: document.getElementById("composer"),
      prompt: document.getElementById("prompt"),
      send: document.getElementById("send"),
      counter: document.getElementById("counter"),
      statusDot: document.getElementById("status-dot"),
      statusText: document.getElementById("status-text"),
      tpl: document.getElementById("message-tpl"),
    };
    this.history = [];
    this.bind();
    this.health();
    this.greet();
  }

  bind() {
    // autosize textarea
    const resize = () => {
      this.el.prompt.style.height = "auto";
      this.el.prompt.style.height = Math.min(this.el.prompt.scrollHeight, 220) + "px";
      this.el.counter.textContent = `${this.el.prompt.value.length}/1000`;
    };
    this.el.prompt.addEventListener("input", resize);
    resize();

    this.el.composer.addEventListener("submit", (e) => this.onSubmit(e));
    this.el.prompt.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        this.el.composer.requestSubmit();
      }
    });
  }

  async health() {
    try {
      const r = await fetch(HEALTH_URL);
      const j = await r.json();
      if (j?.ollama?.up) {
        this.setStatus(true, `Connecté – ${j.model}`);
      } else {
        this.setStatus(false, "Hors ligne");
      }
    } catch {
      this.setStatus(false, "Hors ligne");
    }
  }

  setStatus(ok, text){
    this.el.statusText.textContent = text;
    this.el.statusDot.classList.toggle("ok", !!ok);
    this.el.statusDot.classList.toggle("bad", !ok);
  }

  greet(){
    this.addMessage(
      "👋 Salut ! Je suis Vision. Pose ta question (survie ou générale) et je t’aide avec une réponse claire. Pour une urgence, précise le contexte.",
      "bot"
    );
  }

  toast(msg){
    const t = document.createElement("div");
    t.className = "toast";
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(()=> t.remove(), 3000);
  }

  scrollBottom(){
    this.el.messages.scrollTo({ top: this.el.messages.scrollHeight, behavior: "smooth" });
  }

  // ——— Markdown & “format survie” renderer ———
  formatMessage(content){
    let md = String(content || "")
      .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");

    // code fences
    md = md.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    // inline code
    md = md.replace(/`([^`]+)`/g, '<code>$1</code>');
    // bold / italic
    md = md.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    md = md.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    const lines = md.split(/\r?\n/);
    const out = [];
    let inUL=false, inOL=false;

    const closeLists = () => {
      if(inUL){ out.push("</ul>"); inUL=false; }
      if(inOL){ out.push("</ol>"); inOL=false; }
    };

    const isSurvivalHeading = (t) =>
      /^#\s*(Évaluation rapide|Actions immédiates|Plan 24[–-]72 h|Matériel ?\/ ?ressources|Points de vigilance|SOURCES)/i.test(t);

    let openSection = false;

    for(const raw of lines){
      const t = raw.trim();

      // headings
      if(/^###\s+/.test(t)){ closeLists(); out.push(`<h3 class="h3">${t.replace(/^###\s+/,"")}</h3>`); continue; }
      if(/^##\s+/.test(t)){ closeLists(); out.push(`<h2 class="h2">${t.replace(/^##\s+/,"")}</h2>`); continue; }
      if(/^#\s+/.test(t)){
        closeLists();
        const title = t.replace(/^#\s+/,"");
        if(isSurvivalHeading(t)){
          if(openSection){ out.push(`</div>`); openSection=false; }
          out.push(`<div class="vision-section"><div class="section-title"><span class="chip"></span>${title}</div>`);
          out.push(`<div class="section-body">`);
          openSection=true;
        }else{
          if(openSection){ out.push(`</div>`); openSection=false; }
          out.push(`<h1 class="h1">${title}</h1>`);
        }
        continue;
      }

      // lists
      if(/^(\*|-)\s+/.test(t)){
        if(!inUL){ closeLists(); out.push('<ul class="ul">'); inUL=true; }
        out.push(`<li>${t.replace(/^(\*|-)\s+/, "")}</li>`);
        continue;
      }
      if(/^\d+\.\s+/.test(t)){
        if(!inOL){ closeLists(); out.push('<ol class="ol">'); inOL=true; }
        out.push(`<li>${t.replace(/^\d+\.\s+/, "")}</li>`);
        continue;
      }

      // blank
      if(t===""){
        closeLists();
        out.push("<br>");
        continue;
      }

      // paragraph
      out.push(`<p>${t}</p>`);
    }

    closeLists();
    if(openSection){ out.push(`</div>`); } // close last section-body + section

    return out.join("\n");
  }

  // ——— message bubble ———
  addMessage(content, who="bot", meta={}){
    const n = this.el.tpl.content.firstElementChild.cloneNode(true);
    n.classList.add(who);

    const av = n.querySelector(".message-avatar");
    av.innerHTML = who === "bot" ? '<i class="fa-solid fa-robot"></i>' : '<i class="fa-solid fa-user"></i>';

    const box = n.querySelector(".message-content");
    box.innerHTML = this.formatMessage(content);

    // sources footer
    if (who === "bot" && Array.isArray(meta.sources) && meta.sources.length){
      const footer = document.createElement("div");
      footer.className = "sources-footer";
      footer.innerHTML =
        `<i class="fa-solid fa-link"></i>` +
        meta.sources.map(s => `<span class="source-tag" title="Source locale">${s}</span>`).join("");
      box.appendChild(footer);
    }

    this.el.messages.appendChild(n);
    this.history.push({ who, content, meta, t: Date.now() });
    this.scrollBottom();
  }

  // ——— submit ———
  async onSubmit(e){
    e.preventDefault();
    const text = this.el.prompt.value.trim();
    if(!text) return;

    this.addMessage(text, "user");
    this.el.prompt.value="";
    this.el.counter.textContent="0/1000";
    this.el.prompt.style.height="40px";
    this.el.send.disabled = true;

    try{
      const r = await fetch(API_URL, {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ message: text })
      });
      const j = await r.json();
      if(!r.ok){
        this.addMessage("⚠️ Erreur côté serveur.", "bot");
      }else{
        this.addMessage(j.reply || "—", "bot", { sources: j.sources, mode: j.mode });
      }
    }catch(err){
      this.addMessage("⚠️ Impossible de contacter l’API.", "bot");
      console.error(err);
      this.toast("Connexion perdue. Vérifie le serveur.");
    }finally{
      this.el.send.disabled = false;
      setTimeout(()=> this.health(), 50);
    }
  }
}

new VisionUI();
