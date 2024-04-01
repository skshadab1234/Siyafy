// vendor.js

const express = require("express");
const app = express();
const pool = require("../config");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const { default: slugify } = require("slugify");

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  req.pool = pool;
  next();
});

app.get("/getAllSubcategories", async (req, res) => {
  try {
    // const query = "SELECT * FROM subcategories";
    const query =
      "SELECT subcategories.* FROM subcategories GROUP BY subcategories.subcategory_id, subcategories.subcategory_name, subcategories.subcategory_description, subcategories.subcategory_image_url, subcategories.parent_category_id, subcategories.created_at,subcategories.updated_at, subcategories.isfeatured,subcategories.subcat_status, subcategories.nested_subcategories";

    const { rows } = await pool.query(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API endpoint to update a subcategory
app.post("/updateSubcategory", async (req, res) => {
  try {
    const { selectedSubcategory, subcategory_name, subcategory_description } =
      req.body;

    // Check if the subcategory with the given ID exists in the database
    const checkQuery = "SELECT * FROM subcategories WHERE subcategory_id = $1";
    const checkValues = [selectedSubcategory];
    const checkResult = await pool.query(checkQuery, checkValues);

    if (checkResult.rows.length === 0) {
      // Subcategory with the given ID does not exist
      return res.status(404).json({ error: "Subcategory not found." });
    }

    // Update the subcategory in the database, including the updated_at column
    const updateQuery =
      "UPDATE subcategories SET subcategory_name = $1, subcategory_description = $2, updated_at = NOW() WHERE subcategory_id = $3";
    const updateValues = [
      subcategory_name,
      subcategory_description,
      selectedSubcategory,
    ];

    await pool.query(updateQuery, updateValues);

    res.status(200).json({ message: "Subcategory updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/addNewSubCategories", async (req, res) => {
  try {
    const { selectedKey } = req.body;
    const { subcategory_name, subcategory_description } = req.body.values;

    // Check if the parent category exists
    const checkCategoryQuery =
      "SELECT * FROM categories WHERE category_id = $1";
    const checkCategoryValues = [selectedKey];
    const checkCategoryResult = await pool.query(
      checkCategoryQuery,
      checkCategoryValues
    );

    if (checkCategoryResult.rows.length === 0) {
      return res.status(404).json({ error: "Parent category not found." });
    }

    // Insert the new subcategory into the database
    const insertQuery =
      "INSERT INTO subcategories (subcategory_name, subcategory_description, parent_category_id) VALUES ($1, $2, $3) RETURNING *";
    const insertValues = [
      subcategory_name,
      subcategory_description,
      selectedKey,
    ];
    const result = await pool.query(insertQuery, insertValues);

    // Return the newly added subcategory data
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding subcategory:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a subcategory by ID
app.post("/deleteSubcategory", async (req, res) => {
  try {
    const { subcategory_id } = req.body;
    // Check if the subcategory exists in the database
    const checkQuery = "SELECT * FROM subcategories WHERE subcategory_id = $1";
    const checkValues = [subcategory_id];
    const checkResult = await pool.query(checkQuery, checkValues);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: "Subcategory not found." });
    }

    // If the subcategory exists, proceed with the deletion
    const deleteQuery = "DELETE FROM subcategories WHERE subcategory_id = $1";
    await pool.query(deleteQuery, [subcategory_id]);

    res.status(204).end(); // Return 204 No Content status to indicate successful deletion
  } catch (error) {
    console.error("Error deleting subcategory:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Handle file upload
// img storage path
const imgConfigSubcatgeory = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./upload/SubcategoryImages");
  },
  filename: (req, file, callback) => {
    callback(null, `SubcategoryImages-${Date.now()} - ${file.originalname}`);
  },
});

// img filter
const isSubCategory = (req, file, callback) => {
  if (file.mimetype.startsWith("image")) {
    callback(null, true);
  } else {
    callback(new Error("Only images are allowed"));
  }
};

const uploadSubcategory = multer({
  storage: imgConfigSubcatgeory,
  fileFilter: isSubCategory,
});

app.post(
  "/UploadSubcatgeoryImage",
  uploadSubcategory.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided." });
      }

      const file = req.file;
      const subcategoryId = req.body.selectedKey; // Assuming you have the category_id in the request body

      // Fetch the old image URL and file name from the database based on category_id
      const query =
        "SELECT subcategory_image_url FROM subcategories WHERE subcategory_id = $1";
      const { rows } = await pool.query(query, [subcategoryId]);

      if (rows.length === 0) {
        return res.status(404).json({ message: "Category not found." });
      }

      const oldImageUrl = rows[0].category_image_url;

      // If there's an old image URL, unlink it from your server
      if (oldImageUrl) {
        const oldImageFilePath = `./upload/SubcategoryImages/${oldImageUrl}`;

        fs.unlink(oldImageFilePath, (err) => {
          if (err) {
            console.error(`Error deleting old image: ${err}`);
          }
        });
      }

      // Update the category_image_url in your PostgreSQL database
      const updateQuery =
        "UPDATE subcategories SET subcategory_image_url = $1 WHERE subcategory_id = $2";
      const values = [file.filename, subcategoryId]; // Adjust as per your needs

      await pool.query(updateQuery, values);

      res.status(200).json({
        file: file.filename,
        message: "SubCategory image updated successfully.",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Error occurred while storing the category picture.",
      });
    }
  }
);

// Handle file upload
// img storage path
const imgConfigSubMaincatgeory = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./upload/SubMaincategoryImage");
  },
  filename: (req, file, callback) => {
    callback(null, `SubMaincategoryImage-${Date.now()} - ${file.originalname}`);
  },
});

// img filter
const isSubMainCategory = (req, file, callback) => {
  if (file.mimetype.startsWith("image")) {
    callback(null, true);
  } else {
    callback(new Error("Only images are allowed"));
  }
};

const uploadSubMaincategory = multer({
  storage: imgConfigSubMaincatgeory,
  fileFilter: isSubMainCategory,
});

app.post(
  "/UploadSubMaincatgeoryImage",
  uploadSubMaincategory.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided." });
      }

      const file = req.file;
      const { SubMainSelectedRow, selectedKey } = req.body;
      const subcatData = JSON.parse(SubMainSelectedRow);
      const { nested_subcategories } = subcatData;

      console.log(nested_subcategories);
      // Update nested_subcat_status for the matched nested subcategory
      const update =
        nested_subcategories &&
        nested_subcategories.map((item, index) => {
          if (index === parseInt(selectedKey)) {
            // Assuming your object has a 'status' property, update it here
            return {
              ...item,
              image_url: file.filename, // Replace 'newStatus' with the desired status value
              nested_slug: slugify(
                nested_subcategories[index]?.nested_subcategory_name
              ),
            };
          }
          return item;
        });

      const updateQuery =
        "UPDATE subcategories SET nested_subcategories = $1 WHERE subcategory_id = $2 RETURNING *;";
      const values = [
        JSON.stringify(update), // Convert the array to a JSON string
        subcatData?.subcategory_id,
      ];

      const { rows } = await pool.query(updateQuery, values);

      res.status(200).json({
        file: file.filename,
        message: "SubCategory image updated successfully.",
        file: file.filename,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Error occurred while storing the category picture.",
      });
    }
  }
);

module.exports = app;
