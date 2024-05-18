import type {
  RequestBodyObject,
  SchemaObject,
} from "@moontai0724/openapi-types";
import { Type } from "@sinclair/typebox";
import { expect, it } from "vitest";

import { transformRequestBody } from ".";

enum Gender {
  Female = "female",
  Male = "male",
  NonBinary = "non-binary",
}

const schema: SchemaObject = Type.Object(
  {
    name: Type.String(),
    account: Type.String({ pattern: "^[a-zA-Z0-9]{8,16}$" }),
    age: Type.Optional(Type.Integer({ format: "int32", minimum: 0 })),
    email: Type.String({ format: "email" }),
    valid: Type.Optional(Type.Boolean({ default: true })),
    gender: Type.Optional(Type.Enum(Gender)),
    permissions: Type.Optional(
      Type.Array(Type.Union([Type.Literal("read"), Type.Literal("write")]), {
        default: [],
      }),
    ),
  },
  {
    description: "Some description",
  },
);

const expected: RequestBodyObject = {
  description: "Some description",
  required: true,
  content: {
    "application/json": {
      schema: {
        type: "object",
        required: ["name", "account", "email"],
        properties: {
          name: {
            type: "string",
          },
          account: {
            type: "string",
            pattern: "^[a-zA-Z0-9]{8,16}$",
          },
          age: {
            type: "integer",
            format: "int32",
            minimum: 0,
          },
          email: {
            type: "string",
            format: "email",
          },
          valid: {
            type: "boolean",
            default: true,
          },
          gender: {
            anyOf: [
              {
                const: "female",
                type: "string",
              },
              {
                const: "male",
                type: "string",
              },
              {
                const: "non-binary",
                type: "string",
              },
            ],
          },
          permissions: {
            type: "array",
            items: {
              anyOf: [
                {
                  const: "read",
                  type: "string",
                },
                {
                  const: "write",
                  type: "string",
                },
              ],
            },
            default: [],
          },
        },
      },
    },
  },
};

it("should be able to transform a schema", () => {
  expect(transformRequestBody(schema)).toEqual(expected);
});
