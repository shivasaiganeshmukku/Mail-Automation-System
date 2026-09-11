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

@email_bp.route(
    "/email-job/<int:job_id>",
    methods=["GET"]
)
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

            "id":
                job.id,

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

@email_bp.route(
    "/test-birthdays",
    methods=["GET"]
)
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

@email_bp.route(
    "/test-birthday-send",
    methods=["POST"]
)
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

            "success":
                False,

            "message":
                str(e)

        }), 500


# ============================================================
# BIRTHDAY STATUS
# ============================================================

@email_bp.route(
    "/birthday-status",
    methods=["GET"]
)
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


        # ====================================================
        # CHECK PERSONAL BIRTHDAY EMAIL STATUS
        # ====================================================

        birthday_status_map = {}

        birthday_ids = [
            employee.id
            for employee in birthdays
        ]


        if birthday_ids:

            birthday_logs = (

                EmailLog.query

                .filter(

                    EmailLog.employee_id.in_(
                        birthday_ids
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


            for log in birthday_logs:

                # Already found a birthday status
                # for this employee
                if (
                    log.employee_id
                    in birthday_status_map
                ):

                    continue


                # Find the birthday employee
                employee = next(

                    (
                        employee

                        for employee
                        in birthdays

                        if employee.id ==
                        log.employee_id

                    ),

                    None

                )


                if not employee:
                    continue


                # Generate all possible birthday subjects
                birthday_subjects = [

                    BirthdayService.replace_variables(
                        subject,
                        employee
                    )

                    for subject, body
                    in BirthdayService.BIRTHDAY_MESSAGES

                ]


                # Only consider birthday email logs
                if log.subject in birthday_subjects:

                    birthday_status_map[
                        log.employee_id
                    ] = (
                        log.status == "SUCCESS"
                    )


        # ====================================================
        # GROUP BIRTHDAYS BY DEPARTMENT
        # ====================================================

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
                f"Checking department: "
                f"{department}"
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
            # GENERATE THE EXACT ANNOUNCEMENT SUBJECT
            # =================================================
            #
            # IMPORTANT:
            # Use the same method used by
            # BirthdayService.send_department_announcement()
            #
            # This prevents subject mismatches.
            # =================================================

            announcement_subject, _ = (

                BirthdayService
                .generate_department_announcement(
                    birthday_employees
                )

            )


            print(
                "Birthday announcement subject:",
                announcement_subject
            )


            # =================================================
            # GET ONLY TODAY'S BIRTHDAY ANNOUNCEMENT LOGS
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
                        ) == today,

                        EmailLog.subject ==
                            announcement_subject

                    )

                    .order_by(
                        EmailLog.sent_at.desc()
                    )

                    .all()

                )


            print(
                f"Found {len(today_logs)} "
                f"birthday announcement logs "
                f"for {department}"
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

                len(recipients) > 0

                and

                sent ==
                len(recipients)

            ):

                status = "SUCCESS"


            elif (

                failed > 0

                and

                sent > 0

            ):

                status = "PARTIAL"


            elif failed > 0:

                status = "FAILED"


            else:

                status = "PENDING"


            print(

                f"{department}: "
                f"Recipients={len(recipients)}, "
                f"Sent={sent}, "
                f"Failed={failed}, "
                f"Status={status}"

            )


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
                    len(
                        recipients
                    ),

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

            "success":
                True,

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
                        employee.department,

                    "wishes_sent":
                        birthday_status_map.get(
                            employee.id,
                            False
                        )

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

            "success":
                False,

            "message":
                str(e)

        }), 500


# ============================================================
# MANUAL BIRTHDAY SEND
# ============================================================

