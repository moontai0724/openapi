import type { ResponsesObject, SchemaObject } from "@moontai0724/openapi-types";
import { Type } from "@sinclair/typebox";
import { expect, it } from "vitest";

import { transformResponses } from "..";

const schema: SchemaObject = Type.Object({});

const expected: ResponsesObject = {
  "200": {
    description: "No Description.",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {},
        },
      },
    },
  },
};

it("should be able to transform an empty schema", () => {
  expect(transformResponses(schema)).toEqual(expected);
});
