import express from "express";
import "express-async-errors";
import prisma from "./lib/prisma/client";
import {
    validate,
    validationErrorMiddleware,
    mealsSchema,
    mealsData
 } from "./lib/validation";

const app = express();
app.use(express.json())

app.get("/meals", async (request, response) => {
    const meals = await prisma.meals.findMany()
    response.json(meals)
})

app.use(validationErrorMiddleware)

export default app
