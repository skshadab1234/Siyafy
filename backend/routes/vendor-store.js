const express = require("express");
const app = express();
const pool = require("../config");
const cors = require("cors");
const bcrypt = require("bcrypt");
const authenticate = require("../lib");
const multer = require("multer");
const sendEmail = require("./nodemailer");
const jwt = require("jsonwebtoken"); // Import jsonwebtoken

const fs = require("fs");

app.use(express.json());

app.use(cors());
app.use((req, res, next) => {
  req.pool = pool;
  next();
});

const oneDayInSeconds = 24 * 60 * 60; // One day in seconds

app.post("/vendorLogin", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Email ko lower case mein convert karein
    const lowerCaseEmail = email.toLowerCase();

    // Query ko execute karte waqt lower case email ka istemal karein
    const result = await req.pool.query(
      "SELECT * FROM vendors_registration WHERE email ILIKE $1",
      [lowerCaseEmail]
    );

    if (result.rows.length > 0) {
      const vendorLogin = result.rows[0];
      const hashedPassword = vendorLogin.password; // Assuming the hashed password is stored in the 'password' field

      // Compare the hashed password with the input password
      const passwordMatch = await bcrypt.compare(password, hashedPassword);
      if (passwordMatch) {
        const token = jwt.sign({ id: vendorLogin.id }, process.env.SECRET_KEY, {
          expiresIn: oneDayInSeconds, // Token expires in one day (in seconds)
        });
        // Set a cookie with the JWT
        const expiryDate = new Date(Date.now() + oneDayInSeconds * 1000); // Calculate the expiry date (one day from now)
        res.cookie("tokenVendorLogin", token, {
          httpOnly: true,
          secure: false, // Set secure to true if you're using HTTPS
          expires: expiryDate, // Set the expiry date
        });

        res.status(200).send({
          status: 200,
          message: "Login successful.",
          token,
          expiryTime: expiryDate, // Return the expiry time to the client
        });
      } else {
        // Passwords do not match
        res.status(200).json({ status: 400, message: "Invalid Password..." });
      }
    } else {
      res.status(200).json({ status: 400, message: "Email does not exist." });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/getVendorLoginDetails", authenticate, async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(200).json({
        status: false,
        message: "Please login first",
      });
    }

    // Query to fetch vendor details
    const vendorDataQuery = await req.pool.query(
      "SELECT * FROM vendors_registration WHERE id = $1",
      [req.userId]
    );

    if (vendorDataQuery.rows.length === 0) {
      return res.status(200).json({
        status: false,
        message: `User with ID ${req.userId} not found`,
      });
    }

    // Query to fetch associated stores
    const storeDataQuery = await req.pool.query(
      "SELECT * FROM stores WHERE vendor_id = $1",
      [req.userId]
    );

    const vendorDetails = vendorDataQuery.rows[0];
    const stores = storeDataQuery.rows;

    // Construct response object with vendor details and associated stores
    const responseData = {
      ...vendorDetails,
      stores: stores,
    };

    return res.status(200).json({
      status: true,
      data: responseData,
      message: "Vendor data with associated stores fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching vendor data:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/checkstoreExists/:id/:storeName", async (req, res) => {
  try {
    const { id, storeName } = req.params;

    // Query to check if the provided id and storeName exist in the stores table
    const query = `
      SELECT EXISTS (
        SELECT 1
        FROM stores
        WHERE vendor_id = $1 AND store_slug = $2
      ) AS store_exists;
    `;

    const result = await pool.query(query, [id, storeName]);

    // Extract the value of store_exists from the query result
    const { store_exists } = result.rows[0];

    res.json({ success: store_exists });
  } catch (error) {
    console.error("Error checking store existence:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

function generateApiKey() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let apiKey = "";
  for (let i = 0; i < 12; i++) {
    apiKey += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return apiKey;
}

app.post("/createApi", authenticate, async (req, res) => {
  try {
    console.log(req.body);
    let apiKey = generateApiKey();
    let apiKeyExists = true;

    while (apiKeyExists) {
      // Query to check if the generated API key exists
      const checkQuery = `
        SELECT EXISTS(
          SELECT 1 
          FROM stores 
          WHERE api_key @> $1::jsonb
        )`;
      const { rows } = await pool.query(checkQuery, [
        JSON.stringify([{ apiKey }]),
      ]);

      if (rows[0].exists) {
        // If API key exists, generate a new one and loop again
        apiKey = generateApiKey();
      } else {
        apiKeyExists = false;
      }
    }

    // Get the current timestamp
    const currentTime = new Date().toISOString();

    // Query to get the count of existing API keys
    const countQuery = `
      SELECT api_key
      FROM stores
      WHERE store_slug = $1 AND vendor_id = $2 AND api_key IS NOT NULL`;

    const countResult = await pool.query(countQuery, [
      req.body.store_name,
      req.userId,
    ]);

    console.log(countResult.rows[0]?.api_key?.length, "countResult");
    const keyCount = parseInt(countResult.rows[0]?.api_key?.length) || 0;

    if (keyCount >= 5) {
      // If the maximum limit of API keys is reached, return an error
      return res
        .status(400)
        .json({ success: false, error: "Maximum limit of API keys reached" });
    }

    // Once a unique API key is generated and limit check is passed, append it to the existing JSONB array
    const appendQuery = `
      UPDATE stores 
      SET api_key = COALESCE(api_key, '[]'::jsonb) || $1::jsonb
      WHERE store_slug = $2 AND vendor_id = $3
      RETURNING *;`;

    const appendResult = await pool.query(appendQuery, [
      JSON.stringify([{ apiKey, created_at: currentTime }]), // Updated to include apiKey and created_at date
      req.body.store_name,
      req.userId,
    ]);

    if (appendResult.rows.length > 0) {
      // Success, API key added
      res.json({
        success: true,
        message: "API Key generated and stored successfully.",
        apiKey,
      });
    } else {
      // Store not found or update failed
      res
        .status(404)
        .json({ success: false, error: "Store not found or update failed" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/Vendor/getApi", authenticate, async (req, res) => {
  try {
    // Ensure user is authenticated
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Extract required data from request body
    const { store_name } = req.body;

    // Query to fetch API key data based on store_slug and vendor_id
    const query = `
      SELECT api_key
      FROM stores
      WHERE store_slug = $1 AND vendor_id = $2`;

    const { rows } = await pool.query(query, [store_name, req.userId]);

    // Extract API key data from the query result
    const apiKeys = rows.map((row) => row.api_key);

    // Send the API key data to the frontend
    res.json(apiKeys);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = app;
