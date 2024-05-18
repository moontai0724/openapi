import type {
  ParameterLocation,
  ParameterObject,
} from "@moontai0724/openapi-types";
import { Type } from "@sinclair/typebox";
import { expect, it } from "vitest";

import { type ParameterSchema, transformParameters } from "..";
import { locations } from "../locations.test";

const schema: ParameterSchema = Type.Object({});
const expected: ParameterObject[] = [];

it.each(locations)(
  "should return empty array when schema is empty for %s",
  (location: ParameterLocation) => {
    expect(transformParameters(location, schema)).toEqual(expected);
  },
);
