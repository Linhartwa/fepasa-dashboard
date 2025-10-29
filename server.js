// --- fepasa-dashboard proxy server ---
import express from "express";
import fetch from "node-fetch";  // 👈 importante: usar node-fetch
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Variables de entorno (definidas en Render)
const APP_ID = process.env.APP_ID || "04f7bf47-3b74-4b82-a433-e6ac3e6b4199";
const API_KEY = process.env.API_KEY || "AFmtp-tvFPE-EY23b-ZDc1p-2gmzw-RewnK-VMNyc-I8pTk";

// --- Ruta de prueba ---
app.get("/", (req, res) => {
  res.send("✅ Servidor FEPASA activo y escuchando correctamente");
});

// --- Endpoint principal: FILTROS DASHBOARD APPSHEET ---
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

    const text = await response.text();

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

// --- Puerto de Render ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
});
