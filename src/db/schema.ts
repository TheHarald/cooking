import type { DBSchema } from "idb";
import type { IRecipe } from "../types/types";

export interface ICookingDB extends DBSchema {
  recipes: {
    value: IRecipe;
    key: string;
  };
}
