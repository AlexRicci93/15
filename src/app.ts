import express from "express";
import "express-async-errors";
import { validationErrorMiddleware } from "./lib/middleware/validation";
import { initCorsMiddleware } from "./lib/middleware/cors";


import mealsRoutes from "./routes/meals";




const app = express();
app.use(express.json());

app.use(initCorsMiddleware());
app.use("/meals", mealsRoutes);



app.use(validationErrorMiddleware);

export default app;
