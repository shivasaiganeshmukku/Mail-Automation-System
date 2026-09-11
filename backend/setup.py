import os
import subprocess
import sys

from setup_database import create_database


def run_migrations():
    print()
    print("=" * 60)
    print("Running database migrations...")
    print("=" * 60)

    env = os.environ.copy()
    env["SKIP_SCHEDULER"] = "True"

    result = subprocess.run(
        [sys.executable, "-m", "flask", "db", "upgrade"],
        env=env,
        check=False
    )

    if result.returncode != 0:
        print()
        print("Database migration failed.")
        sys.exit(result.returncode)

    print()
    print("Database migrations completed successfully.")


if __name__ == "__main__":

    print("=" * 60)
    print("Mail Automation System - Database Setup")
    print("=" * 60)

    # 1. Create MAS database if it does not exist
    create_database()

    # 2. Create/update tables using Flask-Migrate
    run_migrations()

    print()
    print("=" * 60)
    print("Database setup completed successfully.")
    print("=" * 60)