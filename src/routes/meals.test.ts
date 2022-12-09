import { prismaMock } from "../lib/prisma/client.mock";

import supertest from "supertest";

import app from "../app";


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
      .expect("Content-Type", /application\/json/)
      .expect("Access-Control-Allow-Origin", "http://localhost:8080");
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
      .expect("Content-Type", /application\/json/)      
      .expect("Access-Control-Allow-Origin", "http://localhost:8080");

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

describe("GET /meals:id", () => {
  test("Valid request", async () => {
    const meals = [
      {
        id: 1,
        title: "Carbonara",
        description: "Un buonissimo piatto di pasta",
      },
    ];
    //@ts-ignore
    prismaMock.meals.findUnique.mockResolvedValue(meals);
    const response = await request
      .get("/meals/1")
      .expect(200)
      .expect("Content-Type", /application\/json/)
      .expect("Access-Control-Allow-Origin", "http://localhost:8080");

    expect(response.body).toEqual(meals);
  });
  test("Meals does not exist", async () => {
    //@ts-ignore
    prismaMock.meals.findUnique.mockResolvedValue(null);
    const response = await request
      .get("/meals/23")
      .expect(404)
      .expect("Content-Type", /text\/html/);
    expect(response.text).toContain("Cannot GET /meals/23");
  });
  test("Invalid meals ID", async () => {
    //@ts-ignore
    prismaMock.meals.findUnique.mockResolvedValue(null);
    const response = await request
      .get("/meals/asdf")
      .expect(404)
      .expect("Content-Type", /text\/html/);
    expect(response.text).toContain("Cannot GET /meals/asdf");
  });
});

describe("PUT /meals/:id", () => {
  test("Valid Request", async () => {
    const meals = {
      id: 1,
      title: "Pizza",
      description: "Una buona pizza margherita",
    };
    //@ts-ignore
    prismaMock.meals.update.mockResolvedValue(meals);
    const response = await request
      .put("/meals/1")
      .send({
        title: "Pizza",
        description: "Una buona pizza margherita",
      })
      .expect(200)
      .expect("Content-Type", /application\/json/)
      .expect("Access-Control-Allow-Origin", "http://localhost:8080");

    expect(response.body).toEqual(meals);
  });
  test("Invalid Request", async () => {
    const meals = {
      description: "Una buona pizza",
    };
    const response = await request
      .put("/meals/23")
      .send(meals)
      .expect(422)
      .expect("Content-Type", /application\/json/);
    expect(response.body).toEqual({
      errors: {
        body: expect.any(Array),
      },
    });
  });

  test("Meals does not exist", async () => {
    //@ts-ignore
    prismaMock.meals.update.mockRejectedValue(new Error("Error"));
    const response = await request
      .put("/meals/23")
      .send({
        title: "Carbonara",
        description: "Una buonissimo piatto di pasta",
      })
      .expect(404)
      .expect("Content-Type", /text\/html/);
    expect(response.text).toContain("Cannot PUT /meals/23");
  });

  test("Invalid meals Id", async () => {
    //@ts-ignore
    prismaMock.meals.findUnique.mockResolvedValue(null);
    const response = await request
      .put("/meals/asdf")
      .send({
        title: "Carbonara",
        description: "Un buonissimo piatto di pasta",
      })
      .expect(404)
      .expect("Content-Type", /text\/html/);
    expect(response.text).toContain("Cannot PUT /meals/asdf");
  });
});

describe("DELETE /meals/:id", () => {
  test("Valid request", async () => {
    const response = await request.delete("/meals/1").
    expect(204)
    .expect("Access-Control-Allow-Origin", "http://localhost:8080");


    expect(response.text).toEqual("");
  });

  test("Meals does not exist", async () => {
    //@ts-ignore
    prismaMock.meals.delete.mockRejectedValue(new Error("Error"));

    const response = await request
      .delete("/meals/23")
      .expect(404)
      .expect("Content-Type", /text\/html/)
      

    expect(response.text).toContain("Cannot DELETE /meals/23");
  });

  test("Invalid meals ID", async () => {
    const response = await request
      .delete("/meals/asdf")
      .expect(404)
      .expect("Content-Type", /text\/html/);

    expect(response.text).toContain("Cannot DELETE /meals/asdf");
  });
});



describe("POST /meals/:id/photo", () => {

  test("Valid request with TXT hello upload", async () => {
    await request
        .post("/meals/23/photo")
        .attach("photo", "test-fixtures/photos/hello.txt")
        .expect(201)
        .expect("Access-Control-Allow-Origin", "http://localhost:8080");
});

  test("Invalid meals ID", async() => {
      const response = await request
          .post("/meals/asdf/photo")
          .expect(404)
          .expect("Content-Type", /text\/html/ )
      expect(response.text).toContain("Cannot POST /meals/asdf/photo")
  });

  test("Invalid request with no file upload", async() =>{
      const response = await request
          .post("/meals/23/photo")
          .expect(400)        
          .expect("Content-Type", /text\/html/ )
      expect(response.text).toContain("No photo file uploaded")
  });
});


