import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import ping from "./routes/ping.route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    // origin: ['https://xzy.at'],
    credentials: true,
  })
);

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

//  API Routes
app.use("/api/ping", ping);

// Catch all handler: send back React's index.html file for client-side routing
app.use((req, res, next) => {
  // If it's an API route and we got here, it's not found
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ error: "API route not found" });
  }

  // For all other routes, serve the React app
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
