"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const client_1 = __importDefault(require("./lib/prisma/client"));
const validation_1 = require("./lib/validation");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get("/meals", async (request, response) => {
    const meals = await client_1.default.meals.findMany();
    response.json(meals);
});
app.post("/meals", (0, validation_1.validate)({ body: validation_1.mealsSchema }), async (request, response) => {
    const meals = request.body;
    response.status(201).json(meals);
});
app.use(validation_1.validationErrorMiddleware);
exports.default = app;
//# sourceMappingURL=app.js.map