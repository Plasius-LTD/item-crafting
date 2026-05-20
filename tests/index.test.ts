import {
  ITEM_CRAFTING_FEATURE_FLAG_ID,
  createItemCraftingAccessState,
  createItemCraftingThroughputAssumptions,
  createItemCraftingWorkOrderRecord,
  defaultItemCraftingThroughputAssumptions,
  isItemCraftingDiscipline,
  isWorkshopTier,
  itemCraftingFieldPolicies,
  itemCraftingPrivacyScaleRollout,
  packageDescriptor,
  ITEM_CRAFTING_PRIVACY_SCALE_FEATURE_FLAG_ID,
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

  it("exports the privacy and scale rollout metadata", () => {
    expect(itemCraftingPrivacyScaleRollout.featureFlagId).toBe(
      ITEM_CRAFTING_PRIVACY_SCALE_FEATURE_FLAG_ID
    );
    expect(itemCraftingPrivacyScaleRollout.envOverride).toBe(
      "ITEM_CRAFTING_PRIVACY_SCALE_ENABLED"
    );
  });

  it("documents a minimized work-order field policy", () => {
    expect(itemCraftingFieldPolicies).toEqual([
      expect.objectContaining({
        field: "crafterSubjectId",
        sensitivity: "pseudonymous",
      }),
      expect.objectContaining({
        field: "workshopId",
      }),
      expect.objectContaining({
        field: "discipline",
      }),
      expect.objectContaining({
        field: "workshopTier",
      }),
      expect.objectContaining({
        field: "updatedAtIso",
        retention: "short-lived",
      }),
    ]);
  });

  it("creates a minimal work-order record", () => {
    const record = createItemCraftingWorkOrderRecord({
      crafterSubjectId: "crafter-sub-1",
      workshopId: "workshop-1",
      discipline: "smithing",
      workshopTier: "guild",
      updatedAtIso: "2026-05-20T00:00:00.000Z",
    });

    expect(record.workshopTier).toBe("guild");
  });

  it("rejects unsupported discipline or workshop tiers", () => {
    expect(isItemCraftingDiscipline("alchemy")).toBe(true);
    expect(isItemCraftingDiscipline("invalid")).toBe(false);
    expect(isWorkshopTier("academy")).toBe(true);
    expect(isWorkshopTier("invalid")).toBe(false);

    expect(() =>
      createItemCraftingWorkOrderRecord({
        crafterSubjectId: "crafter-sub-1",
        workshopId: "workshop-1",
        discipline: "invalid" as never,
        workshopTier: "guild",
        updatedAtIso: "2026-05-20T00:00:00.000Z",
      })
    ).toThrow("discipline must be a supported item-crafting discipline");
  });

  it("validates positive throughput assumptions", () => {
    expect(defaultItemCraftingThroughputAssumptions.maxConcurrentWorkOrders).toBe(
      4_000
    );

    const throughputAssumptions = createItemCraftingThroughputAssumptions({
      maxConcurrentWorkOrders: 5_000,
      maxWorkshopDispatchesPerMinute: 20_000,
      maxCraftingEventsPerMinute: 35_000,
    });

    expect(throughputAssumptions.maxCraftingEventsPerMinute).toBe(35_000);
    expect(() =>
      createItemCraftingThroughputAssumptions({
        maxConcurrentWorkOrders: 0,
        maxWorkshopDispatchesPerMinute: 20_000,
        maxCraftingEventsPerMinute: 35_000,
      })
    ).toThrow("maxConcurrentWorkOrders must be a positive safe integer");
  });
});
