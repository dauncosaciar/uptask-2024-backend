import type { Request, Response } from "express";
import User from "../models/User";
import Token from "../models/Token";
import { hashPassword } from "../utils/auth";
import { generate6DigitsToken } from "../utils/token";
import { transporter } from "../config/nodemailer";

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      // Prevent duplicate users
      const userExists = await User.findOne({ email });

      if (userExists) {
        const error = new Error("El Usuario con este email ya está registrado");
        res.status(409).json({ error: error.message });
        return;
      }

      // Create user
      const user = new User(req.body);

      // Hash password
      user.password = await hashPassword(password);

      // Generate token for the new user
      const token = new Token();
      token.token = generate6DigitsToken();
      token.user = user.id;

      // Send email
      await transporter.sendMail({
        from: "UpTask <admin@uptask.com>",
        to: user.email,
        subject: "UpTask - Confirma tu cuenta",
        text: "UpTask - Confirma tu cuenta",
        html: `<p>Probando e-mail</p>`
      });

      await Promise.allSettled([user.save(), token.save()]);
      res.send("Cuenta creada, revisa tu email para confirmarla");
    } catch (error) {
      console.log(error);

      res.status(500).json({ error: "Hubo un error" });
    }
  };
}
