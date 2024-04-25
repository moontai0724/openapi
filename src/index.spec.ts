import { add, divide, max } from "index";
import { describe, expect, it, vi } from "vitest";

describe("add", () => {
  it("adds two numbers", () => {
    expect(add(1, 2)).toBe(3);
  });

  it("adds negative numbers", () => {
    expect(add(-1, -2)).toBe(-3);
  });

  it("adds zero to a number", () => {
    expect(add(5, 0)).toBe(5);
  });
});

describe("divide", () => {
  it("divides two numbers", () => {
    expect(divide(10, 2)).toBe(5);
  });

  it("divides negative numbers", () => {
    expect(divide(-10, -2)).toBe(5);
  });

  it("throws an error when dividing by zero", () => {
    expect(() => divide(10, 0)).toThrow("Cannot divide by zero");
  });
});

describe("max", () => {
  it("returns the maximum of two numbers", () => {
    expect(max(3, 7)).toBe(7);
  });

  it("returns the maximum of negative numbers", () => {
    expect(max(-5, -2)).toBe(-2);
  });

  it("returns the maximum of zero and a number", () => {
    expect(max(0, 10)).toBe(10);
  });

  it("should call the Math.max function", () => {
    const spy = vi.spyOn(Math, "max");

    max(1, 2);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
