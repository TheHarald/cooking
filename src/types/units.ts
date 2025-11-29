import { unitLabels } from "../services/constants";
import type { Unit } from "./types";

export function getUnitLabel(unit: Unit): string {
  return unitLabels[unit] ?? "едениц";
}
