import type {
  AnyParameterObject,
  ParameterLocation,
  ParameterObject,
  SchemaObject,
} from "@moontai0724/openapi-types";

import { deepMerge } from "../utils/deep-merge";

/**
 * Options or overwrites to the result ParameterObject when transforming.
 */
export interface TransformParametersOptions
  extends Partial<
    Omit<ParameterObject, "schema" | "deprecated" | "explode" | "allowReserved">
  > {
  /**
   * The transformer will set the `allowReserved` property to `true` if the
   * parameter name is included in this array.
   * @see ParameterObject.allowReserved
   */
  allowReserved?: string[];
  /**
   * The transformer will set the `deprecated` property to `true` if the
   * parameter name is included in this array.
   * @see ParameterObject.deprecated
   */
  deprecated?: string[];
  /**
   * The transformer will set the `explode` property to `true` if the parameter
   * name is included in this array.
   * @see ParameterObject.explode
   */
  explode?: string[];
}

/**
 * Transform a schema to a parameter object.
 * @param name Name or key of the parameter.
 * @param location The location of the parameter. (e.g. path, query, header, cookie)
 * @param schema The schema of the parameter.
 * @param required Whether the parameter is required.
 * @param options Options or overwrites to the result parameter when transforming.
 * @returns Transformed parameter object.
 */
export function transformParameter(
  name: string,
  location: ParameterLocation,
  schema: SchemaObject,
  required: boolean,
  options: TransformParametersOptions = {},
) {
  const { description, examples } = schema;
  const { allowReserved, deprecated, explode, ...remainOptions } = options;

  const parameter = {
    name,
    in: location,
    description,
    required,
    deprecated: deprecated?.includes(name),
    explode: explode?.includes(name),
    allowReserved: allowReserved?.includes(name),
    schema,
    examples: examples as ParameterObject["examples"],
  } satisfies ParameterObject;

  return deepMerge(parameter, remainOptions) as AnyParameterObject;
}

export interface ParameterSchema extends SchemaObject {
  properties: Record<string, SchemaObject>;
}

/**
 * Transform a schema object to array of parameter objects.
 * @param location The location of the parameter. (e.g. path, query, header, cookie)
 * @param schema The schema of the parameter.
 * @param options Options or overwrites to the result parameter when transforming.
 * @returns Transformed parameter object.
 */
export function transformParameters(
  location: ParameterLocation,
  schema: ParameterSchema,
  options: TransformParametersOptions = {},
) {
  return Object.entries(schema.properties).map(([name, itemSchema]) => {
    if (typeof itemSchema !== "object")
      throw new Error("Unhandled schema type! Please report this issue.");

    return transformParameter(
      name,
      location,
      itemSchema,
      !!schema.required?.includes(name),
      options,
    );
  });
}
