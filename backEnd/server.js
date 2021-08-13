import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import colors from "colors";
import morgan from 'morgan'
import coinRoutes from "./routes/coinRoutes.js";

dotenv.config();

connectDB();

const app = express();

if(process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}


app.get("/", (req, res) => {

  res.send("API is running...");
});



app.use('/api/coins', coinRoutes)

const PORT = 6000;

app.listen(
  PORT,
  console.log(
    `Server Running in ${process.env.NODE_ENV} mode On Port ${PORT}`.yellow.bold
  )
);
