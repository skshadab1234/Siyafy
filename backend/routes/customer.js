const express = require("express");
const app = express();
const pool = require("../config");
const cors = require("cors");
const bcrypt = require("bcrypt");
const authenticate = require("../lib");
const multer = require("multer");
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
    address_country = "",
    company = "",
    address_line1 = "",
    address_line2 = "",
    city = "",
    state = "",
    pin_code = "",
    phone_number_address = "",
    note = "",
    collect_taxes = "",
    selectedCountry,
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
        pin_code, phone_number_address, note, collect_taxes, customer_media, vendor_id, store_name, countryJSONB
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) RETURNING *
    `;
  const { rows: InsertRow } = await pool.query(insertQuery, [
    first_name,
    last_name,
    email,
    phone,
    address_country,
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
    selectedCountry,
  ]);

  return InsertRow;
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

      const InsertRow = await insertCustomer(
        customerData,
        customer_media,
        req.userId,
        store_name
      );

      res.status(200).json({
        success: true,
        message: "Customer added successfully",
        data: InsertRow,
      });
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

app.put(
  "/vendors/customer/update/:customer_id",
  uploadCustomer.single("file"),
  authenticate,
  async (req, res) => {
    try {
      const { customer_id } = req.params;

      // Fetch the existing customer data
      const { rows: existingRows } = await pool.query(
        "SELECT customer_media FROM customers WHERE customer_id = $1",
        [customer_id]
      );
      const existingCustomer = existingRows[0];

      // Check if the customer has an existing media file
      const existingMediaFilePath = existingCustomer?.customer_media;
      const customer_media =
        req?.file?.filename || existingMediaFilePath || null;

      // If the customer has an existing media file, unlink it
      // if (existingMediaFilePath && customer_media) {
      //   const filePath = `./upload/customerProfile/${existingMediaFilePath}`;
      //   fs.unlinkSync(filePath);
      // }

      if (existingMediaFilePath && customer_media) {
        const filePath = `./upload/customerProfile/${existingMediaFilePath}`;
        fs.unlink(filePath, (err) => {
          if (err) {
            console.log("Error deleting file:", err);
          } else {
            console.log("File deleted successfully:", existingMediaFilePath);
          }
        });
      }

      // Get the new media file, if any, from the request

      // Construct the update query
      const updateQuery = `
        UPDATE customers
        SET
          first_name = $1,
          last_name = $2,
          email = $3,
          phone = $4,
          address_country = $5,
          address_company = $6,
          address_line1 = $7,
          address_line2 = $8,
          city = $9,
          state = $10,
          pin_code = $11,
          phone_number_address = $12,
          note = $13,
          collect_taxes = $14,
          customer_media = $15,
          countryJSONB=$17
        WHERE customer_id = $16
        RETURNING *
      `;

      const {
        first_name = "",
        last_name = "",
        email = "",
        phone = "",
        address_country = "",
        company = "",
        address_line1 = "",
        address_line2 = "",
        city = "",
        state = "",
        pin_code = "",
        phone_number_address = "",
        note = "",
        collect_taxes = false,
        selectedCountry,
      } = JSON.parse(req.body?.data);

      // Execute the update query
      const { rows } = await pool.query(updateQuery, [
        first_name,
        last_name,
        email,
        phone,
        address_country,
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
        customer_id,
        selectedCountry,
      ]);

      res.status(200).json(rows[0]);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

app.get("/vendors/customers/:id/:store", async (req, res) => {
  try {
    const { id, store } = req.params;
    const { page = 1, pageSize = 10, searchTerm } = req.query; // Extract page, pageSize, and searchTerm from query parameters

    // Calculate the offset based on the current page and page size
    const offset = (parseInt(page) - 1) * parseInt(pageSize);

    // Construct the SQL query to fetch customers based on vendor ID, store name, and optional search term
    let query = {
      text: `SELECT * FROM customers WHERE vendor_id = $1 AND store_name = $2`,
      values: [id, store],
    };

    // If search term is provided, append it to the query to search in the concatenated full name
    if (searchTerm) {
      query.text += ` AND (CONCAT(first_name, ' ', last_name) ILIKE $${
        query.values.length + 1
      } OR email ILIKE $${query.values.length + 1} OR phone ILIKE $${
        query.values.length + 1
      } OR store_name ILIKE $${query.values.length + 1})`;
      query.values.push(`%${searchTerm}%`);
    }

    // Append LIMIT and OFFSET clauses for pagination
    query.text += ` ORDER BY customer_id LIMIT $${
      query.values.length + 1
    } OFFSET $${query.values.length + 2}`;
    query.values.push(pageSize, offset);

    // Execute the query to fetch paginated customers
    const result = await pool.query(query);

    // Fetch total count of records (excluding pagination) to enable frontend pagination
    const totalCountQuery = {
      text: `SELECT COUNT(*) FROM customers WHERE vendor_id = $1 AND store_name = $2`,
      values: [id, store],
    };

    // If search term is provided, modify the total count query to include the search condition
    if (searchTerm) {
      totalCountQuery.text += ` AND (CONCAT(first_name, ' ', last_name) ILIKE $${
        totalCountQuery.values.length + 1
      } OR email ILIKE $${totalCountQuery.values.length + 1} OR phone ILIKE $${
        totalCountQuery.values.length + 1
      })`;
      totalCountQuery.values.push(`%${searchTerm}%`);
    }

    const totalCountResult = await pool.query(totalCountQuery);
    const totalCount = parseInt(totalCountResult.rows[0].count);

    // Send the fetched customers and total count as a JSON response
    res.status(200).json({ customers: result.rows, totalCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/vendors/customer/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Get the filename of the profile picture to be deleted
    const getFileNameQuery = {
      text: "SELECT customer_media FROM customers WHERE customer_id = $1",
      values: [id],
    };

    // Execute the query to get the filename
    const fileNameResult = await pool.query(getFileNameQuery);
    const fileName = fileNameResult.rows[0]?.customer_media;

    // Construct the SQL query to delete the customer record based on its ID
    const deleteQuery = {
      text: "DELETE FROM customers WHERE customer_id = $1",
      values: [id],
    };

    // Execute the delete query
    const deleteResult = await pool.query(deleteQuery);

    // Check if any rows were affected (i.e., if the record was successfully deleted)
    if (deleteResult.rowCount === 1) {
      // If a profile picture exists, delete the corresponding file
      if (fileName) {
        const filePath = `./upload/customerProfile/${fileName}`;
        fs.unlink(filePath, (err) => {
          if (err) {
            console.log("Error deleting file:", err);
          } else {
            console.log("File deleted successfully:", fileName);
          }
        });
      }
      res.status(200).json({ message: "Customer deleted successfully" });
    } else {
      // If no rows were affected, it means the record with the provided ID doesn't exist
      res.status(404).json({ error: "Customer not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = app;
