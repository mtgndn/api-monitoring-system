import db from "../database/db.js";

// 🔥 Toplam request sayısı
export const getTotalRequests = (req, res) => {
  db.get(`SELECT COUNT(*) as total FROM api_requests`, [], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
};

// 🔥 En çok kullanılan endpointler
export const getTopEndpoints = (req, res) => {
  db.all(
    `
    SELECT endpoint, COUNT(*) as count
    FROM api_requests
    GROUP BY endpoint
    ORDER BY count DESC
    LIMIT 5
    `,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
};

// 🔥 Son 7 gün kullanım
export const getDailyUsage = (req, res) => {
  db.all(
    `
    SELECT DATE(created_at) as date, COUNT(*) as count
    FROM api_requests
    GROUP BY DATE(created_at)
    ORDER BY date DESC
    LIMIT 7
    `,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
};