import express, { Router } from "express";
import prisma from "../lib/prisma/client";
import { initMulterMiddleware } from "../lib/middleware/multer";
import { checkAuthorization } from "../lib/middleware/passport";
import { validate, mealsSchema, mealsData } from "../lib/middleware/validation";

const upload = initMulterMiddleware();

const router = Router();

router.get("/", async (request, response) => {
  const meals = await prisma.meals.findMany();
  response.json(meals);
});

router.post("/", checkAuthorization, validate ({ body: mealsSchema }), async (request, response) => {
  const meals: mealsData = request.body;

  response.status(201).json(meals);
});

router.get("/:id(\\d+)", async (request, response, next) => {
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

router.put(
  "/:id(\\d+)",
  checkAuthorization,
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

router.delete("/:id(\\d+)", checkAuthorization, async (request, response, next) => {
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

router.post(
  "/:id(\\d+)/photo",
  checkAuthorization, 
  upload.single("photo"),
  async (request, response, next) => {
    console.log("request.file", request.file);
    if (!request.file) {
      response.status(400);
      return next("No photo file uploaded");
    }

    const photoFilename = request.file.filename;
    response.status(201).json({ photoFilename });
  }
);

export default router;
