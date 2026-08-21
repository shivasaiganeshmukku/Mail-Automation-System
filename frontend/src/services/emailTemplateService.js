import api from "./api";

const EmailTemplateService = {

    getAllTemplates: () => {
        return api.get("/templates");
    },

    createTemplate: (template) => {
        return api.post("/templates", template);
    },

    getTemplateById: (id) => {
        return api.get(`/templates/${id}`);
    },

    updateTemplate: (id, template) => {
        return api.put(`/templates/${id}`, template);
    },

    deleteTemplate: (id) => {
        return api.delete(`/templates/${id}`);
    }

};

export default EmailTemplateService;