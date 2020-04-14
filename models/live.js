const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const liveSchema = new Schema({
  name: { type: String, required: true },
  data: { type: String, required: true },
  time: { type: String, required: true },
  genre: { type: [String] },
  link: { type: String, required: true },
  imgPath: String,
  imgName: String,
  review: [
    {
      user: String,
      comment: String,
    },
  ],
});

const Live = mongoose.model("Live", liveSchema);

module.exports = Live;
