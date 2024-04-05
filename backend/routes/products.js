const express = require("express");
const app = express();
const pool = require("../config");
const cors = require("cors");
const bcrypt = require("bcrypt");
const authenticate = require("../lib");
const multer = require("multer");
const fs = require("fs");
const sendEmail = require("./nodemailer");
const { fetchAndStructureProductDetails } = require("../lib/reuse");

app.use(express.json());

app.use(cors());
app.use((req, res, next) => {
  req.pool = pool;
  next();
});

async function fetchProductById(productId) {
  const query = "SELECT * FROM products WHERE id = $1";
  const { rows } = await pool.query(query, [productId]);
  return rows[0]; // Assuming id is unique and only one product is returned
}

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
            OR sku ILIKE $1)
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

// Function to insert a product into the database
const insertProduct = async (values) => {
  try {
    const query =
      "INSERT INTO products (name, slug, type, status, featured, catalog_visibility, description, short_description, sku, price, regular_price, sale_price, date_on_sale_from, date_on_sale_from_gmt, date_on_sale_to, date_on_sale_to_gmt, on_sale, tax_status, tax_class, stock_quantity, stock_status, sold_individually, dimensions, reviews_allowed, average_rating, parent_id, purchase_note, meta_data, categories, attributes, default_attributes, images, variations, related_ids, upsell_ids, cross_sell_ids, permalink, date_created, date_created_gmt, vendor_id, store_name) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, '', $37, $38, $39, $40) RETURNING *";

    const data = await pool.query(query, values);
    return data;
  } catch (error) {
    throw error;
  }
};

const imgProduct = multer.diskStorage({
  destination: (req, file, callback) => {
    console.log(file);
    callback(null, "./upload/vendorProducts");
  },
  filename: (req, file, callback) => {
    callback(null, `vendorProducts-${Date.now()}-${file.originalname}`);
  },
});

// img filter
const isVEndorProduct = (req, file, callback) => {
  if (file.mimetype.startsWith("image")) {
    console.log(file);
    callback(null, true);
  } else {
    callback(new Error("Only images are allowed"));
  }
};

const uploadProduct = multer({
  storage: imgProduct,
  fileFilter: isVEndorProduct,
});

