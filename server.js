require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

/* MongoDB connection */
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log(err));


/* Schemas */
const Purchase = mongoose.model("Purchase", {
    fullName: String,
    email: String,
    phone: String,
    organization: String,
    passType: String,
    price: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Contact = mongoose.model("Contact", {
    name: String,
    email: String,
    message: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});


/* Routes */

// Save purchase
app.post("/api/purchase", async (req, res) => {
    try {
        const purchase = new Purchase(req.body);
        await purchase.save();

        res.json({ success: true });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Save contact
app.post("/api/contact", async (req, res) => {
    try {
        const contact = new Contact(req.body);
        await contact.save();

        res.json({ success: true });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.listen(3000, () =>
    console.log("Server running on port 3000 🚀")
);