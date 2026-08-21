from flask import Blueprint, request, jsonify, current_app
import threading
from datetime import date

from app.database import db
from app.models import Employee, EmailJob, EmailLog
from app.services.email_service import EmailService
from app.workers.email_worker import process_email_job
from app.services.birthday_service import BirthdayService


email_bp = Blueprint("email", __name__)


# ============================================================
# SEND SINGLE EMAIL
# ============================================================

@email_bp.route("/send-email", methods=["POST"])
def send_email():

    data = request.get_json()

    result = EmailService.send_email(
        sender=data["sender"],
        recipient=data["recipient"],
        subject=data["subject"],
        body=data["body"]
    )

    if result["success"]:
        return jsonify(result), 200

    return jsonify(result), 500


# ============================================================
# SEND TEMPLATE EMAIL
# ============================================================

@email_bp.route("/send-template-email", methods=["POST"])
def send_template_email():

    data = request.get_json()

    result = EmailService.send_template_email(
        employee_id=data["employee_id"],
        template_id=data["template_id"]
    )

    if result["success"]:
        return jsonify(result), 200

    return jsonify(result), 404


# ============================================================
# SEND BULK EMAIL
# ============================================================

@email_bp.route("/send-bulk-email", methods=["POST"])
def send_bulk_email():

    data = request.get_json()

    template_id = data["template_id"]

    employees = Employee.query.all()

    if not employees:

        return jsonify({
            "success": False,
            "message": "No employees found."
        }), 404

    job = EmailJob(
        job_type="BULK",
        template_id=template_id,
        total=len(employees),
        sent=0,
        failed=0,
        status="PENDING"
    )

    db.session.add(job)
    db.session.commit()

    # Save job ID before starting background processing
    job_id = job.id

    thread = threading.Thread(
        target=process_email_job,
        args=(
            job_id,
            current_app._get_current_object()
        )
    )

    thread.daemon = True
    thread.start()

    return jsonify({
        "success": True,
        "message": "Bulk email started successfully.",
        "job_id": job_id,
        "total": len(employees)
    }), 202


# ============================================================
# SEND DEPARTMENT EMAIL
# ============================================================

@email_bp.route("/send-department-email", methods=["POST"])
def send_department_email():

    data = request.get_json()

    department = data["department"]
    template_id = data["template_id"]

    employees = Employee.query.filter_by(
        department=department
    ).all()

    if not employees:

        return jsonify({
            "success": False,
            "message":
                f"No employees found in {department} department."
        }), 404

    job = EmailJob(
        job_type="DEPARTMENT",
        template_id=template_id,
        department=department,
        total=len(employees),
        sent=0,
        failed=0,
        status="PENDING"
    )

    db.session.add(job)
    db.session.commit()

    # Save job ID before starting background processing
    job_id = job.id

    thread = threading.Thread(
        target=process_email_job,
        args=(
            job_id,
            current_app._get_current_object()
        )
    )

    thread.daemon = True
    thread.start()

    return jsonify({
        "success": True,
        "message":
            "Department email started successfully.",
        "job_id": job_id,
        "department": department,
        "total": len(employees)
    }), 202


# ============================================================
# GET EMAIL JOB
# ============================================================

@email_bp.route("/email-job/<int:job_id>", methods=["GET"])
def get_email_job(job_id):

    job = EmailJob.query.get(job_id)

    if not job:

        return jsonify({
            "success": False,
            "message": "Email job not found."
        }), 404

    return jsonify({

        "success": True,

        "data": {

            "id": job.id,

            "job_type":
                job.job_type,

            "template_id":
                job.template_id,

            "department":
                job.department,

            "total":
                job.total,

            "sent":
                job.sent,

            "failed":
                job.failed,

            "status":
                job.status,

            "error_message":
                job.error_message,

            "created_at":
                job.created_at,

            "completed_at":
                job.completed_at

        }

    }), 200


# ============================================================
# TEST TODAY'S BIRTHDAYS
# ============================================================

@email_bp.route("/test-birthdays", methods=["GET"])
def test_birthdays():

    birthdays = (
        BirthdayService
        .get_todays_birthdays()
    )

    grouped = (
        BirthdayService
        .group_by_department(
            birthdays
        )
    )

    return jsonify({

        "success": True,

        "total_birthdays":
            len(birthdays),

        "birthdays": [

            {
                "id":
                    employee.id,

                "employee_id":
                    employee.employee_id,

                "name":
                    employee.name,

                "email":
                    employee.email,

                "department":
                    employee.department
            }

            for employee in birthdays

        ],

        "departments": {

            department: [

                {
                    "id":
                        employee.id,

                    "employee_id":
                        employee.employee_id,

                    "name":
                        employee.name,

                    "email":
                        employee.email

                }

                for employee in employees

            ]

            for department, employees
            in grouped.items()

        }

    }), 200


# ============================================================
# TEST BIRTHDAY SEND
# ============================================================

