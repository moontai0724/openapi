import type { ParameterLocation } from "@moontai0724/openapi-types";
import { expect, it } from "vitest";

import { type ParameterSchema, transformParameters } from "..";
import { locations } from "../locations.test";

it.each(locations)(
  "should throw error when type unhandled for %s",
  (location: ParameterLocation) => {
    expect(() =>
      transformParameters(
        location,
        { properties: { error: true } } as unknown as ParameterSchema,
        {},
      ),
    ).toThrowError("Unhandled schema type! Please report this issue.");
  },
);