// Endpoint to add products
app.post(
  "/vendors/products/add",
  authenticate,
  uploadProduct.array("images"),
  async (req, res) => {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const {
        typeofUpload,
        name,
        slug = "",
        sku = null,
        typeofProduct = null,
        short_description = null,
        description = null,
        regular_price = null,
        price = null,
        width = null,
        height = null,
        length = null,
        weight = null,
        on_sale = false,
        sale_price = null,
        start_date = null,
        end_date = null,
        stock_quantity = null,
        stock_status = "instock",
        related_id = [],
        upsell_ids = [],
        cross_sell_ids = [],
        review_allowed = false,
        average_rating = 0,
        parent_id = null,
        purchase_note = null,
        meta_data = null,
        taxable = false,
        sold_individually = false,
        tax_class = "standard",
        store_name = "",
      } = req.body;

      const extractIds = (items) => items.map((item) => item.id);

      const relatedIdsArray = extractIds(related_id);
      const upsellIdsArray = extractIds(upsell_ids);
      const crossSellIdsArray = extractIds(cross_sell_ids);

      const dimensions = JSON.stringify({
        width: width || null,
        height: height || null,
        length: length || null,
        weight: weight || null,
      });

      // Get current dates in ISO format
      const currentDate = new Date();
      const dateCreated = currentDate.toISOString();
      // Convert to GMT
      const dateCreatedGMT = new Date(
        currentDate.getTime() + currentDate.getTimezoneOffset() * 60000
      ).toISOString();

      if (
        typeofUpload === "Draft" &&
        typeof name === "string" &&
        name.length >= 3
      ) {
        const values = [
          name,
          slug,
          typeofProduct,
          "draft",
          false,
          "pending",
          description,
          short_description,
          sku,
          price,
          regular_price,
          sale_price,
          start_date,
          start_date,
          end_date,
          end_date,
          on_sale,
          taxable ? "taxable" : "none",
          tax_class,
          stock_quantity,
          stock_status,
          sold_individually,
          dimensions,
          review_allowed,
          average_rating,
          parent_id,
          purchase_note,
          JSON.stringify(meta_data) || [],
          null,
          null,
          null,
          null,
          null,
          relatedIdsArray,
          upsellIdsArray,
          crossSellIdsArray,
          dateCreated,
          dateCreatedGMT,
          req.userId,
          store_name,
        ];

        const { rows } = await insertProduct(values);
        const inserted = await fetchAndStructureProductDetails(rows?.[0]);

        return res.status(200).json({
          status: true,
          message: "Draft product added successfully",
          data: rows?.[0]?.id,
          inserted,
        });
      } else if (typeofUpload === "Publish") {
        const values = [
          name,
          slug,
          typeofProduct,
          "publish",
          false,
          "visible",
          description,
          short_description,
          sku,
          price,
          regular_price,
          sale_price,
          start_date,
          start_date,
          end_date,
          end_date,
          on_sale,
          taxable ? "taxable" : "none",
          tax_class,
          stock_quantity,
          stock_status,
          sold_individually,
          dimensions,
          review_allowed,
          average_rating,
          parent_id,
          purchase_note,
          JSON.stringify(meta_data) || [],
          null,
          null,
          null,
          null,
          null,
          relatedIdsArray,
          upsellIdsArray,
          crossSellIdsArray,
          dateCreated,
          dateCreatedGMT,
          req.userId,
          store_name,
        ];

        const { rows } = await insertProduct(values);
        const inserted = await fetchAndStructureProductDetails(rows?.[0]);
        return res.status(200).json({
          status: true,
          message: "Product published successfully",
          data: rows?.[0]?.id,
          inserted,
        });
      } else {
        return res.status(400).json({
          status: false,
          error: "Invalid request for adding a product.",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

const updateProduct = async (productId, values, images) => {
  try {
    const query = `
      UPDATE products 
      SET 
        name = $1,
        slug = $2,
        type = $3,
        status = $4,
        featured = $5,
        catalog_visibility = $6,
        description = $7,
        short_description = $8,
        sku = $9,
        price = $10,
        regular_price = $11,
        sale_price = $12,
        date_on_sale_from = $13,
        date_on_sale_from_gmt = $14,
        date_on_sale_to = $15,
        date_on_sale_to_gmt = $16,
        on_sale = $17,
        tax_status = $18,
        tax_class = $19,
        stock_quantity = $20,
        stock_status = $21,
        sold_individually = $22,
        dimensions = $23,
        reviews_allowed = $24,
        average_rating = $25,
        parent_id = $26,
        purchase_note = $27,
        meta_data = $28,
        categories = $29,
        attributes = $30,
        default_attributes = $31,
        variations = $32,
        related_ids = $33,
        upsell_ids = $34,
        cross_sell_ids = $35,
        permalink = $36,
        date_modified = $37,
        date_modified_gmt = $38, 
        images = $40
      WHERE id = $39
      RETURNING *
    `;

    const { rows } = await pool.query(query, [...values, productId, images]);
    return { rows };
  } catch (error) {
    throw error;
  }
};

app.put(
  "/vendors/products/update/:id",
  authenticate,
  uploadProduct.array("images"),
  async (req, res) => {
    try {
      const productId = req.params.id;

      // Extract files from req.files
      const files = req.files || {};

      const { images } = await fetchProductById(productId);

      // Assuming `images` is a JSON string of an array from your database
      let existingImages = [];

      // Check if images is a string and try to parse it
      if (typeof images === "string") {
        try {
          existingImages = JSON.parse(images);
        } catch (error) {
          console.error("Error parsing images JSON", error);
          // Handle cases where images might be a string array but not wrapped in double quotes for JSON
          // This is just a fallback and should be corrected at the source if possible
          existingImages = images
            .split(",")
            .map((image) => image.trim().replace(/^"|"$/g, ""));
        }
      } else if (Array.isArray(images)) {
        // If images is already an array, use it directly
        existingImages = images;
      }

      // Proceed with the rest of your code to append new filenames and stringify
      const filenames = Object.values(files).map((file) => file.filename);
      const updatedImagesArray = [...existingImages, ...filenames];
      const imagesJSON = JSON.stringify(updatedImagesArray);
      const {
        typeofUpload,
        name,
        slug = "",
        sku = null,
        typeofProduct = null,
        short_description = null,
        description = null,
        regular_price = null,
        price = null,
        width = null,
        height = null,
        length = null,
        weight = null,
        on_sale = false,
        sale_price = null,
        start_date = null,
        end_date = null,
        stock_quantity = null,
        stock_status = "instock",
        related_id = [],
        upsell_ids = [],
        cross_sell_ids = [],
        review_allowed = false,
        average_rating = 0,
        parent_id = null,
        purchase_note = null,
        meta_data = null,
        taxable = false,
        sold_individually = false,
        tax_class = "standard",
      } = JSON.parse(req.body.formData);

      console.log(JSON.parse(req.body.formData));
      const extractIds = (items) => items.map((item) => item.id);

      const relatedIdsArray = extractIds(related_id);
      const upsellIdsArray = extractIds(upsell_ids);
      const crossSellIdsArray = extractIds(cross_sell_ids);

      const dimensions = JSON.stringify({
        width: width || null,
        height: height || null,
        length: length || null,
        weight: weight || null,
      });

      const currentDate = new Date();
      const dateUpdated = currentDate.toISOString();
      const dateUpdatedGMT = currentDate.toISOString(); // No need to convert to GMT here

      if (
        typeofUpload?.toLowerCase() !== "draft" &&
        typeofUpload?.toLowerCase() !== "publish"
      ) {
        return res.status(400).json({
          status: false,
          error: "Invalid request for updating a product.",
        });
      }

      const status = typeofUpload === "Draft" ? "draft" : "publish";
      const catalog_visibility = typeofUpload;

      const values = [
        name,
        slug,
        typeofProduct,
        status,
        false,
        catalog_visibility,
        description,
        short_description,
        sku,
        price,
        regular_price,
        sale_price,
        start_date,
        start_date ? start_date.toISOString() : null, // Convert to ISO string if start_date is provided
        end_date,
        end_date ? end_date.toISOString() : null, // Convert to ISO string if end_date is provided
        on_sale,
        taxable,
        tax_class,
        stock_quantity,
        stock_status,
        sold_individually,
        dimensions,
        review_allowed,
        average_rating,
        parent_id,
        purchase_note,
        JSON.stringify(meta_data) || [],
        null,
        null,
        null,
        null,
        relatedIdsArray,
        upsellIdsArray,
        crossSellIdsArray,
        "",
        dateUpdated,
        dateUpdatedGMT,
      ];

      const { rows } = await updateProduct(productId, values, imagesJSON);

      const updatedRow = await fetchAndStructureProductDetails(rows?.[0]);

      return res.status(200).json({
        status: true,
        message:
          typeofUpload === "Draft"
            ? "Draft product updated successfully"
            : "Product published successfully",
        data: rows?.[0]?.id,
        updatedRow,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

app.get("/getProductsListofVendors", authenticate, async (req, res) => {
  try {
    const vendorid = req.userId;
    const { page = 1, pageSize = 10, search = "" } = req.query;

    if (!vendorid) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let query = `
      SELECT * FROM products
      WHERE vendor_id = $1
    `;
    const params = [vendorid];

    if (search) {
      query += ` AND (name ILIKE $${params.length + 1} OR description ILIKE $${
        params.length + 1
      } OR sku ILIKE $${params.length + 1})`;
      params.push(`%${search}%`);
    }

    query += ` ORDER BY id LIMIT $${params.length + 1} OFFSET $${
      params.length + 2
    }`;
    params.push(pageSize);
    params.push((page - 1) * pageSize);

    const { rows } = await pool.query(query, params);

    // Use the reusable function for restructuring products
    const restructuredProducts = await Promise.all(
      rows.map(fetchAndStructureProductDetails)
    );

    res.status(200).json({ products: restructuredProducts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = app;
