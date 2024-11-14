import type { Request, Response } from "express";
import User from "../models/User";
import Token from "../models/Token";
import { checkPassword, hashPassword } from "../utils/auth";
import { generate6DigitsToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";

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
      AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token.token
      });

      await Promise.allSettled([user.save(), token.save()]);
      res.send("Cuenta creada, revisa tu email para confirmarla");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static confirmAccount = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;

      const tokenExists = await Token.findOne({ token });

      if (!tokenExists) {
        const error = new Error("Token no válido");
        res.status(404).json({ error: error.message });
        return;
      }

      const user = await User.findById(tokenExists.user);
      user.confirmed = true;

      await Promise.allSettled([user.save(), tokenExists.deleteOne()]);
      res.send("Cuenta confirmada correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      // Check if user exists
      if (!user) {
        const error = new Error("Usuario no encontrado");
        res.status(404).json({ error: error.message });
        return;
      }

      // Check if user has confirmed his account
      if (!user.confirmed) {
        const token = new Token();
        token.user = user.id;
        token.token = generate6DigitsToken();
        await token.save();

        // Send email
        AuthEmail.sendConfirmationEmail({
          email: user.email,
          name: user.name,
          token: token.token
        });

        const error = new Error(
          "La cuenta no ha sido confirmada, hemos enviado un email de confirmación"
        );
        res.status(401).json({ error: error.message });
        return;
      }

      // Check user password
      const isPasswordCorrect = await checkPassword(password, user.password);

      if (!isPasswordCorrect) {
        const error = new Error("Password incorrecto");
        res.status(401).json({ error: error.message });
        return;
      }

      res.send("Usuario autenticado con éxito");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static requestConfirmationCode = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });

      // Check if user exists
      if (!user) {
        const error = new Error("El Usuario con este email no está registrado");
        res.status(404).json({ error: error.message });
        return;
      }

      // Check if user is already registered
      if (user.confirmed) {
        const error = new Error("El Usuario con este email ya está registrado");
        res.status(403).json({ error: error.message });
        return;
      }

      // Generate token for the new user
      const token = new Token();
      token.token = generate6DigitsToken();
      token.user = user.id;

      // Send email
      AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token.token
      });

      await Promise.allSettled([user.save(), token.save()]);
      res.send("Se envió un nuevo token a tu email");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static forgotPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });

      // Check if user exists
      if (!user) {
        const error = new Error("El Usuario con este email no está registrado");
        res.status(404).json({ error: error.message });
        return;
      }

      // Generate token for the new user
      const token = new Token();
      token.token = generate6DigitsToken();
      token.user = user.id;
      await token.save();

      // Send email
      AuthEmail.sendPasswordResetToken({
        email: user.email,
        name: user.name,
        token: token.token
      });

      res.send("Revisa tu email para instrucciones");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };
}
