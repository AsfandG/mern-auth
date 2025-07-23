import express from "express";

const router = express.Router();

router.get("/test", (req, res) => {
  res.send({ message: "test server" });
});

export default router;
