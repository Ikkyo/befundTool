import cors from "cors";
import express from "express";

import ping from "./routes/ping.route.js";

export const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    // origin: ['https://xzy.at'],
    credentials: true,
  })
);
//  Routes
app.use("/ping", ping);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
