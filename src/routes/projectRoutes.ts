import { Router } from "express";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middlewares/validation";
import { validateProjectExists } from "../middlewares/project";
import { ProjectController } from "../controllers/ProjectController";
import { TaskController } from "../controllers/TaskController";

const router = Router();

// Routes for Projects
router.post(
  "/",
  body("projectName")
    .trim()
    .notEmpty()
    .withMessage("El Nombre del Proyecto es obligatorio"),
  body("clientName")
    .trim()
    .notEmpty()
    .withMessage("El Nombre del Cliente es obligatorio"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("La Descripción del Proyecto es obligatoria"),
  handleInputErrors,
  ProjectController.createProject
);

router.get("/", ProjectController.getAllProjects);

router.get(
  "/:id",
  param("id").isMongoId().withMessage("ID no válido"),
  handleInputErrors,
  ProjectController.getProjectById
);

router.put(
  "/:id",
  param("id").isMongoId().withMessage("ID no válido"),
  body("projectName")
    .trim()
    .notEmpty()
    .withMessage("El Nombre del Proyecto es obligatorio"),
  body("clientName")
    .trim()
    .notEmpty()
    .withMessage("El Nombre del Cliente es obligatorio"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("La Descripción del Proyecto es obligatoria"),
  handleInputErrors,
  ProjectController.updateProject
);

router.delete(
  "/:id",
  param("id").isMongoId().withMessage("ID no válido"),
  handleInputErrors,
  ProjectController.deleteProject
);

// Routes for Tasks
router.post(
  "/:projectId/tasks",
  validateProjectExists,
  TaskController.createTask
);

export default router;
