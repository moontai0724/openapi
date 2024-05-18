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
});

const expected: Omit<ParameterObject, "in">[] = [
  {
    name: "name",
    required: true,
    schema: {
      type: "string",
    },
  },
  {
    name: "account",
    required: true,
    schema: {
      type: "string",
      pattern: "^[a-zA-Z0-9]{8,16}$",
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
  },
  {
    name: "email",
    required: true,
    schema: {
      type: "string",
      format: "email",
    },
  },
  {
    name: "valid",
    required: false,
    schema: {
      type: "boolean",
      default: true,
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
  },
];

it.each(locations)(
  "should be able to transform an normal object for %s",
  (location: ParameterLocation) => {
    expect(transformParameters(location, schema)).toEqual(
      expected.map((e) => ({ ...e, in: location })),
    );
  },
);
