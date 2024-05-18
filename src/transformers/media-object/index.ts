import type { MediaTypeObject, SchemaObject } from "@moontai0724/openapi-types";

export interface TransformMediaObjectOptions
  extends Partial<Omit<MediaTypeObject, "schema">> {}

export function transformMediaObject(
  schema: SchemaObject,
  options: TransformMediaObjectOptions = {},
) {
  const { example, examples, ...remains } = schema;

  return {
    schema: remains,
    example,
    examples: examples as MediaTypeObject["examples"],
    ...options,
  } satisfies MediaTypeObject;
}
