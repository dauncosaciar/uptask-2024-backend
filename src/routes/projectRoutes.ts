import { Router } from "express";
import { body, param } from "express-validator";
import { authenticate } from "../middlewares/auth";
import { handleInputErrors } from "../middlewares/validation";
import { projectExists } from "../middlewares/project";
import { taskBelongsToProject, taskExists } from "../middlewares/task";
import { ProjectController } from "../controllers/ProjectController";
import { TaskController } from "../controllers/TaskController";
import { TeamController } from "../controllers/TeamController";

const router = Router();

router.use(authenticate);

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

router.param("projectId", projectExists);

// Routes for Tasks
router.post(
  "/:projectId/tasks",
  body("name")
    .trim()
    .notEmpty()
    .withMessage("El Nombre de la Tarea es obligatorio"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("La Descripción de la Tarea es obligatoria"),
  handleInputErrors,
  TaskController.createTask
);

router.get("/:projectId/tasks", TaskController.getProjectTasks);

router.param("taskId", taskExists);
router.param("taskId", taskBelongsToProject);

router.get(
  "/:projectId/tasks/:taskId",
  param("taskId").isMongoId().withMessage("ID de tarea no válido"),
  handleInputErrors,
  TaskController.getTaskById
);

router.put(
  "/:projectId/tasks/:taskId",
  param("taskId").isMongoId().withMessage("ID de tarea no válido"),
  body("name")
    .trim()
    .notEmpty()
    .withMessage("El Nombre de la Tarea es obligatorio"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("La Descripción de la Tarea es obligatoria"),
  handleInputErrors,
  TaskController.updateTask
);

router.delete(
  "/:projectId/tasks/:taskId",
  param("taskId").isMongoId().withMessage("ID de tarea no válido"),
  handleInputErrors,
  TaskController.deleteTask
);

router.post(
  "/:projectId/tasks/:taskId/status",
  param("taskId").isMongoId().withMessage("ID de tarea no válido"),
  body("status").notEmpty().withMessage("El estado de la tarea es obligatorio"),
  handleInputErrors,
  TaskController.updateStatus
);

// Routes for Teams (Collaborators)
router.post(
  "/:projectId/team/find",
  body("email").isEmail().toLowerCase().withMessage("Email no válido"),
  handleInputErrors,
  TeamController.findMemberByEmail
);

router.get("/:projectId/team", TeamController.getProjectTeam);

router.post(
  "/:projectId/team",
  body("id").isMongoId().withMessage("ID no válido"),
  handleInputErrors,
  TeamController.addMemberById
);

router.delete(
  "/:projectId/team",
  body("id").isMongoId().withMessage("ID no válido"),
  handleInputErrors,
  TeamController.removeMemberById
);

export default router;
