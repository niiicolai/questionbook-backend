
## Install
1. Install dependencies
```bash
npm install
```
2. Create and set up .env file
```bash
cp .env.example .env
```
3. Run migrations
```bash
npm run db:migrate
```
4. Seed database
```bash
npm run db:seed
```

## Run
```bash
npm start
```

## Test
```bash
npm test
```

## Docker
1. Build image
```bash
docker build -t backend:v1.0 .
```

2. Run Docker container
```bash
docker run -p 3001:3001 backend:v1.0
```

## Docker Compose
1. Build image
```bash
docker build -t backend:v1.0 .
```

2. Create and set up .env file
```bash
cp .env.example .env
```

3. Create and set up .env.db file
```bash
cp .env.db.example .env.db
```

4. Run Docker container
```bash
docker compose up -d
```
