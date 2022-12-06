"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mealsSchema = void 0;
const typebox_1 = require("@sinclair/typebox");
exports.mealsSchema = typebox_1.Type.Object({
    email: typebox_1.Type.String(),
    name: typebox_1.Type.Optional(typebox_1.Type.String()),
}, { additionalProperties: false });
//# sourceMappingURL=meals.js.map