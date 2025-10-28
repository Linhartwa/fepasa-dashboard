import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Configuración del API de AppSheet
const APP_ID = "04f7bf47-3b74-4b82-a433-e6ac3e6b4199";
const API_KEY = "AFmtp-tvFPE-EY23b-ZDc1p-2gmzw-RewnK-VMNyc-I8pTk";
const TABLE = "REGISTROS REALES";

// Endpoint proxy que consulta AppSheet
app.get("/api/appsheet", async (req, res) => {
  try {
    const response = await fetch(
      `https://api.appsheet.com/api/v2/apps/${APP_ID}/tables/${encodeURIComponent(TABLE)}/records`,
      {
        method: "GET",
        headers: {
          "ApplicationAccessKey": API_KEY,
          "Accept": "application/json",
        },
      }
    );

    if (!response.ok) {
      return res.status(response.status).json({ error: "Error en AppSheet" });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Puerto Render / local
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Proxy activo en puerto ${PORT}`));
