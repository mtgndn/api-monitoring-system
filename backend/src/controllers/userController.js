import db from "../database/db.js";
import crypto from "crypto";

// 🔥 CREATE KEY
export const createApiKey = (req, res) => {
  const apiKey = crypto.randomBytes(32).toString("hex");

  const email = "user_" + Date.now() + "@test.com";

  db.run(
    "INSERT INTO users (email, password, api_key) VALUES (?, ?, ?)",
    [email, "123456", apiKey],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({ apiKey });
    }
  );
};

// 🔥 REGENERATE KEY
export const regenerateApiKey = (req, res) => {
  const newKey = crypto.randomBytes(32).toString("hex");

  db.run(
    "UPDATE users SET api_key = ? WHERE api_key = ?",
    [newKey, req.user.api_key],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({
        message: "API key updated",
        apiKey: newKey
      });
    }
  );
};