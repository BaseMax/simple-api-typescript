import { Router } from "express";
import type { Request, Response } from "express";
import { getUsers, addUser, getUserById, getUserCount, deleteUser } from "../db/database";

const router: Router = Router();

router.get("/", (req: Request, res: Response): void => {
  getUsers((err, users) => {
    if (err) {
      res.status(500).send({ success: false, error: err.message });
      return;
    }
    res.json({ success: true, data: users });
  });
});

router.get("/count", (req: Request, res: Response): void => {
  getUserCount((err, count) => {
    if (err) {
      res.status(500).send({ success: false, error: err.message });
      return;
    }
    res.json({ success: true, count });
  });
});

router.get("/:id", (req: Request, res: Response): void => {
  const userId = req.params.id;

  if (!/^\d+$/.test(userId)) {
    res.status(400).send({ success: false, error: "Invalid user ID" });
    return;
  }

  getUserById(Number(userId), (err, user) => {
    if (err) {
      res.status(500).send({ success: false, error: err.message });
      return;
    }
    if (!user) {
      res.status(404).send({ success: false, error: "User not found" });
      return;
    }
    res.json({ success: true, data: user });
  });
});


router.post("/", (req: Request, res: Response): void => {
  const { name, email } = req.body;
  if (!name || !email) {
    res.status(400).send({ success: false, error: "Missing name or email" });
    return;
  }

  addUser(name, email, (err, lastID) => {
    if (err) {
      if (err.message.includes("UNIQUE constraint failed")) {
        res.status(400).send({ success: false, error: "Email already exists" });
      } else {
        res.status(500).send({ success: false, error: err.message });
      }
      return;
    }
    res.json({ success: true, message: "User added successfully", "data": {"id": lastID} });
  });
});

router.delete("/:id", (req: Request, res: Response): void => {
  const userId = req.params.id;

  if (!/^\d+$/.test(userId)) {
    res.status(400).send({ success: false, error: "Invalid user ID. It must be a positive number." });
    return;
  }

  const userIdNumber: number = Number(userId);

  deleteUser(userIdNumber, (err, changes) => {
    if (err) {
      res.status(500).send({ success: false, error: err.message });
      return;
    }
    if (changes === 0) {
      res.status(404).send({ success: false, error: "User not found or already deleted" });
      return;
    }
    res.json({ success: true, message: "User deleted successfully" });
  });
});

export default router;
