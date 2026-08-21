# 📧 Mail Automation System

A full-stack **Mail Automation System** built with **Flask, React, PostgreSQL, and SMTP**.

The system allows organizations to manage employees, upload employee information through Excel files, create reusable email templates, send individual or bulk emails, maintain email logs, and automatically send birthday emails using a scheduled background process.

---

## 🚀 Features

### Employee Management

- Add employees manually
- View all employees
- Edit employee information
- Delete employees
- Activate/deactivate employees
- Store:
  - Employee ID
  - Name
  - Email
  - Date of Birth
  - Department
  - Designation

### 📊 Excel Employee Import

Employees can be imported using an Excel `.xlsx` file.

The system validates:

- Required columns
- Required values
- Email format
- Date of birth format
- Duplicate employee IDs
- Duplicate email addresses
- Existing employee IDs in the database
- Existing email addresses in the database

Existing employee IDs are skipped during import.

---

## 📧 Email Template Management

Create reusable email templates containing dynamic employee variables.

Supported variables:

```text
{{name}}
{{email}}
{{department}}
{{designation}}
{{employee_id}}

Example:

Subject:
Happy Birthday {{name}}!


Body:
Dear {{name}},


We wish you a very happy birthday!


Regards,
HR Team

The system automatically replaces the variables with employee information before sending the email.

✉️ Email Sending

The system supports:

Individual Email

Send an email to a specific employee using an email template.

Bulk Email

Send the selected template to all employees.

Department Email

Send a template to all employees belonging to a specific department.

📝 Email Logs

Every email attempt is recorded in the database.

The logs contain:

Employee
Template
Recipient email
Subject
Status
Error message
Sent time

Possible statuses:

SUCCESS
FAILED

The frontend provides:

Search
Status filtering
Pagination
Email history

🎂 Birthday Automation

The system automatically checks employee birthdays.

The birthday service:

Finds employees whose birthday matches the current date.
Selects the configured birthday email template.
Replaces employee variables.
Sends the email.
Creates an email log.
Reports successful and failed emails.

A background scheduler is used to execute the birthday process automatically.

System Architecture
                    ┌──────────────────────┐
                    │      React UI        │
                    │      Frontend        │
                    └──────────┬───────────┘
                               │
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │     Flask Backend    │
                    │      REST APIs       │
                    └──────────┬───────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
        ┌───────────┐    ┌───────────┐   ┌─────────────┐
        │ PostgreSQL│    │  Services │   │  Scheduler  │
        │ Database  │    │   Layer   │   │  APScheduler│
        └───────────┘    └─────┬─────┘   └──────┬──────┘
                               │                  │
                               ▼                  │
                         ┌────────────┐           │
                         │ SMTP Email │◄──────────┘
                         │   Server   │
                         └────────────┘

🛠️ Technology Stack
Frontend
React
Vite
Material UI
Axios
JavaScript
Backend
Python
Flask
Flask-CORS
Flask-SQLAlchemy
SQLAlchemy
APScheduler
Pandas
OpenPyXL
SMTP
Database
PostgreSQL
Database
PostgreSQL
Development Tools
Visual Studio
VS Code
Postman
Git
GitHub

📁 Project Structure
Mail Automation System/
│
├── backend/
│   │
│   ├── app/
│   │   │
│   │   ├── models/
│   │   │   ├── employee.py
│   │   │   ├── email_template.py
│   │   │   ├── email_log.py
│   │   │   └── email_job.py
│   │   │
│   │   ├── routes/
│   │   │   ├── employee_routes.py
│   │   │   ├── upload_routes.py
│   │   │   ├── email_routes.py
│   │   │   ├── email_template_routes.py
│   │   │   ├── email_log_routes.py
│   │   │   └── dashboard_routes.py
│   │   │
│   │   ├── services/
│   │   │   ├── employee_service.py
│   │   │   ├── upload_service.py
│   │   │   ├── email_service.py
│   │   │   ├── email_template_service.py
│   │   │   ├── email_log_service.py
│   │   │   ├── birthday_service.py
│   │   │   └── dashboard_service.py
│   │   │
│   │   ├── validators/
│   │   │   └── employee_validator.py
│   │   │
│   │   ├── utils/
│   │   │   └── excel_reader.py
│   │   │
│   │   ├── scheduler/
│   │   │   └── birthday_scheduler.py
│   │   │
│   │   └── workers/
│   │       └── email_worker.py
│   │
│   ├── requirements.txt
│   └── run.py
│
├── frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── .gitignore
├── Mail Automation System.pyproj
└── Mail Automation System.slnx

🗄️ Database Models

The application uses PostgreSQL.

Employees

Stores employee information.

employees
├── id
├── employee_id
├── name
├── email
├── dob
├── department
├── designation
├── status
├── created_at
└── updated_at

Email Templates

Stores reusable email templates.

email_templates
├── id
├── template_name
├── subject
├── body
└── ...
Email Logs

Stores every email sending attempt.

email_logs
├── id
├── employee_id
├── template_id
├── recipient_email
├── subject
├── status
├── error_message
└── sent_at
Email Jobs

Stores email job information used by the email processing system.

🔌 API Endpoints

The backend APIs use the following base URL:

http://127.0.0.1:5000/api/v1
Employees
Get Employees
GET /employees
Create Employee
POST /employees

Example:

{
    "employee_id": "EMP001",
    "name": "Shiva Sai",
    "email": "shivasaiganesh@example.com",
    "dob": "2000-07-27",
    "department": "IT",
    "designation": "Software Engineer"
}
Update Employee
PUT /employees/{id}
Delete Employee
DELETE /employees/{id}

📊 Excel Upload API
POST /api/v1/upload/employees

The request must use:

multipart/form-data

with the file field:

file

📑 Excel Format

The Excel file must contain these columns:

employee_id
name
email
dob
department
designation

Example:

employee_id	name	email	dob	department	designation
EMP001	Shiva Sai	shivasaiganesh@example.com	2000-07-27	IT	Software Engineer
EMP002	Priya Reddy	priya.reddy@example.com	1999-05-10	HR	HR Executive
EMP003	Rahul Kumar	rahul.kumar@example.com	1998-12-15	Finance	Analyst

DOB format must be:

YYYY-MM-DD

📨 Email APIs

Email functionality is exposed through the Flask email routes.

The system supports:

Individual employee email
Bulk email
Department email
Template-based email sending
📋 Email Log API
Get All Email Logs
GET /email-logs

The API returns:

{
    "success": true,
    "count": 1,
    "data": []
}

🎂 Birthday Scheduler

The application starts the birthday scheduler when the Flask application starts.

The scheduler executes the birthday processing service automatically.

The scheduler is implemented using:

APScheduler

The birthday process:

Scheduler
    ↓
BirthdayService
    ↓
Find today's birthdays
    ↓
Select birthday template
    ↓
Replace employee variables
    ↓
Send email
    ↓
Create EmailLog

⚙️ Environment Configuration

Create a .env file inside the backend directory.

Example:

SECRET_KEY=your-secret-key


DB_HOST=localhost
DB_PORT=5432
DB_NAME=mail_automation
DB_USER=postgres
DB_PASSWORD=your_database_password


MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_email_password


MAIL_USE_TLS=True
MAIL_USE_SSL=False

Never commit the .env file to GitHub.

🐍 Backend Setup

Navigate to the backend:

cd backend

Create a virtual environment:

python -m venv venv

Activate it on Windows:

venv\Scripts\activate

Install dependencies:

pip install -r requirements.txt

Configure PostgreSQL and the .env file.

Run the backend:

python run.py

Backend will start at:

http://127.0.0.1:5000

⚛️ Frontend Setup

Navigate to the frontend:

cd frontend

Install dependencies:

npm install

Start the development server:

npm run dev

Frontend will start at:

http://localhost:5173

🧪 Testing

The application can be tested using:

Browser
Postman
React frontend

Example workflow:

1. Start PostgreSQL
       ↓
2. Start Flask backend
       ↓
3. Start React frontend
       ↓
4. Add employees
       ↓
5. Create email template
       ↓
6. Send email
       ↓
7. Check Email Logs
       ↓
8. Test birthday automation

🔐 Security Considerations

Sensitive configuration should be stored in environment variables.

Do not commit:

.env
passwords
API keys
SMTP credentials
database credentials

The project .gitignore prevents environment-specific and generated files from being committed.

📈 Future Improvements

Possible future enhancements:

User authentication
Role-based access control
Email scheduling UI
Email queue management
Retry failed emails
Email attachments
HTML email templates
Rich text editor
Advanced employee search
Dashboard charts
Export email logs
Birthday reminder notifications
Production deployment
Docker support
CI/CD pipeline
Cloud deployment

👨‍💻 Development

This project was developed as a full-stack mail automation application combining:

React
+
Flask
+
PostgreSQL
+
SMTP
+
APScheduler
+
Excel Processing

The application demonstrates REST API development, database integration, frontend/backend communication, file processing, email automation, background scheduling, and CRUD operations.

