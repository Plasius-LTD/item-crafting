import {
  ITEM_CRAFTING_FEATURE_FLAG_ID,
  createItemCraftingAccessState,
  packageDescriptor,
} from "../src/index.js";

describe("@plasius/item-crafting", () => {
  it("exports the package descriptor", () => {
    expect(packageDescriptor.packageName).toBe("@plasius/item-crafting");
    expect(packageDescriptor.featureFlagId).toBe(ITEM_CRAFTING_FEATURE_FLAG_ID);
  });

  it("creates item-crafting access state", () => {
    const state = createItemCraftingAccessState({
      apprenticeshipReady: true,
      discipline: "smithing",
      workshopTier: "local",
    });

    expect(state.discipline).toBe("smithing");
  });
});
