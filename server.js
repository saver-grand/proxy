import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("MPD + Widevine Restream Server Running");
});

// ======================= RESTREAM MPD ===========================
app.get("/restream", async (req, res) => {
  try {
    const mpd = req.query.mpd || process.env.MPD_URL;
    const key = req.query.key || process.env.KEY_URL;

    if (!mpd) return res.status(400).send("Missing MPD URL (?mpd=)");
    if (!key) return res.status(400).send("Missing KEY URL (?key=)");

    // Add key server info to HTTP header so players can use it
    res.set("X-Widevine-License-Server", key);

    const response = await fetch(mpd);

    if (!response.ok) {
      return res.status(500).send("Failed to fetch MPD");
    }

    res.set("Content-Type", "application/dash+xml");
    response.body.pipe(res);

  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});

// ======================= KEY FORWARD ============================
app.get("/key", async (req, res) => {
  try {
    const keyURL = req.query.url || process.env.KEY_URL;

    if (!keyURL) return res.status(400).send("Missing key URL");

    const result = await fetch(keyURL, {
      method: "POST",
      body: req.body,
      headers: req.headers
    });

    res.set("Content-Type", result.headers.get("Content-Type"));
    result.body.pipe(res);
  } catch (err) {
    res.status(500).send("Key Forward Error: " + err.message);
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
