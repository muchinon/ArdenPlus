import express from "express";
import mongoose from "mongoose";
import authRouter from "./routes/auth_router.js";
import { dbConnection } from "./config/db.js";
import expressOasGenerator from "express-oas-generator"


// Creating the express ap
const app = express();

expressOasGenerator.handleResponses(app, {
    alwaysServeDocs: true,
    tags: ['Auth'],
    mongooseModels: mongoose.modelNames(),
});



dbConnection();

// middlewares
app.use(express.json());

// Routers
app.use(authRouter)
expressOasGenerator.handleRequests();
app.use((req, res) => res.redirect('/api-docs'));

// Listening to incoming request
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Arden Play is Live at port ${port}`)
})