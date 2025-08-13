# Magic Transporters API

TypeScript + Express + MongoDB (Mongoose) service for managing **Magic Movers**, **Magic Items**, and their **missions**.

* Add/list items and movers
* **Load** items on movers (with weight-limit validation)
* **Start/End** missions (with audit logs)
* **Leaderboard** of movers by completed missions
* Swagger docs

## Tech Stack

* **Runtime:** Node 20, Express 4
* **DB:** MongoDB 7/8, Mongoose 8
* **Lang:** TypeScript 5
* **DI:** tsyringe (`reflect-metadata`)
* **Validation:** zod
* **Docs:** swagger-jsdoc + swagger-ui-express
* **Dev tooling:** ts-node-dev

---

## Quick Start

### Option 2: Local (Ubuntu)

1. **MongoDB**

   * Native: ensure `mongod` is running on `mongodb://localhost:27017`

2. **App**

```bash
cp .env.example .env            # adjust MONGO_URI if needed
npm install
npm run dev                     # starts express with ts-node-dev
# Docs  http://localhost:3000/docs
```

---

## Configuration

`.env`

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/magic_transporters
NODE_ENV=development
```

> If MongoDB auth is enabled:
> `MONGO_URI=mongodb://user:pass@localhost:27017/magic_transporters?authSource=admin`

---

## Scripts

```bash
npm run dev      # hot-reload dev server
npm run build    # compile TS to dist/
npm start        # run compiled app
```

---

## API Endpoints

Base path: `/api`

* **Items**

  * `POST /items`
    Body: `{ "name": string, "weight": number }`
  * `GET /items`

* **Movers**

  * `POST /movers`
    Body: `{ "weight_limit": number }`
  * `GET /movers`
  * `POST /movers/:id/items`
    Body: `{ "item_ids": string[] }` (additive; validates weight)
  * `POST /movers/:id/start-mission`
  * `POST /movers/:id/end-mission` (unloads & logs completion)

* **Leaderboard**

  * `GET /movers/leaderboard`
    Returns top movers by **completed** missions.

* **Docs**

  * Swagger UI: `GET /docs`

### Curl Examples

```bash
# Create items
curl -X POST localhost:3000/api/items -H 'content-type: application/json' \
  -d '{"name":"Crystal","weight":2}'

# Create mover
curl -X POST localhost:3000/api/movers -H 'content-type: application/json' \
  -d '{"weight_limit":10}'

# Load items (additive)
curl -X POST localhost:3000/api/movers/<MOVER_ID>/items -H 'content-type: application/json' \
  -d '{"item_ids":["<ITEM_ID_1>","<ITEM_ID_2>"]}'

# Start / end mission
curl -X POST localhost:3000/api/movers/<MOVER_ID>/start-mission
curl -X POST localhost:3000/api/movers/<MOVER_ID>/end-mission

# Leaderboard
curl localhost:3000/api/movers/leaderboard
```

---

## Data Model (Mongoose)

* **Item**

  ```ts
  { name: string, weight: number, timestamps: true }
  ```

* **Mover**

  ```ts
  {
    name: string,
    weight_limit: number,
    state: 'resting' | 'loading' | 'on-mission',
    loadedItems: ObjectId[] (ref: 'Item'),
    timestamps: true
  }
  ```

* **ActivityLog**

  ```ts
  {
    mover: ObjectId (ref: 'Mover'),
    type: 'loading' | 'start-mission' | 'end-mission',
    itemsSnapshot: ObjectId[] (ref: 'Item'),
    createdAt: Date
  }
  ```

### Relations

`Mover.loadedItems` is an **array of ObjectId references** to `Item`.
Use `.populate('loadedItems')` to fetch full item docs.

---

## Core Behaviors

* **Load**

  * De-duplicates incoming `item_ids`, merges with existing `loadedItems`
  * Computes total weight (from DB) and checks against `weight_limit`
  * Sets state to `loading`, logs `"loading"`

* **Start mission**

  * Guard against double-start
  * Sets state to `on-mission`, logs `"start-mission"`

* **End mission**

  * Logs `"end-mission"`, clears `loadedItems`, sets state to `resting`

* **Leaderboard**

  * Aggregation counts **`end-mission`** logs per mover, sorts desc, `$lookup` mover info

---

## Project Structure

```
src/
  config/        # env, db connect
  controllers/   # HTTP handlers (thin)
  di/            # Dependency Injection
  models/        # Mongoose schemas/models
  routes/        # Express routes (+ Swagger JSDoc)
  services/      # Business logic (load/start/end/leaderboard)
  utils/         # Swagger init
```

* **DI (tsyringe)**: services/controllers decorated with `@injectable()` where needed.
  Ensure `import 'reflect-metadata'` is loaded once (entry point) and `tsconfig.json` has:

  ```json
  { "experimentalDecorators": true, "emitDecoratorMetadata": true }
  ```

* **Validation (zod)**: controllers parse/validate request bodies (400 on invalid).

* **Docs**: OpenAPI annotations live in `src/routes/api.ts`.

---

## Troubleshooting

* **CommonJS vs ESM / `verbatimModuleSyntax` errors**
  Keep `"module": "CommonJS"` and **do not** enable `verbatimModuleSyntax` in `tsconfig.json`.
  Don’t set `"type": "module"` in `package.json` unless you switch to ESM fully.

* **`TypeInfo not known` (tsyringe)**
  Load `reflect-metadata` **before** importing decorated classes; enable decorators/metadata in `tsconfig.json`; mark classes with `@injectable()`; use arrow handlers or `.bind(this)` for controllers.

* **Mongo auth / connection**
  If you enabled Mongo authorization, add `?authSource=admin` and credentials to `MONGO_URI`.
