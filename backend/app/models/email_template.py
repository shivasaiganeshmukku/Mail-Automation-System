from app.database import db


class EmailTemplate(db.Model):

    __tablename__ = "email_templates"

    id = db.Column(db.Integer, primary_key=True)

    template_name = db.Column(
        db.String(100),
        nullable=False,
        unique=True
    )

    subject = db.Column(
        db.String(255),
        nullable=False
    )

    body = db.Column(
        db.Text,
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )