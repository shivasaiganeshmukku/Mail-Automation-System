from app.models import Employee, EmailTemplate, EmailLog


class DashboardService:

    @staticmethod
    def get_summary():
        total_employees = Employee.query.count()

        total_templates = EmailTemplate.query.count()

        emails_sent = EmailLog.query.filter_by(
            status="SUCCESS"
        ).count()

        emails_failed = EmailLog.query.filter_by(
            status="FAILED"
        ).count()

        total_emails = emails_sent + emails_failed

        if total_emails == 0:
            success_rate = 0
        else:
            success_rate = round(
                (emails_sent / total_emails) * 100,
                2
            )

        return {
            "success": True,
            "data": {
                "total_employees": total_employees,
                "total_templates": total_templates,
                "emails_sent": emails_sent,
                "emails_failed": emails_failed,
                "success_rate": success_rate
            }
        }