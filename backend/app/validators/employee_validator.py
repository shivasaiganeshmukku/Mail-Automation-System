import re
from datetime import datetime

class EmployeeValidator:

    REQUIRED_COLUMNS = [
        "employee_id",
        "name",
        "email",
        "dob",
        "department",
        "designation"
    ]

    @staticmethod
    def validate_columns(df):

        missing_columns = []

        for column in EmployeeValidator.REQUIRED_COLUMNS:
            if column not in df.columns:
                missing_columns.append(column)

        if missing_columns:
            return {
                "success": False,
                "message": "Missing required columns",
                "missing_columns": missing_columns
            }

        return {
            "success": True
        }

    @staticmethod
    def validate_rows(df):

        errors = []

        required_fields = [
            "employee_id",
            "name",
            "email",
            "dob",
            "department",
            "designation"
        ]

        for index, row in df.iterrows():

            excel_row = index + 2

            for field in required_fields:

                value = row[field]

                if value is None or str(value).strip() == "":
                    errors.append({
                        "row": excel_row,
                        "field": field,
                        "message": f"{field} is required"
                    })

        if errors:
            return {
                "success": False,
                "errors": errors
            }

        return {
            "success": True
        }


    @staticmethod
    def validate_email(df):

        errors = []

        email_pattern = r'^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'

        for index, row in df.iterrows():

            email = str(row["email"]).strip()

            if not re.match(email_pattern, email):
                errors.append({
                    "row": index + 2,
                    "field": "email",
                    "message": "Invalid email format"
                })

        if errors:
            return {
                "success": False,
                "errors": errors
            }

        return {
            "success": True
        }
    
    @staticmethod
    def validate_dob(df):

        errors = []

        for index, row in df.iterrows():

            dob = str(row["dob"]).strip()

            try:
                datetime.strptime(dob, "%Y-%m-%d")

            except ValueError:
                errors.append({
                    "row": index + 2,
                    "field": "dob",
                    "message": "Invalid DOB format. Expected YYYY-MM-DD"
                })

            if errors:
                return {
                    "success": False,
                    "errors": errors
                }

            return {
                "success": True
            } 


    @staticmethod
    def validate_duplicate_employee_ids(df):

        errors = []

        duplicates = df[df.duplicated(subset=["employee_id"], keep=False)]

        for index, row in duplicates.iterrows():
            errors.append({
                    "row": index + 2,
                    "field": "employee_id",
                    "message": f"Duplicate Employee ID: {row['employee_id']}"
            })

        if errors:
            return {
                "success": False,
                "errors": errors
            }

        return {
            "success": True
        }

    @staticmethod
    def validate_duplicate_emails(df):

        errors = []

        duplicates = df[df.duplicated(subset=["email"], keep=False)]

        for index, row in duplicates.iterrows():
            errors.append({
                "row": index + 2,
                "field": "email",
                "message": f"Duplicate Email: {row['email']}"
            })

        if errors:
            return {
                "success": False,
                "errors": errors
            }

        return {
            "success": True
        }