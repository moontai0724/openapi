import type {
  ParameterLocation,
  ParameterObject,
  SchemaObject,
} from "@moontai0724/openapi-types";
import { Type } from "@sinclair/typebox";
import { describe, expect, it } from "vitest";

import {
  type ParameterSchema,
  transformParameters,
  type TransformParametersOptions,
} from "./parameter";

const locations = [
  "cookie",
  "header",
  "path",
  "query",
] satisfies ParameterLocation[];

describe.each(locations)(
  "transformParameters(%s)",
  (location: ParameterLocation) => {
    it("should throw error when type unhandled", () =>
      expect(() =>
        transformParameters(
          location,
          { properties: { error: true } } as unknown as ParameterSchema,
          {},
        ),
      ).toThrowError("Unhandled schema type! Please report this issue."));

    it("should return empty array when schema is empty", () =>
      expect(transformParameters(location, Type.Object({}))).toEqual([]));

    it("should be able to transform an normal object", () => {
      const schema = Type.Object({
        page: Type.Optional(Type.Integer()),
        size: Type.Integer({ default: 10 }),
        amount: Type.Number(),
        userAccount: Type.String({ pattern: "^[a-zA-Z0-9]{8,16}$" }),
        email: Type.String({ format: "email" }),
      }) satisfies SchemaObject;

      const expected: ParameterObject[] = [
        {
          name: "page",
          in: location,
          required: false,
          schema: {
            type: "integer",
          },
        },
        {
          name: "size",
          in: location,
          required: true,
          schema: {
            type: "integer",
            default: 10,
          },
        },
        {
          name: "amount",
          in: location,
          required: true,
          schema: {
            type: "number",
          },
        },
        {
          name: "userAccount",
          in: location,
          required: true,
          schema: {
            type: "string",
            pattern: "^[a-zA-Z0-9]{8,16}$",
          },
        },
        {
          name: "email",
          in: location,
          required: true,
          schema: {
            type: "string",
            format: "email",
          },
        },
      ];

      expect(transformParameters(location, schema)).toEqual(expected);
    });

    it("should be able to transform an schema object with options", () => {
      const schema = Type.Object({
        page: Type.Optional(Type.Integer()),
        size: Type.Integer({ default: 10 }),
        amount: Type.Number(),
        userAccount: Type.String({ pattern: "^[a-zA-Z0-9]{8,16}$" }),
        email: Type.String({ format: "email" }),
      }) satisfies SchemaObject;

      const expected: ParameterObject[] = [
        {
          name: "page",
          in: location,
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
          in: location,
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
          in: location,
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
          in: location,
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
          in: location,
          required: true,
          deprecated: true,
          explode: true,
          allowReserved: true,
          schema: {
            type: "string",
            format: "email",
          },
        },
      ];

      const options: TransformParametersOptions = {
        allowReserved: ["amount", "userAccount", "email"],
        deprecated: ["amount", "email"],
        explode: ["amount", "userAccount", "email"],
      };

      expect(transformParameters(location, schema, options)).toEqual(expected);
    });

    it("should be able to transform an schema object with examples", () => {
      const schema = Type.Object({
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
      }) satisfies SchemaObject;

      const expected: ParameterObject[] = [
        {
          name: "email",
          in: location,
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
      ];

      expect(transformParameters(location, schema)).toEqual(expected);
    });

    it("should be able to transform an schema object with examples and example", () => {
      const schema = Type.Object({
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
      }) satisfies SchemaObject;

      const expected: ParameterObject[] = [
        {
          name: "email",
          in: location,
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
      ];

      expect(transformParameters(location, schema)).toEqual(expected);
    });

    it("should be able to transform an schema object with non-standard examples and example", () => {
      const schema = Type.Object({
        email: Type.String({
          examples: ["test@example.com", "example@example.com"],
        }),
      }) satisfies SchemaObject;

      const expected: ParameterObject[] = [
        {
          name: "email",
          in: location,
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
      ];

      expect(transformParameters(location, schema)).toEqual(expected);
    });

    it("should be able to transform an schema object with non-standard examples and example and example also acceptable", () => {
      const schema = Type.Object({
        email: Type.String({
          examples: ["test@example.com", "example@example.com"],
          example: "test@example.com",
        }),
      }) satisfies SchemaObject;

      const expected: ParameterObject[] = [
        {
          name: "email",
          in: location,
          required: true,
          schema: {
            type: "string",
            examples: ["test@example.com", "example@example.com"],
            example: "test@example.com",
          },
          examples: [
            "test@example.com",
            "example@example.com",
          ] as unknown as ParameterObject["examples"],
        },
      ];

      expect(transformParameters(location, schema)).toEqual(expected);
    });

    it("should be able to transform an schema object with non-standard examples and example and example also acceptable (non-standard)", () => {
      const schema = Type.Object({
        email: Type.String({
          examples: ["test@example.com", "example@example.com"],
          example: "test@example.com",
        }),
      }) satisfies SchemaObject;

      const expected: ParameterObject[] = [
        {
          name: "email",
          in: location,
          required: true,
          schema: {
            type: "string",
            examples: ["test@example.com", "example@example.com"],
            example: "test@example.com",
          },
          examples: [
            "test@example.com",
            "example@example.com",
          ] as unknown as ParameterObject["examples"],
        },
      ];

      expect(transformParameters(location, schema)).toEqual(expected);
    });
  },
);
