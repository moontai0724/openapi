import type { RequestBodyObject } from "@moontai0724/openapi-types";
import { expect, it } from "vitest";

import { transformRequestBody } from ".";

const expected: RequestBodyObject = {
  content: {},
};

it("should be able to transform without a schema", () => {
  expect(transformRequestBody(undefined)).toEqual(expected);
});
