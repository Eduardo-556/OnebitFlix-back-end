import express from "express";
import { categoriesController } from "./controllers/categoriesController";
import { coursesController } from "./controllers/courseController";
import { authController } from "./controllers/authController";
const router = express.Router();
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.get("/categories", categoriesController.index);
router.get("/categories/:id", categoriesController.show);
router.get("/courses/featured", coursesController.featured);
router.get("/courses/newest", coursesController.newest);
router.get("/courses/search", coursesController.search);
router.get("/courses/:id", coursesController.show);

export { router };
