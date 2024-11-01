import { Router } from "express";

const router = Router();

// Routes for Authentication
router.get("/", (req, res) => {
  res.send("desde /api/auth");
});

export default router;
