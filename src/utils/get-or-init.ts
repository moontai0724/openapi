/**
 * Get value from or initialize it in target object if it is not found.
 *
 * @param target Target object to fetch
 * @param key Key of target property to fetch in object, value type MUST be an object, or it will not be able to reference to the original object
 * @param defaultValue Default value to return if the value is not found
 * @returns Current value or default value, `never` if the target type is not an object.
 */
export function getOrInit<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Target extends Record<PropertyKey, any>,
  Key extends keyof Target,
  Value extends Exclude<Target[Key], undefined>,
>(
  target: Target,
  key: Key,
  defaultValue: Target[Key],
): Value extends object ? Value : never {
  const { [key]: targetValue = defaultValue } = target;

  if (typeof targetValue !== "object") {
    throw new Error(`Target value is not an object, key: ${String(key)}`);
  }

  // eslint-disable-next-line no-param-reassign
  target[key] = targetValue;

  return targetValue;
}
