const express = require("express");
const app = express();
const pool = require("../config");
const cors = require("cors");

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  req.pool = pool;
  next();
});

// Define a route to accept and console the data
app.post("/SetAttributesValues", async (req, res) => {
  try {
    const {
      attributeName,
      attributeValues,
      type,
      category,
      subcategory,
      backendCategory,
      backendSubCategory,
    } = req.body;

    let attributeId;
    if (type === "update") {
      // Update existing attribute
      const updateQuery = `
                UPDATE attributes
                SET attribute_values = $1, category = $2, subcategory = $3
                WHERE attribute_name = $4
                RETURNING attribute_id;
            `;
      const { rows: updatedRows } = await pool.query(updateQuery, [
        attributeValues,
        JSON.stringify(category),
        JSON.stringify(subcategory),
        attributeName,
      ]);

      if (updatedRows.length > 0) {
        attributeId = updatedRows[0].attribute_id;
      } else {
        return res.status(404).json({ error: "Attribute not found" });
      }
    } else if (type === "add") {
      // Insert new attribute
      const checkQuery = `
                SELECT COUNT(*) AS count
                FROM attributes
                WHERE attribute_name = $1 AND category = $2 AND subcategory = $3;
            `;
      const { rows } = await pool.query(checkQuery, [
        attributeName,
        JSON.stringify(category),
        JSON.stringify(subcategory),
      ]);
      const existingAttributeCount = parseInt(rows[0].count, 10);

      if (existingAttributeCount === 0) {
        const insertQuery = `
                    INSERT INTO attributes (attribute_name, attribute_values, category, subcategory)
                    VALUES ($1, $2, $3, $4)
                    RETURNING attribute_id;
                `;
        const { rows: attributeRows } = await pool.query(insertQuery, [
          attributeName,
          attributeValues,
          JSON.stringify(category),
          JSON.stringify(subcategory),
        ]);
        attributeId = attributeRows?.[0]?.attribute_id;
      } else {
        return res
          .status(400)
          .json({
            error:
              "Attribute with the same name, category, and subcategory already exists",
          });
      }
    }

    // Retrieve categories with matching category_id from backendCategory
    const categoryIds =
      backendCategory &&
      backendCategory.map((category) => category.category_id);

    // Fetch rows from categories table based on categoryIds
    const fetchCategoriesQuery = `
            SELECT *
            FROM categories
            WHERE category_id = ANY ($1);
        `;

    const { rows: categoriesToUpdate } = await pool.query(
      fetchCategoriesQuery,
      [categoryIds]
    );

    // Update categories table with attribute_id if not already present
    for (const categoryToUpdate of categoriesToUpdate) {
      // Check if attribute_cat_id is null or not an array
      if (!Array.isArray(categoryToUpdate.attribute_cat_id)) {
        // If it's null or not an array, initialize it as an empty array
        categoryToUpdate.attribute_cat_id = [];
      }

      // Push attributeId to the array
      if (!categoryToUpdate.attribute_cat_id.includes(attributeId)) {
        categoryToUpdate.attribute_cat_id.push(attributeId);
      }
    }

    // Update the categories in the database
    const updateCategoriesQuery = `
            UPDATE categories
            SET attribute_cat_id = $1
            WHERE category_id = $2;
        `;

    for (const categoryToUpdate of categoriesToUpdate) {
      await pool.query(updateCategoriesQuery, [
        categoryToUpdate?.attribute_cat_id,
        categoryToUpdate?.category_id,
      ]);
    }

    // Send success response
    return res
      .status(200)
      .json({ message: "Data received and inserted/updated successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/GetAttributesByVendor", async (req, res) => {
  try {
    // Example SQL query to retrieve attributes by vendor_id
    const query = `
            SELECT *
            FROM attributes ORDER BY attribute_id ASC
        `;

    // Execute the query
    const { rows } = await req.pool.query(query);

    // Assuming the data is retrieved successfully, send it as a JSON response
    res.status(200).json({ attributes: rows });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete an attribute by attribute_id
app.post("/DeleteAttribute", async (req, res) => {
  try {
    const { attribute_id } = req.body;

    // Implement the logic to delete the attribute in the database
    const deleteQuery = `
        DELETE FROM attributes
        WHERE attribute_id = $1;
      `;
    await req.pool.query(deleteQuery, [attribute_id]);

    // Send a success response to the frontend
    res.status(200).json({ message: "Attribute deleted successfully" });
  } catch (error) {
    console.error("Error:", error);

    // Send an error response to the frontend
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = app;
