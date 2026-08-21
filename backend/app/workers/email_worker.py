from datetime import datetime

from app.database import db
from app.models import Employee, EmailJob
from app.services.email_service import EmailService


def process_email_job(job_id, app):

    with app.app_context():

        job = EmailJob.query.get(job_id)

        if not job:

            print(
                f"Email job {job_id} not found."
            )

            return

        print(
            f"Starting email job {job_id}"
        )

        # ============================================================
        # MARK JOB AS PROCESSING
        # ============================================================

        job.status = "PROCESSING"

        db.session.commit()

        # ============================================================
        # GET EMPLOYEES
        # ============================================================

        if job.job_type == "BULK":

            employees = Employee.query.all()

        elif job.job_type == "DEPARTMENT":

            employees = Employee.query.filter_by(
                department=job.department
            ).all()

        else:

            job.status = "FAILED"

            job.error_message = (
                "Invalid email job type."
            )

            job.completed_at = datetime.utcnow()

            db.session.commit()

            print(
                f"Email job {job.id} failed: "
                f"Invalid job type."
            )

            return

        # ============================================================
        # STORE TOTAL
        # ============================================================

        job.total = len(employees)

        db.session.commit()

        # ============================================================
        # SEND EMAILS
        # ============================================================

        for employee in employees:

            try:

                result = EmailService.send_template_email(
                    employee_id=employee.id,
                    template_id=job.template_id
                )

                if result["success"]:

                    job.sent += 1

                else:

                    job.failed += 1

                    print(
                        f"Email failed for "
                        f"{employee.email}: "
                        f"{result['message']}"
                    )

            except Exception as e:

                job.failed += 1

                print(
                    f"Exception while sending email "
                    f"to {employee.email}: {str(e)}"
                )

            db.session.commit()

            print(
                f"Job {job.id}: "
                f"{job.sent} sent, "
                f"{job.failed} failed, "
                f"{job.total} total"
            )

        # ============================================================
        # JOB COMPLETED
        # ============================================================

        job.status = "COMPLETED"

        job.completed_at = datetime.utcnow()

        db.session.commit()

        print(
            f"Email job {job.id} completed."
        )