from flask import Blueprint, request, jsonify

from app.services.employee_service import EmployeeService


employee_bp = Blueprint(
    "employee_bp",
    __name__
)


@employee_bp.route(
    "/employees",
    methods=["POST"]
)
def create_employee():

    data = request.get_json()

    result = EmployeeService.create_employee(
        data
    )

    if result["success"]:

        return jsonify(result), 201

    return jsonify(result), 400


@employee_bp.route(
    "/employees",
    methods=["GET"]
)
def get_all_employees():

    result = EmployeeService.get_all_employees()

    return jsonify(result), 200


@employee_bp.route(
    "/employees/<int:employee_id>",
    methods=["PUT"]
)
def update_employee(employee_id):

    data = request.get_json()

    result = EmployeeService.update_employee(
        employee_id,
        data
    )

    if result["success"]:

        return jsonify(result), 200

    return jsonify(result), 404


@employee_bp.route(
    "/employees/<int:employee_id>",
    methods=["DELETE"]
)
def delete_employee(employee_id):

    result = EmployeeService.delete_employee(
        employee_id
    )

    if result["success"]:

        return jsonify(result), 200

    return jsonify(result), 404


# ============================================================
# EXCEL IMPORT
# ============================================================

@employee_bp.route(
    "/employees/import",
    methods=["POST"]
)
def import_employees():

    if "file" not in request.files:

        return jsonify({

            "success": False,

            "message":
                "No Excel file provided."

        }), 400


    file = request.files["file"]


    if file.filename == "":

        return jsonify({

            "success": False,

            "message":
                "No file selected."

        }), 400


    if not file.filename.lower().endswith(
        ".xlsx"
    ):

        return jsonify({

            "success": False,

            "message":
                "Only .xlsx Excel files are allowed."

        }), 400


    result = EmployeeService.import_from_excel(
        file
    )


    if result["success"]:

        return jsonify(result), 201


    return jsonify(result), 400