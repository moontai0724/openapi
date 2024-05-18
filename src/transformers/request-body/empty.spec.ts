import type {
  RequestBodyObject,
  SchemaObject,
} from "@moontai0724/openapi-types";
import { Type } from "@sinclair/typebox";
import { expect, it } from "vitest";

import { transformRequestBody } from ".";

const schema: SchemaObject = Type.Object({});

const expected: RequestBodyObject = {
  required: true,
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {},
      },
    },
  },
};

it("should be able to transform an empty schema", () => {
  expect(transformRequestBody(schema)).toEqual(expected);
});
