"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const cors_1 = __importDefault(require("cors"));
const client_1 = __importDefault(require("./lib/prisma/client"));
const validation_1 = require("./lib/validation");
const corsOptions = {
    origin: "http://localhost:8080",
    credentials: true,
};
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)(corsOptions));
app.get("/meals", async (request, response) => {
    const meals = await client_1.default.meals.findMany();
    response.json(meals);
});
app.post("/meals", (0, validation_1.validate)({ body: validation_1.mealsSchema }), async (request, response) => {
    const meals = request.body;
    response.status(201).json(meals);
});
app.get("/meals/:id(\\d+)", async (request, response, next) => {
    const mealsId = Number(request.params.id);
    const meals = await client_1.default.meals.findUnique({
        where: { id: mealsId },
    });
    if (!meals) {
        response.status(404);
        return next(`Cannot GET /meals/${mealsId}`);
    }
    response.json(meals);
});
app.put("/meals/:id(\\d+)", (0, validation_1.validate)({ body: validation_1.mealsSchema }), async (request, response, next) => {
    const mealsId = Number(request.params.id);
    const mealsData = request.body;
    try {
        const meals = await client_1.default.meals.update({
            where: { id: mealsId },
            data: mealsData,
        });
        response.status(200).json(meals);
    }
    catch (error) {
        response.status(404);
        next(`Cannot PUT /meals/${mealsId}`);
    }
});
app.delete("/meals/:id(\\d+)", async (request, response, next) => {
    const mealsId = Number(request.params.id);
    try {
        await client_1.default.meals.delete({
            where: { id: mealsId },
        });
        response.status(204).end();
    }
    catch (error) {
        response.status(404);
        next(`Cannot DELETE /meals/${mealsId}`);
    }
});
app.use(validation_1.validationErrorMiddleware);
exports.default = app;
//# sourceMappingURL=app.js.map