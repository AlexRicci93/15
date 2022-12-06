import { prismaMock } from "./lib/prisma/client.mock";

import supertest from "supertest";

import app from "./app";

const request = supertest(app);

describe("GET /meals", () => {
  test("Valid request", async () => {
    const meals = [
      {
        id: 1,
        title: "Carbonara",
        description: "Un buonissimo piatto di pasta",
      },
    ];

    //@ts-ignore
    prismaMock.meals.findMany.mockResolvedValue(meals);
    const response = await request
      .get("/meals")
      .expect(200)
      .expect("Content-Type", /application\/json/);
    expect(response.body).toEqual(meals);
  });
});

describe("POST /meals", () => {
  test("Valid request", async () => {
    const meals = {
      title: "Arrabiata",
      description: "Un piatto di pasta piccante",
    };

    const response = await request
      .post("/meals")
      .send(meals)
      .expect(201)
      .expect("Content-Type", /application\/json/);
    expect(response.body).toEqual(meals);
  });

  test("Invalid request", async () => {
    const meals = {
      description: "Le melanzane non passano per fortuna!",
    };

    const response = await request
      .post("/meals")
      .send(meals)
      .expect(422)
      .expect("Content-Type", /application\/json/);

    expect(response.body).toEqual({
      errors: {
        body: expect.any(Array),
      },
    });
  });
});
