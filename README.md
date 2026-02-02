# Log Ingestion and Querying System

A full-stack application for ingesting, storing, and querying log data with real-time updates and advanced analytics. Built with Node.js backend and React frontend, featuring a clean architecture, comprehensive filtering capabilities, and interactive data visualization.

## Overview

This system provides a complete solution for log management with the following capabilities:

- **Log Ingestion**: REST API endpoint for receiving and storing log entries
- **Advanced Querying**: Filter logs by level, message content, resource ID, timestamp ranges, and trace information
- **Real-time Updates**: WebSocket integration for live log streaming
- **Analytics Dashboard**: Interactive charts and metrics for log analysis
- **Structured Storage**: JSON file-based persistence with efficient querying
- **Modern UI**: React-based interface with responsive design, dark mode support, and smooth animations

## Features

### Core Functionality
- **Log Management**: Structured log ingestion with comprehensive validation
- **Multi-Filter Search**: Filter by level, message, resourceId, timestamp range, traceId, spanId, and commit
- **Real-time Streaming**: WebSocket-powered live log updates
- **Chronological Sorting**: Logs displayed in reverse chronological order (newest first)

### Analytics Dashboard
- **Interactive Metrics Cards**: Total logs, critical errors, warnings, and error rate statistics
- **Visual Charts**: Bar charts and donut charts with gradient styling and hover effects
- **Trend Analysis**: Real-time analytics that update with filtered data
- **Progress Indicators**: Visual progress bars in detailed statistics table
- **Responsive Design**: Optimized for desktop and mobile viewing

### User Experience
- **Modern Interface**: Clean, professional design with gradient backgrounds and glass-morphism effects
- **Dark Mode Support**: Seamless theme switching with system preference detection
- **Loading States**: Skeleton animations and smooth transitions
- **Error Handling**: Comprehensive error states with helpful messaging
- **Color-coded Levels**: Visual distinction for error, warn, info, and debug logs
- **Smooth Animations**: Performance-optimized transitions and hover effects

### Development Features
- **Comprehensive Testing**: Unit test coverage with Jest
- **Environment Configuration**: Flexible config management
- **Structured Logging**: Custom logger with proper error handling
- **CORS Support**: Cross-origin request handling
- **Hot Reload**: Development-friendly setup
- **TypeScript**: Full type safety throughout the frontend

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
- **WebSocket**: ws library for real-time communication
- **Testing**: Jest with comprehensive test coverage
- **Storage**: JSON file system with efficient read/write operations

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **Styling**: Tailwind CSS v4 with custom design system
- **UI Components**: Radix UI primitives for accessibility
- **Icons**: Lucide React for consistent iconography
- **Charts**: Recharts for interactive data visualization
- **State Management**: React hooks with custom state logic

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

## Screenshots

### Main Interface
The application features a modern, clean interface with:
- Header with theme toggle and analytics dashboard toggle
- Advanced filter bar with multiple search criteria
- Real-time log results with color-coded levels
- Responsive design that works on all screen sizes

### Analytics Dashboard
Interactive analytics dashboard includes:
- **Metrics Cards**: Overview of total logs, critical errors, warnings, and error rates
- **Bar Chart**: Visual representation of log distribution by level
- **Donut Chart**: Percentage breakdown of log levels
- **Statistics Table**: Detailed breakdown with progress indicators
- **Real-time Updates**: Charts update automatically as filters change

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

### Analytics Dashboard
- **Interactive Metrics**: Total logs, critical errors, warnings, and error rate cards
- **Visual Charts**: Bar charts and donut charts with gradient styling
- **Real-time Analytics**: Charts update automatically with filtered data
- **Detailed Statistics**: Comprehensive table with progress indicators
- **Responsive Design**: Optimized for all screen sizes

### User Interface
- Clean, modern design with gradient backgrounds
- Dark mode support with system preference detection
- Color-coded log levels for easy identification
- Loading states with skeleton animations
- Smooth transitions and hover effects
- Glass-morphism design elements

