from flask import Blueprint, request, jsonify
from app.services.upload_service import UploadService

upload_bp = Blueprint("upload_bp", __name__)


@upload_bp.route("/employees", methods=["POST"])
def upload_employee_file():

    if "file" not in request.files:
        return jsonify({
            "success": False,
            "message": "No file selected"
        }), 400

    file = request.files["file"]

    result = UploadService.read_excel(file)

    return jsonify(result), 200