require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");

const authRoutes = require("./src/routes/authRoutes");
const categoryRoutes = require("./src/routes/categoryRoutes");
const menuRoutes = require("./src/routes/menuRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const { stripeWebhook } = require("./src/controllers/orderController");

const app = express();

// Connect Database
connectDB();

/*
========================================
STRIPE WEBHOOK (MUST BE BEFORE express.json())
========================================
*/
app.post(
  "/api/orders/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

/*
========================================
NORMAL MIDDLEWARES
========================================
*/
app.use(cors({
  origin: "*"
}));
app.use(express.json());

/*
========================================
ROUTES
========================================
*/
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("API Running Successfully 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);