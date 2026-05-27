import {
  ITEM_CRAFTING_FEATURE_FLAG_ID,
  createHandoffRetryPolicy,
  createItemCraftingAccessState,
  createItemCraftingHandoffContract,
  createPortableHandoffHost,
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

  it("creates portable handoff hosts", () => {
    const host = createPortableHandoffHost({
      hostId: "authority-worker-a",
      runtime: "worker",
      transport: "queue",
      capabilityFlags: ["replay-safe"],
    });

    expect(host.transport).toBe("queue");
    expect(() => {
      (host.capabilityFlags as string[]).push("mutate");
    }).toThrow();
  });

  it("creates bounded retry policy metadata", () => {
    const policy = createHandoffRetryPolicy({
      timeoutMs: 1250,
      maxAttempts: 3,
      retryableFailureCodes: ["CRAFTING_TIMEOUT"],
      terminalFailureCodes: ["APPRENTICESHIP_MISSING"],
    });

    expect(policy.maxAttempts).toBe(3);
    expect(Object.isFrozen(policy)).toBe(true);
  });

  it("creates item-crafting handoff contracts", () => {
    const contract = createItemCraftingHandoffContract({
      handoffId: "handoff-1",
      apprenticeshipReady: true,
      discipline: "alchemy",
      workshopTier: "guild",
      sourceHost: {
        hostId: "training-authority",
        runtime: "server",
        transport: "http",
        capabilityFlags: ["trace-linked"],
      },
      targetHost: {
        hostId: "crafting-authority",
        runtime: "worker",
        transport: "queue",
        capabilityFlags: ["replay-safe"],
      },
      retryPolicy: {
        timeoutMs: 1250,
        maxAttempts: 3,
        retryableFailureCodes: ["CRAFTING_TIMEOUT"],
        terminalFailureCodes: ["APPRENTICESHIP_MISSING"],
      },
    });

    expect(contract.targetHost.runtime).toBe("worker");
    expect(contract.retryPolicy.timeoutMs).toBe(1250);
  });
});
