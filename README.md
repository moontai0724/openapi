# @moontai0724/openapi

[![NPM Version](https://img.shields.io/npm/v/@moontai0724/openapi)](https://www.npmjs.com/package/@moontai0724/openapi)
[![NPM Downloads](https://img.shields.io/npm/d18m/@moontai0724/openapi)](https://www.npmjs.com/package/@moontai0724/openapi)
[![Codecov](https://codecov.io/gh/moontai0724/openapi/graph/badge.svg)](https://codecov.io/gh/moontai0724/openapi)

An OpenAPI document define, generate and schema validation library supported by ajv.

The schema validation feature is currently under development, version 1.0.0 does not have schema validation feature, only document generation.

## To-do

- [ ] Add schema validation.

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
