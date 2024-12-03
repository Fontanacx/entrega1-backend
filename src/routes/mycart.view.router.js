import { Router } from "express";

const ROUTER = Router();

ROUTER.get("/", async (req, res) => {
  try {
    res.status(200).render("mycart", {
      title: "Tienda Argentina 24/7",
    });
  } catch (err) {
    res.status(err.code || 500).json({ status: "error", message: err.message });
  }
});

export default ROUTER;