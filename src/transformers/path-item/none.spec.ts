import type { OperationObject } from "@moontai0724/openapi-types";
import { beforeAll, expect, it, vi } from "vitest";

import { type HttpMethod } from ".";

const expectedOperation: OperationObject = {
  parameters: [],
  requestBody: {
    content: {},
  },
  responses: {},
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
  "should be able to transform without schemas for %s",
  (method) => {
    const expected = {
      [method]: expectedOperation,
    };

    expect(transformPathItem(method)).toEqual(expected);
    expect(transformOperation).toBeCalledWith({}, {});
  },
);
