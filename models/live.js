const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const liveSchema = new Schema({
  name: { type: String, required: true },
  time: { required: true },
  genre: { type: String, required: true },
  link: { type: String, required: true },
});

const Live = mongoose.model("Live", liveSchema);

module.exports = Live;
