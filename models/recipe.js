const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
  name: { type: String, required: true },
  prepare: { type: String, required: true },
  category: { type: String, required: true },
  duration: { type: String, required: true },
  level: { type: String, required: true },
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

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
