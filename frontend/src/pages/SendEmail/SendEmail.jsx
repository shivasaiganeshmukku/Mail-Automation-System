import api from "../../services/api";

import { useEffect, useState } from "react";

import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";

import EmployeeService from "../../services/employeeService";
import EmailTemplateService from "../../services/emailTemplateService";

function SendEmail() {

    const [employees, setEmployees] = useState([]);
    const [templates, setTemplates] = useState([]);

    const [employeeId, setEmployeeId] = useState("");
    const [templateId, setTemplateId] = useState("");

    const [sendMode, setSendMode] = useState("INDIVIDUAL");
    const [department, setDepartment] = useState("");

    // Loading state
    const [sending, setSending] = useState(false);

    // Background email job
    const [job, setJob] = useState(null);
    const [jobId, setJobId] = useState(null);

    // Snackbar notification
    const [notification, setNotification] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    // Confirmation dialog
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmData, setConfirmData] = useState(null);


    // --------------------------------------------------
    // LOAD EMPLOYEES AND TEMPLATES
    // --------------------------------------------------

    useEffect(() => {

        EmployeeService.getAllEmployees()
            .then((response) => {

                console.log(
                    "EMPLOYEES:",
                    response.data.data
                );

                setEmployees(response.data.data);

            })
            .catch((error) => {

                console.error(
                    "GET EMPLOYEES ERROR:",
                    error
                );

                showNotification(
                    "Failed to load employees.",
                    "error"
                );

            });


        EmailTemplateService.getAllTemplates()
            .then((response) => {

                console.log(
                    "TEMPLATES:",
                    response.data.data
                );

                setTemplates(response.data.data);

            })
            .catch((error) => {

                console.error(
                    "GET TEMPLATES ERROR:",
                    error
                );

                showNotification(
                    "Failed to load email templates.",
                    "error"
                );

            });

    }, []);


    // --------------------------------------------------
    // SHOW NOTIFICATION
    // --------------------------------------------------

    const showNotification = (
        message,
        severity = "success"
    ) => {

        setNotification({
            open: true,
            message: message,
            severity: severity
        });

    };


    // --------------------------------------------------
    // CLOSE NOTIFICATION
    // --------------------------------------------------

    const handleCloseNotification = () => {

        setNotification({
            ...notification,
            open: false
        });

    };


    // --------------------------------------------------
    // DEPARTMENTS
    // --------------------------------------------------

    const departments = [
        ...new Set(
            employees
                .map((employee) => employee.department)
                .filter(Boolean)
        )
    ];


    // --------------------------------------------------
    // JOB STATUS POLLING
    // --------------------------------------------------

    useEffect(() => {

        if (!jobId) {
            return;
        }

        let interval;

        const checkJobStatus = () => {

            api.get(`/email-job/${jobId}`)
                .then((response) => {

                    const jobData =
                        response.data.data;

                    console.log(
                        "JOB STATUS:",
                        jobData
                    );

                    setJob(jobData);


                    // Job completed
                    if (
                        jobData.status === "COMPLETED"
                    ) {

                        clearInterval(interval);

                        setJobId(null);
                        setSending(false);

                        showNotification(
                            `Email job completed. Total: ${jobData.total}, Sent: ${jobData.sent}, Failed: ${jobData.failed}`,
                            jobData.failed > 0
                                ? "warning"
                                : "success"
                        );

                    }


                    // Job failed
                    else if (
                        jobData.status === "FAILED"
                    ) {

                        clearInterval(interval);

                        setJobId(null);
                        setSending(false);

                        showNotification(
                            jobData.error_message ||
                            "Email job failed.",
                            "error"
                        );

                    }

                })
                .catch((error) => {

                    console.error(
                        "JOB STATUS ERROR:",
                        error
                    );

                });

        };


        // Check immediately
        checkJobStatus();


        // Check every 2 seconds
        interval = setInterval(
            checkJobStatus,
            2000
        );


        // Cleanup
        return () => {

            clearInterval(interval);

        };

    }, [jobId]);


    // --------------------------------------------------
    // START SEND PROCESS
    // --------------------------------------------------

    const handleSendEmail = () => {

        if (sending) {
            return;
        }


        // Template validation
        if (!templateId) {

            showNotification(
                "Please select an email template.",
                "warning"
            );

            return;
        }


        // --------------------------------------------------
        // INDIVIDUAL
        // --------------------------------------------------

        if (sendMode === "INDIVIDUAL") {

            if (!employeeId) {

                showNotification(
                    "Please select an employee.",
                    "warning"
                );

                return;
            }


            const selectedEmployee =
                employees.find(
                    (employee) =>
                        employee.id === employeeId
                );


            setConfirmData({

                endpoint:
                    "/send-template-email",

                data: {
                    employee_id: employeeId,
                    template_id: templateId
                },

                message:
                    `Send email to ${selectedEmployee?.name}?`

            });


            setConfirmOpen(true);

            return;
        }


        // --------------------------------------------------
        // BULK
        // --------------------------------------------------

        if (sendMode === "BULK") {

            setConfirmData({

                endpoint:
                    "/send-bulk-email",

                data: {
                    template_id: templateId
                },

                message:
                    `Send email to all ${employees.length} employees?`

            });


            setConfirmOpen(true);

            return;
        }


        // --------------------------------------------------
        // DEPARTMENT
        // --------------------------------------------------

        if (sendMode === "DEPARTMENT") {

            if (!department) {

                showNotification(
                    "Please select a department.",
                    "warning"
                );

                return;
            }


            const departmentEmployees =
                employees.filter(
                    (employee) =>
                        employee.department === department
                );


            setConfirmData({

                endpoint:
                    "/send-department-email",

                data: {
                    department: department,
                    template_id: templateId
                },

                message:
                    `Send email to ${departmentEmployees.length} employees in ${department} department?`

            });


            setConfirmOpen(true);

            return;
        }

    };


    // --------------------------------------------------
    // CONFIRM AND SEND
    // --------------------------------------------------

    const handleConfirmSend = () => {

        if (!confirmData) {
            return;
        }


        setConfirmOpen(false);

        setSending(true);

        setJob(null);

        console.log(
            "SENDING:",
            confirmData
        );


        api.post(
            confirmData.endpoint,
            confirmData.data
        )

            .then((response) => {

                console.log(
                    "EMAIL OPERATION SUCCESS:",
                    response.data
                );


                // --------------------------------------------------
                // INDIVIDUAL
                // --------------------------------------------------

                if (
                    sendMode === "INDIVIDUAL"
                ) {

                    setSending(false);

                    showNotification(
                        "Email sent successfully!",
                        "success"
                    );

                }


                // --------------------------------------------------
                // BULK
                // --------------------------------------------------

                else if (
                    sendMode === "BULK"
                ) {

                    const newJobId =
                        response.data.job_id;


                    console.log(
                        "BULK JOB ID:",
                        newJobId
                    );


                    // Start polling
                    setJobId(newJobId);


                    showNotification(
                        `Bulk email started. Total employees: ${response.data.total}`,
                        "success"
                    );

                    // DO NOT setSending(false)
                    // Background job is still running.
                }


                // --------------------------------------------------
                // DEPARTMENT
                // --------------------------------------------------

                else if (
                    sendMode === "DEPARTMENT"
                ) {

                    const newJobId =
                        response.data.job_id;


                    console.log(
                        "DEPARTMENT JOB ID:",
                        newJobId
                    );


                    // Start polling
                    setJobId(newJobId);


                    showNotification(
                        `Department email started. Department: ${response.data.department}, Total employees: ${response.data.total}`,
                        "success"
                    );

                    // DO NOT setSending(false)
                    // Background job is still running.
                }

            })

            .catch((error) => {

                console.error(
                    "EMAIL OPERATION ERROR:",
                    error
                );


                setSending(false);


                if (error.response) {

                    showNotification(
                        "Error sending email: " +
                        JSON.stringify(
                            error.response.data
                        ),
                        "error"
                    );

                }

                else {

                    showNotification(
                        "Error sending email. Check the backend.",
                        "error"
                    );

                }

            });

    };


    // --------------------------------------------------
    // CALCULATE PROGRESS
    // --------------------------------------------------

    const getProgress = () => {

        if (!job || !job.total) {
            return 0;
        }


        const processed =
            job.sent + job.failed;


        return Math.min(
            (processed / job.total) * 100,
            100
        );

    };


    // --------------------------------------------------
    // UI
    // --------------------------------------------------

    return (
        <>

            <Typography
                variant="h4"
                sx={{ mb: 3 }}
            >
                Send Email
            </Typography>


            <Paper sx={{ p: 3 }}>

                <Stack spacing={3}>


                    {/* SEND MODE */}

                    <TextField
                        select
                        label="Send Mode"
                        value={sendMode}
                        onChange={(event) => {

                            setSendMode(
                                event.target.value
                            );

                            setEmployeeId("");
                            setDepartment("");

                        }}
                        fullWidth
                    >

                        <MenuItem value="INDIVIDUAL">
                            Individual Employee
                        </MenuItem>

                        <MenuItem value="BULK">
                            All Employees
                        </MenuItem>

                        <MenuItem value="DEPARTMENT">
                            Department
                        </MenuItem>

                    </TextField>


                    {/* INDIVIDUAL EMPLOYEE */}

                    {sendMode === "INDIVIDUAL" && (

                        <Autocomplete
                            options={employees}

                            getOptionLabel={(employee) =>
                                `${employee.employee_id} - ${employee.name}`
                            }

                            value={
                                employees.find(
                                    (employee) =>
                                        employee.id === employeeId
                                ) || null
                            }

                            onChange={(
                                event,
                                newValue
                            ) => {

                                setEmployeeId(
                                    newValue
                                        ? newValue.id
                                        : ""
                                );

                            }}

                            isOptionEqualToValue={(
                                option,
                                value
                            ) =>
                                option.id === value.id
                            }

                            renderInput={(params) => (

                                <TextField
                                    {...params}
                                    label="Employee"
                                    placeholder="Search by ID or name"
                                />

                            )}

                        />

                    )}


                    {/* DEPARTMENT */}

                    {sendMode === "DEPARTMENT" && (

                        <Autocomplete
                            options={departments}

                            value={department}

                            onChange={(
                                event,
                                newValue
                            ) => {

                                setDepartment(
                                    newValue || ""
                                );

                            }}

                            renderInput={(params) => (

                                <TextField
                                    {...params}
                                    label="Department"
                                    placeholder="Search department"
                                />

                            )}

                        />

                    )}


                    {/* EMAIL TEMPLATE */}

                    <Autocomplete
                        options={templates}

                        getOptionLabel={(template) =>
                            template.template_name
                        }

                        value={
                            templates.find(
                                (template) =>
                                    template.id === templateId
                            ) || null
                        }

                        onChange={(
                            event,
                            newValue
                        ) => {

                            setTemplateId(
                                newValue
                                    ? newValue.id
                                    : ""
                            );

                        }}

                        isOptionEqualToValue={(
                            option,
                            value
                        ) =>
                            option.id === value.id
                        }

                        renderInput={(params) => (

                            <TextField
                                {...params}
                                label="Email Template"
                                placeholder="Search template by name"
                            />

                        )}

                    />


                    {/* SEND BUTTON */}

                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleSendEmail}
                        disabled={sending}
                    >

                        {sending
                            ? "Sending..."
                            : "Send Email"}

                    </Button>


                    {/* --------------------------------------------------
                        EMAIL JOB PROGRESS
                    -------------------------------------------------- */}

                    {job && (

                        <Paper
                            elevation={2}
                            sx={{
                                p: 3,
                                mt: 2
                            }}
                        >

                            <Typography
                                variant="h6"
                                sx={{ mb: 2 }}
                            >
                                Email Progress
                            </Typography>


                            <Typography
                                sx={{ mb: 1 }}
                            >
                                Status:{" "}

                                <strong>
                                    {job.status}
                                </strong>
                            </Typography>


                            <Typography>
                                Total: {job.total}
                            </Typography>


                            <Typography>
                                Sent: {job.sent}
                            </Typography>


                            <Typography>
                                Failed: {job.failed}
                            </Typography>


                            <Typography
                                sx={{ mt: 1, mb: 1 }}
                            >
                                Processed:{" "}
                                {job.sent + job.failed}
                                {" / "}
                                {job.total}
                            </Typography>


                            {/* PROGRESS BAR */}

                            <Box sx={{ mt: 2 }}>

                                <LinearProgress
                                    variant="determinate"
                                    value={getProgress()}
                                />

                            </Box>


                            <Typography
                                align="right"
                                sx={{ mt: 1 }}
                            >
                                {getProgress().toFixed(1)}%
                            </Typography>

                        </Paper>

                    )}

                </Stack>

            </Paper>


            {/* --------------------------------------------------
                CONFIRMATION DIALOG
            -------------------------------------------------- */}

            <Dialog
                open={confirmOpen}
                onClose={() => {

                    if (!sending) {
                        setConfirmOpen(false);
                    }

                }}
            >

                <DialogTitle>
                    Confirm Email Sending
                </DialogTitle>


                <DialogContent>

                    {confirmData?.message}

                </DialogContent>


                <DialogActions>

                    <Button
                        onClick={() =>
                            setConfirmOpen(false)
                        }
                        disabled={sending}
                    >
                        Cancel
                    </Button>


                    <Button
                        variant="contained"
                        onClick={handleConfirmSend}
                        disabled={sending}
                    >
                        Confirm Send
                    </Button>

                </DialogActions>

            </Dialog>


            {/* --------------------------------------------------
                NOTIFICATION
            -------------------------------------------------- */}

            <Snackbar
                open={notification.open}
                autoHideDuration={4000}
                onClose={
                    handleCloseNotification
                }
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right"
                }}
            >

                <Alert
                    onClose={
                        handleCloseNotification
                    }
                    severity={
                        notification.severity
                    }
                    variant="filled"
                    sx={{
                        width: "100%"
                    }}
                >

                    {notification.message}

                </Alert>

            </Snackbar>

        </>

    );

}

export default SendEmail;