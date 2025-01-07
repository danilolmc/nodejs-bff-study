# Posts BFF

This project is a BFF (Backend for Front-end) study in order to deep into the fundamentals of BFF concepts.

## Technologies

- NodeJS
- Typescript
- Express
- Docker

# How to run

Make sure you have docker and docker compose installed

1. Install posts-bff-mobile dependencies with your prefered package manager

```bash
cd posts-bff-mobile & pnpm install
```
2. Install posts-service dependencies

```bash
cd posts-service & pnpm install
```

3. Run the apps

```bash
docker compose up -d
```

4. Services will be running at port:
- `posts-service`: 3000
- `posts-bff-mobile`: 3001

5. Then, test the bff
```bash
curl "http://localhost:3001/posts?limit=10"
```