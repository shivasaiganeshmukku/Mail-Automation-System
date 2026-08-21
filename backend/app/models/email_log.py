from app.database import db


class EmailLog(db.Model):

    __tablename__ = "email_logs"

    id = db.Column(db.Integer, primary_key=True)

    employee_id = db.Column(
        db.Integer,
        db.ForeignKey("employees.id"),
        nullable=False
    )

    template_id = db.Column(
        db.Integer,
        db.ForeignKey("email_templates.id"),
        nullable=True
    )

    recipient_email = db.Column(
        db.String(255),
        nullable=False
    )

    subject = db.Column(
        db.String(255),
        nullable=False
    )

    status = db.Column(
        db.String(20),
        nullable=False
    )

    error_message = db.Column(
        db.Text
    )

    sent_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )