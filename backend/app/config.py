import os
from dotenv import load_dotenv

load_dotenv()


class Config:

    # ==========================================
    # Flask Configuration
    # ==========================================

    SECRET_KEY = os.getenv(
        "SECRET_KEY",
        "mail-automation-secret-key"
    )


    # ==========================================
    # PostgreSQL Configuration
    # ==========================================

    DB_HOST = os.getenv("DB_HOST")
    DB_PORT = os.getenv("DB_PORT")
    DB_NAME = os.getenv("DB_NAME")
    DB_USER = os.getenv("DB_USER")
    DB_PASSWORD = os.getenv("DB_PASSWORD")


    # ==========================================
    # Mail Configuration
    # ==========================================

    MAIL_SERVER = os.getenv("MAIL_SERVER")

    MAIL_PORT = int(
        os.getenv("MAIL_PORT", 587)
    )

    MAIL_USERNAME = os.getenv("MAIL_USERNAME")

    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")

    MAIL_USE_TLS = (
        os.getenv("MAIL_USE_TLS", "True") == "True"
    )

    MAIL_USE_SSL = (
        os.getenv("MAIL_USE_SSL", "False") == "True"
    )