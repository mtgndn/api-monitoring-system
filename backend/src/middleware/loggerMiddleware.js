import db from "../database/db.js";

export const loggerMiddleware = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    const query = `
      INSERT INTO api_requests 
      (user_id, endpoint, method, status_code, ip_address)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.run(query, [
      req.user?.id || null,
      req.originalUrl,
      req.method,
      res.statusCode,
      req.ip
    ]);
  });

  next();
};