# Agent Instructions

## Project State

Fresh skeleton. All `src/` files exist with comments only. No implementation yet.

## Primary Reference

**Read `Architecture.md` first.** It defines strict layered architecture rules that are non-negotiable.

## Absolute Rules

### Layer Calling Pattern

**MUST** follow: `Route → Middleware → Controller → Service → Model`

**NEVER:**
- Controller calling Model directly (always through Service)
- Service receiving `req`/`res` parameters (HTTP-agnostic)
- Logic in Route files (only endpoint definitions)
- Validation in Controller/Service (Middleware only)

### Service Signatures

Services must be callable without HTTP context:

```js
// CORRECT
const createProduct = async (userId, data) => { ... }

// WRONG
const createProduct = async (req, res) => { ... }
```

### Error Handling

All errors use `ApiError` class and throw to centralized `errorHandler.middleware.js`:

```js
throw new ApiError(403, 'Hanya verified seller yang dapat menambahkan produk');
```

No manual `try/catch` for error formatting except to call `next(error)` in controllers.

### Response Format

All success responses via `apiResponse` helper:

```js
return apiResponse.success(res, 201, 'Produk berhasil dibuat', product);
```

Format:
```json
{
  "success": true,
  "message": "...",
  "data": { }
}
```

### File Organization

**One file = one resource.** Never mix multiple domains in one controller/service/model.

File naming: `[resource].[layer].js`
- Routes: `product.routes.js`
- Controllers: `product.controller.js`
- Services: `product.service.js`
- Models: `product.model.js`
- Validations: `product.validation.js`
- Middlewares: `[function].middleware.js`

## Current Setup

- **No test framework** configured yet
- **No linter/formatter** configured yet
- **Entry point:** Should be `src/server.js` (not `app.js` from package.json)
- **Module system:** CommonJS
- **Dependencies:** Only express installed

## Resources

Routes defined in Architecture.md: auth, product, cart, order, payment, seller, review, admin

## Before Implementation

1. Check `Architecture.md` for business rules (e.g., verified seller requirement)
2. Verify ORM/database choice (Prisma mentioned but not installed)
3. Verify validation library choice (Joi/Zod mentioned but not installed)
4. Check if Cloudinary/JWT libraries needed
