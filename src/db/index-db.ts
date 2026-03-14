// db/config.ts
import { openDB, deleteDB } from "idb";
import type { ICookingDB } from "./schema";

const DB_NAME = "cooking-db";
const DB_VERSION = 2;

export async function initDB() {
  const db = await openDB<ICookingDB>(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion) {
      console.log(`Upgrading DB from ${oldVersion} to ${newVersion}`);

      if (!db.objectStoreNames.contains("recipes")) {
        db.createObjectStore("recipes", { keyPath: "id" });
      }

      if (!db.objectStoreNames.contains("mealPlans")) {
        const mealStore = db.createObjectStore("mealPlans", { keyPath: "weekStart" });
        mealStore.createIndex("by-weekStart", "weekStart");
      }

      if (!db.objectStoreNames.contains("shoppingListChecked")) {
        db.createObjectStore("shoppingListChecked", { keyPath: "key" });
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
