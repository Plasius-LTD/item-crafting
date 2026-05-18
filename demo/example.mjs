import { createItemCraftingAccessState, packageDescriptor } from "../dist/index.js";

const state = createItemCraftingAccessState({
  apprenticeshipReady: true,
  discipline: "alchemy",
  workshopTier: "guild",
});

console.log(packageDescriptor);
console.log(state);
