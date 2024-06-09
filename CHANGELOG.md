# [1.1.0](https://github.com/moontai0724/openapi/compare/v1.0.0...v1.1.0) (2024-06-09)


### Features

* **init:** init ajv instance and define the path ([506ee2b](https://github.com/moontai0724/openapi/commit/506ee2ba09abf96b95d1e361fe190ec556787222))
* **validate:** validate the data with existing schema ([482e35c](https://github.com/moontai0724/openapi/commit/482e35c59d574ba92fc02983d8375b179ccf2776))

# 1.0.0 (2024-05-28)


### Bug Fixes

* **media:** overwrite instead of merging them ([041c863](https://github.com/moontai0724/openapi/commit/041c863e2b712dfcf960a8778f363b0a5f8e7236))
* **operation:** reoreder parameters ([1c4aad8](https://github.com/moontai0724/openapi/commit/1c4aad8e4dcdc33854df3320ac8592aae7b14426))
* **parameter:** ability to overwrite result or clear the result ([d32db0e](https://github.com/moontai0724/openapi/commit/d32db0e77ef88c2ff8e79fc51fc8852128bd3e44))
* **parameter:** correct transform result ([c283c2b](https://github.com/moontai0724/openapi/commit/c283c2b6a1468114ade6d5f07669b8a31619b1d1))
* **parameter:** omit description from schema ([ec26f34](https://github.com/moontai0724/openapi/commit/ec26f34b77ce2d1ce6e63665e13c210b8057aaca))
* **parameter:** transform with options to overwrite result ([74ace8b](https://github.com/moontai0724/openapi/commit/74ace8b4f3e2b00c7b9d36b1e04569ced0dbd865))
* **request-body:** ability to extends body options ([87347d0](https://github.com/moontai0724/openapi/commit/87347d02d40bdbd6c3c8c8f2b57bac47e7360dd9))
* **request-body:** correct schema ([d011d4c](https://github.com/moontai0724/openapi/commit/d011d4c27a492a4d7ea8116279d98be38f810b60))
* **request-body:** omit description from body ([1d5b222](https://github.com/moontai0724/openapi/commit/1d5b222afdf80b59355c85719dfb0c1b2ade13c7))
* **request-body:** omit example properties ([58884f4](https://github.com/moontai0724/openapi/commit/58884f47f5e5f4883b1531573ce6e4c46e1488e0))
* **request-body:** return undefined when not giving schema ([3a0f5c6](https://github.com/moontai0724/openapi/commit/3a0f5c6a4c93fe319cee67324bded9e1d5150a31))
* **request-body:** separate options to make it clean and enhance readability ([06d427d](https://github.com/moontai0724/openapi/commit/06d427dd7e5ccc74b20e722b16d0480d7f9198c3))
* **response:** fix response tranform to match test cases ([018fc46](https://github.com/moontai0724/openapi/commit/018fc46989a5153c1373f1738c398426b6dc0505))
* restrict parameter schema to object ([21da305](https://github.com/moontai0724/openapi/commit/21da30593e67179643cf1dec4a58947f32ad5acd))
* **type:** set deepMerge function type ([da6a997](https://github.com/moontai0724/openapi/commit/da6a9973537af6a2268137981e563d88626ca1d2))


### Features

* accept empty request body ([db0ed41](https://github.com/moontai0724/openapi/commit/db0ed41c09d964b2c40cb575b016c925cbfa8741))
* define and generate openapi document ([9328d7e](https://github.com/moontai0724/openapi/commit/9328d7e9c8507bacebdf79ef6e3dd7cc7f3c91bf))
* **openapi:** path define and document generation ([44f2a89](https://github.com/moontai0724/openapi/commit/44f2a89058e55f24020b4b117ddad29c9af0e1e7))
* **path-item:** transform path item ([5a324f0](https://github.com/moontai0724/openapi/commit/5a324f0f3dc7a8fc45de6002288e04f332cfd318))
