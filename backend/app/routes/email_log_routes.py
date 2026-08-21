from flask import Blueprint, jsonify

from app.services.email_log_service import EmailLogService

email_log_bp = Blueprint("email_log", __name__)


@email_log_bp.route("/email-logs", methods=["GET"])
def get_all_logs():

    result = EmailLogService.get_all_logs()

    return jsonify(result), 200