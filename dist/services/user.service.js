"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = exports.ValidationError = exports.EmailAlreadyExistsError = exports.InvalidPasswordError = exports.UserNotFoundError = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
// Custom error classes for better error handling
class UserNotFoundError extends Error {
    constructor(message = "Usuário não encontrado") {
        super(message);
        this.name = "UserNotFoundError";
    }
}
exports.UserNotFoundError = UserNotFoundError;
class InvalidPasswordError extends Error {
    constructor(message = "Senha inválida") {
        super(message);
        this.name = "InvalidPasswordError";
    }
}
exports.InvalidPasswordError = InvalidPasswordError;
class EmailAlreadyExistsError extends Error {
    constructor(message = "E-mail já cadastrado") {
        super(message);
        this.name = "EmailAlreadyExistsError";
    }
}
exports.EmailAlreadyExistsError = EmailAlreadyExistsError;
class ValidationError extends Error {
    constructor(message = "Dados inválidos") {
        super(message);
        this.name = "ValidationError";
    }
}
exports.ValidationError = ValidationError;
const registerUser = async (name, email, password) => {
    try {
        // Validate input
        if (!name || !email || !password) {
            throw new ValidationError("Nome, email e senha são obrigatórios");
        }
        if (name.length < 3) {
            throw new ValidationError("Nome deve ter pelo menos 3 caracteres");
        }
        if (password.length < 6) {
            throw new ValidationError("Senha deve ter pelo menos 6 caracteres");
        }
        // Check if email already exists
        const existing = await user_model_1.default.findOne({ email });
        if (existing) {
            throw new EmailAlreadyExistsError();
        }
        // Create new user
        const user = await user_model_1.default.create({ name, email, password });
        return {
            id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            message: "Usuário criado com sucesso"
        };
    }
    catch (error) {
        if (error.name === "ValidationError" || error.name === "EmailAlreadyExistsError") {
            throw error;
        }
        // Handle Mongoose validation errors
        if (error.name === "ValidationError" && error.errors) {
            const firstError = Object.values(error.errors)[0];
            throw new ValidationError(firstError.message);
        }
        throw new Error("Erro interno do servidor ao criar usuário");
    }
};
exports.registerUser = registerUser;
const loginUser = async (email, password) => {
    try {
        // Validate input
        if (!email || !password) {
            throw new ValidationError("Email e senha são obrigatórios");
        }
        // Find user with password using the static method
        const user = await user_model_1.default.findByEmailWithPassword(email);
        if (!user) {
            throw new UserNotFoundError();
        }
        // Compare password using the instance method
        const match = await user.comparePassword(password);
        if (!match) {
            throw new InvalidPasswordError();
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, env_1.env.JWT_SECRET, { expiresIn: "1h" });
        return {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt
            },
            message: "Login realizado com sucesso"
        };
    }
    catch (error) {
        if (error.name === "ValidationError" || error.name === "UserNotFoundError" || error.name === "InvalidPasswordError") {
            throw error;
        }
        throw new Error("Erro interno do servidor ao fazer login");
    }
};
exports.loginUser = loginUser;
