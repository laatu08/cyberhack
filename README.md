# VaultGuard 🛡️

A comprehensive secure data sharing platform that enables users to safely share their financial data with trusted fintech applications through advanced tokenization, consent management, and anomaly detection.

## 🌟 Overview

VaultGuard is a microservices-based platform that provides:
- **Secure Data Tokenization**: Advanced encryption and tokenization of sensitive financial data
- **Granular Consent Management**: User-controlled permissions for data sharing
- **Policy-Based Access Control**: Rule-based data access using Open Policy Agent (OPA)
- **Real-time Anomaly Detection**: Monitoring and alerting for suspicious data access patterns
- **Comprehensive Audit Logging**: Full traceability of all data operations

## 🏗️ Architecture

The system follows a microservices architecture with the following components:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client Apps   │    │   Vault Client  │    │   Bank Portal   │
│  (Fintech UIs)  │    │   (Dashboard)   │    │   (Admin UI)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Fintech Service│    │ Consent Service │    │  Bank Service   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Tokenizer/Vault │    │ Policy Service  │    │ Anomaly Service │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Redis       │    │  Elasticsearch  │    │   PostgreSQL    │
│   (Caching)     │    │   (Logging)     │    │  (Database)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Git

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vaultguard
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start the entire system**
   ```bash
   docker-compose up -d
   ```

4. **Access the applications**
   - **Main Portal**: http://localhost:3006
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
  - Account details and transaction history
  - Integration with consent and policy services
  - OTP-based verification system

#### 🔐 Consent Service (Port 4000)
- **Purpose**: Manages user consent and data sharing permissions
- **Technology**: TypeScript, Express, Prisma, JWT
- **Features**:
  - User authentication and authorization
  - Consent creation and management
  - Revoke request handling
  - Role-based access control (user/bank)

#### 🛡️ Tokenizer/Vault Service (Port 8963)
- **Purpose**: Secure data tokenization and encryption
- **Technology**: TypeScript, Express, Redis, AES-256 encryption
- **Features**:
  - Advanced data encryption and tokenization
  - TTL-based token expiration
  - Masked data retrieval
  - Audit logging to Elasticsearch

#### 📋 Policy Service (Port 8181)
- **Purpose**: Rule-based access control
- **Technology**: Open Policy Agent (OPA)
- **Features**:
  - Rego-based policy definitions
  - Real-time policy evaluation
  - Application-specific data access rules

#### 🚨 Anomaly Service (Port 8192)
- **Purpose**: Monitors and detects suspicious data access patterns
- **Technology**: Node.js, Express, Elasticsearch
- **Features**:
  - Real-time anomaly detection
  - Email alerting system
  - Configurable thresholds
  - Alert management dashboard

### Fintech Applications

#### 💳 Z-Pay (Port 3001)
- **Purpose**: Payment processing application
- **Data Access**: Account number, balance
- **Technology**: React, TypeScript, Tailwind CSS

#### 📊 Budget App (Port 3005)
- **Purpose**: Financial planning and budgeting
- **Data Access**: Balance, transaction dates
- **Technology**: React, TypeScript, Tailwind CSS

### Client Applications

#### 🏠 Main Portal (Port 3006)
- **Purpose**: Central landing page and navigation
- **Features**:
  - Service overview
  - Application selection
  - Bank account creation

#### 📱 Vault Dashboard (Port 3000)
- **Purpose**: User and bank administration interface
- **Features**:
  - User: Consent management, alert viewing
  - Bank: User oversight, revoke request processing

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
FINTECH_SERVICE_PORT_2=3004
CLIENT_FINTECH_PORT=3001
CLIENT_FINTECH_PORT_2=3005
CLIENT_VAULT_PORT=3000
CLIENT_MAIN_PORT=3006
CONSENT_SERVICE_PORT=4000
ANOMALY_SERVICE_PORT=8192
POLICY_SERVICE_PORT=8181

# External Services
REDIS_PORT=6379
ELASTICSEARCH_PORT=9200
KIBANA_PORT=5601

# Security
JWT_SECRET="your-jwt-secret"

# Email (for anomaly alerts)
EMAIL_USER="your-email@example.com"
EMAIL_PASS="your-email-password"

