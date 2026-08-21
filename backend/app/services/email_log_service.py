from app.database import db
from app.models import EmailLog, Employee, EmailTemplate


class EmailLogService:

    @staticmethod
    def create_log(
        employee_id,
        template_id,
        recipient_email,
        subject,
        status,
        error_message=None
    ):

        log = EmailLog(
            employee_id=employee_id,
            template_id=template_id,
            recipient_email=recipient_email,
            subject=subject,
            status=status,
            error_message=error_message
        )

        db.session.add(log)
        db.session.commit()

        return {
            "success": True,
            "message": "Email log created successfully."
        }


    @staticmethod
    def get_all_logs():

        logs = EmailLog.query.order_by(
            EmailLog.sent_at.desc()
        ).all()

        data = []

        for log in logs:
            employee = Employee.query.get(log.employee_id)
            template = EmailTemplate.query.get(log.template_id)

            data.append({
                "id": log.id,
                "employee_id": log.employee_id,
                "employee_name": employee.name if employee else None,
                "template_id": log.template_id,
                "template_name": template.template_name if template else None,
                "recipient_email": log.recipient_email,
                "subject": log.subject,
                "status": log.status,
                "error_message": log.error_message,
                "sent_at": log.sent_at
            })

        return {
            "success": True,
            "count": len(data),
            "data": data
        }