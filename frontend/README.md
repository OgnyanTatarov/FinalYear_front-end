# Study Buddy - Frontend Application

## Overview
Study Buddy is a comprehensive learning management system designed to help students optimize their study time and improve academic performance. The frontend is built with Vue.js 3 and integrates with AWS Amplify for deployment and hosting.

## Tech Stack
- **Framework**: Vue.js 3
- **State Management**: Vuex 4
- **Routing**: Vue Router 4
- **HTTP Client**: Axios
- **UI Components**: Custom Components
- **Form Validation**: Vuelidate
- **Notifications**: Vue Toastification
- **Build Tool**: Vite
- **Deployment**: AWS Amplify
- **Version Control**: Git/GitHub

## Features

### 1. Authentication System
- User registration and login
- Email verification
- Password recovery
- Session management
- Role-based access control (Admin/Student)

### 2. Course Management
- Course listing and details
- Course enrollment
- Progress tracking
- Course materials access
- Interactive course content
- Admin course management (create, update, delete)

### 3. Deadline Management
- Assignment tracking
- Deadline notifications
- Progress monitoring
- Priority-based task organization
- Calendar integration
- Admin deadline management (create, update, delete)

### 4. Machine Learning Integration
- Personalized revision suggestions
- Topic difficulty prediction
- Study schedule optimization
- Performance analytics
- Adaptive learning paths

### 5. Revision System
- Interactive revision sessions
- Multiple content formats (text, quiz, practice)
- Progress tracking
- Time management
- Performance analytics

### 6. Admin Module
- Student search and management
- Course creation and management
- Student enrollment
- Deadline creation and management
- Progress monitoring
- Analytics dashboard

## Backend Integration

### Database Schema
- `course_enrollments`: Tracks student enrollments
- `student_deadlines`: Tracks individual student deadlines
- `courses`: Includes both `user_id` and `admin_id`
- `users`: Role-based access (`role = 'admin'`)

### API Endpoints

#### Student Management
```javascript
// Search Student
GET /admin/search-student?up_number={up_number}
Response: {
  data: {
    student_id: number,
    up_number: string,
    name: string,
    email: string
  }
}
```

#### Course Management
```javascript
// Get Admin's Courses
GET /admin/courses?user_id={admin_id}
Response: {
  data: [
    {
      course_id: number,
      course_name: string,
      admin_id: number
    }
  ]
}

// Create Course
POST /admin/courses
Body: {
  course_name: string
}

// Update Course
PUT /admin/courses/:courseId
Body: {
  course_name: string
}

// Delete Course
DELETE /admin/courses/:courseId
```

#### Student Enrollment
```javascript
// Enroll Student
POST /admin/enroll-student
Body: {
  course_id: number,
  student_id: number
}
```

#### Deadline Management
```javascript
// Create Deadline
POST /admin/deadlines
Body: {
  course_id: number,
  title: string,
  description: string,
  due_date: timestamp,
  priority: string
}

// Update Deadline
PUT /admin/deadlines/:deadlineId
Body: {
  title: string,
  description: string,
  due_date: timestamp,
  priority: string
}

// Delete Deadline
DELETE /admin/deadlines/:deadlineId
```

### Error Handling
```javascript
// Success Response
{
  data: { ... }
}

// Error Response
{
  error: "Error message",
  statusCode: number
}
```

Status Codes:
- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Development Timeline

### Week 1-2: Project Setup and Authentication
- [x] Project initialization with Vue 3
- [x] Basic routing setup
- [x] Authentication system implementation
- [x] User registration and login
- [x] Session management
- [x] Role-based access control

### Week 3-4: Course Management
- [x] Course listing implementation
- [x] Course detail pages
- [x] Enrollment system
- [x] Progress tracking
- [x] Course materials integration
- [x] Admin course management

### Week 5-6: Deadline System
- [x] Deadline tracking implementation
- [x] Priority management
- [x] Progress monitoring
- [x] Notification system
- [x] Calendar integration
- [x] Admin deadline management

### Week 7-8: Machine Learning Integration
- [x] ML service implementation
- [x] Revision suggestions
- [x] Topic difficulty prediction
- [x] Study schedule optimization
- [x] Performance analytics

### Week 9-10: Revision System
- [x] Revision view implementation
- [x] Interactive content types
- [x] Progress tracking
- [x] Time management
- [x] Performance analytics

### Week 11-12: Testing and Deployment
- [x] Unit testing
- [x] Integration testing
- [x] Performance optimization
- [x] AWS Amplify deployment
- [x] CI/CD setup

## AWS Amplify Integration

### Deployment Configuration
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - cd frontend
        - npm ci
    build:
      commands:
        - npm run build:clean
  artifacts:
    baseDirectory: frontend/dist
    files:
      - '**/*'
  cache:
    paths:
      - frontend/node_modules/**/*
```

### Environment Variables
Required environment variables in AWS Amplify:
- `VITE_APP_API_BASE_URL`: Backend API base URL
- `VITE_API_URL`: Additional API endpoints
- Other production-specific variables

### Automatic Deployments
- Connected to GitHub repository
- Automatic builds on push to main branch
- Preview deployments for feature branches
- Custom domain configuration available

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- AWS Account
- GitHub Account

### Installation
1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create .env file:
   ```env
   VITE_APP_API_BASE_URL=your_api_url
   VITE_API_URL=your_api_url
   ```

4. Run development server:
   ```bash
   npm run dev
   ```

### Building for Production
```bash
npm run build:clean
```

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Contact
[Your Name] - [Your Email]
Project Link: [https://github.com/yourusername/study-buddy](https://github.com/yourusername/study-buddy)
