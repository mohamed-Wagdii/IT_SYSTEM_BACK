require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

async function dbconnection() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("connected");
  } catch (error) {
    console.log(error);
  }
}

dbconnection();

const authRoutes = require("./routers/authRoutes");
const ticketRoutes = require("./routers/ticketsRoutes");
app.use("/api", authRoutes);
app.use("/api", ticketRoutes);


app.listen(port, () => {
  console.log(`server is running at port ${port} `);
});
