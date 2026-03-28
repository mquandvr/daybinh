import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Proxy for fuel prices to avoid CORS
  app.get("/api/proxy/fuel", async (req, res) => {
    try {
      const { date } = req.query;
      const url = `https://giaxanghomnay.com/api/pvdate/${date}`;
      const response = await axios.get(url);
      res.json(response.data);
    } catch (error) {
      console.error("Error fetching fuel data:", error);
      res.status(500).json({ error: "Failed to fetch fuel data" });
    }
  }); 

  // Proxy for Google Apps Script to avoid CORS
  app.get("/api/proxy/vehicles", async (req, res) => {
    try {
      const url = "https://script.google.com/macros/s/AKfycbzyhYBKeJpj5DYNZ4s6He4X9CXE09lnckQTOeJA7S6M7DEPHYhKNOYsZayKMf-hLMre/exec";
      const response = await axios.get(url, {
        maxRedirects: 5,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0'
        }
      });
      res.json(response.data);
    } catch (error) {
      console.error("Error fetching vehicle data:", error);
      res.status(500).json({ error: "Failed to fetch vehicle data" });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
