const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

require("./db")(function (err, data, CatData) {
  if (err) {
    console.log(err);
    return;
  }

  global.foodData = data;
  global.foodCategory = CatData;
});
const cors = require("cors");
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://khana-khazana-frontend-lspx.onrender.com"
  ],
  credentials: true
}));

app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api",require("./Routes/Auth"));

// Start Server
app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});