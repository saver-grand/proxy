import https from "https";
import fetch from "node-fetch";

// create an agent that ignores SSL certificate errors
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

const response = await fetch(target, {
    agent: httpsAgent,
    headers: {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:139.0) Gecko/20100101 Firefox/139.0",
        "Referer": "https://embednow.top/",
        "Origin": "https://embednow.top"
    }
});
