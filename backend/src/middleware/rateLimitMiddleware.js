import db from "../database/db.js";

export const rateLimitMiddleware = (req, res, next) => {
  const userId = req.user.id;

  const query = `
    SELECT COUNT(*) as count 
    FROM api_requests
    WHERE user_id = ?
    AND created_at > datetime('now', '-1 minute')
  `;

  db.get(query, [userId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const requestCount = result.count;

    const LIMIT = 10; // 🔥 istediğin gibi değiştir

    if (requestCount >= LIMIT) {
      return res.status(429).json({
        error: "Too many requests. Try again later."
      });
    }

    next();
  });
};