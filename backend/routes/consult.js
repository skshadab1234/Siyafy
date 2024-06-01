const express = require("express");
const app = express();
const pool = require("../config");
const cors = require("cors");
const authenticate = require("../lib");

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  req.pool = pool;
  next();
});

app.get("/consultation", authenticate, async (req, res) => {
  try {
    const { page = 1, pageSize = 10, search } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(pageSize);

    let cleanedSearchTerm = search ? search.replace(/-/g, "") : null;

    let consultationsQuery = `
      SELECT * FROM consultation
      WHERE 1=1 
    `;
    const values = [];

    // Append search conditions if search term is provided
    if (cleanedSearchTerm) {
      consultationsQuery += `
        AND (full_name ILIKE $${values.push(
          `%${cleanedSearchTerm}%`
        )} OR REPLACE(contact_number, '-', '') ILIKE $${values.push(
        `%${cleanedSearchTerm}%`
      )})
      `;
    }

    // Order by preferred_date, preferred_time, created_at
    consultationsQuery += `
      ORDER BY 
          CASE
              WHEN preferred_date IS NULL THEN 1
              ELSE 0
          END,
          preferred_date ASC,
          CASE
              WHEN preferred_time IS NULL THEN 1
              ELSE 0
          END,
          preferred_time ASC,
          created_at DESC
      LIMIT $${values.push(parseInt(pageSize))} OFFSET $${values.push(offset)}
    `;

    const countQuery = "SELECT COUNT(*) FROM consultation";

    const [consultations, totalCount] = await Promise.all([
      pool.query(consultationsQuery, values),
      pool.query(countQuery),
    ]);

    res.json({
      data: consultations.rows,
      total: parseInt(totalCount.rows[0].count),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Error...." });
  }
});

app.put("/update-consultation/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { appointmentstatus, additionaltext } = req.body;
    const appointmentEndedByAdminTime = new Date(); // Get current timestamp with timezone

    // Update the consultation in the database
    const updateQuery = `
      UPDATE consultation
      SET appointmentstatus = $1,
          additionaltext = $2,
          appointmentendedbyadmintime = $3
      WHERE id = $4
      RETURNING *
    `;

    const { rows } = await pool.query(updateQuery, [
      appointmentstatus,
      additionaltext,
      appointmentEndedByAdminTime,
      id,
    ]);

    const updatedConsultation = rows[0];

    res
      .status(200)
      .json({
        message: "Consultation updated successfully",
        consultation: updatedConsultation,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Error...." });
  }
});

module.exports = app;
