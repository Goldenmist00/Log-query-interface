# Log Ingestion and Querying System

A full-stack application for ingesting, storing, and querying log data with real-time updates. Built with Node.js backend and React frontend, featuring a clean architecture and comprehensive filtering capabilities.

## Overview

This system provides a complete solution for log management with the following capabilities:

- **Log Ingestion**: REST API endpoint for receiving and storing log entries
- **Advanced Querying**: Filter logs by level, message content, resource ID, timestamp ranges, and trace information
- **Real-time Updates**: WebSocket integration for live log streaming
- **Structured Storage**: JSON file-based persistence with efficient querying
- **Modern UI**: React-based interface with responsive design and dark mode support

## Architecture

The application follows a clean, layered architecture:

**Backend (Node.js + Express)**
- Controller Layer: HTTP request handling and response formatting
- Service Layer: Business logic, validation, and data processing
- Database Layer: File-based persistence and data access
- WebSocket Layer: Real-time communication with clients

**Frontend (React + TypeScript)**
- Component-based architecture with reusable UI elements
- Custom hooks for data fetching and state management
- Real-time WebSocket integration
- Responsive design with Tailwind CSS

## Technology Stack

### Backend
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **WebSocket**: ws library
- **Testing**: Jest
- **Storage**: JSON file system

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Goldenmist00/Log-query-interface.git
cd Log-query-interface
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

### Configuration

#### Backend Configuration

Create a `.env` file in the backend directory (optional):
```bash
cp .env.example .env
```

Available environment variables:
- `PORT`: Server port (default: 3001)
- `CORS_ORIGIN`: Allowed CORS origin (default: http://localhost:5173)
- `DATA_FILE`: Path to log storage file (default: backend/data/logs.json)

#### Frontend Configuration

Create a `.env` file in the frontend directory (optional):
```bash
cp env.example .env
```

Available environment variables:
- `VITE_API_URL`: Backend API URL (default: http://localhost:3001)

### Running the Application

1. Start the backend server:
```bash
cd backend
npm start
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

3. Access the application at `http://localhost:5173`

## API Documentation

### Log Ingestion

**POST** `/logs`

Ingest a new log entry.

**Request Body:**
```json
{
  "level": "error|warn|info|debug",
  "message": "Log message content",
  "resourceId": "resource-identifier",
  "timestamp": "2024-01-15T14:32:00.000Z",
  "traceId": "trace-identifier",
  "spanId": "span-identifier",
  "commit": "commit-hash",
  "metadata": {}
}
```

**Response:**
- `201 Created`: Log successfully ingested
- `400 Bad Request`: Invalid log data
- `500 Internal Server Error`: Server error

### Log Querying

**GET** `/logs`

Query logs with optional filters.

**Query Parameters:**
- `level`: Filter by log level (error, warn, info, debug)
- `message`: Filter by message content (partial match)
- `resourceId`: Filter by resource identifier
- `timestamp_start`: Filter logs after this timestamp (ISO 8601)
- `timestamp_end`: Filter logs before this timestamp (ISO 8601)
- `traceId`: Filter by trace identifier
- `spanId`: Filter by span identifier
- `commit`: Filter by commit hash

**Response:**
```json
[
  {
    "level": "error",
    "message": "Database connection failed",
    "resourceId": "server-1234",
    "timestamp": "2024-01-15T14:32:00.000Z",
    "traceId": "abc-xyz-001",
    "spanId": "span-101",
    "commit": "5e5342f1",
    "metadata": {
      "parentResourceId": "server-5678"
    }
  }
]
```

## Features

### Log Management
- Structured log ingestion with validation
- Comprehensive filtering and search capabilities
- Chronological sorting (newest first)
- Real-time log streaming via WebSocket

### User Interface
- Clean, modern design with dark mode support
- Responsive layout for desktop and mobile
- Advanced filter controls with date/time pickers
- Color-coded log levels for easy identification
- Loading states and error handling

### Development Features
- Comprehensive unit test coverage
- Environment-based configuration
- Structured logging with custom logger
- CORS support for cross-origin requests
- Hot reload for development

## Testing

Run the backend test suite:
```bash
cd backend
npm test
```

The test suite covers:
- Log validation logic
- Query filtering functionality
- Error handling scenarios
- Service layer integration

## Development

### Backend Development

The backend follows a strict separation of concerns:

- **Controllers**: Handle HTTP requests and responses only
- **Services**: Contain all business logic and validation
- **Database Services**: Manage data persistence and retrieval
- **Utilities**: Provide logging and configuration support

### Frontend Development

The frontend uses modern React patterns:

- **Custom Hooks**: Encapsulate data fetching and state logic
- **Component Composition**: Reusable UI components with clear interfaces
- **TypeScript**: Full type safety throughout the application
- **Performance Optimization**: Efficient re-rendering and data updates

### Code Quality

The project maintains high code quality standards:

- JSDoc documentation for all public functions
- Consistent error handling patterns
- No hardcoded values (configuration-driven)
- Structured logging (no console.log in production)
- TypeScript strict mode enabled

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration management
│   │   ├── controllers/     # HTTP request handlers
│   │   ├── db/             # Database services
│   │   ├── routes/         # API route definitions
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utility functions
│   │   └── ws/             # WebSocket handling
│   ├── data/               # Log storage
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utility functions
│   ├── public/             # Static assets
│   └── package.json
└── README.md
```

## Contributing

When contributing to this project:

1. Follow the established architecture patterns
2. Maintain test coverage for new features
3. Use TypeScript for type safety
4. Follow the existing code style and conventions
5. Update documentation for API changes

## Support

For questions or issues, please refer to the project documentation or create an issue in the repository.