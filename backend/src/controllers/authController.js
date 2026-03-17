import db from "../database/db.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

export const register = (req, res) => {
  const { email, password } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 10);
  const apiKey = crypto.randomBytes(32).toString("hex");

  const query = `
    INSERT INTO users (email, password, api_key)
    VALUES (?, ?, ?)
  `;

  db.run(query, [email, hashedPassword, apiKey], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({
      message: "User created",
      userId: this.lastID,
      apiKey
    });
  });
};