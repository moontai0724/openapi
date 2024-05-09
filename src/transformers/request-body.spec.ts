import type {
  MediaTypeObject,
  RequestBodyObject,
  SchemaObject,
} from "@moontai0724/openapi-types";
import { Type } from "@sinclair/typebox";
import { expect, it, test } from "vitest";

import {
  transformRequestBody,
  type TransformRequestBodyOptions,
} from "./request-body";

it("should return none if no schema", () => {
  expect(transformRequestBody()).toBeUndefined();
});

test("Empty Object", () => {
  const schema = Type.Object({});
  const options = {};
  const expected = {
    description: undefined,
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {},
        },
        example: undefined,
        examples: undefined,
      },
    },
  };

  expect(transformRequestBody(schema, options)).toEqual(expected);
});

test("Normal Object", () => {
  const schema: SchemaObject = Type.Object(
    {
      page: Type.Optional(Type.Integer()),
      size: Type.Integer({ default: 10 }),
      amount: Type.Number(),
      userAccount: Type.String({ pattern: "^[a-zA-Z0-9]{8,16}$" }),
      email: Type.String({ format: "email" }),
    },
    {
      description: "Request body",
      example: {
        page: 1,
        size: 10,
        amount: 1.0,
        userAccount: "12345678",
        email: "test@example.com",
      },
      examples: {
        example1: {
          value: {
            page: 1,
            size: 10,
            amount: 1.0,
            userAccount: "12345678",
            email: "test@example.com",
          },
        },
        example2: {
          value: {
            page: 2,
            size: 20,
            amount: 2.0,
            userAccount: "23456789",
            email: "test2@example.com",
          },
        },
      },
    },
  );
  const options: TransformRequestBodyOptions = {};
  const expectedItem: MediaTypeObject = {
    schema: {
      type: "object",
      description: "Request body",
      required: ["size", "amount", "userAccount", "email"],
      properties: {
        page: {
          type: "integer",
        },
        size: {
          type: "integer",
          default: 10,
        },
        amount: {
          type: "number",
        },
        userAccount: {
          type: "string",
          pattern: "^[a-zA-Z0-9]{8,16}$",
        },
        email: {
          type: "string",
          format: "email",
        },
      },
      example: {
        page: 1,
        size: 10,
        amount: 1.0,
        userAccount: "12345678",
        email: "test@example.com",
      },
      examples: {
        example1: {
          value: {
            page: 1,
            size: 10,
            amount: 1.0,
            userAccount: "12345678",
            email: "test@example.com",
          },
        },
        example2: {
          value: {
            page: 2,
            size: 20,
            amount: 2.0,
            userAccount: "23456789",
            email: "test2@example.com",
          },
        },
      },
    },
    example: {
      page: 1,
      size: 10,
      amount: 1.0,
      userAccount: "12345678",
      email: "test@example.com",
    },
    examples: {
      example1: {
        value: {
          page: 1,
          size: 10,
          amount: 1.0,
          userAccount: "12345678",
          email: "test@example.com",
        },
      },
      example2: {
        value: {
          page: 2,
          size: 20,
          amount: 2.0,
          userAccount: "23456789",
          email: "test2@example.com",
        },
      },
    },
  };
  const expected: RequestBodyObject = {
    description: "Request body",
    required: true,
    content: {
      "application/json": expectedItem,
    },
  };

  expect(transformRequestBody(schema, options)).toEqual(expected);
});

test("Normal Object with options and overrides", () => {
  const schema: SchemaObject = Type.Object(
    {
      page: Type.Optional(Type.Integer()),
      size: Type.Integer({ default: 10 }),
      amount: Type.Number(),
      userAccount: Type.String({ pattern: "^[a-zA-Z0-9]{8,16}$" }),
      email: Type.String({ format: "email" }),
    },
    {
      description: "Request body",
      example: "some example",
      examples: {
        example1: {
          value: "some example 1",
        },
        example2: {
          value: "some example 2",
        },
      },
    },
  );
  const options: TransformRequestBodyOptions = {
    description: "Some description",
    required: false,
    contentTypes: ["application/x-www-form-urlencoded", "application/xml"],
    content: {
      encoding: {
        "application/x-www-form-urlencoded": {
          explode: true,
        },
      },
      example: "overriden example",
      examples: {
        example1: {
          value: "overriden example 1",
        },
        example2: {
          value: "overriden example 2",
        },
      },
    },
  };

  const expectedItem: MediaTypeObject = {
    schema: {
      type: "object",
      description: "Request body",
      required: ["size", "amount", "userAccount", "email"],
      properties: {
        page: {
          type: "integer",
        },
        size: {
          type: "integer",
          default: 10,
        },
        amount: {
          type: "number",
        },
        userAccount: {
          type: "string",
          pattern: "^[a-zA-Z0-9]{8,16}$",
        },
        email: {
          type: "string",
          format: "email",
        },
      },
      example: "some example",
      examples: {
        example1: {
          value: "some example 1",
        },
        example2: {
          value: "some example 2",
        },
      },
    },
    encoding: {
      "application/x-www-form-urlencoded": {
        explode: true,
      },
    },
    example: "overriden example",
    examples: {
      example1: {
        value: "overriden example 1",
      },
      example2: {
        value: "overriden example 2",
      },
    },
  };
  const expected: RequestBodyObject = {
    description: "Some description",
    required: false,
    content: {
      "application/x-www-form-urlencoded": expectedItem,
      "application/xml": expectedItem,
    },
  };

  expect(transformRequestBody(schema, options)).toEqual(expected);
});
