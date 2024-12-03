import { Router } from "express";

const ROUTER = Router();

ROUTER.get("/", async (req, res) => {
  try {
    res.status(200).render("home", {
      title: "Tienda Argentina",
    });
  } catch (err) {
    res.status(err.code || 500).json({ status: "error", message: err.message });
  }
});

export default ROUTER;