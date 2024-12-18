export const speciesOptionsList = ["Dog", "Cat"] as const;
export type Species = (typeof speciesOptionsList)[number];
