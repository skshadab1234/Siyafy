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

module.exports = { updateStoreName };
