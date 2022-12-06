import { prismaMock } from "./lib/prisma/client.mock";

import supertest from "supertest";

import app from "./app";

const request = supertest(app);

test("GET /meals", async () => {
    const meals = [{
        id: 1,
        name: "Carbonara",
        description: "Un buonissimo piatto di pasta",
    },
]

   //@ts-ignore
   prismaMock.meals.findMany.mockResolvedValue(meals)
   const response = await request
       .get("/meals")
       .expect(200)
       .expect("Content-Type", /application\/json/)
   expect(response.body).toEqual(meals);

        
});

 





