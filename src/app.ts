import express from "express";
import "express-async-errors";
import cors from "cors";
import prisma from "./lib/prisma/client";
import {
  validate,
  validationErrorMiddleware,
  mealsSchema,
  mealsData,
} from "./lib/validation";

const corsOptions = {
  origin: "http://localhost:8080",
  credentials: true,
};

const app = express();
app.use(express.json());
app.use(cors(corsOptions))

app.get("/meals", async (request, response) => {
  const meals = await prisma.meals.findMany();
  response.json(meals);
});

app.post(
  "/meals",
  validate({ body: mealsSchema }),
  async (request, response) => {
    const meals: mealsData = request.body;

    response.status(201).json(meals);
  }
);

app.get("/meals/:id(\\d+)", async (request, response, next) => {
  const mealsId = Number(request.params.id);
  const meals = await prisma.meals.findUnique({
    where: { id: mealsId },
  });
  if (!meals) {
    response.status(404);
    return next(`Cannot GET /meals/${mealsId}`);
  }
  response.json(meals);
});

app.put(
  "/meals/:id(\\d+)",
  validate({ body: mealsSchema }),
  async (request, response, next) => {
    const mealsId = Number(request.params.id);
    const mealsData: mealsData = request.body;
    try {
      const meals = await prisma.meals.update({
        where: { id: mealsId },
        data: mealsData,
      });
      response.status(200).json(meals);
    } catch (error) {
      response.status(404);
      next(`Cannot PUT /meals/${mealsId}`);
    }
  }
);

app.delete("/meals/:id(\\d+)", async (request, response, next) => {
  const mealsId = Number(request.params.id);

  try {
    await prisma.meals.delete({
      where: { id: mealsId },
    });

    response.status(204).end();
  } catch (error) {
    response.status(404);
    next(`Cannot DELETE /meals/${mealsId}`);
  }
});

app.use(validationErrorMiddleware);

export default app;
