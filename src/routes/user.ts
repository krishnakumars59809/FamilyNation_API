import { Router } from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  addFamilyMember,
  updateFamilyMember,
  deleteFamilyMember,
  registerUser,
  loginUser,
  getCurrentUser,
} from "../controllers/userController";
import { authenticate, authorize } from "../middlewares/authMiddleware";


const router = Router();

// ===== Public routes =====
router.post("/auth/register", registerUser); // Normal user registration
router.post("/auth/login", loginUser);      // Login
router.get("/auth/me", authenticate, getCurrentUser); // Get current user info

// ===== Admin CRUD =====
// Only admin can manage users
router.post("/", authenticate, authorize(["admin"]), createUser);
router.get("/", authenticate, authorize(["admin"]), getUsers);
router.get("/:id", authenticate, authorize(["admin"]), getUserById);
router.put("/:id", authenticate, authorize(["admin"]), updateUser);
router.delete("/:id", authenticate, authorize(["admin"]), deleteUser);

// ===== Family member routes =====
// Normal users can manage their own family
router.post("/:id/family", authenticate, authorize(["user", "admin"]), addFamilyMember);
router.put("/:id/family/:memberId", authenticate, authorize(["user", "admin"]), updateFamilyMember);
router.delete("/:id/family/:memberId", authenticate, authorize(["user", "admin"]), deleteFamilyMember);

export default router;
