# @moontai0724/openapi

[![NPM Version](https://img.shields.io/npm/v/@moontai0724/openapi)](https://www.npmjs.com/package/@moontai0724/openapi)
[![NPM Downloads](https://img.shields.io/npm/d18m/@moontai0724/openapi)](https://www.npmjs.com/package/@moontai0724/openapi)
[![Codecov](https://codecov.io/gh/moontai0724/openapi/graph/badge.svg)](https://codecov.io/gh/moontai0724/openapi)

An OpenAPI document define, generate and schema validation library supported by ajv.

## 📝 Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Examples](#examples)
- [API Document](#api-document)

## Install

### NPM

```bash
npm install @moontai0724/openapi
```

### Yarn

```bash
yarn add @moontai0724/openapi
```

### PNPM

```bash
pnpm add @moontai0724/openapi
```

## Usage

### define(path, method, schemas, options)

You can define a path by calling the `define` method.

```typescript
import OpenAPI, {
  type OperationSchemas,
  type TransformPathItemOptions,
} from "@moontai0724/openapi";
import Type from "@sinclair/typebox";

const openapi = new OpenAPI({
  /** basic document options */
});

const path = "/:path1";
const method = "patch";
const schemas: OperationSchemas = {
  body: Type.Object({
    body1: Type.String(),
  }),
  cookie: Type.Object({
    cookie1: Type.String(),
  }),
  header: Type.Object({
    header1: Type.String(),
  }),
  path: Type.Object({
    path1: Type.String(),
  }),
  query: Type.Object({
    query1: Type.String(),
  }),
  response: Type.Object({
    response1: Type.String(),
  }),
};
const options: TransformPathItemOptions = {
  /** options */
};

openapi.define(path, method, schemas, options);
```

For more informations, you can see examples below or the [API documentation](https://www.moontai0724.tw/openapi/classes/OpenAPI.html#define).

### init(path, method, schemas, options)

You can get the Ajv instance for further validation when initializing the OpenAPI instance by calling the `init` method.

```typescript
import OpenAPI from "@moontai0724/openapi";

const openapi = new OpenAPI({
  /** basic document options */
});

const path = "/:id";
const method = "patch";
const schemas: OperationSchemas = {
  cookie: {
    type: "object",
    properties: {
      token: {
        type: "string",
        description: "Token",
      },
    },
  },
  path: {
    type: "object",
    required: ["id"],
    properties: {
      id: {
        type: "number",
      },
    },
  },
  response: {
    description: "Specific resource",
    type: "object",
    required: ["success", "message"],
    properties: {
      success: {
        type: "boolean",
      },
      message: {
        type: "string",
      },
    },
  },
};
const options: TransformPathItemOptions = {
  /** options */
};

const ajv = openapi.init(path, method, schemas, options); // got the Ajv instance with schemas defined
```

For more informations, you can see examples below or the [API documentation](https://www.moontai0724.tw/openapi/classes/OpenAPI.html#init).

### validate(path, method, data, options)

You can validate a set of data after defined a path by calling the `validate` method.

```typescript
import OpenAPI from "@moontai0724/openapi";

const openapi = new OpenAPI({
  /** basic document options */
});

const path = "/:id";
const method = "patch";
const schemas: OperationSchemas = {
  /** schemas same as above */
};

openapi.define(path, method, schemas);

const data = {
  body: {
    body1: "body1",
  },
  cookie: {
    cookie1: "cookie1",
  },
  header: {},
  path: null,
  query: undefined,
};

const result = openapi.validate(path, method, data);
/**
 * result = {
 *   body: null,
 *   cookie: null,
 *   header: [
 *     {
 *       instancePath: "",
 *       keyword: "required",
 *       message: "must have required property 'header1'",
 *       params: {
 *         missingProperty: "header1",
 *       },
 *       schemaPath: "#/required",
 *     },
 *   ],
 *   path: [
 *     {
 *       instancePath: "",
 *       keyword: "type",
 *       message: "must be object",
 *       params: {
 *         type: "object",
 *       },
 *       schemaPath: "#/type",
 *     },
 *   ],
 *   query: [
 *     {
 *       instancePath: "",
 *       keyword: "type",
 *       message: "must be object",
 *       params: {
 *         type: "object",
 *       },
 *       schemaPath: "#/type",
 *     },
 *   ],
 * }
 */
```

For more informations, you can see the [API documentation](https://www.moontai0724.tw/openapi/classes/OpenAPI.html#validate).

## Examples

### Define a path and generate the document

```typescript
import OpenAPI from "@moontai0724/openapi";

const openapi = new OpenAPI({
  openapi: "3.1.0",
  info: {
    title: "Example",
    version: "1.0.0",
  },
});

openapi.define("/:id", "get", {
  cookie: {
    type: "object",
    properties: {
      token: {
        type: "string",
        description: "Token",
      },
    },
  },
  path: {
    type: "object",
    required: ["id"],
    properties: {
      id: {
        type: "number",
      },
    },
  },
  response: {
    description: "Specific resource",
    type: "object",
    required: ["success", "message"],
    properties: {
      success: {
        type: "boolean",
      },
      message: {
        type: "string",
      },
    },
  },
});

console.log(openapi.json()); // Generated OpenAPI JSON string.
console.log(openapi.yaml()); // Generated OpenAPI YAML string.
```

Rather than directly defining the JSON schemas in hand, we recommend you to use the [TypeBox](https://github.com/sinclairzx81/typebox) library to define the schemas. It would be like this:

```typescript
import { Type } from "@sinclair/typebox";

import OpenAPI from "./src";

const openapi = new OpenAPI({
  openapi: "3.1.0",
  info: {
    title: "Example",
    version: "1.0.0",
  },
});

openapi.define("/:id", "get", {
  cookie: Type.Object({
    token: Type.Optional(
      Type.String({
        description: "Token",
      }),
    ),
  }),
  path: Type.Object({
    id: Type.Number(),
  }),
  response: Type.Object(
    {
      success: Type.Boolean(),
      message: Type.String(),
    },
    { description: "Specific resource" },
  ),
});

console.log(openapi.json()); // Generated OpenAPI JSON string.
console.log(openapi.yaml()); // Generated OpenAPI YAML string.
```

The above code will generate the following document:

```yaml
openapi: "3.1.0"
info:
  title: "Example"
  version: "1.0.0"
paths:
  /:id:
    get:
      parameters:
        - name: "token"
          in: "cookie"
          description: "Token"
          required: false
          schema:
            type: "string"
        - name: "id"
          in: "path"
          required: true
          schema:
            type: "number"
      responses:
        200:
          description: "Specific resource"
          content:
            application/json:
              schema:
                type: "object"
                properties:
                  success:
                    type: "boolean"
                  message:
                    type: "string"
                required:
                  - "success"
                  - "message"
```

### Define a path and generate the document with options to adjust or overwrites

The last parameter is options for transforming the schemas.

There are some options when transforming the schema and also overwrites to the transformed schema.

For example, you can change the response http code or apply schema to specific content types:

```typescript
/* ... */
openapi.define(
  "/",
  "post",
  {
    body: {
      type: "object",
      properties: {
        name: {
          type: "string",
        },
      },
    },
  },
  {
    requestBody: {
      contentTypes: ["application/json", "application/x-www-form-urlencoded"],
    },
    responses: {
      httpCode: 201,
      overwrite: {
        default: {
          description: "Default Empty Response",
        },
      },
    },
  },
);
/* ... */
```

The above code will generate the following document:

```yaml
openapi: "3.1.0"
info:
  title: "Example"
  version: "1.0.0"
paths:
  /:
    post:
      parameters: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: "object"
              properties:
                name:
                  type: "string"
          application/x-www-form-urlencoded:
            schema:
              type: "object"
              properties:
                name:
                  type: "string"
      responses:
        201:
          description: "No Description." # Since the description is required in response, there will set "No Description." if schema has no description.
        default:
          description: "Default Empty Response"
```

## API Document

For more informations, you can see the [API documentation](https://moontai0724.github.io/openapi/).
