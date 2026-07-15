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

const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

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