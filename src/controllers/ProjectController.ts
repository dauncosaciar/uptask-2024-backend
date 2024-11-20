import type { Request, Response } from "express";
import Project from "../models/Project";

export class ProjectController {
  static createProject = async (req: Request, res: Response) => {
    try {
      const project = new Project(req.body);

      // Asign a manager, the person who created the project
      project.manager = req.user.id;

      await project.save();
      res.send("Proyecto creado correctamente");
    } catch (error) {
      console.log(error);
    }
  };

  static getAllProjects = async (req: Request, res: Response) => {
    try {
      const projects = await Project.find({
        $or: [{ manager: { $in: req.user.id } }]
      });
      res.json(projects);
    } catch (error) {
      console.log(error);
    }
  };

  static getProjectById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const project = await Project.findById(id).populate("tasks");

      if (!project) {
        const error = new Error("Proyecto no encontrado");
        res.status(404).json({ error: error.message });
        return;
      }

      if (project.manager.toString() !== req.user.id.toString()) {
        const error = new Error("Acción no válida, no creaste este proyecto");
        res.status(401).json({ error: error.message });
        return;
      }

      res.json(project);
    } catch (error) {
      console.log(error);
    }
  };

  static updateProject = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const project = await Project.findById(id);

      if (!project) {
        const error = new Error("Proyecto no encontrado");
        res.status(404).json({ error: error.message });
        return;
      }

      if (project.manager.toString() !== req.user.id.toString()) {
        const error = new Error(
          "Acción no válida, sólo el Manager puede actualizar un Proyecto"
        );
        res.status(401).json({ error: error.message });
        return;
      }

      project.projectName = req.body.projectName;
      project.clientName = req.body.clientName;
      project.description = req.body.description;
      await project.save();
      res.send("Proyecto actualizado correctamente");
    } catch (error) {
      console.log(error);
    }
  };

  static deleteProject = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const project = await Project.findById(id);

      if (!project) {
        const error = new Error("Proyecto no encontrado");
        res.status(404).json({ error: error.message });
        return;
      }

      if (project.manager.toString() !== req.user.id.toString()) {
        const error = new Error(
          "Acción no válida, sólo el Manager puede eliminar un Proyecto"
        );
        res.status(401).json({ error: error.message });
        return;
      }

      await project.deleteOne();
      res.send("Proyecto eliminado correctamente");
    } catch (error) {
      console.log(error);
    }
  };
}
