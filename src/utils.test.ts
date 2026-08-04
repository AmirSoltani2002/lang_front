import { describe, expect, it } from "vitest";

import { stageLabel } from "./utils";

describe("stageLabel", () => {
  it("returns a friendly label for every configured reminder", () => {
    expect(stageLabel("1_day")).toBe("1-day review");
    expect(stageLabel("1_year")).toBe("1-year review");
  });
});
