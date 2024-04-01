import express from "express";
import App from "./services/ExpressApp";
import dbConnection from "./services/Database";

const server = async () => {
  const app = express();

  await dbConnection();

  await App(app);

  app.listen(5000, () => {
    console.log(`🚀 Server is up on ::1:5000`);
  });
};

server();
