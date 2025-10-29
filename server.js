import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

// 🔓 Paso clave: permitir que GitHub Pages acceda
app.use(cors({
  origin: [
    "https://linhartwa.github.io",   // permite tu dashboard
    "http://localhost:3000"          // para pruebas locales
  ],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "ApplicationAccessKey"]
}));

app.use(express.json());

// 🔐 Tus credenciales de AppSheet
const APP_ID = "04f7bf47-3b74-4b82-a433-e6ac3e6b4199";
const API_KEY = "AFmtp-tvFPE-EY23b-ZDc1p-2gmzw-RewnK-VMNyc-I8pTk";

// ✅ 1. Datos de REGISTROS REALES
app.get("/api/registros", async (req, res) => {
  try {
    const r = await fetch(
      `https://api.appsheet.com/api/v2/apps/${APP_ID}/tables/REGISTROS%20REALES/records`,
      {
        method: "GET",
        headers: {
          "ApplicationAccessKey": API_KEY,
          "Accept": "application/json"
        }
      }
    );
    const data = await r.json();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// --- Endpoint 2: FILTROS DASHBOARD APPSHEET ---
app.get("/api/filtros", async (req, res) => {
  try {
    const response = await fetch(
      `https://api.appsheet.com/api/v2/apps/${APP_ID}/tables/FILTROS%20DASHBOARD%20APPSHEET/records`,
      {
        method: "GET",
        headers: {
          "ApplicationAccessKey": API_KEY,
          "Accept": "application/json",
        },
      }
    );

    const text = await response.text(); // 🔍 obtenemos texto sin asumir formato
    if (!text) {
      return res.status(500).json({ error: "Respuesta vacía desde AppSheet" });
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(500).json({
        error: "Formato JSON inválido recibido desde AppSheet",
        raw: text,
      });
    }

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
