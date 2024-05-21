import type { OperationObject } from "@moontai0724/openapi-types";
import { Type } from "@sinclair/typebox";
import { beforeAll, expect, it, vi } from "vitest";

import type { OperationSchemas } from "../operation";
import { type HttpMethod } from ".";

const schema: OperationSchemas = {
  body: Type.Object({
    body: Type.String(),
  }),
  cookie: Type.Object({
    cookie: Type.String(),
  }),
  header: Type.Object({
    header: Type.String(),
  }),
  path: Type.Object({
    path: Type.String(),
  }),
  query: Type.Object({
    query: Type.String(),
  }),
  response: Type.Object({
    response: Type.String(),
  }),
};

const expectedOperation: OperationObject = {
  parameters: [
    {
      in: "cookie",
      name: "cookie",
      required: true,
      schema: {
        type: "string",
      },
    },
    {
      in: "header",
      name: "header",
      required: true,
      schema: {
        type: "string",
      },
    },
    {
      in: "path",
      name: "path",
      required: true,
      schema: {
        type: "string",
      },
    },
    {
      in: "query",
      name: "query",
      required: true,
      schema: {
        type: "string",
      },
    },
  ],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          required: ["body"],
          properties: {
            body: {
              type: "string",
            },
          },
        },
      },
    },
  },
  responses: {
    "200": {
      description: "No Description.",
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["response"],
            properties: {
              response: {
                type: "string",
              },
            },
          },
        },
      },
    },
  },
};

const transformOperation = vi.fn().mockReturnValue(expectedOperation);

vi.mock("../operation", () => ({ transformOperation }));

let transformPathItem: typeof import(".").transformPathItem;

beforeAll(async () => {
  transformPathItem = await import(".").then((m) => m.transformPathItem);
});

const httpMethods: HttpMethod[] = [
  "get",
  "put",
  "post",
  "delete",
  "options",
  "head",
  "patch",
  "trace",
];

it.each(httpMethods)(
  "should be able to transform an empty schemas for %s",
  (method) => {
    const expected = {
      [method]: expectedOperation,
    };

    expect(transformPathItem(method, schema)).toEqual(expected);
    expect(transformOperation).toHaveBeenCalledWith(schema, {});
  },
);
