import api from "./api";

const DashboardService = {

    getSummary: () => {
        return api.get("/dashboard");
    }

};

export default DashboardService;