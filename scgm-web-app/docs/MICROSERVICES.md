# Microservices Architecture

## Overview

The UWM system now includes authentication and authorization microservices built with Java 21 and Spring Boot.

## Services

### 1. Authentication Service (Port 8081)
- **Technology**: Java 21, Spring Boot, PostgreSQL, Flyway
- **Database**: `auth_db`
- **Purpose**: JWT-based authentication with access and refresh tokens

#### Endpoints
- `POST /auth/signin` - User sign in
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - User logout

#### JWT Configuration
- Access Token: 15 minutes expiration
- Refresh Token: 7 days expiration
- Subject: User email only

### 2. Accounts Service (Port 8082)
- **Technology**: Java 21, Spring Boot, PostgreSQL, RabbitMQ, Flyway
- **Database**: `accounts_db`
- **Purpose**: CRUD operations for user accounts

#### Endpoints
- `POST /accounts` - Create account
- `GET /accounts` - Get all accounts
- `GET /accounts/{id}` - Get account by ID
- `PUT /accounts/{id}` - Update account
- `DELETE /accounts/{id}` - Delete account

#### Account Properties
- `name`: String
- `email`: String (unique)
- `password`: String (encrypted)
- `profile`: ADMIN | SUPERVISOR | OPERATOR

#### Events
Publishes RabbitMQ events for all CRUD operations:
- Exchange: `accounts.exchange`
- Routing Key: `accounts.events`
- Event Types: CREATED, UPDATED, DELETED

## Infrastructure

### PostgreSQL
- **Version**: Latest (16)
- **Port**: 5432
- **Databases**: `auth_db`, `accounts_db`
- **User**: `uwm_user`
- **Password**: `uwm_password`

### RabbitMQ
- **Version**: Latest with management
- **Port**: 5672 (AMQP), 15672 (Management UI)
- **User**: `guest`
- **Password**: `guest`

## Quick Start

### Option 1: All Services
```bash
./start.sh
```

### Option 2: Separate Terminals
```bash
./start-services.sh
```

### Option 3: Manual
```bash
# Start infrastructure
docker compose up -d

# Start services individually
cd auth-service && mvn spring-boot:run
cd accounts-service && mvn spring-boot:run
```

## Frontend Integration

### Authentication Components
- **SignInForm**: Modal dialog for user authentication
- **CreateUserForm**: Role-based user creation with validation
- **UsersPage**: User management with CRUD operations
- **AuthContext**: React context for authentication state

### Role-Based Access Control
- **ADMIN**: Can create/delete SUPERVISOR users
- **SUPERVISOR**: Can create/delete OPERATOR users  
- **OPERATOR**: Read-only access to system

### Navigation
- Dynamic navbar based on user role
- Users menu only visible to ADMIN/SUPERVISOR
- Sign in/out functionality integrated

## Security

- Passwords are encrypted using BCrypt
- JWT tokens use HMAC-SHA256 signing
- Sessions are stored in database with expiration
- CORS enabled for frontend integration
- Role-based UI restrictions

## Database Migrations

Both services use Flyway for database migrations:
- Auth Service: Creates `sessions` table
- Accounts Service: Creates `accounts` table with profile enum

## Initial Setup

After starting services, create initial admin user:
```bash
./create-admin.sh
```

Default admin credentials:
- Email: admin@uwm.com
- Password: admin123