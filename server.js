import express from "express";
import api from "./api.js"; // <-- ce fichier
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// sert le front (si tu en as un)
app.use(express.static(path.join(__dirname, "public")));

// monte l’API sous /api
app.use("/api", api);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ Serveur lancé sur http://localhost:${PORT}`));
