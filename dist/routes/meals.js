"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = __importDefault(require("../lib/prisma/client"));
const multer_1 = require("../lib/middleware/multer");
const passport_1 = require("../lib/middleware/passport");
const validation_1 = require("../lib/middleware/validation");
const upload = (0, multer_1.initMulterMiddleware)();
const router = (0, express_1.Router)();
router.get("/", async (request, response) => {
    const meals = await client_1.default.meals.findMany();
    response.json(meals);
});
router.post("/", passport_1.checkAuthorization, (0, validation_1.validate)({ body: validation_1.mealsSchema }), async (request, response) => {
    const meals = request.body;
    response.status(201).json(meals);
});
router.get("/:id(\\d+)", async (request, response, next) => {
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
router.put("/:id(\\d+)", passport_1.checkAuthorization, (0, validation_1.validate)({ body: validation_1.mealsSchema }), async (request, response, next) => {
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
router.delete("/:id(\\d+)", passport_1.checkAuthorization, async (request, response, next) => {
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
router.post("/:id(\\d+)/photo", passport_1.checkAuthorization, upload.single("photo"), async (request, response, next) => {
    console.log("request.file", request.file);
    if (!request.file) {
        response.status(400);
        return next("No photo file uploaded");
    }
    const photoFilename = request.file.filename;
    response.status(201).json({ photoFilename });
});
exports.default = router;
//# sourceMappingURL=meals.js.map