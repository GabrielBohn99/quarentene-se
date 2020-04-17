const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const liveSchema = new Schema({
  name: { type: String },
  data: { type: String },
  time: { type: String },
  genre: { type: [String] },
  link: { type: String },
  imgPath: String,
  imgName: String,
  review: [
    {
      user: String,
      comment: String,
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
});

const Live = mongoose.model("Live", liveSchema);

module.exports = Live;
