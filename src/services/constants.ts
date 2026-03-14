import { Unit } from "../types/types";

export const newId = "new-id";

export const unitLabels: Record<Unit, string> = {
  [Unit.Grams]: "гр",
  [Unit.Kilograms]: "кг",
  [Unit.Milligrams]: "мг",
  [Unit.Milliliters]: "мл",
  [Unit.Liters]: "л",
  [Unit.Teaspoon]: "ч.л.",
  [Unit.Tablespoon]: "ст.л.",
  [Unit.Cup]: "стакан",
  [Unit.Pieces]: "шт",
  [Unit.Bunch]: "пучок",
  [Unit.Clove]: "зубчик",
  [Unit.Stalk]: "стебель",
  [Unit.Pinch]: "щепотка",
  [Unit.ToTaste]: "по вкусу",
  [Unit.Serving]: "порция",
  [Unit.Package]: "упаковка",
};
