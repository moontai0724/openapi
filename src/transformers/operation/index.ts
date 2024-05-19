import type { OperationObject, SchemaObject } from "@moontai0724/openapi-types";

import { deepMerge } from "../../utils/deep-merge";
import {
  type ParameterSchema,
  transformParameters,
  type TransformParametersOptions,
} from "../parameter";
import {
  transformRequestBody,
  type TransformRequestBodyOptions,
} from "../request-body";
import {
  transformResponses,
  type TransformResponsesOptions,
} from "../response";

export interface OperationSchemas {
  /**
   * Schema for the request body.
   */
  body?: SchemaObject;
  /**
   * Schema for the cookie parameters.
   */
  cookie?: ParameterSchema;
  /**
   * Schema for the header parameters.
   */
  header?: ParameterSchema;
  /**
   * Schema for the path parameters.
   */
  path?: ParameterSchema;
  /**
   * Schema for the query parameters.
   */
  query?: ParameterSchema;
  /**
   * Schema for the response.
   */
  response?: SchemaObject;
}

/**
 * Options or overwrites to the result OperationObject when transforming.
 */
export interface TransformOperationOverwrites
  extends Partial<
    Omit<OperationObject, "parameters" | "requestBody" | "responses">
  > {}

/**
 * Options or overwrites to the result PathItemObject when transforming.
 */
export interface TransformOperationOptions {
  /**
   * Options or overwrites to the result ParameterObject of corresponding
   * `cookie` prooperties in schemas when transforming.
   */
  cookie?: TransformParametersOptions;
  /**
   * Options or overwrites to the result ParameterObject of corresponding
   * `header` prooperties in schemas when transforming.
   */
  header?: TransformParametersOptions;
  /**
   * Options or overwrites to the result OperationObject when transforming.
   */
  overwrite?: TransformOperationOverwrites;
  /**
   * Options or overwrites to the result ParameterObject of corresponding
   * `path` prooperties in schemas when transforming.
   */
  path?: TransformParametersOptions;
  /**
   * Options or overwrites to the result ParameterObject of corresponding
   * `query` prooperties in schemas when transforming.
   */
  query?: TransformParametersOptions;
  /**
   * Options or overwrites to the result RequestBodyObject of corresponding
   * `body` prooperties in schemas when transforming.
   */
  requestBody?: TransformRequestBodyOptions;
  /**
   * Options or overwrites to the result ResponseObject of corresponding
   * `response` prooperties in schemas when transforming.
   */
  responses?: TransformResponsesOptions;
}

/**
 * Transform a schema object to an operation object.
 * @param operationSchemas Schemas for this operation.
 * @param options Options or overwrites to the result operation when transforming.
 * @returns Transformed operation object.
 */
export function transformOperation(
  operationSchemas: OperationSchemas,
  options: TransformOperationOptions = {},
) {
  const { body, cookie, header, path, query, response } = operationSchemas;
  const {
    overwrite: operationOptions = {},
    requestBody: requestBodyOptions = {},
    responses: responsesOptions = {},
    cookie: cookieOptions = {},
    header: headerOptions = {},
    path: pathOptions = {},
    query: queryOptions = {},
  } = options;

  const requestBody = transformRequestBody(body, requestBodyOptions);
  const responses = transformResponses(response, responsesOptions);
  const parameters = [
    ...(path ? transformParameters("path", path, pathOptions) : []),
    ...(query ? transformParameters("query", query, queryOptions) : []),
    ...(header ? transformParameters("header", header, headerOptions) : []),
    ...(cookie ? transformParameters("cookie", cookie, cookieOptions) : []),
  ];

  const operation = {
    parameters,
    requestBody,
    responses,
  } satisfies OperationObject;

  return deepMerge(operationOptions, operation) as OperationObject;
}