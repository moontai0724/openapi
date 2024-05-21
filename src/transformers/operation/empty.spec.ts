import type { OperationObject } from "@moontai0724/openapi-types";
import { beforeAll, expect, it, vi } from "vitest";

import type { OperationSchemas } from ".";

const schemas: OperationSchemas = {};

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

it("should be able to pass correct schemas to transformers", () => {
  expect(transformOperation(schemas)).toEqual(expected);

  expect(mocks.transformRequestBody).toHaveBeenCalledTimes(1);
  expect(mocks.transformRequestBody).toHaveBeenCalledWith(schemas.body, {});

  expect(mocks.transformParameters).toHaveBeenCalledTimes(0);

  expect(mocks.transformResponses).toHaveBeenCalledTimes(1);
  expect(mocks.transformResponses).toHaveBeenCalledWith(schemas.response, {});
});
