import type { OperationObject } from "@moontai0724/openapi-types";
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

it("should be able to transform to yaml", () => {
  const path = "/";
  const method = "patch";

  transformPathItem.mockReturnValueOnce({ [method]: expectedOperation });
  openapi.define(path, method, {});

  const result = `openapi: "3.1.0"
info:
  title: "Example API"
  version: "1.0.0"
paths:
  /:
    patch:
      parameters: []
      requestBody:
        content: {}
      responses:
        200:
          description: "No Description."
`;

  expect(openapi.yaml()).toEqual(result);
});
