import { Static, Type } from "@sinclair/typebox";

export const mealsSchema = Type.Object(
  {
    title: Type.String(),
    description: Type.Optional(Type.String()),
  },
  { additionalProperties: false }
);

export type mealsData = Static<typeof mealsSchema>;
