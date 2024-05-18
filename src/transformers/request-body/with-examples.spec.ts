import type {
  RequestBodyObject,
  SchemaObject,
} from "@moontai0724/openapi-types";
import { Type } from "@sinclair/typebox";
import { expect, it } from "vitest";

import { transformRequestBody } from ".";

const schema: SchemaObject = Type.Object(
  {
    name: Type.String(),
    age: Type.Optional(Type.Integer({ format: "int32" })),
  },
  {
    examples: {
      sample1: {
        summary: "Sample 1",
        description: "Sample 1 Description",
        value: {
          name: "sample1",
          age: 10,
        },
      },
      sample2: {
        summary: "Sample 2",
        value: {
          name: "sample2",
          age: 20,
        },
      },
      sample3: {
        description: "Sample 3 Description",
        value: {
          name: "sample3",
        },
      },
    },
  },
);

const expected: RequestBodyObject = {
  required: true,
  content: {
    "application/json": {
      schema: {
        type: "object",
        required: ["name"],
        properties: {
          name: {
            type: "string",
          },
          age: {
            type: "integer",
            format: "int32",
          },
        },
      },
      examples: {
        sample1: {
          summary: "Sample 1",
          description: "Sample 1 Description",
          value: {
            name: "sample1",
            age: 10,
          },
        },
        sample2: {
          summary: "Sample 2",
          value: {
            name: "sample2",
            age: 20,
          },
        },
        sample3: {
          description: "Sample 3 Description",
          value: {
            name: "sample3",
          },
        },
      },
    },
  },
};

it("should be able to omit examples from schema", () => {
  expect(transformRequestBody(schema)).toEqual(expected);
});
