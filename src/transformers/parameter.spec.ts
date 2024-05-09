import type { ParameterObject, SchemaObject } from "@moontai0724/openapi-types";
import { Type } from "@sinclair/typebox";
import { expect, test } from "vitest";

import {
  type ParameterSchema,
  transformParameters,
  type TransformParametersOptions,
} from "./parameter";

const locations = ["cookie", "header", "path", "query"] as const;
const testCases = [
  {
    summary: "Empty Object",
    schema: Type.Object({}),
    options: {},
    expected: [],
  },
  {
    summary: "Normal Object",
    schema: Type.Object({
      page: Type.Optional(Type.Integer()),
      size: Type.Integer({ default: 10 }),
      amount: Type.Number(),
      userAccount: Type.String({ pattern: "^[a-zA-Z0-9]{8,16}$" }),
      email: Type.String({ format: "email" }),
    }),
    options: {},
    expected: [
      {
        name: "page",
        in: "query",
        required: false,
        schema: {
          type: "integer",
        },
      },
      {
        name: "size",
        in: "query",
        required: true,
        schema: {
          type: "integer",
          default: 10,
        },
      },
      {
        name: "amount",
        in: "query",
        required: true,
        schema: {
          type: "number",
        },
      },
      {
        name: "userAccount",
        in: "query",
        required: true,
        schema: {
          type: "string",
          pattern: "^[a-zA-Z0-9]{8,16}$",
        },
      },
      {
        name: "email",
        in: "query",
        required: true,
        schema: {
          type: "string",
          format: "email",
        },
      },
    ],
  },
  {
    summary: "Normal Object options enabled",
    schema: Type.Object({
      page: Type.Optional(Type.Integer()),
      size: Type.Integer({ default: 10 }),
      amount: Type.Number(),
      userAccount: Type.String({ pattern: "^[a-zA-Z0-9]{8,16}$" }),
      email: Type.String({ format: "email" }),
    }),
    options: {
      allowReserved: ["amount", "userAccount", "email"],
      deprecated: ["amount", "email"],
      explode: ["amount", "userAccount", "email"],
    },
    expected: [
      {
        name: "page",
        in: "query",
        required: false,
        deprecated: false,
        explode: false,
        allowReserved: false,
        schema: {
          type: "integer",
        },
      },
      {
        name: "size",
        in: "query",
        required: true,
        deprecated: false,
        explode: false,
        allowReserved: false,
        schema: {
          type: "integer",
          default: 10,
        },
      },
      {
        name: "amount",
        in: "query",
        required: true,
        deprecated: true,
        explode: true,
        allowReserved: true,
        schema: {
          type: "number",
        },
      },
      {
        name: "userAccount",
        in: "query",
        required: true,
        deprecated: false,
        explode: true,
        allowReserved: true,
        schema: {
          type: "string",
          pattern: "^[a-zA-Z0-9]{8,16}$",
        },
      },
      {
        name: "email",
        in: "query",
        required: true,
        deprecated: true,
        explode: true,
        allowReserved: true,
        schema: {
          type: "string",
          format: "email",
        },
      },
    ],
  },
  {
    summary: "With description",
    schema: Type.Object({
      email: Type.String({ description: "Email" }),
    }),
    options: {},
    expected: [
      {
        name: "email",
        in: "query",
        description: "Email",
        required: true,
        schema: {
          type: "string",
          description: "Email",
        },
      },
    ],
  },
  {
    summary: "With example",
    schema: Type.Object({
      email: Type.String({ example: "test@example.com" }),
    }),
    options: {},
    expected: [
      {
        name: "email",
        in: "query",
        required: true,
        schema: {
          type: "string",
          example: "test@example.com",
        },
      },
    ],
  },
  {
    summary: "With examples",
    schema: Type.Object({
      email: Type.String({
        examples: {
          test: {
            value: "test@example.com",
          },
          example: {
            value: "example@example.com",
            summary: "example",
            description: "example",
          },
        },
      }),
    }),
    options: {},
    expected: [
      {
        name: "email",
        in: "query",
        required: true,
        schema: {
          type: "string",
          examples: {
            test: {
              value: "test@example.com",
            },
            example: {
              value: "example@example.com",
              summary: "example",
              description: "example",
            },
          },
        },
        examples: {
          test: {
            value: "test@example.com",
          },
          example: {
            value: "example@example.com",
            summary: "example",
            description: "example",
          },
        },
      },
    ],
  },
  {
    summary: "With both examples and example also acceptable (non-standard)",
    schema: Type.Object({
      email: Type.String({
        examples: {
          test: {
            value: "test@example.com",
          },
          example: {
            value: "example@example.com",
            summary: "example",
            description: "example",
          },
        },
        example: "test@example.com",
      }),
    }),
    options: {},
    expected: [
      {
        name: "email",
        in: "query",
        required: true,
        schema: {
          type: "string",
          examples: {
            test: {
              value: "test@example.com",
            },
            example: {
              value: "example@example.com",
              summary: "example",
              description: "example",
            },
          },
          example: "test@example.com",
        },
        examples: {
          test: {
            value: "test@example.com",
          },
          example: {
            value: "example@example.com",
            summary: "example",
            description: "example",
          },
        },
      },
    ],
  },
  {
    summary: "With non-standard examples also acceptable",
    schema: Type.Object({
      email: Type.String({
        examples: ["test@example.com", "example@example.com"],
      }),
    }),
    options: {},
    expected: [
      {
        name: "email",
        in: "query",
        required: true,
        schema: {
          type: "string",
          examples: ["test@example.com", "example@example.com"],
        },
        examples: [
          "test@example.com",
          "example@example.com",
        ] as unknown as ParameterObject["examples"],
      },
    ],
  },
] satisfies {
  expected: ParameterObject[];
  options: TransformParametersOptions;
  schema: SchemaObject;
  summary: string;
}[];

locations.forEach((location) => {
  testCases.forEach(({ summary, schema, options, expected }) => {
    test(`${location}: ${summary}`, () => {
      expect(transformParameters(location, schema, options), summary).toEqual(
        expected.map((expectedItem) => ({ ...expectedItem, in: location })),
      );
    });
  });

  test(`${location}: Error when type unhandled`, () =>
    expect(() =>
      transformParameters(
        location,
        { properties: { error: true } } as unknown as ParameterSchema,
        {},
      ),
    ).toThrowError("Unhandled schema type! Please report this issue."));
});
