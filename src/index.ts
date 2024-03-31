import express from "express";
import { AdminRoute, VandorRoute } from "./routes";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { MONGO_URI } from "./config";
import path from "path";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
console.log(__dirname);
app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/admin", AdminRoute);
app.use("/vandor", VandorRoute);

mongoose
  .connect(MONGO_URI)
  .then((result) => {
    console.log("Conntect to mongodb");
  })
  .catch((err) => {
    console.log("error " + err);
  });

app.listen(5000, () => {
  console.log(`🚀 Server is up on ::1:5000`);
});
