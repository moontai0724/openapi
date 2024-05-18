import type {
  RequestBodyObject,
  SchemaObject,
} from "@moontai0724/openapi-types";

import { deepMerge } from "../../utils/deep-merge";
import {
  transformMediaObject,
  type TransformMediaObjectOptions,
} from "../media-object";

/**
 * Options or overwrites to the result RequestBodyObject when transforming.
 */
export interface TransformRequestBodyOptions {
  /**
   * Overwrite properties of request body content.
   */
  contentOverwrite?: TransformMediaObjectOptions;
  /**
   * Array of content types to be set with this schema.
   * @default ["application/json"]
   */
  contentTypes?: string[];
  overwrite?: Partial<Omit<RequestBodyObject, "content">>;
}

/**
 * Transform a schema object to a request body object.
 * @param schema The schema of the request body.
 * @param options Options or overwrites to the result request body when transforming.
 * @returns Transformed request body object.
 */
export function transformRequestBody(
  schema?: SchemaObject,
  options: TransformRequestBodyOptions = {},
) {
  if (!schema)
    return {
      content: {},
    };

  const { description, ...remains } = schema;
  const {
    overwrite = {},
    contentOverwrite: contentOptions,
    contentTypes = ["application/json"],
  } = options;
  const contentBody = transformMediaObject(remains, contentOptions);
  const requestBody = {
    description,
    required: !!schema,
    content: contentTypes.reduce(
      (acc, contentType) => ({
        ...acc,
        [contentType]: contentBody,
      }),
      {},
    ),
  } satisfies RequestBodyObject;

  return deepMerge(requestBody, overwrite) as RequestBodyObject;
}
