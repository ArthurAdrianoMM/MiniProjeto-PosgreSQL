import { prisma } from "../database/connection";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

// Custom error classes for better error handling
export class UserNotFoundError extends Error {
  constructor(message: string = "Usuário não encontrado") {
    super(message);
    this.name = "UserNotFoundError";
  }
}

export class InvalidPasswordError extends Error {
  constructor(message: string = "Senha inválida") {
    super(message);
    this.name = "InvalidPasswordError";
  }
}

export class EmailAlreadyExistsError extends Error {
  constructor(message: string = "E-mail já cadastrado") {
    super(message);
    this.name = "EmailAlreadyExistsError";
  }
}

export class ValidationError extends Error {
  constructor(message: string = "Dados inválidos") {
    super(message);
    this.name = "ValidationError";
  }
}

export const registerUser = async (name: string, email: string, password: string) => {
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
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new EmailAlreadyExistsError();
    }

    // Hash password and create new user
    const saltRounds = env.BCRYPT_ROUNDS;
    const hashed = await bcrypt.hash(password, saltRounds);
    const user = await prisma.user.create({
      data: { name, email, password: hashed }
    });
    
    return { 
      id: user.id, 
      name: user.name, 
      email: user.email,
      createdAt: user.createdAt,
      message: "Usuário criado com sucesso"
    };
  } catch (error: any) {
    if (error.name === "ValidationError" || error.name === "EmailAlreadyExistsError") {
      throw error;
    }
    
    throw new Error("Erro interno do servidor ao criar usuário");
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    // Validate input
    if (!email || !password) {
      throw new ValidationError("Email e senha são obrigatórios");
    }

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UserNotFoundError();
    }

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new InvalidPasswordError();
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email }, 
      env.JWT_SECRET, 
      { expiresIn: "1h" }
    );

    return { 
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      },
      message: "Login realizado com sucesso"
    };
  } catch (error: any) {
    if (error.name === "ValidationError" || error.name === "UserNotFoundError" || error.name === "InvalidPasswordError") {
      throw error;
    }
    throw new Error("Erro interno do servidor ao fazer login");
  }
};
