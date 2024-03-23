const express = require("express");
const app = express();
const pool = require("../config");
const cors = require("cors");
const bcrypt = require("bcrypt");
const authenticate = require("../lib");
const multer = require("multer");
app.use(express.json());

app.use(cors());
app.use((req, res, next) => {
  req.pool = pool;
  next();
});

app.post("/vendors/all", authenticate, async (req, res) => {
  try {
    // Ensure userId is present in the request
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { page = 1, pageSize = 10, search } = req.body;

    // Calculate the offset for pagination
    const offset = (page - 1) * pageSize;

    // Construct the WHERE clause for search
    let whereClause = "";
    let searchValues = [];
    if (search) {
      whereClause = `
    WHERE name ILIKE $1
    OR email ILIKE $2
    OR phone_number ILIKE $3
  `;
      searchValues = Array(3).fill(`%${search}%`);
    }

    // Query to fetch vendors with pagination and search
    const queryData = {
      text: `
    SELECT *, id as key FROM vendors_registration
    ${whereClause}
    ORDER BY id OFFSET $${search ? "4" : "1"} LIMIT $${search ? "5" : "2"}
  `,
      values: search ? [...searchValues, offset, pageSize] : [offset, pageSize],
    };

    // Query to count total number of vendors
    const queryTotal = {
      text: `
    SELECT COUNT(*) FROM vendors_registration
    ${whereClause}
  `,
      values: search ? [...searchValues] : [],
    };

    // Execute both queries concurrently using Promise.all
    const [dataResult, totalResult] = await Promise.all([
      pool.query(queryData),
      pool.query(queryTotal),
    ]);

    // Extract data and total count from query results
    const data = dataResult.rows;
    const totalCount = totalResult.rows[0].count;

    // Send the result back to the client
    res.json({ data, totalCount });
  } catch (error) {
    console.error("Error fetching vendors:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/vendors/delete", authenticate, async (req, res) => {
  try {
    // Ensure userId is present in the request
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Extract vendorIds from request body
    const { ids } = req.body;

    // Ensure vendorIds are provided
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "Vendor IDs are required" });
    }

    // Delete vendors from the database
    const query = {
      text: "DELETE FROM vendors_registration WHERE id = ANY($1)",
      values: [ids],
    };

    await pool.query(query);

    // Send success response
    res.json({ message: "Vendors deleted successfully" });
  } catch (error) {
    console.error("Error deleting vendors:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/vendors/add", authenticate, async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const {
      name,
      email,
      phone_number,
      website_url,
      about_company,
      is_multiple_shop,
      vendor_status,
      contact_person_name,
      contact_person_email,
      company_name,
      business_type,
      industry,
      head_office_address_line1,
      head_office_address_line2,
      head_office_city,
      head_office_state,
      head_office_country,
      head_office_zipcode,
    } = req.body;

    // Check if the email already exists in the database
    const existingVendor = await pool.query(
      "SELECT * FROM vendors_registration WHERE email = $1",
      [email]
    );

    if (existingVendor.rows.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Generate a random password
    const randomPassword = Math.random().toString(36).substring(2, 10); // Example: 'xj6nz5u'

    // Hash the password
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    // Insert the data into the table
    const { rows } = await pool.query(
      "INSERT INTO vendors_registration (name, email, password, phone_number, website_url, about_company, is_multiple_shop, vendor_status, contact_person_name, contact_person_email, company_name, business_type, industry, head_office_address_line1, head_office_address_line2, head_office_city, head_office_state, head_office_country, head_office_zipcode) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19) RETURNING *",
      [
        name,
        email,
        hashedPassword,
        phone_number,
        website_url,
        about_company,
        is_multiple_shop,
        vendor_status,
        contact_person_name,
        contact_person_email,
        company_name,
        business_type,
        industry,
        head_office_address_line1,
        head_office_address_line2,
        head_office_city,
        head_office_state,
        head_office_country,
        head_office_zipcode,
      ]
    );

    // Send success response
    res
      .status(200)
      .json({ message: "Vendor added successfully", data: rows?.[0] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const imgConfigVendorProfile = multer.diskStorage({
  destination: (req, file, callback) => {
    console.log(file);
    callback(null, "./upload/vendorImage");
  },
  filename: (req, file, callback) => {
    callback(null, `vendorImage-${Date.now()}-${file.originalname}`);
  },
});

// img filter
const isCategoryImage = (req, file, callback) => {
  if (file.mimetype.startsWith("image")) {
    callback(null, true);
  } else {
    callback(new Error("Only images are allowed"));
  }
};

const uploadVendor = multer({
  storage: imgConfigVendorProfile,
  fileFilter: isCategoryImage,
});

app.post(
  "/vendors/uploadImage",
  uploadVendor.single("file"),
  async (req, res) => {
    try {
      console.log(req.body);

      const { selectedKey } = req.body;

      const query = {
        text: "UPDATE vendors_registration SET vendor_image = $1 WHERE id = $2 RETURNING *",
        values: [req.file?.filename, selectedKey],
      };

      const { rows } = await pool.query(query);

      // Send success response
      res.json({ message: "Image uploaded successfully", data: rows[0] });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

module.exports = app;
