from flask import Blueprint, jsonify

from app.services.dashboard_service import DashboardService

dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.route("/dashboard", methods=["GET"])
def get_dashboard():

    result = DashboardService.get_summary()

    return jsonify(result), 200
