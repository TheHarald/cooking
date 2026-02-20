// db/config.ts
import { openDB, deleteDB } from "idb";
import type { DBSchema } from "idb";
import type { IRecipe } from "../types/types";

export interface ICookingDB extends DBSchema {
  recipes: {
    value: IRecipe;
    key: string; // предположим, что ключ - это id рецепта (строка)
  };
}

const DB_NAME = "cooking-db";
const DB_VERSION = 1;

export async function initDB() {
  const db = await openDB<ICookingDB>(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion) {
      console.log(`Upgrading DB from ${oldVersion} to ${newVersion}`);

      // Создаём хранилище рецептов
      if (!db.objectStoreNames.contains("recipes")) {
        db.createObjectStore("recipes", {
          keyPath: "id", // предполагаем, что у IRecipe есть поле id
          // или если ключ не является полем объекта:
          // autoIncrement: true
        });

        // Здесь можно создать индексы, если у IRecipe есть поля для поиска
        // Например:
        // recipeStore.createIndex('by-category', 'category');
        // recipeStore.createIndex('by-cookingTime', 'cookingTime');
      }
    },
    blocked() {
      console.log("Database opening blocked");
    },
    blocking() {
      console.log("This connection is blocking a new version");
    },
    terminated() {
      console.log("Database connection terminated");
    },
  });

  return db;
}

// Удаление базы данных
export async function dropDB() {
  await deleteDB(DB_NAME, {
    blocked() {
      console.log("Database deletion blocked");
    },
  });
}
