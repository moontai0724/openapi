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
    example: "Some Name",
  }),
  account: Type.String({
    pattern: "^[a-zA-Z0-9]{8,16}$",
    example: "accountName",
  }),
  age: Type.Optional(
    Type.Integer({
      format: "int32",
      minimum: 0,
      example: 18,
    }),
  ),
  email: Type.String({
    format: "email",
    example: "some@email.com",
  }),
  valid: Type.Optional(
    Type.Boolean({
      default: true,
      example: false,
    }),
  ),
  gender: Type.Optional(
    Type.Enum(Gender, {
      example: "female",
    }),
  ),
  permissions: Type.Optional(
    Type.Array(Type.Union([Type.Literal("read"), Type.Literal("write")]), {
      default: [],
      example: ["read", "write"],
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
    example: "Some Name",
  },
  {
    name: "account",
    required: true,
    schema: {
      type: "string",
      pattern: "^[a-zA-Z0-9]{8,16}$",
    },
    example: "accountName",
  },
  {
    name: "age",
    required: false,
    schema: {
      type: "integer",
      format: "int32",
      minimum: 0,
    },
    example: 18,
  },
  {
    name: "email",
    required: true,
    schema: {
      type: "string",
      format: "email",
    },
    example: "some@email.com",
  },
  {
    name: "valid",
    required: false,
    schema: {
      type: "boolean",
      default: true,
    },
    example: false,
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
    example: "female",
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
    example: ["read", "write"],
  },
];

it.each(locations)(
  "should be able to transform an normal object with example for %s",
  (location: ParameterLocation) => {
    expect(transformParameters(location, schema)).toEqual(
      expected.map((e) => ({ ...e, in: location })),
    );
  },
);
