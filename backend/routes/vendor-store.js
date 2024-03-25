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

    const result = await req.pool.query(
      "SELECT * FROM vendors_registration WHERE email = $1",
      [email]
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
      stores: stores
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

app.get('/checkstoreExists/:id/:storeName', async(req, res) => {
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
module.exports = app;
