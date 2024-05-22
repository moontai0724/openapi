import type {
  OpenAPIObject,
  OperationObject,
  PathItemObject,
} from "@moontai0724/openapi-types";
import { beforeAll, beforeEach, expect, it, vi } from "vitest";

import type { TransformPathItemOptions } from "../../transformers";

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
const pathItemOptions: TransformPathItemOptions["pathItem"] = {
  summary: "Brief summary",
  servers: [
    {
      url: "https://example.com",
      description: "Production server",
    },
    {
      url: "https://staging.example.com",
      description: "Staging server",
    },
  ],
};

it("should be able to overwrite transformed object and pass remain options to transformer", () => {
  const path = "/";
  const method = "patch";
  const expectedPathItemObject: PathItemObject = {
    ...pathItemOptions,
    [method]: expectedOperation,
  };

  const options: TransformPathItemOptions = {
    pathItem: pathItemOptions,
  };

  transformPathItem.mockReturnValueOnce(expectedPathItemObject);

  openapi.define(path, method, {}, options);

  const expected = {
    ...baseOpenAPIDocument,
    paths: {
      [path]: expectedPathItemObject,
    },
  } satisfies OpenAPIObject;

  expect(JSON.parse(openapi.json())).toEqual(expected);

  expect(transformPathItem).toHaveBeenCalledWith(method, {}, options);
});
