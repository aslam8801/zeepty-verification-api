require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

// CONNECT
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("DB Error:", err));

// USER MODEL
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }
});

const User = mongoose.model("User", UserSchema);

// VERIFY API — EMAIL ONLY
app.post("/verify", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.json({ valid: false });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.json({ valid: true });
    } else {
      return res.json({ valid: false });
    }
  } catch (err) {
    return res.json({ valid: false });
  }
});

// START SERVER
app.listen(process.env.PORT || 5000, () => {
  console.log("Verification API running on port 5000");
});
