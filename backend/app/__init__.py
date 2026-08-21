from flask import Flask
from flask_cors import CORS

from app.config import Config
from app.database import db

from app.models import (
    Employee,
    EmailTemplate,
    EmailLog,
    EmailJob
)

from app.routes.employee_routes import employee_bp
from app.routes.upload_routes import upload_bp
from app.routes.email_template_routes import template_bp
from app.routes.email_routes import email_bp
from app.routes.email_log_routes import email_log_bp
from app.routes.dashboard_routes import dashboard_bp

from app.scheduler.birthday_scheduler import start_scheduler


def create_app():

    # ============================================================
    # CREATE FLASK APP
    # ============================================================

    app = Flask(__name__)

    CORS(app)

    # ============================================================
    # CONFIGURATION
    # ============================================================

    app.config["SECRET_KEY"] = Config.SECRET_KEY

    app.config["SQLALCHEMY_DATABASE_URI"] = (
        f"postgresql://{Config.DB_USER}:"
        f"{Config.DB_PASSWORD}@"
        f"{Config.DB_HOST}:"
        f"{Config.DB_PORT}/"
        f"{Config.DB_NAME}"
    )

    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # ============================================================
    # INITIALIZE DATABASE
    # ============================================================

    db.init_app(app)

    # ============================================================
    # REGISTER EMPLOYEE ROUTES
    # ============================================================

    app.register_blueprint(
        employee_bp,
        url_prefix="/api/v1"
    )

    # ============================================================
    # REGISTER UPLOAD ROUTES
    # ============================================================

    app.register_blueprint(
        upload_bp,
        url_prefix="/api/v1/upload"
    )

    # ============================================================
    # REGISTER EMAIL TEMPLATE ROUTES
    # ============================================================

    app.register_blueprint(
        template_bp,
        url_prefix="/api/v1"
    )

    # ============================================================
    # REGISTER EMAIL ROUTES
    # ============================================================

    app.register_blueprint(
        email_bp,
        url_prefix="/api/v1"
    )

    # ============================================================
    # REGISTER EMAIL LOG ROUTES
    # ============================================================

    app.register_blueprint(
        email_log_bp,
        url_prefix="/api/v1"
    )

    # ============================================================
    # REGISTER DASHBOARD ROUTES
    # ============================================================

    app.register_blueprint(
        dashboard_bp,
        url_prefix="/api/v1"
    )

    # ============================================================
    # CREATE DATABASE TABLES
    # ============================================================

    with app.app_context():

        print("Creating database tables...")

        db.create_all()

        print("Database tables created.")

    # ============================================================
    # HOME ROUTE
    # ============================================================

    @app.route("/")
    def home():

        return "Welcome to Mail Automation System Backend"

    # ============================================================
    # START DAILY BIRTHDAY SCHEDULER
    # ============================================================

    start_scheduler(app)

    # ============================================================
    # RETURN APP
    # ============================================================

    return app