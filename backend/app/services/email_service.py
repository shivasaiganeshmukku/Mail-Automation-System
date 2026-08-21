import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from app.config import Config
from app.models import Employee, EmailTemplate
from app.services.email_log_service import EmailLogService


class EmailService:

    # ============================================================
    # GET SENDER EMAIL
    # ============================================================

    @staticmethod
    def get_sender():
        return Config.MAIL_USERNAME

    # ============================================================
    # REPLACE TEMPLATE VARIABLES
    # ============================================================

    @staticmethod
    def replace_variables(template, employee):

        template = template.replace(
            "{{name}}",
            employee.name or ""
        )

        template = template.replace(
            "{{email}}",
            employee.email or ""
        )

        template = template.replace(
            "{{department}}",
            employee.department or ""
        )

        template = template.replace(
            "{{designation}}",
            employee.designation or ""
        )

        template = template.replace(
            "{{employee_id}}",
            employee.employee_id or ""
        )

        return template

    # ============================================================
    # SEND TEMPLATE EMAIL
    # ============================================================

    @staticmethod
    def send_template_email(employee_id, template_id):

        employee = Employee.query.get(employee_id)

        if not employee:
            return {
                "success": False,
                "message": "Employee not found."
            }

        template = EmailTemplate.query.get(template_id)

        if not template:
            return {
                "success": False,
                "message": "Email template not found."
            }

        subject = EmailService.replace_variables(
            template.subject,
            employee
        )

        body = EmailService.replace_variables(
            template.body,
            employee
        )

        result = EmailService.send_email(
            sender=Config.MAIL_USERNAME,
            recipient=employee.email,
            subject=subject,
            body=body
        )

        # Save email log
        if result["success"]:

            EmailLogService.create_log(
                employee_id=employee.id,
                template_id=template.id,
                recipient_email=employee.email,
                subject=subject,
                status="SUCCESS"
            )

        else:

            EmailLogService.create_log(
                employee_id=employee.id,
                template_id=template.id,
                recipient_email=employee.email,
                subject=subject,
                status="FAILED",
                error_message=result["message"]
            )

        return result

    # ============================================================
    # SEND EMAIL
    # ============================================================

    @staticmethod
    def send_email(
        sender,
        recipient,
        subject,
        body
    ):

        message = MIMEMultipart()

        message["From"] = sender
        message["To"] = recipient
        message["Subject"] = subject

        message.attach(
            MIMEText(body, "plain")
        )

        server = None

        try:

            server = smtplib.SMTP(
                Config.MAIL_SERVER,
                Config.MAIL_PORT
            )

            if Config.MAIL_USE_TLS:

                server.starttls()

            server.login(
                Config.MAIL_USERNAME,
                Config.MAIL_PASSWORD
            )

            server.sendmail(
                sender,
                recipient,
                message.as_string()
            )

            return {
                "success": True,
                "message": "Email sent successfully."
            }

        except Exception as e:

            return {
                "success": False,
                "message": str(e)
            }

        finally:

            if server:

                try:
                    server.quit()
                except Exception:
                    pass

    # ============================================================
    # SEND BULK EMAIL
    # ============================================================

    @staticmethod
    def send_bulk_email(template_id):

        employees = Employee.query.all()

        sent = 0
        failed = 0

        for employee in employees:

            result = EmailService.send_template_email(
                employee_id=employee.id,
                template_id=template_id
            )

            if result["success"]:
                sent += 1
            else:
                failed += 1

        return {
            "success": True,
            "total": len(employees),
            "sent": sent,
            "failed": failed
        }

    # ============================================================
    # SEND DEPARTMENT EMAIL
    # ============================================================

    @staticmethod
    def send_department_email(
        department,
        template_id
    ):

        employees = Employee.query.filter_by(
            department=department
        ).all()

        if not employees:

            return {
                "success": False,
                "message": (
                    f"No employees found in "
                    f"{department} department."
                )
            }

        sent = 0
        failed = 0

        for employee in employees:

            result = EmailService.send_template_email(
                employee_id=employee.id,
                template_id=template_id
            )

            if result["success"]:
                sent += 1
            else:
                failed += 1

        return {
            "success": True,
            "department": department,
            "total": len(employees),
            "sent": sent,
            "failed": failed
        }