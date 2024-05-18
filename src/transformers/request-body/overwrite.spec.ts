import type {
  MediaTypeObject,
  RequestBodyObject,
  SchemaObject,
} from "@moontai0724/openapi-types";
import { Type } from "@sinclair/typebox";
import { expect, it } from "vitest";

import { transformRequestBody, type TransformRequestBodyOptions } from ".";

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
    description: "Original description",
    example: {
      name: "sample",
      account: "sample",
      email: "sample@example.com",
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
);

const options: TransformRequestBodyOptions = {
  contentTypes: ["application/x-www-form-urlencoded", "application/xml"],
  overwrite: {
    description: "Some description",
    required: false,
  },
  contentOverwrite: {
    example: {
      name: "example",
      account: "example",
      email: "example@example.com",
    },
    examples: {
      example1: {
        summary: "Example 1",
        value: {
          name: "example 1",
          account: "example1",
          email: "example1@example.com",
        },
      },
      example2: {
        summary: "Example 2",
        value: {
          name: "example 2",
          account: "example2",
          email: "example2@example.com",
        },
      },
    },
  },
};

const content: MediaTypeObject = {
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
  example: {
    name: "example",
    account: "example",
    email: "example@example.com",
  },
  examples: {
    example1: {
      summary: "Example 1",
      value: {
        name: "example 1",
        account: "example1",
        email: "example1@example.com",
      },
    },
    example2: {
      summary: "Example 2",
      value: {
        name: "example 2",
        account: "example2",
        email: "example2@example.com",
      },
    },
  },
};

const expected: RequestBodyObject = {
  description: "Some description",
  required: false,
  content: {
    "application/x-www-form-urlencoded": content,
    "application/xml": content,
  },
};

it("should be able to transform a schema", () => {
  expect(transformRequestBody(schema, options)).toEqual(expected);
});
