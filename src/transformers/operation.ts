import type {
  OperationObject,
  ResponsesObject,
  SchemaObject,
} from "@moontai0724/openapi-types";

import {
  type ParameterSchema,
  transformParameters,
  type TransformParametersOptions,
} from "./parameter";
import {
  transformRequestBody,
  type TransformRequestBodyOptions,
} from "./request-body";
import { transformResponse, type TransformResponseOptions } from "./response";

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
interface TransformOperationOptions
  extends Partial<
    Omit<OperationObject, "parameters" | "requestBody" | "responses">
  > {}

/**
 * Options or overwrites to the result PathItemObject when transforming.
 */
export interface TransformOptions {
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
  operation?: TransformOperationOptions;
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
  response?: TransformResponseOptions & {
    /**
     * HTTP code of the response.
     * @default 200
     */
    httpCode?: number;
  };
  /**
   * Additional properties to append into ResponsesObject.
   */
  responses?: ResponsesObject;
}

/**
 * Transform a schema object to an operation object.
 * @param operationSchemas Schemas for this operation.
 * @param options Options or overwrites to the result operation when transforming.
 * @returns Transformed operation object.
 */
export function transformOperation(
  operationSchemas: OperationSchemas,
  options: TransformOptions = {},
) {
  const { body, cookie, header, path, query, response } = operationSchemas;
  const {
    operation: operationOptions = {},
    requestBody: requestBodyOptions = {},
    response: responseOptions = {},
    responses: responsesOptions = {},
    cookie: cookieOptions = {},
    header: headerOptions = {},
    path: pathOptions = {},
    query: queryOptions = {},
  } = options;

  const requestBody = body
    ? transformRequestBody(body, requestBodyOptions)
    : undefined;
  const { httpCode = 200 } = responseOptions;
  const responses = {
    ...responsesOptions,
    [httpCode]: response
      ? transformResponse(response, responseOptions)
      : undefined,
  };
  const parameters = [
    ...(path ? transformParameters("path", path, pathOptions) : []),
    ...(query ? transformParameters("query", query, queryOptions) : []),
    ...(header ? transformParameters("header", header, headerOptions) : []),
    ...(cookie ? transformParameters("cookie", cookie, cookieOptions) : []),
  ];

  const operation = {
    ...operationOptions,
    parameters,
    requestBody,
    responses,
  } satisfies OperationObject;

  return operation as OperationObject;
}
