import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 10000;

app.get("/proxy", async (req, res) => {
    const target = req.query.url;

    if (!target) {
        return res.status(400).send("Missing ?url parameter");
    }

    try {
        // Forward request with custom allowed headers
        const response = await fetch(target, {
            headers: {
                "User-Agent": req.headers["user-agent"] || "Mozilla/5.0",
                "Referer": req.headers["referer"] || "https://embednow.top/",
                "Origin": req.headers["origin"] || "https://embednow.top"
            }
        });

        // Copy the content type (M3U8, TS, MP4, etc.)
        res.set("Content-Type", response.headers.get("content-type"));

        // Stream the video or playlist back to the client
        response.body.pipe(res);

    } catch (err) {
        res.status(500).send("Proxy error: " + err.message);
    }
});

app.listen(PORT, () => {
    console.log("Proxy server running on port " + PORT);
});
