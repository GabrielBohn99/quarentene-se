const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  confirmationCode: String,
  status:{    
    type: String,    
    enum: ["Aguardando confirmação", "Conta ativa"],    
    default: 'Aguardando confirmação'  
  },
  role: {
    type: String,
    enum: ['GUEST','EDITOR', 'ADMIN'],
    default: 'GUEST'
  },
  email: String
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;