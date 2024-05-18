import type { ResponsesObject } from "@moontai0724/openapi-types";
import { expect, it } from "vitest";

import { transformResponses } from "..";

const expected: ResponsesObject = {
  "200": {
    description: "No Description.",
  },
};

it("should be able to transform without a schema", () => {
  expect(transformResponses(undefined)).toEqual(expected);
});
