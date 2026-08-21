import api from "./api";

const EmailLogService = {

    getAllLogs: () => {
        return api.get("/email-logs");
    }

};

export default EmailLogService;