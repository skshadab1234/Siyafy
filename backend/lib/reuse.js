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

async function updateStoreName(
  tableName,
  oldStoreName,
  newStoreName,
  vendorId
) {
  const selectQuery = `
      SELECT *
      FROM ${tableName}
      WHERE vendor_id = $1 AND store_name = $2
    `;

  const updateQuery = `
      UPDATE ${tableName}
      SET store_name = $1
      WHERE vendor_id = $2 AND store_name = $3
    `;

  try {
    // First, select the row to verify its existence
    const selectResult = await pool.query(selectQuery, [
      vendorId,
      oldStoreName,
    ]);

    if (selectResult.rows.length > 0) {
      // If a matching row is found, proceed with the update
      const updateResult = await pool.query(updateQuery, [
        newStoreName,
        vendorId,
        oldStoreName,
      ]);

      if (updateResult.rowCount > 0) {
        console.log(
          "Update successful:",
          updateResult.rowCount,
          "rows updated."
        );
        return true;
      } else {
        console.log(
          "No rows updated. It's possible that the provided old store name does not match any records."
        );
        return false;
      }
    } else {
      console.log("No matching row found to update.");
      return false;
    }
  } catch (error) {
    console.error("Error updating store name:", error);
    throw error; // Rethrow or handle as per your application's error handling policy
  }
}

async function fetchProductById(productId) {
  const query = "SELECT * FROM products WHERE id = $1";
  const { rows } = await pool.query(query, [productId]);
  return rows[0]; // Assuming id is unique and only one product is returned
}

async function fetchAndStructureProductDetails(product) {
  // Fetch related products
  const relatedProducts = await Promise.all(
    (product.related_ids || []).map(fetchProductById)
  );

  // Fetch upsell products
  const upsellProducts = await Promise.all(
    (product.upsell_ids || []).map(fetchProductById)
  );

  // Fetch cross-sell products
  const crossSellProducts = await Promise.all(
    (product.cross_sell_ids || []).map(fetchProductById)
  );

  // Extract and restructure meta_data
  const meta = {};
  if (product.meta_data && Array.isArray(product.meta_data)) {
    product.meta_data.forEach((item) => {
      meta[item.key] = item.value;
    });
  }

  // Extract and restructure dimensions
  const dimensions = {
    width: product.dimensions.width,
    height: product.dimensions.height,
    length: product.dimensions.length,
    weight: product.dimensions.weight,
  };

  // Prepare the modified product object
  const modifiedProduct = {
    ...product,
    meta_title: meta.meta_title || null,
    meta_description: meta.meta_description || null,
    meta_keywords: meta.meta_keywords || null,
    ...dimensions,
    related_ids: relatedProducts,
    upsell_ids: upsellProducts,
    cross_sell_ids: crossSellProducts,
    typeofProduct: product.type,
    typeofUpload: product.status,
    back_images: product.images,
  };

  // Clean up the modified product object
  delete modifiedProduct.dimensions;
  delete modifiedProduct.meta_data;
  delete modifiedProduct.related_ids;
  delete modifiedProduct.upsell_ids;
  delete modifiedProduct.cross_sell_ids;
  delete modifiedProduct.images;
  delete modifiedProduct.type;
  delete modifiedProduct.status;

  return modifiedProduct;
}

module.exports = {
  updateStoreName,
  fetchAndStructureProductDetails,
  fetchProductById,
};
