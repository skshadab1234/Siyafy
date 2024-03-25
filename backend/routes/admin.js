const express = require("express");
const app = express();
const pool = require("../config");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // Import jsonwebtoken
const authenticate = require("../lib");

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  req.pool = pool;
  next();
});

app.post("/adminlogin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await req.pool.query(
      "SELECT * FROM superadmin WHERE email = $1",
      [email]
    );

    if (result.rows.length > 0) {
      const superAdminLogin = result.rows[0];
      const hashedPassword = superAdminLogin.password; // Assuming the hashed password is stored in the 'password' field

      // Compare the hashed password with the input password
      const passwordMatch = await bcrypt.compare(password, hashedPassword);
      if (passwordMatch) {
        const token = jwt.sign(
          { id: superAdminLogin.id },
          process.env.SECRET_KEY,
          {
            expiresIn: "1h", // Token expires in 1 hour
          }
        );
        // Set a cookie with the JWT
        res.cookie("token", token, { httpOnly: true, secure: false }); // Set secure to true if you're using HTTPS

        // Calculate the expiry time based on the 'expiresIn' option
        const expiryTime = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

        res.status(200).send({
          status: 200,
          message: "Login successful.",
          token,
          expiryTime,
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

app.post("/getSuperAdminData", authenticate, async (req, res) => {
  try {
    if (req.userId) {
      const superAdminData = await req.pool.query(
        "SELECT * FROM superadmin WHERE id = $1",
        [req.userId]
      );
      if (superAdminData.rows.length === 0) {
        res.status(200).json({
          status: false,
          message: `User with ID ${req.userId} not found`,
        });
        throw new Error(`User with ID ${req.userId} not found`);
      }

      delete superAdminData.rows[0].password;
      // Send a response
      res.status(200).json({
        status: true,
        data: superAdminData.rows[0],
        message: "Super admin data fetched successfully",
      });
    }else {
      res.status(200).json({
        status: false,
        message: "Please login first",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = app;
