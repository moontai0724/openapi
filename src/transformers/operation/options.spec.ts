import type { OperationObject } from "@moontai0724/openapi-types";
import { Type } from "@sinclair/typebox";
import { beforeAll, expect, it, vi } from "vitest";

import type { OperationSchemas, TransformOperationOptions } from ".";

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

const options: TransformOperationOptions = {
  cookie: {
    overwriteAll: {},
    overwrites: {},
  },
  header: {
    overwriteAll: {},
    overwrites: {},
  },
  operation: undefined,
  path: {
    overwriteAll: {},
    overwrites: {},
  },
  query: {
    overwriteAll: {},
    overwrites: {},
  },
  requestBody: {
    contentOverwrite: {},
    contentTypes: [],
    overwrite: {},
  },
  responses: {
    httpCode: 200,
    overwrite: {},
    responseOptions: {},
  },
};

const expected: OperationObject = {
  parameters: [],
  requestBody: {
    content: {},
  },
  responses: {},
};

const mocks = {
  transformParameters: vi.fn().mockReturnValue(expected.parameters),
  transformRequestBody: vi.fn().mockReturnValue(expected.requestBody),
  transformResponses: vi.fn().mockReturnValue(expected.responses),
};

vi.mock("../parameter", () => ({
  transformParameters: mocks.transformParameters,
}));

vi.mock("../request-body", () => ({
  transformRequestBody: mocks.transformRequestBody,
}));

vi.mock("../response", () => ({
  transformResponses: mocks.transformResponses,
}));

let transformOperation: typeof import(".").transformOperation;

beforeAll(async () => {
  transformOperation = await import(".").then((m) => m.transformOperation);
});

it("should be able to pass correct schemas to transformers with options", () => {
  expect(transformOperation(schemas, options)).toEqual(expected);

  expect(mocks.transformRequestBody).toHaveBeenCalledTimes(1);
  expect(mocks.transformRequestBody).toHaveBeenCalledWith(
    schemas.body,
    options.requestBody,
  );

  expect(mocks.transformParameters).toHaveBeenCalledTimes(4);
  expect(mocks.transformParameters).toHaveBeenCalledWith(
    "path",
    schemas.path,
    options.path,
  );

  expect(mocks.transformParameters).toHaveBeenCalledWith(
    "query",
    schemas.query,
    options.query,
  );

  expect(mocks.transformParameters).toHaveBeenCalledWith(
    "header",
    schemas.header,
    options.header,
  );

  expect(mocks.transformParameters).toHaveBeenCalledWith(
    "cookie",
    schemas.cookie,
    options.cookie,
  );

  expect(mocks.transformResponses).toHaveBeenCalledTimes(1);
  expect(mocks.transformResponses).toHaveBeenCalledWith(
    schemas.response,
    options.responses,
  );
});
