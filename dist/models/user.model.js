"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const env_1 = require("../config/env");
const userSchema = new mongoose_1.default.Schema({
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
        transform: function (doc, ret) {
            delete ret.password;
            delete ret.__v;
            return ret;
        }
    }
});
// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next();
    try {
        const saltRounds = env_1.env.BCRYPT_ROUNDS;
        this.password = await bcrypt_1.default.hash(this.password, saltRounds);
        next();
    }
    catch (error) {
        next(error);
    }
});
// Instance method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt_1.default.compare(candidatePassword, this.password);
};
// Static method to find user by email with password
userSchema.statics.findByEmailWithPassword = function (email) {
    return this.findOne({ email }).select("+password");
};
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
