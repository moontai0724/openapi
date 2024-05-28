import type { OpenAPIObject, PathItemObject } from "@moontai0724/openapi-types";
import YAML from "json-to-pretty-yaml";

import {
  type HttpMethod,
  type OperationSchemas,
  transformPathItem,
  type TransformPathItemOptions,
} from "../transformers";
import { deepMerge } from "../utils/deep-merge";
import { getOrInit } from "../utils/get-or-init";

export interface BasicOpenAPIObject extends Omit<OpenAPIObject, "paths"> {}

export class OpenAPI {
  /**
   * Internal save of original schemas, could be reused for valiation or other usages.
   */
  protected operationSchemas: Map<string, OperationSchemas> = new Map();

  /**
   * Create a new instance to define and generate OpenAPI document.
   * @param document OpenAPI document initial value, will be merged with the result of `define` method.
   */
  constructor(protected document: BasicOpenAPIObject) {}

  /**
   * Define an operation for a path, save original schemas and transform the schemas into OpenAPI format.
   * @param path API endpoint path, used as key in paths object.
   * @param method HTTP method that this operation is for, will overwrite existing path item if it exists.
   * @param operationSchemas Schemas for this operation.
   * @param pathItemOptions Options for transforming the path item.
   * @returns Generated path item object.
   */
  public define(
    path: `/${string}`,
    method: HttpMethod,
    operationSchemas: OperationSchemas,
    options: TransformPathItemOptions = {},
  ): PathItemObject {
    this.operationSchemas.set(
      `${method.toUpperCase()} ${path}`,
      operationSchemas,
    );

    const paths = getOrInit(this.document as OpenAPIObject, "paths", {});
    const existingPathItem = paths[path] ?? {};
    const pathItemOptions: TransformPathItemOptions = deepMerge(options, {
      pathItem: existingPathItem,
    });

    const pathItem = transformPathItem(
      method,
      operationSchemas,
      pathItemOptions,
    );

    paths[path] = pathItem;

    return pathItem;
  }

  /**
   * Stringify the document to JSON format.
   * @returns OpenAPI document string in JSON format.
   */
  public json(): string {
    return JSON.stringify(this.document);
  }

  /**
   * Stringify the document to YAML format.
   * @returns OpenAPI document string in YAML format.
   */
  public yaml(): string {
    return YAML.stringify(this.document);
  }
}
