const mongoose = require("mongoose");
require("dotenv").config();

const Dealer = mongoose.model(
  "Dealer",
  new mongoose.Schema({
    name: String,
    city: String,
    state: String,
    address: String,
  })
);
const Review = mongoose.model(
  "Review",
  new mongoose.Schema({
    dealerId: mongoose.Types.ObjectId,
    reviewer: String,
    rating: Number,
    reviewText: String,
    purchase: Boolean,
    purchaseDate: String,
  })
);

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Dealer.deleteMany({});
  await Review.deleteMany({});

  const dealers = await Dealer.insertMany([
    {
      name: "Sunrise Motors",
      city: "Wichita",
      state: "KS",
      address: "101 Main St",
    }, // Kansas
    {
      name: "Evergreen Autos",
      city: "Denver",
      state: "CO",
      address: "202 Pine Ave",
    },
  ]);

  await Review.insertMany([
    {
      dealerId: dealers[0]._id,
      reviewer: "Alex",
      rating: 5,
      reviewText: "Great service!",
      purchase: true,
      purchaseDate: "2024-10-01",
    },
  ]);

  console.log(
    "Seeded:",
    dealers.map((d) => d._id.toString())
  );
  await mongoose.disconnect();
  process.exit(0);
})();
