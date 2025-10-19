"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectedRoute = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const protectedRoute = (req, res, next) => {
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
            const decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
            req.user = decoded;
            next();
        }
        catch (jwtError) {
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
    }
    catch (error) {
        console.error("Auth middleware error:", error);
        return res.status(500).json({
            error: "Erro interno do servidor",
            message: "Erro ao processar autenticação."
        });
    }
};
exports.protectedRoute = protectedRoute;