### Development Features
- Comprehensive unit test coverage
- Environment-based configuration
- Structured logging with custom logger
- CORS support for cross-origin requests
- Hot reload for development
- TypeScript for type safety

## Testing

### Backend Tests
Run the comprehensive backend test suite:
```bash
cd backend
npm test
```

The test suite covers:
- **Log Validation**: Schema validation, required fields, data types
- **Query Filtering**: All filter combinations, edge cases, AND logic
- **Error Handling**: Validation errors, server errors, edge cases
- **Service Integration**: Complete service layer testing

### Test Coverage
- 18 comprehensive unit tests
- Service layer validation and filtering logic
- Mock database operations
- Error scenario handling

## Performance Optimizations

The application follows React best practices for optimal performance:

### Frontend Optimizations
- **Memoized Calculations**: Analytics data computed efficiently with useMemo
- **Optimized Re-renders**: Strategic use of React hooks to minimize unnecessary updates
- **Lazy Loading**: Dynamic imports for heavy components
- **Efficient Charts**: Recharts with optimized rendering and animations
- **Debounced Search**: Optional debouncing for search inputs (configurable)

### Backend Optimizations
- **Efficient File I/O**: Optimized JSON file read/write operations
- **Request Deduplication**: WebSocket connection management
- **Error Handling**: Comprehensive error catching and meaningful responses
- **Memory Management**: Efficient data processing and filtering

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
│   │   │   └── __tests__/  # Unit tests
│   │   ├── utils/          # Utility functions
│   │   └── ws/             # WebSocket handling
│   ├── data/               # Log storage (JSON files)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── ui/         # Reusable UI components
│   │   │   ├── FilterBar.tsx
│   │   │   ├── LogEntry.tsx
│   │   │   ├── LogResults.tsx
│   │   │   └── AnalyticsDashboard.tsx  # New analytics component
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utility functions
│   ├── public/             # Static assets and custom favicon
│   └── package.json
├── plans/                  # Project planning documents
└── README.md
```

## Recent Updates

### Version 2.0 Features
- **Analytics Dashboard**: Interactive charts and metrics for log analysis
- **Enhanced UI**: Modern design with gradients, animations, and glass-morphism effects
- **Custom Branding**: Replaced generic favicon with custom Log Query Interface icon
- **Performance Improvements**: Optimized rendering and state management
- **Better UX**: Improved loading states, error handling, and responsive design

### Analytics Dashboard Features
- **Metrics Cards**: Real-time statistics with icons and color coding
- **Interactive Charts**: Bar charts and donut charts with hover effects
- **Visual Enhancements**: Gradient backgrounds, smooth animations, backdrop blur
- **Responsive Layout**: Grid-based layout that adapts to screen size
- **Theme Support**: Full dark/light mode compatibility

## Contributing

When contributing to this project:

1. Follow the established architecture patterns (Controller → Service → DB Service)
2. Maintain test coverage for new features
3. Use TypeScript for type safety in frontend components
4. Follow React best practices for performance optimization
5. Follow the existing code style and conventions
6. Update documentation for API or feature changes
7. Test analytics dashboard with various data sets
8. Ensure responsive design works across screen sizes

## Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Features**: Full support for CSS Grid, Flexbox, CSS Variables, and ES2020
- **WebSocket**: Native WebSocket support required for real-time features
- **SVG**: SVG support required for charts and custom favicon

## Deployment Considerations

### Production Checklist
- [ ] Environment variables configured
- [ ] CORS origins set for production domains
- [ ] WebSocket connections properly configured
- [ ] Static assets optimized and compressed
- [ ] Analytics dashboard tested with large datasets
- [ ] Error monitoring and logging configured
- [ ] Performance monitoring enabled

### Scaling Considerations
- **Database**: Consider migrating to a proper database for high-volume scenarios
- **WebSocket**: Implement WebSocket clustering for multiple server instances
- **Caching**: Add Redis or similar for cross-request caching
- **CDN**: Serve static assets via CDN for better performance

## Support

For questions or issues, please refer to the project documentation or create an issue in the repository.