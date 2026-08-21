from app.database import db
from datetime import datetime


class EmailJob(db.Model):

    __tablename__ = "email_jobs"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    job_type = db.Column(
        db.String(30),
        nullable=False
    )

    template_id = db.Column(
        db.Integer,
        db.ForeignKey("email_templates.id"),
        nullable=True
    )

    department = db.Column(
        db.String(100),
        nullable=True
    )

    # Used for automatic birthday processing
    process_date = db.Column(
        db.Date,
        nullable=True
    )

    total = db.Column(
        db.Integer,
        default=0,
        nullable=False
    )

    sent = db.Column(
        db.Integer,
        default=0,
        nullable=False
    )

    failed = db.Column(
        db.Integer,
        default=0,
        nullable=False
    )

    status = db.Column(
        db.String(20),
        default="PENDING",
        nullable=False
    )

    error_message = db.Column(
        db.Text,
        nullable=True
    )

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )

    completed_at = db.Column(
        db.DateTime,
        nullable=True
    )