@email_bp.route("/test-birthday-send", methods=["POST"])
def test_birthday_send():

    try:

        result = (
            BirthdayService
            .process_birthdays()
        )

        return jsonify(result), 200

    except Exception as e:

        print(
            "BIRTHDAY EMAIL ERROR:",
            str(e)
        )

        return jsonify({

            "success": False,

            "message":
                str(e)

        }), 500


# ============================================================
# BIRTHDAY STATUS
# ============================================================

@email_bp.route("/birthday-status", methods=["GET"])
def birthday_status():

    try:

        today = date.today()

        print("=" * 60)
        print("Checking birthday status")
        print("Date:", today)
        print("=" * 60)

        # ====================================================
        # GET TODAY'S BIRTHDAYS
        # ====================================================

        birthdays = (
            BirthdayService
            .get_todays_birthdays()
        )

        grouped = (
            BirthdayService
            .group_by_department(
                birthdays
            )
        )

        # ====================================================
        # FIND TODAY'S BIRTHDAY JOB
        # ====================================================

        job = (
            EmailJob.query
            .filter_by(
                job_type="BIRTHDAY",
                process_date=today
            )
            .order_by(
                EmailJob.id.desc()
            )
            .first()
        )

        departments = []

        # ====================================================
        # PROCESS EACH DEPARTMENT
        # ====================================================

        for (
            department,
            birthday_employees
        ) in grouped.items():

            print(
                f"Checking department: {department}"
            )

            # =================================================
            # BIRTHDAY EMPLOYEE IDS
            # =================================================

            birthday_ids = [

                employee.id

                for employee
                in birthday_employees

            ]

            # =================================================
            # GET DEPARTMENT RECIPIENTS
            # EXCLUDE BIRTHDAY PERSON
            # =================================================

            recipients_query = (
                Employee.query
                .filter(
                    Employee.department ==
                    department
                )
            )

            if birthday_ids:

                recipients_query = (
                    recipients_query
                    .filter(
                        ~Employee.id.in_(
                            birthday_ids
                        )
                    )
                )

            recipients = (
                recipients_query
                .all()
            )

            recipient_ids = [

                employee.id

                for employee
                in recipients

            ]

            # =================================================
            # GET TODAY'S EMAIL LOGS
            # =================================================

            today_logs = []

            if recipient_ids:

                today_logs = (

                    EmailLog.query

                    .filter(

                        EmailLog.employee_id.in_(
                            recipient_ids
                        ),

                        db.func.date(
                            EmailLog.sent_at
                        ) == today

                    )

                    .order_by(
                        EmailLog.sent_at.desc()
                    )

                    .all()

                )

            # =================================================
            # KEEP ONLY LATEST LOG
            # FOR EACH EMPLOYEE
            # =================================================

            latest_logs = {}

            for log in today_logs:

                if (
                    log.employee_id
                    not in latest_logs
                ):

                    latest_logs[
                        log.employee_id
                    ] = log

            # =================================================
            # COUNT SENT / FAILED
            # =================================================

            sent = 0
            failed = 0

            for (
                employee_id,
                log
            ) in latest_logs.items():

                if log.status == "SUCCESS":

                    sent += 1

                elif log.status == "FAILED":

                    failed += 1

            # =================================================
            # DETERMINE STATUS
            # =================================================

            if (
                sent == len(recipients)
                and len(recipients) > 0
            ):

                status = "SUCCESS"

            elif (
                failed > 0
                and sent > 0
            ):

                status = "PARTIAL"

            elif failed > 0:

                status = "FAILED"

            else:

                status = "PENDING"

            # =================================================
            # DEPARTMENT RESULT
            # =================================================

            departments.append({

                "department":
                    department,

                "birthday_count":
                    len(
                        birthday_employees
                    ),

                "announcement_recipients":
                    len(recipients),

                "sent":
                    sent,

                "failed":
                    failed,

                "status":
                    status,

                "birthdays": [

                    {

                        "id":
                            employee.id,

                        "employee_id":
                            employee.employee_id,

                        "name":
                            employee.name,

                        "email":
                            employee.email

                    }

                    for employee
                    in birthday_employees

                ]

            })

        # ====================================================
        # RESPONSE
        # ====================================================

        return jsonify({

            "success": True,

            "date":
                today.isoformat(),

            "total_birthdays":
                len(birthdays),

            "birthdays": [

                {

                    "id":
                        employee.id,

                    "employee_id":
                        employee.employee_id,

                    "name":
                        employee.name,

                    "email":
                        employee.email,

                    "department":
                        employee.department

                }

                for employee
                in birthdays

            ],

            "departments":
                departments,

            "job": (

                {

                    "id":
                        job.id,

                    "job_type":
                        job.job_type,

                    "process_date":
                        job.process_date,

                    "total":
                        job.total,

                    "sent":
                        job.sent,

                    "failed":
                        job.failed,

                    "status":
                        job.status,

                    "error_message":
                        job.error_message,

                    "created_at":
                        job.created_at,

                    "completed_at":
                        job.completed_at

                }

                if job
                else None

            )

        }), 200

    except Exception as e:

        print(
            "BIRTHDAY STATUS ERROR:",
            str(e)
        )

        return jsonify({

            "success": False,

            "message":
                str(e)

        }), 500