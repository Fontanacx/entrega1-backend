import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.render("addProduct", { title: "Agregar Producto" });
});

export default router;
