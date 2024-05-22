import { expect, it } from "vitest";

import { getOrInit } from "./get-or-init";

it("should throw error if the target value is not an object", () => {
  const obj: Record<string, unknown> = { a: 1 };

  expect(() => getOrInit(obj, "a", 10)).toThrowError();
});

it("should return the target value if it is an object", () => {
  const obj: Record<string, object> = { a: { b: 1 } };

  expect(getOrInit(obj, "a", {})).toBe(obj.a);
});

it("should return the default value if the target value is undefined", () => {
  const obj: Record<string, object> = {};
  const defaultValue = { d: 0 };

  expect(getOrInit(obj, "a", defaultValue)).toBe(defaultValue);
});
