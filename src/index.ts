import express from "express";
import App from "./services/ExpressApp";
import dbConnection from "./services/Database";
import { PORT } from "./config";

const server = async () => {
  const app = express();

  await dbConnection();

  await App(app);

  app.listen(5000, () => {
    console.log(`🚀 Server is up on port: ${PORT}`);
  });
};

server();
