import os

import psycopg2
from psycopg2 import sql
from dotenv import load_dotenv


# ============================================================
# LOAD ENVIRONMENT VARIABLES
# ============================================================

load_dotenv()


DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = int(os.getenv("DB_PORT", 5432))
DB_NAME = os.getenv("DB_NAME", "MAS")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD")


# ============================================================
# CREATE DATABASE IF IT DOES NOT EXIST
# ============================================================

def create_database():

    print("Checking PostgreSQL database...")

    connection = None

    try:

        # Connect to PostgreSQL server itself.
        # We connect to the default 'postgres' database
        # so that we can check/create the MAS database.

        connection = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            database="postgres",
            user=DB_USER,
            password=DB_PASSWORD
        )

        connection.autocommit = True

        cursor = connection.cursor()

        cursor.execute(
            "SELECT 1 FROM pg_database WHERE datname = %s",
            (DB_NAME,)
        )

        database_exists = cursor.fetchone()

        if database_exists:

            print(f"Database '{DB_NAME}' already exists.")

        else:

            cursor.execute(
                sql.SQL("CREATE DATABASE {}").format(
                    sql.Identifier(DB_NAME)
                )
            )

            print(f"Database '{DB_NAME}' created successfully.")

        cursor.close()

    except Exception as error:

        print("Database setup failed.")
        print(f"Error: {error}")

        raise

    finally:

        if connection:
            connection.close()


# ============================================================
# MAIN
# ============================================================

if __name__ == "__main__":

    create_database()