import {Static, Type} from "@sinclair/typebox"

export const mealsSchema = Type.Object({
    email: Type.String(),
    name: Type.Optional(Type.String()),      
}, {additionalProperties: false})  

export type mealsData = Static<typeof mealsSchema>