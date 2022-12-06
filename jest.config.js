module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  setupFilesAfterEnv: ["./src/lib/prisma/client.mock.ts"]
};
