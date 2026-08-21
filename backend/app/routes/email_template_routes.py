from flask import Blueprint, request, jsonify

from app.services.email_template_service import EmailTemplateService

template_bp = Blueprint("template", __name__)


@template_bp.route("/templates", methods=["POST"])
def create_template():

    data = request.get_json()

    result = EmailTemplateService.create_template(data)

    return jsonify(result), 201


@template_bp.route("/templates", methods=["GET"])
def get_all_templates():

    result = EmailTemplateService.get_all_templates()

    return jsonify(result), 200


@template_bp.route("/templates/<int:template_id>", methods=["GET"])
def get_template_by_id(template_id):

    result = EmailTemplateService.get_template_by_id(template_id)

    if not result["success"]:
        return jsonify(result), 404

    return jsonify(result), 200


@template_bp.route("/templates/<int:template_id>", methods=["PUT"])
def update_template(template_id):

    data = request.get_json()

    result = EmailTemplateService.update_template(
        template_id,
        data
    )

    if not result["success"]:
        return jsonify(result), 404

    return jsonify(result), 200


@template_bp.route("/templates/<int:template_id>", methods=["DELETE"])
def delete_template(template_id):

    result = EmailTemplateService.delete_template(template_id)

    if not result["success"]:
        return jsonify(result), 404

    return jsonify(result), 200