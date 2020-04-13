const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const serieSchema = new Schema({
  name: { type: String, required: true },
  rating: { type: [Number], required: true },
  genre: { type: String, required: true },
  resume: { type: String, required: true },
  imgPath: String,
  imgName: String,
  review: [
    {
      user: String,
      comment: String,
    },
  ],
});

const Serie = mongoose.model("Serie", serieSchema);

module.exports = Serie;
