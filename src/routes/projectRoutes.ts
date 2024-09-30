import { Router } from "express";
import { body, param } from "express-validator";
import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middlewares/validation";

const router = Router();

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

export default router;
