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

const imgVendor = multer.diskStorage({
  destination: (req, file, callback) => {
    console.log(file);
    callback(null, "./upload/customerProfile");
  },
  filename: (req, file, callback) => {
    callback(null, `customerProfile-${Date.now()}-${file.originalname}`);
  },
});

// img filter
const isCustomerfilter = (req, file, callback) => {
  if (file.mimetype.startsWith("image")) {
    callback(null, true);
  } else {
    callback(new Error("Only images are allowed"));
  }
};

const uploadCustomer = multer({
  storage: imgVendor,
  fileFilter: isCustomerfilter,
});

async function insertCustomer(
  customerData,
  customer_media,
  vendor_id,
  store_name
) {
  const {
    first_name = "",
    last_name = "",
    email = "",
    phone = "",
    country = "",
    company = "",
    address_line1 = "",
    address_line2 = "",
    city = "",
    state = "",
    pin_code = "",
    phone_number_address = "",
    note = "",
    collect_taxes = "",
  } = customerData;

  // Check if the email already exists for the given vendor and store
  const emailExistsQuery = `
      SELECT EXISTS (
        SELECT 1 
        FROM customers 
        WHERE email = $1 AND vendor_id = $2 AND store_name = $3
      )
    `;
  const { rows } = await pool.query(emailExistsQuery, [
    email,
    vendor_id,
    store_name,
  ]);
  const emailExists = rows[0].exists;

  if (emailExists) {
    throw new Error("Email already exists for this vendor and store");
  }

  // Inserting customer data into the database
  const insertQuery = `
      INSERT INTO customers (
        first_name, last_name, email, phone, address_country,
        address_company, address_line1, address_line2, city, state,
        pin_code, phone_number_address, note, collect_taxes, customer_media, vendor_id, store_name
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
    `;
  await pool.query(insertQuery, [
    first_name,
    last_name,
    email,
    phone,
    country,
    company,
    address_line1,
    address_line2,
    city,
    state,
    pin_code,
    phone_number_address,
    note,
    collect_taxes,
    customer_media,
    vendor_id,
    store_name,
  ]);
}

app.post(
  "/vendors/customer/add",
  uploadCustomer.single("file"),
  authenticate,
  async (req, res) => {
    try {
      let customer_media = req?.file?.filename || null;
      const { data, store_name } = req.body;
      const customerData = JSON.parse(data);

      await insertCustomer(
        customerData,
        customer_media,
        req.userId,
        store_name
      );

      res
        .status(200)
        .json({ success: true, message: "Customer added successfully" });
    } catch (error) {
      console.log(error);
      if (error.message === "Email already exists for this vendor and store") {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  }
);

module.exports = app;
