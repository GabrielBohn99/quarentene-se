const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
  name: { type: String },
  prepare: { type: String },
  category: { type: String },
  duration: { type: String },
  level: { type: String },
  imgPath: String,
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

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
