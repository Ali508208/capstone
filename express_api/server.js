const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Mongo connected");
  })
  .catch(console.error);

const DealerSchema = new mongoose.Schema({
  name: String,
  city: String,
  state: String,
  address: String,
});
const ReviewSchema = new mongoose.Schema({
  dealerId: mongoose.Types.ObjectId,
  reviewer: String,
  rating: Number,
  reviewText: String,
  purchase: Boolean,
  purchaseDate: String,
});
const Dealer = mongoose.model("Dealer", DealerSchema);
const Review = mongoose.model("Review", ReviewSchema);

// Endpoints for screenshots:
app.get("/api/dealerships", async (req, res) => {
  res.json(await Dealer.find({}).lean());
});
app.get("/api/dealerships/:id", async (req, res) => {
  res.json(await Dealer.findById(req.params.id).lean());
});
app.get("/api/dealerships/state/:state", async (req, res) => {
  res.json(await Dealer.find({ state: req.params.state }).lean());
});
app.get("/api/dealer_reviews/:dealerId", async (req, res) => {
  res.json(await Review.find({ dealerId: req.params.dealerId }).lean());
});

// (Optional) create review
app.post("/api/dealer_reviews", async (req, res) => {
  const created = await Review.create(req.body);
  res.status(201).json(created);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API on http://localhost:${port}`));
