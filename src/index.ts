/**
 * Adds two numbers together.
 *
 * @param a The first number to add
 * @param b The second number to add
 * @returns The sum of the two numbers
 */
export function add(a: number, b: number): number {
  return a + b;
}

/**
 * Subtracts two numbers.
 *
 * @param a The number to subtract from
 * @param b The number to subtract
 * @returns The difference of the two numbers.
 */
export function divide(a: number, b: number): number {
  if (b === 0) {
    throw new Error("Cannot divide by zero");
  }

  return a / b;
}

/**
 * Takes the maximum of two numbers.
 *
 * @param a The first number to compare.
 * @param b The second number to compare.
 * @returns The bigger one of the two numbers.
 */
export function max(a: number, b: number): number {
  return Math.max(a, b);
}
