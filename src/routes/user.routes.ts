import { Router } from "express";
import { register, login } from "../controllers/user.controller";
import { protectedRoute } from "../middlewares/auth.middleware";

const router = Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/protected", protectedRoute, (req, res) => {
  res.json({ 
    message: "Acesso autorizado!",
    user: req.user,
    timestamp: new Date().toISOString()
  });
});

// User profile route (protected)
router.get("/profile", protectedRoute, (req, res) => {
  res.json({
    message: "Perfil do usuário",
    user: req.user,
    timestamp: new Date().toISOString()
  });
});

const userRoutes = router;
export default userRoutes;