@email_bp.route(
    "/birthday-send/<int:employee_id>",
    methods=["POST"]
)
def birthday_send(employee_id):

    try:

        today = date.today()


        # ====================================================
        # FIND EMPLOYEE
        # ====================================================

        employee = (
            Employee.query
            .get(employee_id)
        )


        if not employee:

            return jsonify({

                "success":
                    False,

                "message":
                    "Employee not found."

            }), 404


        # ====================================================
        # VERIFY TODAY IS THE EMPLOYEE'S BIRTHDAY
        # ====================================================

        if (

            employee.dob.month !=
            today.month

            or

            employee.dob.day !=
            today.day

        ):

            return jsonify({

                "success":
                    False,

                "message":
                    "This employee does not have a birthday today."

            }), 400


        # ====================================================
        # CHECK PERSONAL BIRTHDAY EMAIL STATUS
        # ====================================================

        existing_logs = (

            EmailLog.query

            .filter(

                EmailLog.employee_id ==
                employee.id,

                db.func.date(
                    EmailLog.sent_at
                ) == today

            )

            .order_by(
                EmailLog.sent_at.desc()
            )

            .all()

        )


        birthday_subjects = [

            BirthdayService.replace_variables(
                subject,
                employee
            )

            for subject, body
            in BirthdayService.BIRTHDAY_MESSAGES

        ]


        personal_already_sent = False


        for log in existing_logs:

            if (

                log.status ==
                "SUCCESS"

                and

                log.subject
                in birthday_subjects

            ):

                personal_already_sent = True

                break


        # ====================================================
        # SEND PERSONAL BIRTHDAY EMAIL
        # ONLY IF NOT ALREADY SENT
        # ====================================================

        if personal_already_sent:

            print(
                f"Personal birthday email already "
                f"sent to {employee.email}."
            )

            personal_result = {

                "success":
                    True,

                "message":
                    "Personal birthday wishes already sent."

            }

        else:

            personal_result = (

                BirthdayService
                .send_birthday_email(
                    employee
                )

            )


            if not personal_result["success"]:

                return jsonify({

                    "success":
                        False,

                    "message":
                        personal_result["message"],

                    "personal_sent":
                        False,

                    "department_sent":
                        0,

                    "department_failed":
                        0

                }), 500


        # ====================================================
        # CHECK WHETHER DEPARTMENT ANNOUNCEMENT
        # IS ALREADY COMPLETELY SENT
        # ====================================================

        department = employee.department


        # Get all birthday employees in the same department
        birthdays_in_department = [

            birthday_employee

            for birthday_employee
            in BirthdayService.get_todays_birthdays()

            if birthday_employee.department ==
            department

        ]


        # If somehow the current employee is not included,
        # make sure it is included.
        if not any(

            birthday_employee.id ==
            employee.id

            for birthday_employee
            in birthdays_in_department

        ):

            birthdays_in_department.append(
                employee
            )


        # ====================================================
        # GET DEPARTMENT RECIPIENTS
        # ====================================================

        birthday_employee_ids = {

            birthday_employee.id

            for birthday_employee
            in birthdays_in_department

        }


        recipients = (

            Employee.query

            .filter(

                Employee.department ==
                department,

                ~Employee.id.in_(
                    birthday_employee_ids
                )

            )

            .all()

        )


        recipient_ids = [

            recipient.id

            for recipient
            in recipients

        ]


        # ====================================================
        # GENERATE EXACT DEPARTMENT SUBJECT
        # ====================================================

        announcement_subject, _ = (

            BirthdayService
            .generate_department_announcement(
                birthdays_in_department
            )

        )


        # ====================================================
        # CHECK EXISTING DEPARTMENT LOGS
        # ====================================================

        department_logs = []


        if recipient_ids:

            department_logs = (

                EmailLog.query

                .filter(

                    EmailLog.employee_id.in_(
                        recipient_ids
                    ),

                    db.func.date(
                        EmailLog.sent_at
                    ) == today,

                    EmailLog.subject ==
                        announcement_subject

                )

                .order_by(
                    EmailLog.sent_at.desc()
                )

                .all()

            )


        # ====================================================
        # KEEP LATEST LOG PER RECIPIENT
        # ====================================================

        latest_department_logs = {}


        for log in department_logs:

            if (
                log.employee_id
                not in latest_department_logs
            ):

                latest_department_logs[
                    log.employee_id
                ] = log


        department_sent = sum(

            1

            for log
            in latest_department_logs.values()

            if log.status ==
            "SUCCESS"

        )


        department_failed = sum(

            1

            for log
            in latest_department_logs.values()

            if log.status ==
            "FAILED"

        )


        # ====================================================
        # DETERMINE WHETHER DEPARTMENT IS ALREADY COMPLETE
        # ====================================================

        department_already_complete = (

            len(recipients) == 0

            or

            department_sent ==
            len(recipients)

        )


        # ====================================================
        # SEND DEPARTMENT ANNOUNCEMENT
        # ONLY IF IT IS NOT ALREADY COMPLETE
        # ====================================================

        if department_already_complete:

            print(
                f"Department announcement for "
                f"{department} is already complete."
            )

            department_result = {

                "department":
                    department,

                "birthday_count":
                    len(
                        birthdays_in_department
                    ),

                "announcement_recipients":
                    len(recipients),

                "sent":
                    department_sent,

                "failed":
                    department_failed

            }

        else:

            department_result = (

                BirthdayService
                .send_department_announcement(

                    department,

                    birthdays_in_department

                )

            )


        # ====================================================
        # FINAL COUNTS
        # ====================================================

        final_department_sent = (

            department_result.get(
                "sent",
                0
            )

        )


        final_department_failed = (

            department_result.get(
                "failed",
                0
            )

        )


        # ====================================================
        # FINAL MESSAGE
        # ====================================================

        if final_department_failed > 0:

            message = (

                "Birthday wish sent, "
                "but some department "
                "announcements failed."

            )

        else:

            message = (
                "Birthday wishes sent successfully."
            )


        # ====================================================
        # RESPONSE
        # ====================================================

        return jsonify({

            "success":
                True,

            "message":
                message,

            "already_sent":
                personal_already_sent,

            "personal_sent":
                True,

            "department_sent":
                final_department_sent,

            "department_failed":
                final_department_failed

        }), 200


    except Exception as e:

        print(
            "MANUAL BIRTHDAY SEND ERROR:",
            str(e)
        )

        return jsonify({

            "success":
                False,

            "message":
                str(e)

        }), 500