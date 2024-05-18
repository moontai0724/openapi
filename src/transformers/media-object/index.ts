import type { MediaTypeObject, SchemaObject } from "@moontai0724/openapi-types";

import { deepMerge } from "../../utils/deep-merge";

export interface TransformMediaObjectOptions
  extends Partial<Omit<MediaTypeObject, "schema">> {}

export function transformMediaObject(
  schema: SchemaObject,
  options: TransformMediaObjectOptions = {},
) {
  const { example, examples, ...remains } = schema;
  const {
    example: exampleOverwrite,
    examples: examplesOptions,
    ...remainOptions
  } = options;

  const content = {
    schema: remains,
    example: exampleOverwrite ?? example,
    examples: examplesOptions ?? (examples as MediaTypeObject["examples"]),
  } satisfies MediaTypeObject;

  return deepMerge(content, remainOptions) as MediaTypeObject;
}
