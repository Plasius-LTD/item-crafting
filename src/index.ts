export interface PackageDescriptor {
  readonly packageName: string;
  readonly featureFlagId: string;
  readonly envPrefix: string;
  readonly summary: string;
}

export type ItemCraftingDiscipline = "smithing" | "alchemy" | "tailoring";

export type WorkshopTier = "local" | "guild" | "academy";

export interface ItemCraftingAccessState {
  readonly apprenticeshipReady: boolean;
  readonly discipline: ItemCraftingDiscipline;
  readonly workshopTier: WorkshopTier;
}

export const ITEM_CRAFTING_PACKAGE = "@plasius/item-crafting";
export const ITEM_CRAFTING_ENV_PREFIX = "ITEM_CRAFTING";
export const ITEM_CRAFTING_FEATURE_FLAG_ID = "isekai.item-crafting.enabled";

export const packageDescriptor: PackageDescriptor = Object.freeze({
  packageName: ITEM_CRAFTING_PACKAGE,
  featureFlagId: ITEM_CRAFTING_FEATURE_FLAG_ID,
  envPrefix: ITEM_CRAFTING_ENV_PREFIX,
  summary:
    "Apprenticeship-gated item-crafting access and authority boundary contracts for Plasius.",
});

export function createItemCraftingAccessState(
  input: ItemCraftingAccessState
): ItemCraftingAccessState {
  return Object.freeze({ ...input });
}
