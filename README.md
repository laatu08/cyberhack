# VaultGuard 🛡️

A comprehensive secure data sharing platform that enables users to safely share their financial data with trusted fintech applications through advanced tokenization, granular consent management, policy-based access control, and real-time anomaly detection.

## 🌟 Overview

VaultGuard is a microservices-based platform that provides:
- **Secure Data Tokenization**: Advanced encryption and tokenization of sensitive financial data
- **Granular Consent Management**: User-controlled, field-level permissions with purpose binding
- **Policy-Based Access Control**: Rule-based data access using Open Policy Agent (OPA)
- **Real-time Anomaly Detection**: Monitoring and alerting for suspicious data access patterns
- **Comprehensive Audit Logging**: Full traceability of all data operations
- **Purpose Binding**: Prevents fintech apps from changing data usage purpose after consent
- **Just-in-Time Access**: No pre-download of data, tokens expire automatically


## 👤 Complete User Flow

### 1. Bank Account Creation
1. User creates account in bank using email address
2. System generates dummy account details (account number, balance, transactions)
3. User can now access Vault Dashboard but has no consents initially

### 2. Fintech App Registration & Consent Creation
1. User decides to use a fintech app (Z-Pay or Budget App)
2. User registers with the same email address used for bank account
3. System sends OTP to user's email
4. User verifies OTP in fintech app
5. **Backend automatically creates consent** based on:
   - Pre-determined consent templates (stored in bank)
   - App-specific data fields and purpose
   - Policy engine validation for each field
   - Agreed duration between bank and fintech

### 3. Data Access Flow
1. Fintech requests user data from bank
2. Bank checks consent for each requested field
3. **If field is in consent**: Bank processes the request
4. **If field is not in consent**: Bank denies access to that field
5. Bank tokenizes allowed data and sends tokens to fintech
6. Fintech detokenizes tokens to get actual data

### 4. Consent Management Rules
- **One Valid Consent**: Only one active consent per user-app combination
- **Re-login Behavior**:
  - If consent is valid and not revoked: No new consent created
  - If consent expired or revoked: New consent creation required
- **Purpose Binding**: If fintech changes purpose after consent creation, no data access allowed
- **Revocation**: Once revoked, fintech cannot access any data until user re-verifies

### 5. User Vault Dashboard Features
- View all active and revoked consents
- Request consent revocation from bank
- View anomaly alerts and receive email notifications
- Monitor data access patterns

### 6. Bank Vault Dashboard Features
- View all users and their consents
- Approve/reject user revocation requests
- Monitor all anomaly alerts across users
- Access comprehensive audit logs via Kibana

## 🔐 Data Protection & Compliance

### How VaultGuard Minimizes Data Sharing
1. **App-Specific Consent Templates**: Each fintech gets only predefined fields
2. **Field-Level Policy Checks**: OPA validates each field before consent creation
3. **Tokenization**: Only tokenized data sent to fintech, never raw data
4. **Purpose Binding**: Prevents misuse by enforcing original purpose

### Preventing Data Misuse
1. **Tokenization**: Raw data never leaves the vault
2. **Time-Limited Tokens**: Automatic expiration (TTL-based)
3. **Purpose Binding**: OPA enforces original consent purpose
4. **Just-in-Time Access**: No pre-download, data accessed only when needed
5. **Consent Revocation**: Immediate access termination

### Usage & Retention Boundaries
1. **Consent Templates**: Define exact data usage scope
2. **OPA Policy Enforcement**: Real-time boundary validation
3. **Token TTL**: Automatic data expiration
4. **Consent Expiry**: Time-bound data access
5. **Purpose Binding**: Prevents scope creep

### Monitoring & Auditing
1. **Centralized Logging**: All operations logged to Elasticsearch
2. **Kibana Dashboards**: Real-time monitoring for banks
3. **Anomaly Detection**: Automated suspicious pattern detection
4. **Email Alerts**: Real-time notifications to users and banks
5. **Immutable Audit Trail**: Complete access history

### User Control & Consent
1. **Explicit Consent**: OTP-verified registration required
2. **Granular Control**: Field-level consent management
3. **Purpose Transparency**: Clear purpose binding
4. **Easy Revocation**: One-click consent withdrawal
5. **Real-time Monitoring**: Live consent status tracking

