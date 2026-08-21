from datetime import date
import random

from app.database import db
from app.models import Employee, EmailJob
from app.services.email_service import EmailService


class BirthdayService:

    # ---------------------------------------------------------
    # Different birthday messages
    # ---------------------------------------------------------

    BIRTHDAY_MESSAGES = [
        (
            "🎉 Happy Birthday {{name}}!",
            "Dear {{name}},\n\n"
            "Wishing you a very Happy Birthday! 🎂🎉\n\n"
            "May your special day be filled with happiness, "
            "success, and wonderful memories.\n\n"
            "Have a fantastic birthday and a great year ahead!\n\n"
            "Best Wishes,\n"
            "Team"
        ),

        (
            "🎂 Wishing You a Happy Birthday {{name}}!",
            "Dear {{name}},\n\n"
            "Warm birthday wishes to you! 🎂\n\n"
            "May this new year of your life bring you "
            "success, happiness, good health, and many "
            "great opportunities.\n\n"
            "Enjoy your special day!\n\n"
            "Best Wishes,\n"
            "Team"
        ),

        (
            "🥳 Happy Birthday {{name}}!",
            "Dear {{name}},\n\n"
            "Many many happy returns of the day! 🥳🎉\n\n"
            "We hope you have a wonderful birthday and "
            "a successful year ahead.\n\n"
            "Keep smiling and keep achieving great things!\n\n"
            "Best Wishes,\n"
            "Team"
        ),

        (
            "🌟 Birthday Wishes for {{name}}!",
            "Dear {{name}},\n\n"
            "Today is your special day! 🌟🎂\n\n"
            "Everyone wishes you happiness, success, "
            "and lots of wonderful moments in the year ahead.\n\n"
            "Have an amazing birthday!\n\n"
            "Best Wishes,\n"
            "Team"
        ),

        (
            "🎈 Have a Wonderful Birthday {{name}}!",
            "Dear {{name}},\n\n"
            "Wishing you a wonderful and memorable birthday! 🎈\n\n"
            "May the coming year bring you new achievements, "
            "new opportunities, and lots of happiness.\n\n"
            "Enjoy your day!\n\n"
            "Best Wishes,\n"
            "Team"
        )
    ]

    # ---------------------------------------------------------
    # Get today's birthdays
    # ---------------------------------------------------------

    @staticmethod
    def get_todays_birthdays():

        today = date.today()

        employees = Employee.query.filter(
            db.extract("month", Employee.dob) == today.month,
            db.extract("day", Employee.dob) == today.day
        ).all()

        return employees

    # ---------------------------------------------------------
    # Group employees by department
    # ---------------------------------------------------------

    @staticmethod
    def group_by_department(employees):

        departments = {}

        for employee in employees:

            department = employee.department

            if department not in departments:
                departments[department] = []

            departments[department].append(employee)

        return departments

    # ---------------------------------------------------------
    # Replace employee variables
    # ---------------------------------------------------------

    @staticmethod
    def replace_variables(text, employee):

        if not text:
            return text

        text = text.replace(
            "{{name}}",
            employee.name or ""
        )

        text = text.replace(
            "{{email}}",
            employee.email or ""
        )

        text = text.replace(
            "{{department}}",
            employee.department or ""
        )

        text = text.replace(
            "{{designation}}",
            employee.designation or ""
        )

        text = text.replace(
            "{{employee_id}}",
            employee.employee_id or ""
        )

        return text

    # ---------------------------------------------------------
    # Generate random birthday message
    # ---------------------------------------------------------

    @staticmethod
    def generate_birthday_message(employee):

        subject, body = random.choice(
            BirthdayService.BIRTHDAY_MESSAGES
        )

        subject = BirthdayService.replace_variables(
            subject,
            employee
        )

        body = BirthdayService.replace_variables(
            body,
            employee
        )

        return subject, body

    # ---------------------------------------------------------
    # Send personal birthday email
    # ---------------------------------------------------------

    @staticmethod
    def send_birthday_email(employee):

        subject, body = BirthdayService.generate_birthday_message(
            employee
        )

        print(
            f"Sending birthday email to {employee.name}..."
        )

        result = EmailService.send_email(
            sender=EmailService.get_sender(),
            recipient=employee.email,
            subject=subject,
            body=body
        )

        return result

    # ---------------------------------------------------------
    # Send department announcement
    # ---------------------------------------------------------

    @staticmethod
    def send_department_announcement(
        department,
        birthday_employees
    ):

        # Get everyone in this department
        employees = Employee.query.filter_by(
            department=department
        ).all()

        # IDs of birthday employees
        birthday_employee_ids = {
            employee.id
            for employee in birthday_employees
        }

        # Remove birthday employees
        recipients = [
            employee
            for employee in employees
            if employee.id not in birthday_employee_ids
        ]

        if not recipients:

            print(
                f"No announcement recipients in "
                f"{department} department."
            )

            return {
                "department": department,
                "birthday_count": len(birthday_employees),
                "announcement_recipients": 0,
                "sent": 0,
                "failed": 0
            }

        sent = 0
        failed = 0

        # Names of birthday employees
        birthday_names = [
            employee.name
            for employee in birthday_employees
        ]

        if len(birthday_names) == 1:

            names_text = birthday_names[0]

        else:

            names_text = ", ".join(
                birthday_names[:-1]
            )

            names_text += " and " + birthday_names[-1]

        subject = (
            f"🎉 Birthday Wishes to {names_text}!"
        )

        body = (
            f"Hello Team,\n\n"
            f"Today is the birthday of "
            f"{names_text}. 🎂🎉\n\n"
            f"Let's all take a moment to wish "
            f"them a very Happy Birthday!\n\n"
            f"Wishing them happiness, success, "
            f"and a wonderful year ahead.\n\n"
            f"Best Wishes,\n"
            f"Team"
        )

        print(
            f"Processing department: {department}"
        )

        for employee in recipients:

            result = EmailService.send_email(
                sender=EmailService.get_sender(),
                recipient=employee.email,
                subject=subject,
                body=body
            )

            if result["success"]:

                sent += 1

            else:

                failed += 1

                print(
                    f"Department email failed for "
                    f"{employee.email}: "
                    f"{result['message']}"
                )

        return {
            "department": department,
            "birthday_count": len(birthday_employees),
            "announcement_recipients": len(recipients),
            "sent": sent,
            "failed": failed
        }

    # ---------------------------------------------------------
    # Main birthday process
    # ---------------------------------------------------------

    @staticmethod
    def process_birthdays():

        today = date.today()

        print("=" * 60)
        print("Checking today's birthdays...")
        print("=" * 60)

        # -----------------------------------------------------
        # DUPLICATE PROTECTION
        # -----------------------------------------------------

        existing_job = EmailJob.query.filter_by(
            job_type="BIRTHDAY",
            process_date=today
        ).first()

        if existing_job:

            print(
                f"Birthday process already exists for "
                f"{today}."
            )

            return {
                "success": True,
                "message": (
                    "Birthday process already processed "
                    "for today."
                ),
                "job_id": existing_job.id,
                "status": existing_job.status
            }

        # -----------------------------------------------------
        # Find birthdays
        # -----------------------------------------------------

        birthdays = BirthdayService.get_todays_birthdays()

        print(
            f"Found {len(birthdays)} birthday(s) today."
        )

        # -----------------------------------------------------
        # Create birthday job
        # -----------------------------------------------------

        job = EmailJob(
            job_type="BIRTHDAY",
            template_id=None,
            process_date=today,
            total=0,
            sent=0,
            failed=0,
            status="PROCESSING"
        )

        db.session.add(job)
        db.session.commit()

        print(
            f"Birthday job {job.id} created."
        )

        # -----------------------------------------------------
        # No birthdays
        # -----------------------------------------------------

        if not birthdays:

            job.status = "COMPLETED"
            job.total = 0
            job.completed_at =  db.func.now()

            db.session.commit()

            print(
                "No birthdays today."
            )

            return {
                "success": True,
                "message": "No birthdays today.",
                "job_id": job.id,
                "total_birthdays": 0,
                "personal_sent": 0,
                "personal_failed": 0,
                "departments": []
            }

        # -----------------------------------------------------
        # Personal birthday emails
        # -----------------------------------------------------

        personal_sent = 0
        personal_failed = 0

        personal_results = []

        for employee in birthdays:

            result = BirthdayService.send_birthday_email(
                employee
            )

            if result["success"]:

                personal_sent += 1

            else:

                personal_failed += 1

                print(
                    f"Birthday email failed for "
                    f"{employee.email}: "
                    f"{result['message']}"
                )

            personal_results.append({
                "employee_id": employee.employee_id,
                "name": employee.name,
                "email": employee.email,
                "success": result["success"],
                "message": result["message"]
            })

        # -----------------------------------------------------
        # Department announcements
        # -----------------------------------------------------

        grouped = BirthdayService.group_by_department(
            birthdays
        )

        department_results = []

        for department, department_birthdays in grouped.items():

            result = BirthdayService.send_department_announcement(
                department,
                department_birthdays
            )

            department_results.append(result)

        # -----------------------------------------------------
        # Calculate job totals
        # -----------------------------------------------------

        department_sent = sum(
            result["sent"]
            for result in department_results
        )

        department_failed = sum(
            result["failed"]
            for result in department_results
        )

        total_sent = (
            personal_sent +
            department_sent
        )

        total_failed = (
            personal_failed +
            department_failed
        )

        total_attempted = (
            total_sent +
            total_failed
        )

        # Update job
        job.total = total_attempted
        job.sent = total_sent
        job.failed = total_failed

        # -----------------------------------------------------
        # Determine final status
        # -----------------------------------------------------

        if total_failed == 0:

            job.status = "COMPLETED"

        elif total_sent > 0:

            job.status = "COMPLETED"

            job.error_message = (
                "Some emails failed to send."
            )

        else:

            job.status = "FAILED"

            job.error_message = (
                "All birthday email attempts failed."
            )

        job.completed_at =  db.func.now()

        db.session.commit()

        # -----------------------------------------------------
        # Final result
        # -----------------------------------------------------

        print("=" * 60)
        print("Birthday processing completed.")
        print("=" * 60)

        return {
            "success": True,
            "message": (
                "Birthday emails processed successfully."
            ),
            "job_id": job.id,
            "total_birthdays": len(birthdays),

            "personal_sent": personal_sent,
            "personal_failed": personal_failed,

            "personal_results": personal_results,

            "departments": department_results,

            "total_sent": total_sent,
            "total_failed": total_failed
        }