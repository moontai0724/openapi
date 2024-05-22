import { expect, it } from "vitest";

import { transformRequestBody } from ".";

it("should return undefined when transform without a schema", () => {
  expect(transformRequestBody(undefined)).toEqual(undefined);
});