### Regulatory Compliance (GDPR, DPDP Act)
1. **Explicit Consent**: Clear, informed user consent
2. **Data Minimization**: Only necessary fields shared
3. **Purpose Limitation**: Strict purpose binding enforcement
4. **Right to Access**: Complete consent visibility
5. **Right to Erasure**: Instant consent revocation
6. **Security by Design**: End-to-end encryption and tokenization
7. **Data Anonymization**: Tokenized data prevents identification

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Git

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/laatu08/cyberhack
   cd cyberhack
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start the entire system**
   ```bash
   docker compose up --build
   ```

4. **Access the applications**
   - **Main Portal**: http://localhost:9000
   - **Vault Dashboard**: http://localhost:3000
   - **Z-Pay Fintech**: http://localhost:3001
   - **Budget App Fintech**: http://localhost:3005

## 📋 Services Overview

### Core Services

#### 🏦 Bank Service (Port 3003)
- **Purpose**: Manages bank accounts and user data
- **Technology**: TypeScript, Express, Prisma
- **Features**:
  - User account creation and management
  - Email verification and OTP generation
  - OTP-based verification system
  - Consent template management
  - Data tokenization requests to Vault
  - Integration with consent and policy services

#### 🔐 Consent Service (Port 4000)
- **Purpose**: Manages user consent and data sharing permissions
- **Technology**: TypeScript, Express, Prisma, JWT
- **Features**:
  - User authentication and authorization
  - Automatic consent creation based on templates
  - Field-level consent validation
  - Consent expiry and auto-cleanup
  - Revoke request workflow (user request → bank approval)
  - Role-based access control (user/bank)
  - Purpose binding enforcement

#### 🛡️ Tokenizer/Vault Service (Port 8963)
- **Purpose**: Secure data tokenization and encryption
- **Technology**: TypeScript, Express, Redis, AES-256 encryption
- **Features**:
  - Advanced data encryption and tokenization
  - TTL-based token expiration
  - Masked data retrieval options
  - Just-in-time token generation
  - Automatic token cleanup
  - Audit logging to Elasticsearch

#### 📋 Policy Service (Port 8181)
- **Purpose**: Rule-based access control
- **Technology**: Open Policy Agent (OPA)
- **Features**:
  - Rego-based policy definitions
  - Real-time policy evaluation
  - Application-specific data access rules
  - Field-level access control
  - Purpose validation

#### 🚨 Anomaly Service (Port 8192)
- **Purpose**: Monitors and detects suspicious data access patterns
- **Technology**: Node.js, Express, Elasticsearch
- **Features**:
  - Real-time anomaly detection
  - Configurable thresholds (default: 5 accesses in 5 minutes)
  - Email alerting system
  - Alert management dashboard
  - Continuous monitoring via cron jobs

### Fintech Applications

#### 💳 Z-Pay (Port 3001)
- **Purpose**: Payment processing application
- **Data Access**: Account number, balance (purpose: payment)
- **Technology**: React, TypeScript, Tailwind CSS
- **Features**:
  - Email registration with OTP verification
  - Secure data retrieval via tokenization
  - Real-time balance checking

#### 📊 Budget App (Port 3005)
- **Purpose**: Financial planning and budgeting
- **Data Access**: Balance, date (purpose: budgeting)
- **Technology**: React, TypeScript, Tailwind CSS
- **Features**:
  - Email registration with OTP verification
  - Financial data analysis
  - Budget tracking and insights

### Client Applications

#### 🏠 Main Portal (Port 9000)
- **Purpose**: Central landing page and navigation
- **Features**:
  - Service overview
  - Application selection
  - Bank account creation
  - System architecture explanation

#### 📱 Vault Dashboard (Port 3000)
- **Purpose**: User and bank administration interface
- **Features**:
  - **User Role**: 
    - View all consents (active/revoked)
    - Request consent revocation
    - View anomaly alerts
    - Monitor data access patterns
  - **Bank Role**: 
    - View all users and their consents
    - Approve/reject revocation requests
    - Monitor system-wide alerts
    - Access audit logs and analytics

## 🔧 Configuration

### Environment Variables

Key environment variables in `.env`:

```bash
# Database
DATABASE_URL="postgresql://user:password@host/database"

# Service Ports
VAULT_PORT=8963
BANK_SERVICE_PORT=3003
FINTECH_SERVICE_PORT=3002
FINTECH_SERVICE_PORT_2=3004  # Budget App backend
CLIENT_FINTECH_PORT=3001
CLIENT_FINTECH_PORT_2=3005   # Budget App frontend
CLIENT_VAULT_PORT=3000
CLIENT_MAIN_PORT=3006
CONSENT_SERVICE_PORT=4000
ANOMALY_SERVICE_PORT=8192
POLICY_SERVICE_PORT=8181

# External Services
REDIS_PORT=6379

# Security
JWT_SECRET="your-jwt-secret"

# Email (for anomaly alerts)
EMAIL_USER="your-email@example.com"
EMAIL_PASS="your-email-password"

# Elasticsearch (Cloud)
ELASTIC_URL="https://your-elasticsearch-url"
ELASTIC_API_KEY="your-api-key"
```

