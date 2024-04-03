const express = require("express");
const app = express();
const pool = require("../config");
const cors = require("cors");
const bcrypt = require("bcrypt");
const authenticate = require("../lib");
const multer = require("multer");
const fs = require("fs");
const sendEmail = require("./nodemailer");

app.use(express.json());

app.use(cors());
app.use((req, res, next) => {
  req.pool = pool;
  next();
});

app.get("/products/search", authenticate, async (req, res) => {
  try {
    console.log(req.query);

    // Ensure req.userId is available
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Check if query parameter 'q' exists
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: "Query parameter 'q' is missing" });
    }

    // Fetch products based on search query (limit of 20)
    const queryText = `
        SELECT * 
        FROM products 
        WHERE (name ILIKE $1 OR 
            description  ILIKE $1 
            OR short_description  ILIKE $1
            OR sku ILIKE $1) AND status = 'Approved'
        LIMIT 20
      `;
    const result = await pool.query(queryText, [`%${q}%`]);

    // Send the fetched products
    res.json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = app;
