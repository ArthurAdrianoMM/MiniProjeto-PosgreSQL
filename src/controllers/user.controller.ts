import { Request, Response } from "express";
import * as userService from "../services/user.service";

const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const result = await userService.registerUser(name, email, password);
    res.status(201).json(result);
  } catch (err: any) {
    console.error("Registration error:", err.message);
    
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }
    
    if (err.name === "EmailAlreadyExistsError") {
      return res.status(409).json({ error: err.message });
    }
    
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await userService.loginUser(email, password);
    res.status(200).json(result);
  } catch (err: any) {
    console.error("Login error:", err.message);
    
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }
    
    if (err.name === "UserNotFoundError" || err.name === "InvalidPasswordError") {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }
    
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export { register, login };
