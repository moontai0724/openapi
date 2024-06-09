import type {
  OpenAPIObject,
  PathItemObject,
  SchemaObject,
} from "@moontai0724/openapi-types";
import Ajv, { type ErrorObject, type Options as AjvOptions } from "ajv";
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

export interface InitOptions extends TransformPathItemOptions {
  ajv?: AjvOptions;
}

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

  protected getAvjInstance(
    path: string,
    method: HttpMethod,
    options: AjvOptions = {},
  ) {
    const schemas = this.operationSchemas.get(
      `${method.toUpperCase()} ${path}`,
    );

    if (!schemas) {
      throw new Error(`No schema found for ${method.toUpperCase()} ${path}`);
    }

    return new Ajv({
      ...options,
      schemas: schemas as Record<string, SchemaObject>,
    });
  }

  public init(
    path: `/${string}`,
    method: HttpMethod,
    operationSchemas: OperationSchemas,
    options: InitOptions = {},
  ): Ajv {
    const { ajv, ...remainOptions } = options;

    this.define(path, method, operationSchemas, remainOptions);

    const ajvInstance = this.getAvjInstance(path, method, ajv);

    return ajvInstance;
  }

  /**
   * Validate the data against the defined schemas. Only validate the schema if
   * the key present in the data.
   *
   * @param path API endpoint path, used as key in paths object.
   * @param method HTTP method that this operation is for, will overwrite
   * existing path item if it exists.
   * @param data Data object to be validated. The key is the schema name. If the
   * key is not present in the data, the schema will not be validated.
   * @param options Options for Ajv instance.
   * @returns Validation result of each schema.
   */
  public validate(
    path: `/${string}`,
    method: HttpMethod,
    data: Partial<Record<keyof OperationSchemas, unknown>>,
    options: AjvOptions,
  ) {
    const ajvInstance = this.getAvjInstance(path, method, options);
    const validationResult: Record<
      keyof OperationSchemas,
      ErrorObject[] | null | undefined
    > = Object.entries(data).reduce(
      (acc, [key, value]) => {
        ajvInstance.validate(key, value);

        Object.assign(acc, { [key]: ajvInstance.errors });

        return acc;
      },
      {} as Record<keyof OperationSchemas, ErrorObject[] | null>,
    );

    return validationResult;
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
