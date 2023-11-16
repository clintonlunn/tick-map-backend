# Tick Map Backend

This is the backend service that contains the REST service for the [tick-map-client](https://github.com/clintonlunn/tick-map-client/)

## Prerequisites

- Node.js
- Docker
- Docker Compose

## Installation

1. Clone the repository:
    ```bash
    git clone git@github.com:clintonlunn/tick-map-backend.git
    ```

2. Navigate to the project directory:
    ```bash
    cd tick-map-backend
    ```
    Replace `repository` with the name of your repository.

3. Install the dependencies:
    ```bash
    yarn
    ```

## Running the Service

To start the backend service:
    ```bash
    yarn start
    ```

To spin up the database, use Docker Compose:

```bash
docker-compose up
```

## Docker-compose.yml

```bash
version: "3.8"
services:
  db:
    container_name: postgres_container
    image: postgres
    restart: always
    environment:
      POSTGRES_USER: root
      POSTGRES_PASSWORD: root
      POSTGRES_DB: tick_db
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  pgadmin:
    container_name: pgadmin4_container
    image: dpage/pgadmin4
    restart: always
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@admin.com
      PGADMIN_DEFAULT_PASSWORD: root
    ports:
      - "5050:80"
    volumes:
      - pgadmindata:/var/lib/pgadmin

volumes:
  pgdata:
  pgadmindata:
```
