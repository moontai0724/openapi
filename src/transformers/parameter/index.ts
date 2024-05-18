import type {
  AnyParameterObject,
  ParameterLocation,
  ParameterObject,
  SchemaObject,
} from "@moontai0724/openapi-types";

import { deepMerge } from "../../utils/deep-merge";

export interface TransformParameterOptions
  extends Partial<Omit<ParameterObject, "name" | "in" | "schema">> {}

/**
 * Options or overwrites to the result ParameterObject when transforming.
 */
export interface TransformParametersOptions {
  /**
   * Options to overwrite to all parameters.
   */
  overwriteAll?: TransformParameterOptions;
  /**
   * Overwrite to the corresponding parameter when transforming. Key is the name
   * of the parameter.
   */
  overwrites?: {
    [key: string]: TransformParameterOptions;
  };
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
  options: TransformParameterOptions = {},
) {
  const { example, examples, ...remains } = schema;
  const { description } = remains;

  const parameter = {
    name,
    in: location,
    description,
    required,
    schema: remains,
    example,
    examples: examples as ParameterObject["examples"],
  } satisfies ParameterObject;

  return deepMerge(parameter, options) as AnyParameterObject;
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
      deepMerge(options?.overwriteAll ?? {}, options?.overwrites?.[name] ?? {}),
    );
  });
}
