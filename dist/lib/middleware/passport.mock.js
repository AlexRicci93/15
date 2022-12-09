"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
jest.mock("./passport.ts", () => {
    const originalModule = jest.requireActual("./passport.ts");
    const checkAuthorization = (request, response, next) => {
        next();
    };
    return {
        __esModule: true,
        ...originalModule,
        checkAuthorization,
    };
});
//# sourceMappingURL=passport.mock.js.map