import type {
  OpenAPIObject,
  OperationObject,
} from "@moontai0724/openapi-types";
import { Type } from "@sinclair/typebox";
import { beforeAll, beforeEach, expect, it, vi } from "vitest";

import type { OperationSchemas } from "../../transformers";

const expectedOperation: OperationObject = {
  parameters: [],
  requestBody: {
    content: {},
  },
  responses: {
    "200": {
      description: "No Description.",
    },
  },
};

const transformPathItem = vi.fn();

vi.mock("../../transformers", () => ({
  transformPathItem,
}));

let OpenAPI: typeof import("..").OpenAPI;

beforeAll(async () => {
  OpenAPI = await import("..").then((m) => m.OpenAPI);
});

const baseOpenAPIDocument = {
  openapi: "3.1.0",
  info: {
    title: "Example API",
    version: "1.0.0",
  },
};

let openapi: InstanceType<typeof OpenAPI>;

beforeEach(() => {
  openapi = new OpenAPI(baseOpenAPIDocument);
});

it("should be able to transform schemas and pass correct schemas to transformers", () => {
  const path = "/";
  const method = "patch";
  const schemas: OperationSchemas = {
    body: Type.Object({
      body1: Type.String(),
    }),
    cookie: Type.Object({
      cookie1: Type.String(),
    }),
    header: Type.Object({
      header1: Type.String(),
    }),
    path: Type.Object({
      path1: Type.String(),
    }),
    query: Type.Object({
      query1: Type.String(),
    }),
    response: Type.Object({
      response1: Type.String(),
    }),
  };

  transformPathItem.mockReturnValueOnce({ [method]: expectedOperation });
  openapi.define(path, method, schemas);

  const expected = {
    ...baseOpenAPIDocument,
    paths: { [path]: { [method]: expectedOperation } },
  } satisfies OpenAPIObject;

  expect(JSON.parse(openapi.json())).toEqual(expected);

  expect(transformPathItem).toHaveBeenCalledWith(method, schemas, {
    pathItem: {},
  });
});
