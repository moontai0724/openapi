import type {
  MediaTypeObject,
  ResponseObject,
  SchemaObject,
} from "@moontai0724/openapi-types";

import { deepMerge } from "../utils/deep-merge";

/**
 * Options or overwrites to the result ResponseObject when transforming.
 */
export interface TransformResponseOptions
  extends Partial<Omit<ResponseObject, "content">> {
  /**
   * Overwrite properties of response content.
   */
  content?: Partial<Omit<MediaTypeObject, "schema" | "example" | "examples">>;
  /**
   * Array of content types to be set with this schema.
   * @default ["application/json"]
   */
  contentTypes?: string[];
}

function transformResponseContent(
  schema: SchemaObject,
  options: TransformResponseOptions["content"],
) {
  return {
    ...options,
    schema,
  } satisfies MediaTypeObject;
}

/**
 * Transform a schema object to a response object.
 * @param schema The schema of the response.
 * @param options Options or overwrites to the result response when transforming.
 * @returns Transformed response object.
 */
export function transformResponse(
  schema: SchemaObject,
  options: TransformResponseOptions,
): ResponseObject {
  const { description = "" } = schema;
  const {
    content: contentOptions,
    contentTypes = ["application/json"],
    ...remainOptions
  } = options;
  const response = {
    description,
    content: contentTypes.reduce(
      (acc, contentType) => ({
        ...acc,
        [contentType]: transformResponseContent(schema, contentOptions),
      }),
      {},
    ),
  } satisfies ResponseObject;

  return deepMerge(response, remainOptions) as typeof response;
}