### Consent Templates

Consent templates are predefined in the bank service (`BankService/src/data/consentTemplates.ts`):

```typescript
export const consentTemplates = {
  "budget-app": {
    dataFields: ["balance", "date"],
    purpose: "budgeting",
    duration: "30d",
  },
  "z-pay-app": {
    dataFields: ["balance", "accountNo"],
    purpose: "payment", 
    duration: "50d",
  }
};
```

### Policy Configuration

Policies are defined in `PolicyEngine/data-access.rego`:

```rego
package data_access

default allow = false

# Budget app can access balance and date
allow if {
  input.appId == "budget-app"
  input.purpose == "budgeting"
  input.field == "balance"
}

allow if {
  input.appId == "budget-app"
  input.purpose == "budgeting"
  input.field == "date"
}

# Z-Pay can access balance and account number
allow if {
  input.appId == "z-pay-app"
  input.purpose == "payment"
  input.field == "balance"
}

allow if {
  input.appId == "z-pay-app"
  input.purpose == "payment"
  input.field == "accountNo"
}
```

## 🔄 Data Flow

### 1. User Registration & Consent Creation
```mermaid
sequenceDiagram
    participant U as User
    participant F as Fintech App
    participant B as Bank Service
    participant C as Consent Service
    participant P as Policy Service

    U->>F: 1. Register with email
    F->>B: 2. Initiate registration
    B->>B: 3. Find user in DB
    B->>U: 4. Send OTP via email
    U->>F: 5. Enter OTP
    F->>B: 6. Verify OTP + app purpose
    B->>B: 7. Match OTP & get consent template
    B->>P: 8. Check policy for each field
    P->>B: 9. Return allowed fields
    B->>C: 10. Create consent for allowed fields
    C->>B: 11. Consent created
    B->>F: 12. Registration successful
```

### 2. Data Access & Tokenization
```mermaid
sequenceDiagram
    participant F as Fintech App
    participant B as Bank Service
    participant C as Consent Service
    participant V as Vault Service

    F->>B: 1. Request user data (email + fields)
    B->>B: 2. Find user & account details
    loop For each requested field
        B->>C: 3. Check consent for field
        C->>B: 4. Consent validation result
    end
    B->>V: 5. Tokenize allowed fields
    V->>B: 6. Return tokens
    B->>F: 7. Send tokenized data
    F->>V: 8. Detokenize tokens
    V->>F: 9. Return actual/masked data
```

### 3. Consent Revocation Flow
```mermaid
sequenceDiagram
    participant U as User
    participant VD as Vault Dashboard
    participant C as Consent Service
    participant BD as Bank Dashboard
    participant B as Bank Admin

    U->>VD: 1. Request consent revocation
    VD->>C: 2. Create revoke request
    C->>C: 3. Store request (status: pending)
    BD->>C: 4. Bank views pending requests
    B->>BD: 5. Approve/Reject request
    BD->>C: 6. Update request status
    alt If Approved
        C->>C: 7. Mark consent as revoked
    end
```

### 4. Anomaly Detection & Alerting
```mermaid
sequenceDiagram
    participant V as Vault Service
    participant E as Elasticsearch
    participant A as Anomaly Service
    participant U as User
    participant B as Bank

    V->>E: 1. Log tokenization event
    loop Every 10 seconds
        A->>E: 2. Query for anomalies (>5 accesses in 5min)
        E->>A: 3. Return suspicious patterns
        alt If anomaly detected
            A->>U: 4. Send email alert to user
            A->>B: 5. Alert visible in bank dashboard
            A->>E: 6. Store alert record
        end
    end
```

## 🛠️ Development

### Local Development Setup

1. **Install dependencies for each service**
   ```bash
   # For each service directory
   npm install
   ```

2. **Set up the database**
   ```bash
   # In ConsentService directory
   npx prisma migrate dev
   npx prisma generate
   ```

