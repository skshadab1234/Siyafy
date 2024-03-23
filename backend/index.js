const express = require("express");
const app = express();
const cors = require("cors");
const port = 3002;

const admin = require("./routes/admin");
const vendors = require("./routes/vendors");
const authenticate = require("./lib");


app.use(express.json()); // Middleware para parsear el body
app.use(cors());

require("dotenv").config();

//ALl Routes
app.use("/api", admin);
app.use("/api", vendors);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
