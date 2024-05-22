import type {
  OpenAPIObject,
  OperationObject,
} from "@moontai0724/openapi-types";
import { beforeAll, beforeEach, expect, it, vi } from "vitest";

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

it("should be able to transform empty schemas and pass correct schemas to transformers", () => {
  const path = "/";
  const method = "patch";

  transformPathItem.mockReturnValueOnce({ [method]: expectedOperation });
  openapi.define(path, method, {});

  const expected = {
    ...baseOpenAPIDocument,
    paths: { [path]: { [method]: expectedOperation } },
  } satisfies OpenAPIObject;

  expect(JSON.parse(openapi.json())).toEqual(expected);

  expect(transformPathItem).toHaveBeenCalledWith(method, {}, { pathItem: {} });
});
