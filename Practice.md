# TypeScript Best Practices & Deep Knowledge Guide

## Table of Contents
1. [Review Summary](#review-summary)
2. [Project Structure](#project-structure)
3. [TypeScript Configuration Mastery](#typescript-configuration-mastery)
4. [Error Handling Patterns](#error-handling-patterns)
5. [Input Validation](#input-validation)
6. [Response Standardization](#response-standardization)
7. [Service Layer Architecture](#service-layer-architecture)
8. [Environment Configuration](#environment-configuration)
9. [Logging Strategy](#logging-strategy)
10. [Naming Conventions](#naming-conventions)
11. [Type Safety Deep Dive](#type-safety-deep-dive)
12. [Advanced TypeScript Patterns](#advanced-typescript-patterns)
13. [Async/Await Best Practices](#asyncawait-best-practices)
14. [Middleware Patterns](#middleware-patterns)
15. [NestJS Enterprise Pattern](#nestjs-enterprise-pattern)
16. [Testing Strategy](#testing-strategy)
17. [Performance Optimization](#performance-optimization)
18. [Common Pitfalls](#common-pitfalls)
19. [Tips & Tricks](#tips--tricks)

---

## Review Summary

### Overall Rating: 5.5 / 10

Your project is functional and uses Express with TypeScript correctly, but it needs stronger architecture and production practices.

### Main Issues Identified

- **Hardcoded configuration**: `PORT` is fixed in code instead of using environment variables.
- **Unnecessary response handling**: `res.end()` is used after `res.json()`.
- **No validation**: Request body and route parameters are not validated, so invalid payloads can break your app.
- **Minimal error handling**: There is no global error middleware or consistent error response format.
- **Tightly coupled controllers**: Controllers access data directly instead of using a service layer.
- **Default exports for types**: `petDTO` is exported as a default type, which is not ideal for TypeScript conventions.
- **No logging**: There is no structured or centralized logging for requests and errors.
- **No middleware best practices**: Missing CORS, rate limiting, security headers, and request ID.
- **No testing**: There is no unit or integration test coverage.
- **No environment management**: `tsconfig` and runtime settings are not fully optimized for production.

### Key Fixes to Implement Immediately

1. Move `PORT` and app settings into `.env` and config module.
2. Remove `res.end()` after `res.json()`.
3. Add validation for `POST /pets` and route params using Zod or Joi.
4. Add global error handling middleware with custom error classes.
5. Introduce a service layer and repository pattern.
6. Use named exports for DTOs/types and PascalCase type names.
7. Add request logging and error logging.
8. Add middleware: `helmet`, `cors`, rate limiting, body parser.
9. Add unit tests and API integration tests.
10. Use strict TypeScript compiler settings.

---

## Project Structure

**Scalable folder organization for production apps:**

```
src/
├── config/
│   ├── database.ts
│   ├── env.ts
│   └── logger.ts
├── controllers/
│   ├── pets.ts
│   └── users.ts
├── services/
│   ├── pets.service.ts
│   ├── users.service.ts
│   └── email.service.ts
├── repositories/
│   ├── pets.repository.ts
│   └── users.repository.ts
├── models/
│   ├── pet.model.ts
│   └── user.model.ts
├── dto/
│   ├── pet.dto.ts
│   ├── create-pet.dto.ts
│   └── update-pet.dto.ts
├── middleware/
│   ├── error.middleware.ts
│   ├── logger.middleware.ts
│   ├── auth.middleware.ts
│   └── validation.middleware.ts
├── routes/
│   ├── pets.route.ts
│   ├── users.route.ts
│   └── index.ts
├── types/
│   ├── express.d.ts
│   ├── common.types.ts
│   └── pet.types.ts
├── utils/
│   ├── response.util.ts
│   ├── error.util.ts
│   ├── validators.util.ts
│   └── helpers.util.ts
├── decorators/
│   ├── validate.decorator.ts
│   └── role.decorator.ts
├── constants/
│   ├── messages.constants.ts
│   ├── status.constants.ts
│   └── config.constants.ts
├── index.ts
└── app.ts
```

**Why this structure?**
- ✅ Separation of concerns
- ✅ Easy to test
- ✅ Scales with team growth
- ✅ Easy to find code
- ✅ Prevents circular dependencies

---

## TypeScript Configuration Mastery

### Strict tsconfig.json (Recommended)
```json
{
  "compilerOptions": {
    /* Language and Environment */
    "target": "ES2020",
    "lib": ["ES2020"],
    "module": "ESNext",
    "useDefineForClassFields": true,

    /* Emit */
    "declaration": true,           // Generate .d.ts files
    "declarationMap": true,        // Source maps for declarations
    "sourceMap": true,             // Generate source maps for debugging
    "outDir": "./dist",
    "rootDir": "./src",

    /* Type Checking */
    "strict": true,                // Enable all strict type checks
    "noImplicitAny": true,         // Disallow 'any' types
    "strictNullChecks": true,      // Strict null/undefined checks
    "strictFunctionTypes": true,   // Strict function type checking
    "strictBindCallApply": true,   // Strict bind, call, apply checking
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,        // Error on unused variables
    "noUnusedParameters": true,    // Error on unused parameters
    "noImplicitReturns": true,     // Error on unreachable code
    "noFallthroughCasesInSwitch": true,

    /* Module Resolution */
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,

    /* Path Mapping */
    "baseUrl": "./src",
    "paths": {
      "@/*": ["./*"],
      "@config/*": ["config/*"],
      "@controllers/*": ["controllers/*"],
      "@services/*": ["services/*"],
      "@types/*": ["types/*"],
      "@utils/*": ["utils/*"],
      "@middleware/*": ["middleware/*"],
      "@routes/*": ["routes/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

**Key Settings Explained:**

| Option | Purpose |
|--------|---------|
| `strict: true` | Enables all strict type checks at once |
| `noImplicitAny: true` | Every variable must have explicit type |
| `strictNullChecks: true` | null/undefined must be explicit |
| `noUnusedLocals: true` | Catches dead code |
| `baseUrl + paths` | Enables import aliases (@/) |
| `declaration: true` | Generates type definitions for npm packages |

---

## Error Handling Patterns

### Custom Error Classes

```typescript
// utils/errors.util.ts

/**
 * Base API Error class
 * Use for all operational errors (validation, not found, etc)
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, ApiError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation Error - 400 Bad Request
 */
export class ValidationError extends ApiError {
  constructor(message: string) {
    super(400, message);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Not Found Error - 404
 */
export class NotFoundError extends ApiError {
  constructor(resource: string) {
    super(404, `${resource} not found`);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * Unauthorized Error - 401
 */
export class UnauthorizedError extends ApiError {
  constructor(message: string = "Unauthorized") {
    super(401, message);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

/**
 * Forbidden Error - 403
 */
export class ForbiddenError extends ApiError {
  constructor(message: string = "Access denied") {
    super(403, message);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

/**
 * Database Error - 500
 */
export class DatabaseError extends ApiError {
  constructor(message: string) {
    super(500, message, false);
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}
```

### Global Error Middleware

```typescript
// middleware/error.middleware.ts

import { Request, Response, NextFunction } from "express";
import logger from "@config/logger";
import { ApiError } from "@utils/errors.util";

export interface ErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  errors?: Record<string, string[]>;
  timestamp: string;
  path: string;
  requestId?: string;
  stack?: string;
}

/**
 * Global error handler middleware
 * MUST be placed LAST in middleware stack
 */
export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = "Internal Server Error";
  let isOperational = false;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    isOperational = err.isOperational;
  }

  // Log error
  if (isOperational) {
    logger.info({
      message,
      statusCode,
      path: req.path
    });
  } else {
    logger.error({
      error: err,
      message: err.message,
      statusCode,
      path: req.path
    });
  }

  const errorResponse: ErrorResponse = {
    success: false,
    statusCode,
    message,
    timestamp: new Date().toISOString(),
    path: req.path,
    requestId: (req as any).requestId
  };

  // Include stack trace in development
  if (process.env.NODE_ENV === "development") {
    errorResponse.stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
};

/**
 * Async route wrapper - catches errors and passes to middleware
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
```

---

## Input Validation

### Using Zod for Schema Validation

```typescript
// dto/pet.dto.ts

import { z } from "zod";

/**
 * Pet species enum
 */
export enum PetSpecies {
  DOG = "Dog",
  CAT = "Cat",
  RABBIT = "Rabbit",
  BIRD = "Bird",
  HAMSTER = "Hamster",
  TURTLE = "Turtle",
  GUINEA_PIG = "Guinea Pig",
  FOX = "Fox"
}

/**
 * Zod schema for creating a pet
 * Provides type-safe validation
 */
export const createPetSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be less than 50 characters")
    .trim(),

  species: z.enum(Object.values(PetSpecies) as [string, ...string[]], {
    errorMap: () => ({ message: "Invalid species" })
  }),

  age: z
    .number()
    .min(0, "Age cannot be negative")
    .max(100, "Age must be less than 100"),

  adopted: z
    .boolean()
    .default(false)
});

/**
 * Update pet schema (all fields optional)
 */
export const updatePetSchema = createPetSchema.partial();

/**
 * Infer TypeScript types from Zod schemas
 * This ensures types and validation stay in sync
 */
export type CreatePetDTO = z.infer<typeof createPetSchema>;
export type UpdatePetDTO = z.infer<typeof updatePetSchema>;

/**
 * Pet response DTO
 */
export type PetResponseDTO = CreatePetDTO & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};
```

### Validation Middleware

```typescript
// middleware/validation.middleware.ts

import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { ValidationError } from "@utils/errors.util";

/**
 * Middleware factory for request body validation
 */
export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.body);
      req.body = validated;
      next();
    } catch (error: any) {
      const errors = error.errors.reduce(
        (acc: Record<string, string[]>, curr: any) => {
          const path = curr.path.join(".");
          if (!acc[path]) {
            acc[path] = [];
          }
          acc[path].push(curr.message);
          return acc;
        },
        {}
      );

      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
        timestamp: new Date().toISOString()
      });
    }
  };
};

/**
 * Middleware factory for path parameter validation
 */
export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.params);
      req.params = validated;
      next();
    } catch (error: any) {
      throw new ValidationError("Invalid parameters");
    }
  };
};

/**
 * Middleware factory for query validation
 */
export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.query);
      req.query = validated as any;
      next();
    } catch (error: any) {
      throw new ValidationError("Invalid query parameters");
    }
  };
};
```

---

## Response Standardization

### Response Helper

```typescript
// utils/response.util.ts

import { Response } from "express";

export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  timestamp: string;
  path?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

/**
 * Send standardized response
 * Usage: sendResponse(res, 200, data, "Pet created");
 */
export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  data: T,
  message: string,
  meta?: ApiResponse["meta"]
): Response => {
  const response: ApiResponse<T> = {
    success: statusCode < 400,
    statusCode,
    message,
    data: statusCode < 400 ? data : undefined,
    timestamp: new Date().toISOString(),
    ...(meta && { meta })
  };

  return res.status(statusCode).json(response);
};

/**
 * Send list response with pagination
 */
export const sendListResponse = <T>(
  res: Response,
  data: T[],
  total: number,
  page: number,
  limit: number,
  message: string = "Data retrieved successfully"
): Response => {
  return sendResponse(res, 200, data, message, {
    total,
    page,
    limit
  });
};

/**
 * Send success response
 */
export const sendSuccess = <T>(
  res: Response,
  data: T,
  statusCode: number = 200,
  message: string = "Success"
): Response => {
  return sendResponse(res, statusCode, data, message);
};

/**
 * Send created response (201)
 */
export const sendCreated = <T>(
  res: Response,
  data: T,
  message: string = "Resource created successfully"
): Response => {
  return sendResponse(res, 201, data, message);
};

/**
 * Send no content response (204)
 */
export const sendNoContent = (res: Response): Response => {
  return res.status(204).send();
};
```

---

## Service Layer Architecture

### Best Practice Service Pattern

```typescript
// services/pets.service.ts

import { PetRepository } from "@repositories/pets.repository";
import { CreatePetDTO, UpdatePetDTO, PetResponseDTO } from "@dto/pet.dto";
import { NotFoundError } from "@utils/errors.util";
import logger from "@config/logger";

/**
 * PetService contains all business logic
 * Controllers should call services, never access data directly
 */
export class PetService {
  private petRepository: PetRepository;

  constructor() {
    this.petRepository = new PetRepository();
  }

  /**
   * Get all pets with optional filtering
   */
  async getAllPets(limit: number = 10, offset: number = 0): Promise<{
    data: PetResponseDTO[];
    total: number;
  }> {
    try {
      logger.info("Fetching all pets");
      const data = await this.petRepository.findAll(limit, offset);
      const total = await this.petRepository.count();
      return { data, total };
    } catch (error) {
      logger.error("Error fetching pets", error);
      throw error;
    }
  }

  /**
   * Get pet by ID
   */
  async getPetById(id: string): Promise<PetResponseDTO> {
    try {
      const pet = await this.petRepository.findById(id);
      if (!pet) {
        throw new NotFoundError("Pet");
      }
      return pet;
    } catch (error) {
      logger.error(`Error fetching pet ${id}`, error);
      throw error;
    }
  }

  /**
   * Get pet by name (case-insensitive)
   */
  async getPetByName(name: string): Promise<PetResponseDTO> {
    try {
      const pet = await this.petRepository.findByName(name.toLowerCase());
      if (!pet) {
        throw new NotFoundError("Pet");
      }
      return pet;
    } catch (error) {
      logger.error(`Error fetching pet ${name}`, error);
      throw error;
    }
  }

  /**
   * Create new pet
   */
  async createPet(dto: CreatePetDTO): Promise<PetResponseDTO> {
    try {
      logger.info("Creating new pet", { name: dto.name });

      // Business logic: check for duplicates
      const existing = await this.petRepository.findByName(dto.name.toLowerCase());
      if (existing) {
        throw new Error("Pet with this name already exists");
      }

      const pet = await this.petRepository.create(dto);
      logger.info("Pet created successfully", { id: pet.id });
      return pet;
    } catch (error) {
      logger.error("Error creating pet", error);
      throw error;
    }
  }

  /**
   * Update pet
   */
  async updatePet(id: string, dto: UpdatePetDTO): Promise<PetResponseDTO> {
    try {
      logger.info("Updating pet", { id });

      const pet = await this.petRepository.findById(id);
      if (!pet) {
        throw new NotFoundError("Pet");
      }

      const updated = await this.petRepository.update(id, dto);
      logger.info("Pet updated successfully", { id });
      return updated;
    } catch (error) {
      logger.error("Error updating pet", error);
      throw error;
    }
  }

  /**
   * Delete pet
   */
  async deletePet(id: string): Promise<void> {
    try {
      logger.info("Deleting pet", { id });

      const pet = await this.petRepository.findById(id);
      if (!pet) {
        throw new NotFoundError("Pet");
      }

      await this.petRepository.delete(id);
      logger.info("Pet deleted successfully", { id });
    } catch (error) {
      logger.error("Error deleting pet", error);
      throw error;
    }
  }

  /**
   * Get adopted pets only
   */
  async getAdoptedPets(): Promise<PetResponseDTO[]> {
    try {
      return await this.petRepository.findByAdoptionStatus(true);
    } catch (error) {
      logger.error("Error fetching adopted pets", error);
      throw error;
    }
  }

  /**
   * Get available pets for adoption
   */
  async getAvailablePets(): Promise<PetResponseDTO[]> {
    try {
      return await this.petRepository.findByAdoptionStatus(false);
    } catch (error) {
      logger.error("Error fetching available pets", error);
      throw error;
    }
  }
}

export default new PetService();
```

### Repository Pattern

```typescript
// repositories/pets.repository.ts

import petsData from "@demoDB/petsData";
import { CreatePetDTO, UpdatePetDTO, PetResponseDTO } from "@dto/pet.dto";
import { v4 as uuidv4 } from "uuid";

/**
 * PetRepository handles all data access
 * Keeps data layer separate from business logic
 */
export class PetRepository {
  private data = petsData;

  /**
   * Find all pets with pagination
   */
  async findAll(limit: number, offset: number): Promise<PetResponseDTO[]> {
    return this.data.slice(offset, offset + limit) as PetResponseDTO[];
  }

  /**
   * Get total count
   */
  async count(): Promise<number> {
    return this.data.length;
  }

  /**
   * Find by ID
   */
  async findById(id: string): Promise<PetResponseDTO | undefined> {
    return this.data.find(p => (p as any).id === id) as PetResponseDTO | undefined;
  }

  /**
   * Find by name
   */
  async findByName(name: string): Promise<PetResponseDTO | undefined> {
    return this.data.find(p => p.name.toLowerCase() === name) as PetResponseDTO | undefined;
  }

  /**
   * Create new pet
   */
  async create(dto: CreatePetDTO): Promise<PetResponseDTO> {
    const newPet: PetResponseDTO = {
      ...dto,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.data.push(newPet as any);
    return newPet;
  }

  /**
   * Update pet
   */
  async update(id: string, dto: UpdatePetDTO): Promise<PetResponseDTO> {
    const index = this.data.findIndex(p => (p as any).id === id);
    if (index === -1) throw new Error("Pet not found");

    const updated = {
      ...this.data[index],
      ...dto,
      updatedAt: new Date()
    };
    this.data[index] = updated as any;
    return updated as PetResponseDTO;
  }

  /**
   * Delete pet
   */
  async delete(id: string): Promise<void> {
    const index = this.data.findIndex(p => (p as any).id === id);
    if (index === -1) throw new Error("Pet not found");
    this.data.splice(index, 1);
  }

  /**
   * Find by adoption status
   */
  async findByAdoptionStatus(adopted: boolean): Promise<PetResponseDTO[]> {
    return this.data.filter(p => p.adopted === adopted) as PetResponseDTO[];
  }
}
```

---

## Environment Configuration

### Environment Variables Setup

```typescript
// config/env.ts

import dotenv from "dotenv";

dotenv.config();

/**
 * Centralized environment configuration
 * Validates that all required vars are present
 */
export class EnvConfig {
  readonly PORT: number;
  readonly NODE_ENV: "development" | "staging" | "production";
  readonly LOG_LEVEL: string;
  readonly DB_URL: string;
  readonly JWT_SECRET: string;
  readonly CORS_ORIGIN: string[];
  readonly RATE_LIMIT_WINDOW: number;
  readonly RATE_LIMIT_MAX_REQUESTS: number;

  constructor() {
    this.PORT = this.getNumberEnv("PORT", 3000);
    this.NODE_ENV = this.getEnv("NODE_ENV", "development") as any;
    this.LOG_LEVEL = this.getEnv("LOG_LEVEL", "info");
    this.DB_URL = this.getRequiredEnv("DATABASE_URL");
    this.JWT_SECRET = this.getRequiredEnv("JWT_SECRET");
    this.CORS_ORIGIN = this.getEnv("CORS_ORIGIN", "http://localhost:3000").split(",");
    this.RATE_LIMIT_WINDOW = this.getNumberEnv("RATE_LIMIT_WINDOW", 15 * 60 * 1000);
    this.RATE_LIMIT_MAX_REQUESTS = this.getNumberEnv("RATE_LIMIT_MAX_REQUESTS", 100);

    this.validate();
  }

  private getEnv(key: string, defaultValue?: string): string {
    return process.env[key] || defaultValue || "";
  }

  private getNumberEnv(key: string, defaultValue?: number): number {
    const value = process.env[key];
    if (value === undefined) return defaultValue || 0;
    return parseInt(value, 10);
  }

  private getRequiredEnv(key: string): string {
    const value = process.env[key];
    if (!value) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
  }

  private validate(): void {
    if (!["development", "staging", "production"].includes(this.NODE_ENV)) {
      throw new Error("Invalid NODE_ENV");
    }
  }

  isDevelopment(): boolean {
    return this.NODE_ENV === "development";
  }

  isProduction(): boolean {
    return this.NODE_ENV === "production";
  }
}

export default new EnvConfig();
```

### .env.example

```
PORT=3000
NODE_ENV=development
LOG_LEVEL=info
DATABASE_URL=mongodb://localhost:27017/pets
JWT_SECRET=your-secret-key-min-32-characters
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## Logging Strategy

### Logger Configuration

```typescript
// config/logger.ts

import pino from "pino";
import env from "@config/env";

/**
 * Pino logger configuration
 * Use Pino for performance (faster than Winston)
 */
const logger = pino({
  level: env.LOG_LEVEL,
  transport:
    env.isDevelopment()
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            ignore: "pid,hostname",
            singleLine: false,
            translateTime: "SYS:standard"
          }
        }
      : undefined,
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    }
  },
  timestamp: pino.stdTimeFunctions.isoTime
});

export default logger;
```

### Logging Best Practices

```typescript
// Examples of good logging patterns

import logger from "@config/logger";

// ✅ DO: Log important operations
logger.info("User logged in", { userId: user.id, email: user.email });

// ✅ DO: Log errors with context
logger.error(
  { err: error, userId, action: "createPet" },
  "Failed to create pet"
);

// ✅ DO: Log with performance metrics
const start = Date.now();
await expensive_operation();
logger.info({ duration: Date.now() - start }, "Operation completed");

// ✅ DO: Use structured logging
logger.debug(
  { request: { method: req.method, path: req.path }, userId: req.user?.id },
  "Request received"
);

// ❌ DON'T: Log sensitive data
logger.info(user); // Don't log entire user object with password!

// ❌ DON'T: Log at wrong level
logger.error("User not found"); // This is INFO level, not ERROR

// ❌ DON'T: Use console.log in production
console.log("Debug"); // Use logger instead!
```

---

## Naming Conventions

### Comprehensive Naming Guide

```typescript
// FILE NAMES

// ✅ DO:
// Descriptive, kebab-case, include type suffix
- pet.service.ts
- pet.repository.ts
- pet.controller.ts
- pet.dto.ts
- auth.middleware.ts
- error.util.ts

// ❌ DON'T:
- pet.ts (ambiguous)
- petService.ts (should be kebab-case)
- Pet.ts (not descriptive)


// CLASS/INTERFACE/TYPE NAMES

// ✅ DO: PascalCase
class PetService {}
interface PetRepository {}
type Pet = { name: string };
enum PetSpecies { DOG, CAT }

// ❌ DON'T:
class petService {} // lowercase
interface pet {} // not descriptive
type petType = {}; // redundant "type"


// VARIABLE/FUNCTION NAMES

// ✅ DO: camelCase
const petService = new PetService();
const getAllPets = async () => {};
let isAdopted = true;
const MAX_RETRIES = 3; // UPPER_SNAKE for constants

// ❌ DON'T:
const PetService = new PetService(); // PascalCase for variables
const get_all_pets = async () => {}; // snake_case for functions
let var1; // meaningless name


// CONSTANT NAMES

// ✅ DO: UPPER_SNAKE_CASE
const MAX_PETS = 1000;
const API_BASE_URL = "http://api.example.com";
const REQUEST_TIMEOUT = 5000;

// ❌ DON'T:
const maxPets = 1000; // should be upper case
const api_base = "http://api.example.com"; // inconsistent


// BOOLEAN VARIABLES

// ✅ DO: Prefix with "is", "has", "should", "can"
const isAdopted = true;
const hasPermission = false;
const shouldNotify = true;
const canDelete = false;

// ❌ DON'T:
const adopted = true; // unclear if it's boolean
const deleted = true; // ambiguous


// EVENT HANDLERS

// ✅ DO: Prefix with "on" or "handle"
const handlePetCreation = () => {};
const onPetDeleted = () => {};

// ❌ DON'T:
const petCreated = () => {}; // unclear if it's handler


// ARRAY NAMES

// ✅ DO: Use plural
const pets: Pet[] = [];
const users: User[] = [];

// ❌ DON'T:
const petList: Pet[] = []; // redundant "List"
const pet: Pet[] = []; // singular for plural data


// CALLBACK FUNCTIONS

// ✅ DO:
const users = data.map((user) => user.name);
const filtered = items.filter((item) => item.active);

// ❌ DON'T:
const users = data.map((u) => u.name); // too abbreviated
```

---

## Type Safety Deep Dive

### Advanced Type Patterns

```typescript
// 1. DISCRIMINATED UNIONS (Type-safe state management)

export type PetResult =
  | { success: true; data: Pet }
  | { success: false; error: string };

// Usage:
const result: PetResult = getPet(id);
if (result.success) {
  console.log(result.data); // ✅ TypeScript knows data exists
} else {
  console.log(result.error); // ✅ TypeScript knows error exists
}


// 2. UTILITY TYPES

// Partial - all properties optional
type PartialPet = Partial<Pet>;

// Required - all properties required
type RequiredPet = Required<Pet>;

// Pick - select specific properties
type PetPreview = Pick<Pet, "name" | "species">;

// Omit - exclude properties
type PetWithoutId = Omit<Pet, "id">;

// Record - key-value mapping
type PetStatus = Record<"adopted" | "available" | "pending", Pet[]>;

// Extract - conditional type
type StringOrNumber = string | number;
type JustString = Extract<StringOrNumber, string>; // string

// Exclude - inverse of Extract
type NotString = Exclude<StringOrNumber, string>; // number


// 3. GENERICS FOR REUSABILITY

/**
 * Generic API response wrapper
 */
interface Response<T, E = string> {
  success: boolean;
  data?: T;
  error?: E;
}

const handlePetResponse: Response<Pet> = {
  success: true,
  data: { id: "1", name: "Buddy", species: "Dog", adopted: true, age: 3 }
};

/**
 * Generic repository pattern
 */
interface IRepository<T> {
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T | undefined>;
  create(data: T): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}

class GenericRepository<T> implements IRepository<T> {
  constructor(private data: T[] = []) {}

  async findAll(): Promise<T[]> {
    return this.data;
  }

  async findById(id: string): Promise<T | undefined> {
    return (this.data as any[]).find((item: any) => item.id === id);
  }

  async create(data: T): Promise<T> {
    this.data.push(data);
    return data;
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    const index = (this.data as any[]).findIndex((item: any) => item.id === id);
    return (this.data[index] = { ...this.data[index], ...data });
  }

  async delete(id: string): Promise<void> {
    const index = (this.data as any[]).findIndex((item: any) => item.id === id);
    this.data.splice(index, 1);
  }
}


// 4. CONDITIONAL TYPES

/**
 * Get parameter type of a function
 */
type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;

type MyFunctionParams = Parameters<(a: string, b: number) => void>; // [string, number]


// 5. TYPE GUARDS

/**
 * Type guard for Pet interface
 */
function isPet(value: unknown): value is Pet {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "name" in value &&
    "species" in value
  );
}

// Usage:
const value: unknown = { id: "1", name: "Buddy", species: "Dog" };
if (isPet(value)) {
  console.log(value.name); // ✅ TypeScript knows it's Pet
}


// 6. AS CONST PATTERN (Literal types)

/**
 * Use 'as const' to get literal types
 */
const STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  PENDING: "pending"
} as const;

type Status = (typeof STATUS)[keyof typeof STATUS]; // "active" | "inactive" | "pending"


// 7. GENERIC FUNCTION CONSTRAINTS

/**
 * Function that works only with objects having 'id' property
 */
function getEntityId<T extends { id: string }>(entity: T): string {
  return entity.id;
}

// ✅ OK
getEntityId({ id: "123", name: "Pet" });

// ❌ Error - no 'id' property
getEntityId({ name: "Pet" });


// 8. READONLY PROPERTIES

/**
 * Immutable types
 */
interface ReadonlyPet {
  readonly id: string;
  readonly name: string;
  readonly species: string;
}

// ✅ OK
const pet: ReadonlyPet = { id: "1", name: "Buddy", species: "Dog" };
const name = pet.name;

// ❌ Error - cannot modify readonly
pet.name = "Max";
```

---

## Advanced TypeScript Patterns

### Factory Pattern

```typescript
// Creational pattern for complex object creation

interface Config {
  timeout: number;
  retries: number;
}

class ServiceFactory {
  static createPetService(config: Config): PetService {
    return new PetService(config);
  }

  static createUserService(config: Config): UserService {
    return new UserService(config);
  }
}

// Usage:
const config = { timeout: 5000, retries: 3 };
const petService = ServiceFactory.createPetService(config);
```

### Decorator Pattern

```typescript
// Add functionality without modifying original class

function Logger(target: any, propertyName: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = async function(...args: any[]) {
    console.log(`Calling ${propertyName}`);
    const result = await originalMethod.apply(this, args);
    console.log(`Finished ${propertyName}`);
    return result;
  };

  return descriptor;
}

class PetService {
  @Logger
  async getAllPets(): Promise<Pet[]> {
    return await this.petRepository.findAll();
  }
}
```

### Singleton Pattern

```typescript
// Ensure only one instance

class DatabaseConnection {
  private static instance: DatabaseConnection;

  private constructor() {}

  static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }
}

// Usage:
const db1 = DatabaseConnection.getInstance();
const db2 = DatabaseConnection.getInstance();
console.log(db1 === db2); // true
```

### Dependency Injection

```typescript
// Inject dependencies instead of creating them

interface ILogger {
  info(message: string): void;
  error(message: string): void;
}

class PetService {
  constructor(
    private petRepository: PetRepository,
    private logger: ILogger
  ) {}

  async getAllPets(): Promise<Pet[]> {
    this.logger.info("Fetching all pets");
    return await this.petRepository.findAll();
  }
}

// Usage:
const logger: ILogger = { info: console.log, error: console.error };
const petService = new PetService(petRepository, logger);
```

---

## Async/Await Best Practices

```typescript
// ✅ DO: Error handling with try-catch

async function getAllPets(): Promise<Pet[]> {
  try {
    const pets = await petRepository.findAll();
    logger.info("Pets fetched successfully");
    return pets;
  } catch (error) {
    logger.error("Failed to fetch pets", error);
    throw new DatabaseError("Could not fetch pets");
  }
}


// ✅ DO: Wait for parallel operations with Promise.all

async function createPetAndNotify(petData: CreatePetDTO): Promise<[Pet, void]> {
  const [pet] = await Promise.all([
    petRepository.create(petData),
    notificationService.sendEmail(petData.owner)
  ]);
  return [pet];
}


// ✅ DO: Handle partial failures with Promise.allSettled

async function syncMultipleSources(): Promise<void> {
  const results = await Promise.allSettled([
    sourceA.fetch(),
    sourceB.fetch(),
    sourceC.fetch()
  ]);

  results.forEach((result, index) => {
    if (result.status === "rejected") {
      logger.error(`Source ${index} failed:`, result.reason);
    }
  });
}


// ❌ DON'T: Use await in loops

// Bad - slow! Sequential execution
for (const petId of petIds) {
  await updatePet(petId); // One at a time
}

// Good - parallel execution
await Promise.all(petIds.map(id => updatePet(id)));


// ❌ DON'T: Fire and forget

// Bad - unhandled promise rejection possible
updatePet(id);

// Good - handle errors
updatePet(id).catch(err => logger.error("Failed", err));


// ❌ DON'T: Mix async-await and .then()

// Confusing
const pet = await petRepository.findById(id)
  .then(p => transformPet(p))
  .catch(e => null);

// Clean
try {
  const pet = await petRepository.findById(id);
  return transformPet(pet);
} catch {
  return null;
}
```

---

## Middleware Patterns

### Complete Middleware Stack

```typescript
// middleware/index.ts

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import requestId from "express-request-id";

import env from "@config/env";
import logger from "@config/logger";
import { errorHandler } from "@middleware/error.middleware";
import { requestLogger } from "@middleware/logger.middleware";
import { requestIdMiddleware } from "@middleware/request-id.middleware";

/**
 * Setup all middleware in correct order
 */
export function setupMiddleware(app: any): void {
  // 1. Security headers
  app.use(helmet());

  // 2. CORS
  app.use(cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
    optionsSuccessStatus: 200
  }));

  // 3. Request ID
  app.use(requestIdMiddleware);

  // 4. Body parsing
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // 5. Request logging
  app.use(requestLogger);

  // 6. Rate limiting
  const limiter = rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW,
    max: env.RATE_LIMIT_MAX_REQUESTS,
    message: "Too many requests, please try again later",
    skip: () => env.isDevelopment()
  });
  app.use("/api", limiter);

  // 7. Response compression (optional)
  // app.use(compression());

  // 8. Routes will be added here
  // setupRoutes(app);

  // 9. 404 handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: "Route not found",
      path: req.path
    });
  });

  // 10. Error handler (MUST BE LAST)
  app.use(errorHandler);
}
```

### Request ID Middleware

```typescript
// middleware/request-id.middleware.ts

import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

/**
 * Add unique request ID for tracing
 */
export const requestIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const requestId = req.get("x-request-id") || uuidv4();
  (req as any).requestId = requestId;
  res.set("x-request-id", requestId);
  next();
};
```

### Request Logger Middleware

```typescript
// middleware/logger.middleware.ts

import { Request, Response, NextFunction } from "express";
import logger from "@config/logger";

/**
 * Log incoming requests and outgoing responses
 */
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const start = Date.now();

  // Log when response is sent
  res.on("finish", () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    const level = statusCode >= 400 ? "error" : "info";

    logger[level as "info" | "error"]({
      method: req.method,
      path: req.path,
      statusCode,
      duration: `${duration}ms`,
      requestId: (req as any).requestId,
      userAgent: req.get("user-agent")
    }, `${req.method} ${req.path}`);
  });

  next();
};
```

---

## NestJS Enterprise Pattern

### For comparison with Express (if migrating)

```typescript
// NestJS uses decorators for cleaner syntax
// This is what your Express code looks like in NestJS:

import { Controller, Get, Post, Body, Param, HttpStatus } from "@nestjs/common";
import { PetService } from "./pet.service";
import { CreatePetDTO } from "./dto/create-pet.dto";

@Controller("pets")
export class PetController {
  constructor(private readonly petService: PetService) {}

  @Get()
  async getAllPets(): Promise<Pet[]> {
    return this.petService.getAllPets();
  }

  @Get(":id")
  async getPetById(@Param("id") id: string): Promise<Pet> {
    return this.petService.getPetById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPet(@Body() createPetDto: CreatePetDTO): Promise<Pet> {
    return this.petService.createPet(createPetDto);
  }
}

/**
 * Advantages of NestJS:
 * - Decorators handle routing automatically
 * - Built-in validation pipes
 * - Dependency injection out of the box
 * - Modules organize code
 * - Interceptors for cross-cutting concerns
 * - Better TypeScript integration
 */
```

---

## Testing Strategy

### Unit Testing with Vitest

```typescript
// services/__tests__/pets.service.test.ts

import { describe, it, expect, beforeEach, vi } from "vitest";
import { PetService } from "@services/pets.service";
import { PetRepository } from "@repositories/pets.repository";
import { NotFoundError } from "@utils/errors.util";

describe("PetService", () => {
  let petService: PetService;
  let petRepository: PetRepository;

  beforeEach(() => {
    petRepository = new PetRepository();
    petService = new PetService();

    // Mock repository
    vi.spyOn(petRepository, "findById").mockImplementation(async (id: string) => {
      if (id === "existing-id") {
        return { id, name: "Buddy", species: "Dog", adopted: true, age: 3 } as any;
      }
      return undefined;
    });
  });

  describe("getPetById", () => {
    it("should return pet when found", async () => {
      const pet = await petService.getPetById("existing-id");
      expect(pet).toBeDefined();
      expect(pet.name).toBe("Buddy");
    });

    it("should throw NotFoundError when pet not found", async () => {
      await expect(
        petService.getPetById("non-existing-id")
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("createPet", () => {
    it("should create new pet", async () => {
      const dto = { name: "Max", species: "Cat", adopted: false, age: 2 };
      const pet = await petService.createPet(dto);
      expect(pet).toBeDefined();
      expect(pet.name).toBe("Max");
    });
  });
});
```

### Integration Testing

```typescript
// __tests__/pets.integration.test.ts

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "@/app";

describe("Pets API Integration Tests", () => {
  describe("GET /api/v1/pets", () => {
    it("should return all pets", async () => {
      const response = await request(app)
        .get("/api/v1/pets")
        .expect(200);

      expect(response.body).toHaveProperty("success", true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe("POST /api/v1/pets", () => {
    it("should create new pet with valid data", async () => {
      const response = await request(app)
        .post("/api/v1/pets")
        .send({
          name: "TestPet",
          species: "Dog",
          age: 1,
          adopted: false
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe("TestPet");
    });

    it("should return 400 with invalid data", async () => {
      const response = await request(app)
        .post("/api/v1/pets")
        .send({
          // missing required fields
          name: "TestPet"
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});
```

---

## Performance Optimization

### Caching Pattern

```typescript
// utils/cache.util.ts

export class Cache<T> {
  private cache = new Map<string, { data: T; expiresAt: number }>();

  set(key: string, value: T, ttlMs: number = 60000): void {
    this.cache.set(key, {
      data: value,
      expiresAt: Date.now() + ttlMs
    });
  }

  get(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  clear(): void {
    this.cache.clear();
  }
}

// Usage:
const petCache = new Cache<Pet>();

async function getPetWithCache(id: string): Promise<Pet> {
  const cached = petCache.get(`pet:${id}`);
  if (cached) {
    logger.info("Cache hit");
    return cached;
  }

  const pet = await petRepository.findById(id);
  if (pet) {
    petCache.set(`pet:${id}`, pet, 5 * 60 * 1000); // 5 minutes
  }

  return pet;
}
```

### Lazy Loading

```typescript
// Load data only when needed

class PetService {
  private _allPets: Pet[] | null = null;

  async getAllPets(): Promise<Pet[]> {
    if (this._allPets === null) {
      this._allPets = await petRepository.findAll();
    }
    return this._allPets;
  }
}
```

### Pagination for Large Datasets

```typescript
// Always paginate large queries

async function getPetsWithPagination(
  page: number = 1,
  limit: number = 10
): Promise<{ data: Pet[]; total: number }> {
  const offset = (page - 1) * limit;
  const [data, total] = await Promise.all([
    petRepository.findAll(limit, offset),
    petRepository.count()
  ]);

  return { data, total };
}
```

---

## Common Pitfalls

### 1. Not Handling Async Errors

```typescript
// ❌ WRONG: No error handling
app.get("/pet/:id", async (req, res) => {
  const pet = await petService.getPetById(req.params.id);
  res.json(pet);
});

// ✅ CORRECT: With error handling
app.get(
  "/pet/:id",
  asyncHandler(async (req, res, next) => {
    const pet = await petService.getPetById(req.params.id);
    sendSuccess(res, pet);
  })
);
```

### 2. Over-using `any`

```typescript
// ❌ WRONG
function process(data: any): any {
  return data.something;
}

// ✅ CORRECT
function process<T extends { something: string }>(data: T): string {
  return data.something;
}
```

### 3. Not Validating Input

```typescript
// ❌ WRONG: No validation
app.post("/pets", (req, res) => {
  const pet = req.body; // Could be anything!
  petService.createPet(pet);
});

// ✅ CORRECT: With validation
app.post(
  "/pets",
  validateRequest(createPetSchema),
  asyncHandler(async (req, res) => {
    const pet = await petService.createPet(req.body);
    sendCreated(res, pet);
  })
);
```

### 4. Circular Dependencies

```typescript
// ❌ WRONG: A imports B, B imports A
// A.ts
import { B } from "./B";

// B.ts
import { A } from "./A";

// ✅ CORRECT: Create separate interfaces
// types.ts
export interface IB {
  method(): void;
}

// A.ts
import { IB } from "./types";

// B.ts
import { IB } from "./types";
```

### 5. Not Using Dependency Injection

```typescript
// ❌ WRONG: Hard to test
class PetService {
  private repository = new PetRepository(); // Tightly coupled
}

// ✅ CORRECT: Inject dependencies
class PetService {
  constructor(private repository: PetRepository) {} // Loosely coupled
}
```

---

## Tips & Tricks

### 1. Use Type Inference Wisely

```typescript
// Let TypeScript infer types when obvious
const pet = { name: "Buddy", age: 3 }; // Type is inferred

// But be explicit for public APIs
export function getPet(id: string): Promise<Pet> {
  // Always specify return types for public functions
}
```

### 2. Use Function Overloading

```typescript
// Function overloading for different argument combinations
function getPet(id: string): Promise<Pet>;
function getPet(name: string, species: string): Promise<Pet>;
function getPet(idOrName: string, species?: string): Promise<Pet> {
  // Implementation
}

// Callers see clear options:
getPet("123");
getPet("Buddy", "Dog");
```

### 3. Use Strict Parameter Checking

```typescript
// This catches many bugs at compile time
const config: { port: number; host: string } = {
  port: 3000,
  host: "localhost"
  // Missing 'host'? ❌ Error caught at compile time!
};
```

### 4. Create Type-Safe Enums

```typescript
// Better than string enums
enum Status {
  ACTIVE = "active",
  INACTIVE = "inactive"
}

// Use Record for mapping
const statusColors: Record<Status, string> = {
  [Status.ACTIVE]: "green",
  [Status.INACTIVE]: "red"
};
```

### 5. Use Template Literals for Strings

```typescript
// More type-safe than concatenation
const url = `${apiBase}/pets/${petId}`;

// Especially with unions
type Method = "GET" | "POST" | "PUT";
const endpoint = `${Method}`;  // Type-safe URL construction
```

### 6. Nullish Coalescing (??)

```typescript
// Use ?? instead of ||
const port = process.env.PORT ?? 3000; // 0 is valid, but || treats it as falsy

// vs

const port = process.env.PORT || 3000; // 0 would use default!
```

### 7. Optional Chaining (?.)

```typescript
// Safe property access
const name = pet?.owner?.name; // Returns undefined if pet or owner is null

// Instead of:
const name = pet && pet.owner && pet.owner.name;
```

### 8. Use satisfies Operator (TS 4.9+)

```typescript
// Validate shape without changing type
const config = {
  port: 3000,
  host: "localhost"
} satisfies { port: number; host: string };

// Now config is still { port: 3000; host: "localhost" }
// Not the interface type
```

### 9. Use Assertion Functions

```typescript
/**
 * Assert that value is not null
 */
function assertExists<T>(value: T | null | undefined): asserts value is T {
  if (!value) {
    throw new Error("Value does not exist");
  }
}

// Usage:
const pet = await petRepository.findById(id);
assertExists(pet); // Now TypeScript knows pet is not null
```

### 10. Extract Complex Types

```typescript
// Don't repeat complex types, extract them
type Result<T> = { success: boolean; data?: T; error?: string };
type PetResult = Result<Pet>;

// Now you can use PetResult everywhere
```

---

## Production Checklist

Before deploying to production, ensure:

- [ ] TypeScript strict mode enabled
- [ ] All error cases handled
- [ ] Input validation on all endpoints
- [ ] Rate limiting configured
- [ ] Logging strategy in place
- [ ] Security headers (Helmet.js)
- [ ] CORS properly configured
- [ ] Environment variables validation
- [ ] Error responses standardized
- [ ] Request/response types documented
- [ ] Circular dependencies checked
- [ ] Performance optimized (pagination, caching)
- [ ] Unit tests written (80%+ coverage)
- [ ] Integration tests passing
- [ ] Linting passes (ESLint)
- [ ] Code formatted (Prettier)
- [ ] No console.log in production code
- [ ] Sensitive data not logged
- [ ] API documented (Swagger/OpenAPI)
- [ ] Database migrations tested
- [ ] Rollback plan documented
- [ ] Monitoring/alerting setup
- [ ] Performance benchmarks recorded

---

## Summary: Your TypeScript Learning Path

**Phase 1: Foundations**
1. Learn basic types (string, number, boolean, etc)
2. Interfaces vs Types
3. Generics basics
4. Basic error handling

**Phase 2: Intermediate**
1. Advanced generics
2. Utility types
3. Type guards
4. Async/await patterns
5. Middleware architecture

**Phase 3: Advanced**
1. Discriminated unions
2. Conditional types
3. Design patterns
4. Dependency injection
5. Testing strategies

**Phase 4: Production**
1. Environment configuration
2. Logging & monitoring
3. Performance optimization
4. Security best practices
5. DevOps & deployment

---

## Quick Reference: Common Commands

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Run in development with hot reload
npm run dev

# Type check only (don't emit JS)
tsc --noEmit

# Format code
npx prettier --write .

# Lint code
npx eslint . --fix

# Run tests
npm test

# Build and start
npm run build && npm start
```

---

**Remember:** Write code for humans, not machines. Good TypeScript is about catching bugs early and making your code self-documenting. Always prioritize readability and maintainability over being clever!

Happy coding! 🚀
