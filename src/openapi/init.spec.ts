import { Type } from "@sinclair/typebox";
import type { Options as AjvOptions, SchemaObject } from "ajv";
import { beforeAll, beforeEach, expect, it, vi } from "vitest";

import type { OperationSchemas } from "../transformers";

const transformPathItem = vi.fn();

vi.mock("../transformers", () => ({
  transformPathItem,
}));

const ajvInstance = { validate: vi.fn() };
const Ajv = vi.fn().mockImplementation(() => ajvInstance);

vi.mock("ajv", () => ({
  default: Ajv,
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

it("should be able to pass correct schemas to transformers", () => {
  openapi.init(path, method, schemas);

  expect(transformPathItem).toHaveBeenCalledWith(method, schemas, {
    pathItem: {},
  });
});

it("should be able to create and return an instance of Ajv", () => {
  const ajvOptions: AjvOptions = {
    strictSchema: true,
    schemas: schemas as Record<string, SchemaObject>,
  };

  const result = openapi.init(path, method, schemas, { ajv: ajvOptions });

  expect(Ajv).toHaveBeenCalledWith(ajvOptions);
  expect(result).toBe(ajvInstance);
});
