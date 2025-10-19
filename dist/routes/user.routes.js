"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Public routes
router.post("/register", user_controller_1.register);
router.post("/login", user_controller_1.login);
// Protected routes
router.get("/protected", auth_middleware_1.protectedRoute, (req, res) => {
    res.json({
        message: "Acesso autorizado!",
        user: req.user,
        timestamp: new Date().toISOString()
    });
});
// User profile route (protected)
router.get("/profile", auth_middleware_1.protectedRoute, (req, res) => {
    res.json({
        message: "Perfil do usuário",
        user: req.user,
        timestamp: new Date().toISOString()
    });
});
const userRoutes = router;
exports.default = userRoutes;
