import type {
  OpenAPIObject,
  OperationObject,
  PathItemObject,
} from "@moontai0724/openapi-types";
import YAML from "json-to-pretty-yaml";

import {
  type OperationSchemas,
  transformOperation,
  type TransformOptions,
} from "./transformers";
import { deepMerge } from "./utils/deep-merge";
import { getOrInit } from "./utils/get-or-init";

export interface BasicOpenAPIObject extends Omit<OpenAPIObject, "paths"> {}

export interface OperationOptions extends OperationObject, OperationSchemas {}

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
 * Options or overwrites to the result PathItem when transforming.
 */
interface PathItemOptions extends TransformOptions {
  /**
   * Overwrite properties of path item.
   */
  pathItem?: Omit<PathItemObject, HttpMethod>;
}

export class OpenAPI {
  protected operationSchemas: Map<string, OperationOptions> = new Map();

  /**
   * Create a new instance to define and generate OpenAPI document.
   * @param document OpenAPI document initial value, will be merged with the result of `define` method
   * @param options Options for features about this instance
   */
  constructor(protected document: BasicOpenAPIObject) {}

  /**
   * Get existing path or initialize it.
   * @param path path key in paths object
   * @returns
   */
  protected getPath(path: `/${string}`): PathItemObject {
    const paths = getOrInit(this.document as OpenAPIObject, "paths", {});
    const existingPath = getOrInit(paths, path, {});

    return existingPath;
  }

  /**
   * Set path item for a path into paths.
   * @param path Path key in paths object
   * @param method HTTP method
   * @param operation Operation object for this path:method
   * @param pathItemOptions Overwrite properties
   */
  protected setPathItem(
    path: `/${string}`,
    method: HttpMethod,
    operation: OperationObject,
    pathItemOptions: PathItemOptions["pathItem"] = {},
  ): PathItemObject {
    const targetPath = this.getPath(path);

    targetPath[method] = operation;
    // Overwrite current path item if there are given options
    Object.assign(targetPath, deepMerge(targetPath, pathItemOptions));

    return targetPath;
  }

  /**
   * Define an operation for a path, save original schemas and also transform the schemas into OpenAPI format.
   * @param path API endpoint path, used as key in paths object.
   * @param method HTTP method that this operation is for, will overwrite existing path item if it exists.
   * @param operationSchemas Schemas for this operation.
   * @param pathItemOptions Additional options to overwrite properties.
   * @returns Generated path item object.
   */
  public define<T extends OperationOptions>(
    path: `/${string}`,
    method: HttpMethod,
    operationSchemas: T,
    pathItemOptions?: PathItemOptions,
  ): PathItemObject {
    this.operationSchemas.set(
      `${method.toUpperCase()} ${path}`,
      operationSchemas,
    );

    const operation: OperationObject = transformOperation(
      operationSchemas,
      pathItemOptions,
    );

    return this.setPathItem(path, method, operation, pathItemOptions?.pathItem);
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
