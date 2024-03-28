import express from "express";

const app = express();

app.listen(5000, () => {
    console.log(`🚀 Server is up on ::1:5000`);
})