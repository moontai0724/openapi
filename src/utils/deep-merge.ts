import deepmerge from "@fastify/deepmerge";

export const deepMerge: <T extends unknown[]>(...args: T) => T[number] =
  deepmerge({
    all: true,
  });
