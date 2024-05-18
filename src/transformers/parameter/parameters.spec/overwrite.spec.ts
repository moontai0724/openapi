import type {
  ParameterLocation,
  ParameterObject,
} from "@moontai0724/openapi-types";
import { Type } from "@sinclair/typebox";
import { expect, it } from "vitest";

import {
  type ParameterSchema,
  transformParameters,
  type TransformParametersOptions,
} from "..";
import { locations } from "../locations.test";

enum Gender {
  Female = "female",
  Male = "male",
  NonBinary = "non-binary",
}

const schema: ParameterSchema = Type.Object({
  name: Type.String({
    example: "Some Name",
    examples: {
      example1: {
        value: "Some Name",
      },
    },
  }),
  account: Type.String({
    pattern: "^[a-zA-Z0-9]{8,16}$",
    example: "accountName",
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
      example: 18,
      examples: {
        example1: {
          value: 18,
        },
      },
    }),
  ),
  email: Type.String({
    format: "email",
    example: "some@email.com",
    examples: {
      example1: {
        value: "some@email.com",
      },
    },
  }),
  valid: Type.Optional(
    Type.Boolean({
      default: true,
      example: false,
      examples: {
        example1: {
          value: false,
        },
      },
    }),
  ),
  gender: Type.Optional(
    Type.Enum(Gender, {
      example: "female",
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
      example: ["read", "write"],
      examples: {
        example1: {
          value: ["read", "write"],
        },
      },
    }),
  ),
});

const options: TransformParametersOptions = {
  overwriteAll: {
    example: undefined,
    examples: undefined,
  },
  overwrites: {
    name: {
      example: "Overwritten Name",
    },
    account: {
      example: "Overwritten Account",
    },
    age: {
      example: 19,
    },
    email: {
      example: "overwritten@email.com",
    },
    valid: {
      example: true,
    },
    gender: {
      example: "male",
    },
    permissions: {
      example: ["read"],
    },
  },
};

const expected: Omit<ParameterObject, "in">[] = [
  {
    name: "name",
    required: true,
    schema: {
      type: "string",
    },
    example: "Overwritten Name",
  },
  {
    name: "account",
    required: true,
    schema: {
      type: "string",
      pattern: "^[a-zA-Z0-9]{8,16}$",
    },
    example: "Overwritten Account",
  },
  {
    name: "age",
    required: false,
    schema: {
      type: "integer",
      format: "int32",
      minimum: 0,
    },
    example: 19,
  },
  {
    name: "email",
    required: true,
    schema: {
      type: "string",
      format: "email",
    },
    example: "overwritten@email.com",
  },
  {
    name: "valid",
    required: false,
    schema: {
      type: "boolean",
      default: true,
    },
    example: true,
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
    example: "male",
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
    example: ["read"],
  },
];

it.each(locations)(
  "should be able to transform an normal object and overwrite properties with options for %s",
  (location: ParameterLocation) => {
    expect(transformParameters(location, schema, options)).toEqual(
      expected.map((e) => ({ ...e, in: location })),
    );
  },
);