3. **Start services individually**
   ```bash
   # Consent Service
   cd ConsentService && npm run dev

   # Bank Service
   cd BankService && npm run dev

   # Vault Service
   cd vault && npm run dev

   # And so on...
   ```

### Building for Production

```bash
# Build all services
docker-compose build

# Or build individual services
docker build -t vaultguard/consent-service ./ConsentService
```

### Database Migrations

```bash
# Navigate to service directory
cd ConsentService  # or BankService

# Create new migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate
```

## 🔍 Monitoring & Logging

### Elasticsearch Integration

All services log to Elasticsearch for comprehensive monitoring:

- **Consent Logs** (`vaultguard-consent-logs`): User authentication, consent operations, revocations
- **Token Logs** (`vaultguard-token-logs`): Tokenization, detokenization, access patterns
- **Alert Logs**: Detected anomalies and email notifications

### Kibana Dashboards

Access pre-built dashboards for:
- Real-time log analysis
- Consent operation monitoring
- Token access patterns
- Alert visualization
- Performance monitoring

**Dashboard Links** (available in Bank Dashboard):
- [Consent Logs Dashboard](https://my-elasticsearch-project-ffe17c.kb.ap-southeast-1.aws.elastic.cloud/app/dashboards#/view/e41530a3-8857-48c8-9ee2-0b86fc2debdf)
- [Tokenize Logs Dashboard](https://my-elasticsearch-project-ffe17c.kb.ap-southeast-1.aws.elastic.cloud/app/dashboards#/view/d9b46bb8-f87e-4a87-875c-6727dfe34a7e)

### Anomaly Detection

The system automatically monitors for:
- **High-frequency access**: >5 token requests in 5 minutes (configurable)
- **Field-specific anomalies**: Unusual access patterns per data field
- **App-specific monitoring**: Per-application access tracking
- **Real-time alerting**: Immediate email notifications

## 🔒 Security Features

### Data Protection
- **AES-256 Encryption**: All sensitive data encrypted at rest
- **Token-based Access**: No direct data exposure
- **TTL Expiration**: Automatic token expiration
- **Masked Responses**: Sensitive data masking options
- **Purpose Binding**: Prevents unauthorized purpose changes
- **Just-in-Time Access**: No data pre-download or caching

### Access Control
- **JWT Authentication**: Secure user sessions
- **Role-based Authorization**: User and bank role separation
- **Policy-based Decisions**: OPA-driven access control
- **Multi-layer Consent Verification**: Template → Policy → Consent checks
- **Field-level Granularity**: Individual field access control

### Audit & Compliance
- **Complete Audit Trail**: All operations logged
- **Immutable Logs**: Elasticsearch-based logging
- **Real-time Monitoring**: Continuous anomaly detection
- **GDPR/DPDP Compliance**: Right to access, erasure, and data minimization
- **Purpose Limitation**: Strict purpose binding enforcement

## 🧪 Testing

### Running Tests

```bash
# Run tests for specific service
cd ConsentService && npm test

# Run integration tests
docker-compose -f docker-compose.test.yml up
```

### Test Data

Use the provided seed scripts:

```bash
# Seed consent service database
cd ConsentService && npx prisma db seed

# Create test user account
# Use email: partha@example.com (pre-seeded)
```

## 📊 API Documentation

### Consent Service API

#### Authentication
```bash
POST /auth/login
POST /auth/register
```

#### Consent Management
```bash
GET /api/consent/user          # Get user consents
POST /api/consent              # Create consent
POST /api/revoke-request/:id   # Request revoke
POST /api/bank/revoke-status   # Bank approve/reject revoke
```

### Vault Service API

#### Tokenization
```bash
POST /api/v1/tokenize          # Create tokens
POST /api/v1/detokenize        # Retrieve data
```

### Bank Service API

#### Account Management
```bash
POST /bank/initiate-registration  # Start registration
POST /bank/verify-otp            # Verify OTP
POST /bank/data                  # Get user data
```

### Anomaly Service API

#### Alert Management
```bash
GET /get-alerts                  # Get user alerts
GET /get-all-alerts             # Get all users with alerts (bank)
GET /get-alerts-user/:userId    # Get specific user alerts (bank)
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Open Policy Agent** for policy engine
- **Elasticsearch** for logging and monitoring
- **Redis** for caching and session management
- **Prisma** for database management
- **React** and **Tailwind CSS** for frontend development
- **Docker** for containerization
- **PostgreSQL** for reliable data storage

**VaultGuard** - Securing financial data sharing through advanced tokenization, granular consent management, and purpose-bound access control.