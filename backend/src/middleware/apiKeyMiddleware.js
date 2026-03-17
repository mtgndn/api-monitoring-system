import db from "../database/db.js";

export const apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res.status(401).json({ error: "API key missing" });
  }

  const query = `SELECT * FROM users WHERE api_key = ?`;

  db.get(query, [apiKey], (err, user) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!user) {
      return res.status(403).json({ error: "Invalid API key" });
    }

    // user'ı request'e ekliyoruz
    req.user = user;

    next();
  });
};