import type { PathItemObject } from "@moontai0724/openapi-types";

import { deepMerge } from "../../utils/deep-merge";
import {
  type OperationSchemas,
  transformOperation,
  type TransformOperationOptions,
} from "../operation";

export type HttpMethod =
  | "get"
  | "put"
  | "post"
  | "delete"
  | "options"
  | "head"
  | "patch"
  | "trace";

/**
 * Options or overwrites to the result ResponseObject when transforming.
 */
export interface TransformPathItemOptions extends TransformOperationOptions {
  /**
   * Options or overwrites to the result PathItemObject when transforming.
   */
  pathItem?: Partial<PathItemObject>;
}

/**
 * Transform a schema object to a response object.
 * @param schemas The schema of the response.
 * @param options Options or overwrites to the result response when transforming.
 * @returns Transformed response object.
 */
export function transformPathItem(
  method: HttpMethod,
  schemas: OperationSchemas = {},
  options: TransformPathItemOptions = {},
): PathItemObject {
  const { pathItem = {}, ...remainOptions } = options;
  const added = {
    ...pathItem,
    [method]: transformOperation(schemas, remainOptions),
  };

  return deepMerge({}, added) as PathItemObject;
}
