# Time Attendance System

A modern time attendance system built with NestJS, TypeORM, and PostgreSQL. This system allows organizations to manage employee attendance, track check-in/check-out times, and generate attendance reports.

## Features

- Employee Management
- Authentication using JWT
- Time Attendance Tracking
- Check-in/Check-out Management
- RESTful API with Swagger Documentation

## Tech Stack

- NestJS - A progressive Node.js framework
- TypeORM - ORM for TypeScript and JavaScript
- PostgreSQL - Open source object-relational database
- Jest - Testing framework
- Swagger - API documentation

## Prerequisites

- Node.js (v20.17.0 or later)
- PostgreSQL
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd time-attendance-system
```

2. Install dependencies:
```bash
cd apps/api
npm install
```

3. Configure environment variables:
Create a `.env` file in the `apps/api` directory with the following content:
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=time_attendance_db
JWT_SECRET=your_jwt_secret
```

4. Start the application:
```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`
Swagger documentation can be accessed at `http://localhost:3000/api`

## API Endpoints

### Auth
- POST /auth/register - Register a new employee
- POST /auth/login - Login and get JWT token

### Employees
- GET /employees - Get all employees
- GET /employees/:id - Get employee by ID
- POST /employees - Create new employee
- PATCH /employees/:id - Update employee
- DELETE /employees/:id - Delete employee

### Attendance
- POST /attendance/check-in - Record check-in time
- POST /attendance/check-out - Record check-out time
- GET /attendance/employee/:id - Get attendance records by employee ID

## Testing

Run unit tests:
```bash
npm run test
```

Run tests with coverage:
```bash
npm run test:cov
```

## Project Structure

```
apps/api/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   ├── employee/
│   │   └── attendance/
│   ├── config/
│   ├── main.ts
│   └── app.module.ts
├── test/
└── package.json
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.

## Future Enhancements

- Web interface with modern UI components
- Mobile application support
- Integration with HR systems
- Advanced reporting and analytics
- Biometric authentication support
- Geolocation tracking
- Leave management module
- Payroll integration
- Shift management
- Multiple time zones support 