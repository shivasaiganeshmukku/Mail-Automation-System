
from app.validators.employee_validator import EmployeeValidator
from app.utils.excel_reader import ExcelReader
from app.models import Employee
from app.database import db

class UploadService:

    @staticmethod
    def read_excel(file):
        try:
            # Read Excel
            df = ExcelReader.read(file)



            # Validate Required Columns
            validation = EmployeeValidator.validate_columns(df)

            if not validation["success"]:
                return validation

            validation = EmployeeValidator.validate_rows(df)

            if not validation["success"]:
                return validation

            validation = EmployeeValidator.validate_email(df)

            if not validation["success"]:
                return validation

            validation = EmployeeValidator.validate_dob(df)

            if not validation["success"]:
                return validation


            validation = EmployeeValidator.validate_duplicate_employee_ids(df)

            if not validation["success"]:
                return validation

            validation = EmployeeValidator.validate_duplicate_emails(df)

            if not validation["success"]:
                return validation
            
            
            total_records = len(df)
            existing_ids = UploadService.check_existing_employee_ids(df)

            df = df[~df["employee_id"].isin(existing_ids)]

            if df.empty:
                return {
                    "success": True,
                    "message": "No new employees to import.",
                    "total_records": total_records,
                    "imported_records": 0,
                    "skipped_records": len(existing_ids)
                }


            #existing_ids = UploadService.check_existing_employee_ids(df)
            #if existing_ids:

                #return {
                   # "success": False,
                    #"message": "Some employee IDs already exist in the database.",
                    #"existing_employee_ids": existing_ids
                #}

            # Check Existing Emails
            existing_emails = UploadService.check_existing_emails(df)

            if existing_emails:
                return {
                    "success": False,
                    "message": "Some email addresses already exist in the database.",
                    "existing_emails": existing_emails
                }


            # Return Preview
            result = UploadService.import_employees(df)
            
            result["total_records"] = total_records
            result["imported_records"] = len(df)
            result["skipped_records"] = len(existing_ids)
            return result

        except Exception as e:
            raise e
    
    @staticmethod
    def check_existing_employee_ids(df):

        employee_ids = df["employee_id"].tolist()

        existing_employees = Employee.query.filter(
            Employee.employee_id.in_(employee_ids)
        ).all()

        existing_ids = [
            employee.employee_id
            for employee in existing_employees
        ]

        return existing_ids

    @staticmethod
    def check_existing_emails(df):

        emails = df["email"].tolist()

        existing_employees = Employee.query.filter(
            Employee.email.in_(emails)
        ).all()

        existing_emails = [
            employee.email
            for employee in existing_employees
        ]

        return existing_emails

    @staticmethod
    def import_employees(df):

        employees = []

        for _, row in df.iterrows():

            employee = Employee(
                employee_id=row["employee_id"],
                name=row["name"],
                email=row["email"],
                dob=row["dob"],
                department=row["department"],
                designation=row["designation"]
            )

            employees.append(employee)

        db.session.add_all(employees)
        db.session.commit()

        return {
            "success": True,
            "message": "Employees imported successfully.",
            "total_imported": len(employees)
        }