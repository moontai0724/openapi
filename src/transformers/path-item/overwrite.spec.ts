import type { OperationObject } from "@moontai0724/openapi-types";
import { beforeAll, beforeEach, expect, it, vi } from "vitest";

import type { TransformPathItemOptions } from ".";

const expectedOperation: OperationObject = {
  parameters: [],
  requestBody: {
    content: {},
  },
  responses: {},
};

const options: TransformPathItemOptions = {
  pathItem: {
    description: "This is a test",
    head: {
      description: "existing path",
    },
  },
};

const transformOperation = vi.fn().mockReturnValue(expectedOperation);

vi.mock("../operation", () => ({ transformOperation }));

let transformPathItem: typeof import(".").transformPathItem;

beforeAll(async () => {
  transformPathItem = await import(".").then((m) => m.transformPathItem);
});

beforeEach(() => {
  vi.clearAllMocks();
});

it("should be able to transform with overwrites", () => {
  const expected = {
    description: "This is a test",
    head: {
      description: "existing path",
    },
    put: expectedOperation,
  };

  expect(transformPathItem("put", {}, options)).toEqual(expected);
  expect(transformOperation).toHaveBeenCalledTimes(1);
});

it("should be able to transform with overwrites and don't merge them", () => {
  const expected = {
    description: "This is a test",
    head: expectedOperation,
  };

  expect(transformPathItem("head", {}, options)).toEqual(expected);
});
