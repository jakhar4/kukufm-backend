const { Schema, model } = require("mongoose");

const audiobookSchema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String, required: true },
  genre: [{ type: String, required: true }],
  coverImage: { type: String, required: true },
  duration: { type: String, required: true },
  rating: { type: Number, default: 0 },
  reviews: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
      userName: { type: String, required: true },
      review: { type: String, required: true },
      rating: { type: Number, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  publishedDate: { type: Date, required: true },
});

module.exports = model("Audiobook", audiobookSchema);
