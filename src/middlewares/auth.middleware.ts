import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

interface JwtPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

const protectedRoute = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ 
        error: "Token de acesso não fornecido",
        message: "É necessário fornecer um token JWT no header Authorization"
      });
    }

    const token = authHeader.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ 
        error: "Formato de token inválido",
        message: "Use o formato: Bearer <token>"
      });
    }

    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
      req.user = decoded;
      next();
    } catch (jwtError: any) {
      if (jwtError.name === "TokenExpiredError") {
        return res.status(401).json({ 
          error: "Token expirado",
          message: "O token JWT expirou. Faça login novamente."
        });
      }
      
      if (jwtError.name === "JsonWebTokenError") {
        return res.status(403).json({ 
          error: "Token inválido",
          message: "O token JWT fornecido é inválido."
        });
      }
      
      return res.status(403).json({ 
        error: "Token inválido",
        message: "Não foi possível verificar o token."
      });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({ 
      error: "Erro interno do servidor",
      message: "Erro ao processar autenticação."
    });
  }
};

export { protectedRoute };
