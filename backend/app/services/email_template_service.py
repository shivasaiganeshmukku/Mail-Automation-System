from app.database import db
from app.models import EmailTemplate


class EmailTemplateService:

    @staticmethod
    def create_template(data):
        template = EmailTemplate(
            template_name=data["template_name"],
            subject=data["subject"],
            body=data["body"]
        )

        db.session.add(template)
        db.session.commit()

        return {
            "success": True,
            "message": "Email template created successfully."
        }

    @staticmethod
    def get_all_templates():

        templates = EmailTemplate.query.all()

        data = []

        for template in templates:
            data.append({
                "id": template.id,
                "template_name": template.template_name,
                "subject": template.subject,
                "body": template.body,
                "created_at": template.created_at
            })

        return {
            "success": True,
            "count": len(data),
            "data": data
        }

    @staticmethod
    def get_template_by_id(template_id):

        template = EmailTemplate.query.get(template_id)

        if not template:
            return {
                "success": False,
                "message": "Email template not found."
            }

        return {
            "success": True,
            "data": {
                "id": template.id,
                "template_name": template.template_name,
                "subject": template.subject,
                "body": template.body,
                "created_at": template.created_at
            }
        }

    @staticmethod
    def update_template(template_id, data):

        template = EmailTemplate.query.get(template_id)

        if not template:
            return {
                "success": False,
                "message": "Email template not found."
            }

        template.template_name = data["template_name"]
        template.subject = data["subject"]
        template.body = data["body"]

        db.session.commit()

        return {
            "success": True,
            "message": "Email template updated successfully."
        }

    @staticmethod
    def delete_template(template_id):

        template = EmailTemplate.query.get(template_id)

        if not template:
            return {
                "success": False,
                "message": "Email template not found."
            }

        db.session.delete(template)
        db.session.commit()

        return {
            "success": True,
            "message": "Email template deleted successfully."
        }