# Food Forest – Backend

This repository contains the backend of the Food Forest application.

The backend consists of multiple Node.js services running behind an API Gateway and provides all data and authentication for the frontend application.

The software is released to end users through this repository and can be installed and run locally by following the instructions below.

## Requirements

- Node.js v18 or higher
- npm
- Git
- SQLite (used via Prisma)

## Project Architecture

The backend consists of the following services:

- API Gateway – port 3011
- Plants service – port 3020
- Events service – port 3021
- Rewards service – port 3022
- Users service – port 3023

All external communication happens through the API Gateway.

## Installation

1. Clone the repository

`git clone https://github.com/Where-s-Serj-TSTWR-Team-5/your-repository-name.git`

2. Navigate to the frontend directory

`cd frontend`

3. Install dependencies

`npm install`

## Environment Configuration

Each service may require an environment file.

At minimum, the following environment variables are required:

JWT_SECRET=supersecretkey

DATABASE_URL=file:./app.db

Environment variables can be placed in `.env` files in the service directories if applicable.

## Database Setup (Prisma)

Before starting the backend, the database must be initialized.

1. Run migrations

`npx prisma migrate dev`

2. Generate Prisma client

`npx prisma generate`

Optional: Seed the database if seed scripts are available.

## Running the Backend

Start all backend services using the configured development command:

`npm run dev`

Alternatively, services can be started individually:

API Gateway
`npm run start:gateway`

Plants service
`npm run start:plants`

Events service
`npm run start:events`

Users service
`npm run start:users`

## Smoke Test

After starting the backend services:

API Gateway starts without crashing

Requests to `/plants` and `/events` return valid responses

Authorization via JWT works correctly


## Frontend Dependency

This backend is required for the Food Forest frontend to function correctly.

By default, the frontend expects the API Gateway to run on:

http://localhost:3011

## Release Information

This backend is released through this GitHub repository and can be downloaded and run locally by end users using the instructions above.
Copyright lololol
