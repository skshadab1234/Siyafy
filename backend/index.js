const express = require("express");
const app = express();
const cors = require("cors");
const port = 3002;
const path = require("path");

// Routes
const admin = require("./routes/admin");
const vendors = require("./routes/vendors");
const vendorStore = require("./routes/vendor-store");
const customer = require("./routes/customer");

app.use(express.json()); // Middleware para parsear el body
app.use(cors());
app.use("/upload", express.static(path.join(__dirname, "upload")));

require("dotenv").config();

//ALl Routes
app.use("/api", admin);
app.use("/api", vendors);
app.use("/api", vendorStore);
app.use("/api", customer);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
