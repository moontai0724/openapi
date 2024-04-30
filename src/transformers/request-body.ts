import type {
  MediaTypeObject,
  RequestBodyObject,
  SchemaObject,
} from "@moontai0724/openapi-types";

import { deepMerge } from "../utils/deep-merge";

/**
 * Options or overwrites to the result RequestBodyObject when transforming.
 */
export interface TransformRequestBodyOptions
  extends Partial<Omit<RequestBodyObject, "content">> {
  /**
   * Overwrite properties of request body content.
   */
  content?: Partial<Omit<MediaTypeObject, "schema" | "example" | "examples">>;
  /**
   * Array of content types to be set with this schema.
   * @default ["application/json"]
   */
  contentTypes?: string[];
}

function transformRequestBodyContent(
  schema: SchemaObject,
  options: TransformRequestBodyOptions["content"],
) {
  return {
    ...options,
    schema,
  } satisfies MediaTypeObject;
}

/**
 * Transform a schema object to a request body object.
 * @param schema The schema of the request body.
 * @param options Options or overwrites to the result request body when transforming.
 * @returns Transformed request body object.
 */
export function transformRequestBody(
  schema: SchemaObject,
  options: TransformRequestBodyOptions,
) {
  const { description } = schema;
  const {
    content: contentOptions,
    contentTypes = ["application/json"],
    ...remainOptions
  } = options;
  const requestBody = {
    description,
    required: true,
    content: contentTypes.reduce(
      (acc, contentType) => ({
        ...acc,
        [contentType]: transformRequestBodyContent(schema, contentOptions),
      }),
      {},
    ),
  } satisfies RequestBodyObject;

  return deepMerge(requestBody, remainOptions) as RequestBodyObject;
}
