---
title: Hospital Service
---

# Hospital Service

## Overview

A hospital management service that exposes REST APIs for managing doctors, patients, and appointments. The service integrates with a PostgreSQL database for persistence, validates appointment availability, and sends notification emails when appointments are confirmed. This sample demonstrates the fundamentals of building a data-backed HTTP service with WSO2 Integrator.

## Architecture Diagram

```mermaid
flowchart LR
    subgraph HospitalService["Hospital Service"]
        direction TB
        Doctors["Doctor Management<br/>GET /doctors<br/>POST /doctors"]
        Patients["Patient Management<br/>GET /patients<br/>POST /patients"]
        Appointments["Appointment Scheduling<br/>POST /appointments<br/>GET /appointments"]
    end

    DB[(PostgreSQL)]
    SMTP[SMTP<br/>(email)]

    Doctors ----> DB
    Patients ----> DB
    Appointments ----> DB
    Appointments ----> SMTP
```

## Features Demonstrated

- **CRUD REST APIs** with proper HTTP methods and status codes
- **PostgreSQL database integration** with parameterized queries and connection pooling
- **Input validation** with Ballerina's type system (constraint annotations)
- **Relational data modeling** with foreign keys between doctors, patients, and appointments
- **Email notifications** sent asynchronously when appointments are confirmed
- **Error handling** with structured error responses
- **OpenAPI specification** auto-generated from the service definition
- **Health check endpoint** for deployment readiness

## Prerequisites

- WSO2 Integrator VS Code extension installed
- Docker (for PostgreSQL) or a local PostgreSQL instance
- SMTP credentials (optional -- for email notifications)

## Quick Start

```bash
git clone https://github.com/wso2/integrator-samples.git
cd integrator-samples/hospital-service
cp Config-example.toml Config.toml
# Edit Config.toml with your database and SMTP settings

# Start PostgreSQL with Docker
docker run -d --name hospital-db -p 5432:5432 \
  -e POSTGRES_DB=hospital -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=admin \
  postgres:16

# Start the service
bal run
```

The service starts on port 8090. Test the endpoints:

```bash
# Add a doctor
curl -X POST http://localhost:8090/doctors \
  -H "Content-Type: application/json" \
  -d '{"name": "Dr. Jane Smith", "specialty": "Cardiology", "phone": "555-0101", "email": "jane.smith@hospital.com"}'

# List all doctors
curl http://localhost:8090/doctors

# Add a patient
curl -X POST http://localhost:8090/patients \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "dateOfBirth": "1985-03-15", "phone": "555-0202", "email": "john.doe@example.com"}'

# Schedule an appointment
curl -X POST http://localhost:8090/appointments \
  -H "Content-Type: application/json" \
  -d '{"doctorId": 1, "patientId": 1, "date": "2024-03-20", "time": "10:00", "reason": "Annual checkup"}'

# List appointments for a doctor
curl "http://localhost:8090/appointments?doctorId=1"
```

## Code Walkthrough

### Project Structure

```
hospital-service/
├── Ballerina.toml
├── Config.toml
├── Config-example.toml
├── main.bal               # HTTP service with all endpoints
├── types.bal              # Record types (Doctor, Patient, Appointment)
├── repository.bal         # Database access layer
├── validators.bal         # Business rule validation
├── notifications.bal      # Email notification logic
├── resources/
│   └── init.sql           # Database schema creation script
└── tests/
    └── hospital_test.bal  # API integration tests
```

### Data Types (`types.bal`)

```ballerina
// Doctor record with constraint validation.
type Doctor record {|
    int id?;
    string name;
    string specialty;
    string phone;
    string email;
|};

// Patient record.
type Patient record {|
    int id?;
    string name;
    string dateOfBirth;   // YYYY-MM-DD
    string phone;
    string email;
|};

// Appointment record with foreign keys.
type Appointment record {|
    int id?;
    int doctorId;
    int patientId;
    string date;          // YYYY-MM-DD
    string time;          // HH:MM
    string reason;
    string status;        // "scheduled" | "confirmed" | "cancelled" | "completed"
|};

// Error response payload.
type ErrorResponse record {|
    string message;
    string code;
|};
```

### Service Endpoints (`main.bal`)

```ballerina
import ballerina/http;

service /api on new http:Listener(8090) {

    // --- Doctors ---
    resource function get doctors() returns Doctor[]|error {
        return getAllDoctors();
    }

    resource function get doctors/[int id]() returns Doctor|http:NotFound {
        Doctor? doctor = check getDoctorById(id);
        if doctor is () { return http:NOT_FOUND; }
        return doctor;
    }

    resource function post doctors(Doctor doctor) returns Doctor|http:BadRequest|error {
        return check createDoctor(doctor);
    }

    // --- Patients ---
    resource function post patients(Patient patient) returns Patient|error {
        return check createPatient(patient);
    }

    // --- Appointments ---
    resource function post appointments(Appointment apt) returns Appointment|http:Conflict|error {
        // Check for scheduling conflicts.
        boolean available = check isDoctorAvailable(apt.doctorId, apt.date, apt.time);
        if !available {
            return <http:Conflict>{body: {message: "Doctor is not available at the requested time"}};
        }
        Appointment created = check createAppointment(apt);
        // Send confirmation email asynchronously.
        _ = start sendAppointmentConfirmation(created);
        return created;
    }

    resource function get appointments(int? doctorId, int? patientId) returns Appointment[]|error {
        return getAppointments(doctorId, patientId);
    }
}
```

### Database Layer (`repository.bal`)

```ballerina
import ballerinax/postgresql;

configurable string dbHost = "localhost";
configurable int dbPort = 5432;
configurable string dbName = "hospital";
configurable string dbUser = "admin";
configurable string dbPassword = "admin";

final postgresql:Client db = check new (dbHost, dbUser, dbPassword, dbName, dbPort);

function createDoctor(Doctor doctor) returns Doctor|error {
    postgresql:ExecutionResult result = check db->execute(
        `INSERT INTO doctors (name, specialty, phone, email) VALUES (${doctor.name}, ${doctor.specialty}, ${doctor.phone}, ${doctor.email})`
    );
    int id = <int>result.lastInsertId;
    return {...doctor, id};
}

function isDoctorAvailable(int doctorId, string date, string time) returns boolean|error {
    Appointment? existing = check db->queryRow(
        `SELECT * FROM appointments WHERE doctor_id = ${doctorId} AND date = ${date} AND time = ${time} AND status != 'cancelled'`
    );
    return existing is ();
}
```

### Testing

```bash
bal test
```

The test suite starts a test database, seeds it with sample data, and runs full API integration tests against all endpoints.

## GitHub

[wso2/integrator-samples/hospital-service](https://github.com/wso2/integrator-samples/tree/main/hospital-service)
