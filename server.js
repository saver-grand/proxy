import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("MPD Restream Server Running");
});

// ====== Restream MPD Endpoint ======
app.get("/restream", async (req, res) => {
  try {
    const input = req.query.url || process.env.INPUT_MPD;

    if (!input) return res.status(400).send("Missing MPD URL ?url=");

    const response = await fetch(input);

    if (!response.ok) {
      return res.status(500).send("Failed to fetch MPD");
    }

    res.set("Content-Type", "application/dash+xml");
    response.body.pipe(res);

  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});

// ====== Widevine Device Forwarding (optional) ======
app.get("/widevine", (req, res) => {
  res.json({
    deviceId: process.env.DEVICE_ID || "02:00:00:00:00:00",
    status: "OK"
  });
});

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
