import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"

import todoRoute from "./routes/todo.route.js"
import userRoute from "./routes/user.route.js"
import cookieParser from "cookie-parser"

const app = express()

dotenv.config();
const PORT = process.env.PORT || 4002
const DB_URI = process.env.MONGODB_URI

// Middlewares
app.use(express.json())
app.use(cookieParser())

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders: ["Content-Type", "Authorization"]
  })
)

// Database connection
try {
   await mongoose.connect(DB_URI)
    console.log("Connected to MongoDB")
} catch (error) {
    console.log(error);
}

// Routes
app.use("/todo",todoRoute)
app.use("/user",userRoute)



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})