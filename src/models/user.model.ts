import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { env } from "../config/env";

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "Nome é obrigatório"], 
    minlength: [3, "Nome deve ter pelo menos 3 caracteres"],
    maxlength: [50, "Nome deve ter no máximo 50 caracteres"],
    trim: true
  },
  email: { 
    type: String, 
    required: [true, "Email é obrigatório"], 
    unique: true, 
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email deve ter um formato válido"],
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: [true, "Senha é obrigatória"], 
    minlength: [6, "Senha deve ter pelo menos 6 caracteres"],
    select: false 
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
  toJSON: {
    transform: function(doc, ret: any) {
      delete ret.password;
      delete ret.__v;
      return ret;
    }
  }
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  
  try {
    const saltRounds = env.BCRYPT_ROUNDS;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Instance method to compare password
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Static method to find user by email with password
userSchema.statics.findByEmailWithPassword = function(email: string) {
  return this.findOne({ email }).select("+password");
};

const User = mongoose.model("User", userSchema);
export default User;
