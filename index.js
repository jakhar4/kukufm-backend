const express = require('express')
const app =express();
const cors = require('cors')
require('dotenv').config()
const mongoose = require("mongoose");

var corsOptions = {
  origin: process.env.ORIGIN_URL, 
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  Credential:true,
  optionsSuccessStatus: 200 
}
app.use(cors(corsOptions))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRoutes =require('./routes/auth.js')
const audioBookRoutes = require('./routes/audiobook.js')


mongoose
  .connect(
    process.env.MONGO_URI,  
  )  
  .then(() => {
    console.log("Database connected");  
  });  


app.use('/api/users',userRoutes)
app.use('/api/audiobook',audioBookRoutes)

app.listen(process.env.PORT, () => {
console.log(`Server is running on port ${process.env.PORT}`);
});