# Elasticsearch (Cloud)
ELASTIC_URL="https://your-elasticsearch-url"
ELASTIC_API_KEY="your-api-key"
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

# Z-Pay can access balance and account number
allow if {
  input.appId == "z-pay-app"
  input.purpose == "payment"
  input.field == "accountNo"
}
```

## 🔄 Data Flow

### 1. User Registration & Consent
```mermaid
sequenceDiagram
    participant U as User
    participant F as Fintech App
    participant B as Bank Service
    participant C as Consent Service
    participant P as Policy Service

    U->>F: Register with email
    F->>B: Initiate registration
    B->>U: Send OTP via email
    U->>F: Enter OTP
    F->>B: Verify OTP + purpose
    B->>P: Check policy for app/purpose
    P->>B: Policy decision
    B->>C: Create consent record
    C->>B: Consent created
    B->>F: Registration successful
```

### 2. Data Access & Tokenization
```mermaid
sequenceDiagram
    participant F as Fintech App
    participant B as Bank Service
    participant C as Consent Service
    participant V as Vault Service
    participant P as Policy Service

    F->>B: Request user data
    B->>C: Check consent
    C->>B: Consent valid
    B->>P: Verify policy
    P->>B: Access allowed
    B->>V: Tokenize data
    V->>B: Return tokens
    B->>F: Send tokenized data
    F->>V: Detokenize when needed
    V->>F: Return actual/masked data
```

### 3. Anomaly Detection
```mermaid
sequenceDiagram
    participant V as Vault Service
    participant E as Elasticsearch
    participant A as Anomaly Service
    participant U as User

    V->>E: Log access event
    A->>E: Query for anomalies
    E->>A: Return suspicious patterns
    A->>U: Send email alert
    A->>E: Store alert record
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

- **Consent Logs**: User authentication, consent operations
- **Token Logs**: Tokenization, detokenization, access patterns
- **Anomaly Logs**: Detected anomalies and alerts

### Kibana Dashboards

Access Kibana at `http://localhost:5601` for:
- Real-time log analysis
- Custom dashboards
- Alert visualization
- Performance monitoring

### Anomaly Detection

The system monitors for:
- **High-frequency access**: Multiple token requests in short time
- **Unusual patterns**: Access outside normal hours
- **Suspicious applications**: Unknown or unauthorized apps

## 🔒 Security Features

### Data Protection
- **AES-256 Encryption**: All sensitive data encrypted at rest
- **Token-based Access**: No direct data exposure
- **TTL Expiration**: Automatic token expiration
- **Masked Responses**: Sensitive data masking options

### Access Control
- **JWT Authentication**: Secure user sessions
- **Role-based Authorization**: User and bank role separation
- **Policy-based Decisions**: OPA-driven access control
- **Consent Verification**: Multi-layer permission checking

### Audit & Compliance
- **Complete Audit Trail**: All operations logged
- **Immutable Logs**: Elasticsearch-based logging
- **Real-time Monitoring**: Continuous anomaly detection
- **Compliance Reports**: Exportable audit data

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

## 🚨 Troubleshooting

### Common Issues

1. **Service Connection Errors**
   ```bash
   # Check service health
   docker-compose ps
   
   # View service logs
   docker-compose logs [service-name]
   ```

2. **Database Connection Issues**
   ```bash
   # Reset database
   docker-compose down -v
   docker-compose up -d postgres
   ```

3. **Redis Connection Problems**
   ```bash
   # Restart Redis
   docker-compose restart redis
   ```

4. **Elasticsearch Issues**
   ```bash
   # Check Elasticsearch health
   curl http://localhost:9200/_cluster/health
   ```

### Debug Mode

Enable debug logging:
```bash
# Set environment variable
NODE_ENV=development
DEBUG=*
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow ESLint configuration
- Write comprehensive tests
- Document API changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Open Policy Agent** for policy engine
- **Elasticsearch** for logging and monitoring
- **Redis** for caching and session management
- **Prisma** for database management
- **React** and **Tailwind CSS** for frontend development

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation wiki

---

**VaultGuard** - Securing financial data sharing through advanced tokenization and consent management.