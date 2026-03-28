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

  // Proxy for Google Sheets to avoid CORS
  app.get("/api/proxy/bikes", async (req, res) => {
    try {
      const sheetId = "1lHjh3yN0W5I_hCUHcUr3kNMF4lMyl9QMD_-Tr_-q5yE";
      const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;
      const response = await axios.get(url);
      
      // Strip the prefix and suffix from Google's response
      const data = response.data;
      const jsonStr = data.substring(data.indexOf("(") + 1, data.lastIndexOf(")"));
      res.json(JSON.parse(jsonStr));
    } catch (error) {
      console.error("Error fetching bike data:", error);
      res.status(500).json({ error: "Failed to fetch bike data" });
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
