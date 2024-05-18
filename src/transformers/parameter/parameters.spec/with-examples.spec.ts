import type {
  ParameterLocation,
  ParameterObject,
} from "@moontai0724/openapi-types";
import { Type } from "@sinclair/typebox";
import { expect, it } from "vitest";

import { type ParameterSchema, transformParameters } from "..";
import { locations } from "../locations.test";

enum Gender {
  Female = "female",
  Male = "male",
  NonBinary = "non-binary",
}

const schema: ParameterSchema = Type.Object({
  name: Type.String({
    examples: {
      example1: {
        value: "Some Name",
      },
    },
  }),
  account: Type.String({
    pattern: "^[a-zA-Z0-9]{8,16}$",
    examples: {
      example1: {
        value: "accountName",
      },
    },
  }),
  age: Type.Optional(
    Type.Integer({
      format: "int32",
      minimum: 0,
      examples: {
        example1: {
          value: 18,
        },
      },
    }),
  ),
  email: Type.String({
    format: "email",
    examples: {
      example1: {
        value: "some@email.com",
      },
    },
  }),
  valid: Type.Optional(
    Type.Boolean({
      default: true,
      examples: {
        example1: {
          value: false,
        },
      },
    }),
  ),
  gender: Type.Optional(
    Type.Enum(Gender, {
      examples: {
        example1: {
          value: "female",
        },
      },
    }),
  ),
  permissions: Type.Optional(
    Type.Array(Type.Union([Type.Literal("read"), Type.Literal("write")]), {
      default: [],
      examples: {
        example1: {
          value: ["read", "write"],
        },
      },
    }),
  ),
});

const expected: Omit<ParameterObject, "in">[] = [
  {
    name: "name",
    required: true,
    schema: {
      type: "string",
    },
    examples: {
      example1: {
        value: "Some Name",
      },
    },
  },
  {
    name: "account",
    required: true,
    schema: {
      type: "string",
      pattern: "^[a-zA-Z0-9]{8,16}$",
    },
    examples: {
      example1: {
        value: "accountName",
      },
    },
  },
  {
    name: "age",
    required: false,
    schema: {
      type: "integer",
      format: "int32",
      minimum: 0,
    },
    examples: {
      example1: {
        value: 18,
      },
    },
  },
  {
    name: "email",
    required: true,
    schema: {
      type: "string",
      format: "email",
    },
    examples: {
      example1: {
        value: "some@email.com",
      },
    },
  },
  {
    name: "valid",
    required: false,
    schema: {
      type: "boolean",
      default: true,
    },
    examples: {
      example1: {
        value: false,
      },
    },
  },
  {
    name: "gender",
    required: false,
    schema: {
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
    examples: {
      example1: {
        value: "female",
      },
    },
  },
  {
    name: "permissions",
    required: false,
    schema: {
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
    examples: {
      example1: {
        value: ["read", "write"],
      },
    },
  },
];

it.each(locations)(
  "should be able to transform an normal object with examples for %s",
  (location: ParameterLocation) => {
    expect(transformParameters(location, schema)).toEqual(
      expected.map((e) => ({ ...e, in: location })),
    );
  },
);
