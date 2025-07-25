import express from "express";
const router = express.Router();

const ping = router.get("/", async (req, res) => {
  res.send("pong");
});

export default ping;
