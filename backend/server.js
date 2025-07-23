import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./db/connect.js";
import fs from "node:fs";

const port = process.env.PORT || 5000;

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const routeFiles = fs.readdirSync("./routes");

routeFiles.forEach((file) => {
  import(`./routes/${file}`)
    .then((route) => {
      app.use("/api", route.default);
    })
    .catch((err) => {
      console.log("Failed to load route file", err);
    });
});

const server = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.log("failed to start server", error.message);
    process.exit(1);
  }
};

server();
