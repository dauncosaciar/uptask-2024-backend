import type { Request, Response } from "express";
import User from "../models/User";

export class TeamController {
  static findMemberByEmail = async (req: Request, res: Response) => {
    const { email } = req.body;

    // Find user
    const user = await User.findOne({ email }).select("id email name");

    if (!user) {
      const error = new Error("Usuario no encontrado");
      res.status(404).json({ error: error.message });
      return;
    }

    res.json(user);
  };

  static addMemberById = async (req: Request, res: Response) => {
    const { id } = req.body;

    // Find user
    const user = await User.findById(id).select("id");

    if (!user) {
      const error = new Error("Usuario no encontrado");
      res.status(404).json({ error: error.message });
      return;
    }

    if (
      req.project.team.some(member => member.toString() === user.id.toString())
    ) {
      const error = new Error("El usuario ya existe en el Proyecto");
      res.status(409).json({ error: error.message });
      return;
    }

    req.project.team.push(user.id);
    await req.project.save();

    res.send("Usuario agregado correctamente");
  };

  static removeMemberById = async (req: Request, res: Response) => {
    const { id } = req.body;

    if (!req.project.team.some(member => member.toString() === id)) {
      const error = new Error("El usuario no existe en el Proyecto");
      res.status(404).json({ error: error.message });
      return;
    }

    req.project.team = req.project.team.filter(
      member => member.toString() !== id
    );

    await req.project.save();

    res.send("Usuario eliminado correctamente");
  };
}
