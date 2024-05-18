import type {
  ResponseObject,
  ResponsesObject,
  SchemaObject,
} from "@moontai0724/openapi-types";

import { deepMerge } from "../../utils/deep-merge";
import {
  transformMediaObject,
  type TransformMediaObjectOptions,
} from "../media-object";

/**
 * Options or overwrites to the result ResponseObject when transforming.
 */
export interface TransformResponseOptions {
  contentOverwrite?: TransformMediaObjectOptions;
  /**
   * Array of content types to be set with this schema.
   * @default ["application/json"]
   */
  contentTypes?: string[];
  overwrite?: Omit<ResponseObject, "content">;
}

/**
 * Transform a schema object to a response object.
 * @param schema The schema of the response.
 * @param options Options or overwrites to the result response when transforming.
 * @returns Transformed response object.
 */
export function transformResponse(
  schema?: SchemaObject,
  options: TransformResponseOptions = {},
): ResponseObject {
  const {
    overwrite = {} as Omit<ResponseObject, "content">,
    contentOverwrite,
    contentTypes = ["application/json"],
  } = options;
  const { description: overwriteDescription, ...remainOverwrites } = overwrite;

  if (!schema)
    return {
      description: overwriteDescription ?? "No Description.",
      ...remainOverwrites,
    };
  const { description, ...remainSchema } = schema;
  const response = {
    description: overwriteDescription ?? description ?? "No Description.",
    content: contentTypes.reduce(
      (acc, contentType) => ({
        ...acc,
        [contentType]: transformMediaObject(remainSchema, contentOverwrite),
      }),
      {},
    ),
  } satisfies ResponseObject;

  return deepMerge(response, remainOverwrites) as typeof response;
}

export interface TransformResponsesOptions {
  /**
   * HTTP code of the response.
   * @default 200
   */
  httpCode?: number;
  overwrite?: ResponsesObject;
  responseOptions?: TransformResponseOptions;
}

export function transformResponses(
  schema?: SchemaObject,
  options: TransformResponsesOptions = {},
) {
  const { httpCode = 200, overwrite = {}, responseOptions } = options;

  return {
    ...overwrite,
    [httpCode.toString()]: transformResponse(schema, responseOptions),
  } satisfies ResponsesObject;
}
