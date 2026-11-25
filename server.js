/**
 * ========================================================
 * Project: Lab 3 - Inventory Management System
 * Developer: Srishti
 * Section: F
 * Roll No: 2501730380
 * ========================================================
 */

const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(express.json());

const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Inventory Management API is running",
        developer: {
            name: "Srishti",
            section: "F",
            rollNo: "2501730380"
        },
        status: "Active"
    });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/inventory_db";

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Developer: Srishti | Section: F | Roll No: 2501730380`);
        });
    })
    .catch((err) => {
        console.log("MongoDB Connection Error:", err.message);
    });
