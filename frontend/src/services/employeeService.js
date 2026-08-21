import api from "./api";

const EmployeeService = {

    getAllEmployees: () => {
        return api.get("/employees");
    },

    createEmployee: (employee) => {
        return api.post("/employees", employee);
    },

    updateEmployee: (id, employee) => {
        return api.put(`/employees/${id}`, employee);
    },

    deleteEmployee: (id) => {
        return api.delete(`/employees/${id}`);
    },

    uploadEmployees: (file) => {

        const formData = new FormData();

        formData.append("file", file);

        return api.post(
            "/upload/employees",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        );
    }

};

export default EmployeeService;