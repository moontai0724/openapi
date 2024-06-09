import { Type } from "@sinclair/typebox";
import type { Options as AjvOptions } from "ajv";
import { beforeAll, beforeEach, expect, it, vi } from "vitest";

import type { OperationSchemas } from "../transformers";

const transformPathItem = vi.fn();

vi.mock("../transformers", () => ({
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

it("should throw error if no schema found", () => {
  const ajvOptions: AjvOptions = {
    strictSchema: true,
  };

  expect(() => openapi.validate(path, method, {}, ajvOptions)).toThrowError(
    "No schema found for PATCH /",
  );
});

it("should be able to validate the defined schemas", () => {
  const ajvOptions: AjvOptions = {
    strictSchema: true,
  };

  openapi.define(path, method, schemas);

  const validationResult = openapi.validate(
    path,
    method,
    {
      body: {
        body1: "body1",
      },
      cookie: {
        cookie1: "cookie1",
      },
      header: {
        header1: "header1",
      },
      path: {
        path1: "path1",
      },
      query: {
        query1: "query1",
      },
      response: {
        response1: "response1",
      },
    },
    ajvOptions,
  );

  expect(validationResult).toEqual({
    body: null,
    cookie: null,
    header: null,
    path: null,
    query: null,
    response: null,
  });
});

it("should be able to ~1", () => {
  const ajvOptions: AjvOptions = {
    strictSchema: true,
  };

  openapi.define(path, method, schemas);

  const validationResult = openapi.validate(
    path,
    method,
    {
      body: {
        body1: "body1",
      },
      cookie: {
        cookie1: "cookie1",
      },
      header: {},
      path: null,
      query: undefined,
    },
    ajvOptions,
  );

  expect(validationResult).toEqual({
    body: null,
    cookie: null,
    header: [
      {
        instancePath: "",
        keyword: "required",
        message: "must have required property 'header1'",
        params: {
          missingProperty: "header1",
        },
        schemaPath: "#/required",
      },
    ],
    path: [
      {
        instancePath: "",
        keyword: "type",
        message: "must be object",
        params: {
          type: "object",
        },
        schemaPath: "#/type",
      },
    ],
    query: [
      {
        instancePath: "",
        keyword: "type",
        message: "must be object",
        params: {
          type: "object",
        },
        schemaPath: "#/type",
      },
    ],
  });
});
