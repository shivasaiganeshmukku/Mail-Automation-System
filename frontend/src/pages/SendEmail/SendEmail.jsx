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

import EmailIcon from "@mui/icons-material/Email";
import SendIcon from "@mui/icons-material/Send";
import PersonIcon from "@mui/icons-material/Person";
import GroupsIcon from "@mui/icons-material/Groups";
import ApartmentIcon from "@mui/icons-material/Apartment";
import DescriptionIcon from "@mui/icons-material/Description";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import ScheduleSendIcon from "@mui/icons-material/ScheduleSend";
import CloseIcon from "@mui/icons-material/Close";

import EmployeeService from "../../services/employeeService";
import EmailTemplateService from "../../services/emailTemplateService";


function SendEmail() {

    const [employees, setEmployees] = useState([]);
    const [templates, setTemplates] = useState([]);

    const [employeeId, setEmployeeId] = useState("");
    const [templateId, setTemplateId] = useState("");

    const [sendMode, setSendMode] = useState("INDIVIDUAL");
    const [department, setDepartment] = useState("");

    const [sending, setSending] = useState(false);

    const [job, setJob] = useState(null);
    const [jobId, setJobId] = useState(null);

    const [notification, setNotification] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmData, setConfirmData] = useState(null);


    // ============================================================
    // LOAD EMPLOYEES AND TEMPLATES
    // ============================================================

    useEffect(() => {

        EmployeeService.getAllEmployees()

            .then((response) => {

                console.log(
                    "EMPLOYEES:",
                    response.data.data
                );

                setEmployees(
                    response.data.data
                );

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

                setTemplates(
                    response.data.data
                );

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


    // ============================================================
    // NOTIFICATION
    // ============================================================

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


    const handleCloseNotification = () => {

        setNotification({
            ...notification,
            open: false
        });

    };


    // ============================================================
    // DEPARTMENTS
    // ============================================================

    const departments = [
        ...new Set(
            employees
                .map(
                    (employee) =>
                        employee.department
                )
                .filter(Boolean)
        )
    ];


    // ============================================================
    // JOB STATUS POLLING
    // ============================================================

    useEffect(() => {

        if (!jobId) {
            return;
        }

        let interval;


        const checkJobStatus = () => {

            api.get(
                `/email-job/${jobId}`
            )

                .then((response) => {

                    const jobData =
                        response.data.data;

                    console.log(
                        "JOB STATUS:",
                        jobData
                    );

                    setJob(jobData);


                    // JOB COMPLETED

                    if (
                        jobData.status ===
                        "COMPLETED"
                    ) {

                        clearInterval(
                            interval
                        );

                        setJobId(null);

                        setSending(false);

                        showNotification(
                            `Email job completed. Total: ${jobData.total}, Sent: ${jobData.sent}, Failed: ${jobData.failed}`,
                            jobData.failed > 0
                                ? "warning"
                                : "success"
                        );

                    }


                    // JOB FAILED

                    else if (
                        jobData.status ===
                        "FAILED"
                    ) {

                        clearInterval(
                            interval
                        );

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


        checkJobStatus();


        interval = setInterval(
            checkJobStatus,
            2000
        );


        return () => {

            clearInterval(
                interval
            );

        };

    }, [jobId]);


    // ============================================================
    // START SEND PROCESS
    // ============================================================

    const handleSendEmail = () => {

        if (sending) {
            return;
        }


        // TEMPLATE VALIDATION

        if (!templateId) {

            showNotification(
                "Please select an email template.",
                "warning"
            );

            return;
        }


        // ========================================================
        // INDIVIDUAL
        // ========================================================

        if (
            sendMode ===
            "INDIVIDUAL"
        ) {

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
                        String(employee.id) ===
                        String(employeeId)
                );


            setConfirmData({

                endpoint:
                    "/send-template-email",

                data: {

                    employee_id:
                        employeeId,

                    template_id:
                        templateId

                },

                message:
                    `Send email to ${selectedEmployee?.name}?`

            });


            setConfirmOpen(true);

            return;
        }


        // ========================================================
        // BULK
        // ========================================================

        if (
            sendMode ===
            "BULK"
        ) {

            setConfirmData({

                endpoint:
                    "/send-bulk-email",

                data: {

                    template_id:
                        templateId

                },

                message:
                    `Send email to all ${employees.length} employees?`

            });


            setConfirmOpen(true);

            return;
        }


        // ========================================================
        // DEPARTMENT
        // ========================================================

        if (
            sendMode ===
            "DEPARTMENT"
        ) {

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
                        employee.department ===
                        department
                );


            setConfirmData({

                endpoint:
                    "/send-department-email",

                data: {

                    department:
                        department,

                    template_id:
                        templateId

                },

                message:
                    `Send email to ${departmentEmployees.length} employees in ${department} department?`

            });


            setConfirmOpen(true);

            return;
        }

    };


    // ============================================================
    // CONFIRM AND SEND
    // ============================================================

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


                // ==================================================
                // INDIVIDUAL
                // ==================================================

                if (
                    sendMode ===
                    "INDIVIDUAL"
                ) {

                    setSending(false);

                    showNotification(
                        "Email sent successfully!",
                        "success"
                    );

                }


                // ==================================================
                // BULK
                // ==================================================

                else if (
                    sendMode ===
                    "BULK"
                ) {

                    const newJobId =
                        response.data.job_id;


                    console.log(
                        "BULK JOB ID:",
                        newJobId
                    );


                    setJobId(
                        newJobId
                    );


                    showNotification(
                        `Bulk email started. Total employees: ${response.data.total}`,
                        "success"
                    );

                }


                // ==================================================
                // DEPARTMENT
                // ==================================================

                else if (
                    sendMode ===
                    "DEPARTMENT"
                ) {

                    const newJobId =
                        response.data.job_id;


                    console.log(
                        "DEPARTMENT JOB ID:",
                        newJobId
                    );


                    setJobId(
                        newJobId
                    );


                    showNotification(
                        `Department email started. Department: ${response.data.department}, Total employees: ${response.data.total}`,
                        "success"
                    );

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


    // ============================================================
    // PROGRESS
    // ============================================================

    const getProgress = () => {

        if (
            !job ||
            !job.total
        ) {

            return 0;

        }


        const processed =
            job.sent +
            job.failed;


        return Math.min(
            (processed /
                job.total) *
            100,
            100
        );

    };


    // ============================================================
    // SELECTED EMPLOYEE
    // ============================================================

    const selectedEmployee =
        employees.find(
            (employee) =>
                String(employee.id) ===
                String(employeeId)
        ) || null;


    // ============================================================
    // SELECTED TEMPLATE
    // ============================================================

    const selectedTemplate =
        templates.find(
            (template) =>
                String(template.id) ===
                String(templateId)
        ) || null;


    // ============================================================
    // UI
    // ============================================================

    return (

        <Box
            sx={{
                width: "100%",
                minHeight:
                    "calc(100vh - 120px)",

                pb: 4,
            }}
        >

            {/* ====================================================
                PAGE HEADER
            ==================================================== */}

            <Box
                sx={{
                    display: "flex",

                    justifyContent:
                        "space-between",

                    alignItems: {
                        xs: "flex-start",
                        sm: "center",
                    },

                    flexDirection: {
                        xs: "column",
                        sm: "row",
                    },

                    gap: 2,

                    mb: 3,
                }}
            >

                <Box>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                        }}
                    >

                        {/* HEADER ICON */}

                        <Box
                            sx={{
                                width: 46,
                                height: 46,

                                borderRadius:
                                    "13px",

                                display: "flex",

                                alignItems:
                                    "center",

                                justifyContent:
                                    "center",

                                background:
                                    "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",

                                color: "#FFFFFF",

                                boxShadow:
                                    "0 7px 18px rgba(79, 70, 229, 0.25)",
                            }}
                        >

                            <EmailIcon />

                        </Box>


                        <Box>

                            <Typography
                                sx={{
                                    fontSize: {
                                        xs:
                                            "1.5rem",

                                        sm:
                                            "1.75rem",
                                    },

                                    fontWeight:
                                        750,

                                    color:
                                        "#172554",

                                    lineHeight:
                                        1.2,
                                }}
                            >
                                Send Email
                            </Typography>


                            <Typography
                                sx={{
                                    mt: 0.5,

                                    fontSize:
                                        "0.86rem",

                                    color:
                                        "#64748B",
                                }}
                            >
                                Send  emails to employees
                            </Typography>

                        </Box>

                    </Box>

                </Box>


                {/* RECIPIENT COUNT */}

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,

                        px: 1.7,
                        py: 1,

                        borderRadius:
                            "12px",

                        background:
                            "#EFF6FF",

                        border:
                            "1px solid #BFDBFE",

                        color:
                            "#1D4ED8",
                    }}
                >

                    <GroupsIcon
                        sx={{
                            fontSize: 20
                        }}
                    />

                    <Typography
                        sx={{
                            fontSize:
                                "0.82rem",

                            fontWeight:
                                700,
                        }}
                    >
                        {employees.length} Employees
                    </Typography>

                </Box>

            </Box>


            {/* ====================================================
                MAIN SEND CARD
            ==================================================== */}

            <Paper
                elevation={0}
                sx={{
                    borderRadius:
                        "20px",

                    overflow:
                        "hidden",

                    border:
                        "1px solid #D8DEEF",

                    background:
                        "linear-gradient(145deg, #EEF2FF 0%, #F5F3FF 48%, #EFF6FF 100%)",

                    boxShadow:
                        "0 10px 30px rgba(30, 41, 59, 0.07)",
                }}
            >

                {/* =================================================
                    CARD HEADER
                ================================================= */}

                <Box
                    sx={{
                        px: {
                            xs: 2.2,
                            sm: 3,
                        },

                        py: 2.2,

                        display: "flex",

                        alignItems:
                            "center",

                        gap: 1.5,

                        borderBottom:
                            "1px solid #D9E0F0",

                        background:
                            "linear-gradient(135deg, #E0E7FF 0%, #EDE9FE 100%)",
                    }}
                >

                    <Box
                        sx={{
                            width: 38,
                            height: 38,

                            borderRadius:
                                "10px",

                            display:
                                "flex",

                            alignItems:
                                "center",

                            justifyContent:
                                "center",

                            background:
                                "#FFFFFF",

                            color:
                                "#4F46E5",

                            boxShadow:
                                "0 3px 10px rgba(79,70,229,0.12)",
                        }}
                    >

                        <ScheduleSendIcon
                            fontSize="small"
                        />

                    </Box>


                    <Box>

                        <Typography
                            sx={{
                                fontSize:
                                    "1rem",

                                fontWeight:
                                    750,

                                color:
                                    "#1E293B",
                            }}
                        >
                            Email Configuration
                        </Typography>


                        <Typography
                            sx={{
                                fontSize:
                                    "0.75rem",

                                color:
                                    "#64748B",

                                mt: 0.2,
                            }}
                        >
                            Choose your recipients and email template
                        </Typography>

                    </Box>

                </Box>


                {/* =================================================
                    FORM
                ================================================= */}

                <Box
                    sx={{
                        p: {
                            xs: 2,
                            sm: 3,
                        },
                    }}
                >

                    <Stack
                        spacing={2.5}
                    >

                        {/* =================================================
                            SEND MODE
                        ================================================= */}

                        <Box>

                            <Typography
                                sx={{
                                    mb: 0.8,

                                    fontSize:
                                        "0.8rem",

                                    fontWeight:
                                        700,

                                    color:
                                        "#334155",
                                }}
                            >
                                Send Mode
                            </Typography>


                            <TextField
                                select

                                value={
                                    sendMode
                                }

                                onChange={(
                                    event
                                ) => {

                                    setSendMode(
                                        event
                                            .target
                                            .value
                                    );

                                    setEmployeeId(
                                        ""
                                    );

                                    setDepartment(
                                        ""
                                    );

                                }}

                                fullWidth

                                sx={{
                                    "& .MuiOutlinedInput-root":
                                        {
                                            backgroundColor:
                                                "#FFFFFF",

                                            borderRadius:
                                                "11px",

                                            "& fieldset":
                                                {
                                                    borderColor:
                                                        "#C7D2FE",
                                                },

                                            "&:hover fieldset":
                                                {
                                                    borderColor:
                                                        "#818CF8",
                                                },

                                            "&.Mui-focused fieldset":
                                                {
                                                    borderColor:
                                                        "#4F46E5",

                                                    borderWidth:
                                                        "2px",
                                                },
                                        },
                                }}
                            >

                                <MenuItem
                                    value="INDIVIDUAL"
                                >
                                    <Box
                                        sx={{
                                            display:
                                                "flex",

                                            alignItems:
                                                "center",

                                            gap: 1,
                                        }}
                                    >

                                        <PersonIcon
                                            sx={{
                                                color:
                                                    "#2563EB",
                                                fontSize:
                                                    20,
                                            }}
                                        />

                                        Individual Employee

                                    </Box>
                                </MenuItem>


                                <MenuItem
                                    value="BULK"
                                >
                                    <Box
                                        sx={{
                                            display:
                                                "flex",

                                            alignItems:
                                                "center",

                                            gap: 1,
                                        }}
                                    >

                                        <GroupsIcon
                                            sx={{
                                                color:
                                                    "#7C3AED",
                                                fontSize:
                                                    20,
                                            }}
                                        />

                                        All Employees

                                    </Box>
                                </MenuItem>


                                <MenuItem
                                    value="DEPARTMENT"
                                >
                                    <Box
                                        sx={{
                                            display:
                                                "flex",

                                            alignItems:
                                                "center",

                                            gap: 1,
                                        }}
                                    >

                                        <ApartmentIcon
                                            sx={{
                                                color:
                                                    "#0F766E",
                                                fontSize:
                                                    20,
                                            }}
                                        />

                                        Department

                                    </Box>
                                </MenuItem>

                            </TextField>

                        </Box>


                        {/* =================================================
                            INDIVIDUAL EMPLOYEE
                        ================================================= */}

                        {sendMode ===
                            "INDIVIDUAL" && (

                            <Box>

                                <Typography
                                    sx={{
                                        mb: 0.8,

                                        fontSize:
                                            "0.8rem",

                                        fontWeight:
                                            700,

                                        color:
                                            "#334155",
                                    }}
                                >
                                    Employee
                                </Typography>


                                <Autocomplete
                                    options={
                                        employees
                                    }

                                    getOptionLabel={(
                                        employee
                                    ) =>
                                        `${employee.employee_id} - ${employee.name}`
                                    }

                                    value={
                                        selectedEmployee
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
                                        String(
                                            option.id
                                        ) ===
                                        String(
                                            value.id
                                        )
                                    }

                                    renderOption={(
                                        props,
                                        employee
                                    ) => (

                                        <Box
                                            component="li"
                                            {...props}
                                            sx={{
                                                display:
                                                    "flex",

                                                alignItems:
                                                    "center",

                                                gap: 1.2,
                                            }}
                                        >

                                            <Box
                                                sx={{
                                                    width: 30,
                                                    height: 30,

                                                    borderRadius:
                                                        "8px",

                                                    display:
                                                        "flex",

                                                    alignItems:
                                                        "center",

                                                    justifyContent:
                                                        "center",

                                                    background:
                                                        "#DBEAFE",

                                                    color:
                                                        "#2563EB",
                                                }}
                                            >

                                                <PersonIcon
                                                    sx={{
                                                        fontSize:
                                                            17,
                                                    }}
                                                />

                                            </Box>


                                            <Box>

                                                <Typography
                                                    sx={{
                                                        fontSize:
                                                            "0.82rem",

                                                        fontWeight:
                                                            650,
                                                    }}
                                                >
                                                    {
                                                        employee.name
                                                    }
                                                </Typography>


                                                <Typography
                                                    sx={{
                                                        fontSize:
                                                            "0.7rem",

                                                        color:
                                                            "#64748B",
                                                    }}
                                                >
                                                    {
                                                        employee.employee_id
                                                    }

                                                </Typography>

                                            </Box>

                                        </Box>

                                    )}

                                    renderInput={(
                                        params
                                    ) => (

                                        <TextField
                                            {...params}

                                            placeholder="Search by employee ID or name"

                                            sx={{
                                                "& .MuiOutlinedInput-root":
                                                    {
                                                        backgroundColor:
                                                            "#FFFFFF",

                                                        borderRadius:
                                                            "11px",

                                                        "& fieldset":
                                                            {
                                                                borderColor:
                                                                    "#BFDBFE",
                                                            },

                                                        "&:hover fieldset":
                                                            {
                                                                borderColor:
                                                                    "#60A5FA",
                                                            },

                                                        "&.Mui-focused fieldset":
                                                            {
                                                                borderColor:
                                                                    "#2563EB",

                                                                borderWidth:
                                                                    "2px",
                                                            },
                                                    },
                                            }}
                                        />

                                    )}

                                />

                            </Box>

                        )}


                        {/* =================================================
                            DEPARTMENT
                        ================================================= */}

                        {sendMode ===
                            "DEPARTMENT" && (

                            <Box>

                                <Typography
                                    sx={{
                                        mb: 0.8,

                                        fontSize:
                                            "0.8rem",

                                        fontWeight:
                                            700,

                                        color:
                                            "#334155",
                                    }}
                                >
                                    Department
                                </Typography>


                                <Autocomplete
                                    options={
                                        departments
                                    }

                                    value={
                                        department
                                    }

                                    onChange={(
                                        event,
                                        newValue
                                    ) => {

                                        setDepartment(
                                            newValue ||
                                            ""
                                        );

                                    }}

                                    renderInput={(
                                        params
                                    ) => (

                                        <TextField
                                            {...params}

                                            placeholder="Search department"

                                            sx={{
                                                "& .MuiOutlinedInput-root":
                                                    {
                                                        backgroundColor:
                                                            "#FFFFFF",

                                                        borderRadius:
                                                            "11px",

                                                        "& fieldset":
                                                            {
                                                                borderColor:
                                                                    "#99F6E4",
                                                            },

                                                        "&:hover fieldset":
                                                            {
                                                                borderColor:
                                                                    "#2DD4BF",
                                                            },

                                                        "&.Mui-focused fieldset":
                                                            {
                                                                borderColor:
                                                                    "#0F766E",

                                                                borderWidth:
                                                                    "2px",
                                                            },
                                                    },
                                            }}
                                        />

                                    )}

                                />

                            </Box>

                        )}


                        {/* =================================================
                            EMAIL TEMPLATE
                        ================================================= */}

                        <Box>

                            <Typography
                                sx={{
                                    mb: 0.8,

                                    fontSize:
                                        "0.8rem",

                                    fontWeight:
                                        700,

                                    color:
                                        "#334155",
                                }}
                            >
                                Email Template
                            </Typography>


                            <Autocomplete
                                options={
                                    templates
                                }

                                getOptionLabel={(
                                    template
                                ) =>
                                    template.template_name
                                }

                                value={
                                    selectedTemplate
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
                                    String(
                                        option.id
                                    ) ===
                                    String(
                                        value.id
                                    )
                                }

                                renderOption={(
                                    props,
                                    template
                                ) => (

                                    <Box
                                        component="li"
                                        {...props}
                                        sx={{
                                            display:
                                                "flex",

                                            alignItems:
                                                "center",

                                            gap: 1.2,
                                        }}
                                    >

                                        <Box
                                            sx={{
                                                width: 30,
                                                height: 30,

                                                borderRadius:
                                                    "8px",

                                                display:
                                                    "flex",

                                                alignItems:
                                                    "center",

                                                justifyContent:
                                                    "center",

                                                background:
                                                    "#EDE9FE",

                                                color:
                                                    "#7C3AED",
                                            }}
                                        >

                                            <DescriptionIcon
                                                sx={{
                                                    fontSize:
                                                        17,
                                                }}
                                            />

                                        </Box>


                                        <Typography
                                            sx={{
                                                fontSize:
                                                    "0.82rem",

                                                fontWeight:
                                                    650,
                                            }}
                                        >
                                            {
                                                template.template_name
                                            }
                                        </Typography>

                                    </Box>

                                )}

                                renderInput={(
                                    params
                                ) => (

                                    <TextField
                                        {...params}

                                        placeholder="Search template by name"

                                        sx={{
                                            "& .MuiOutlinedInput-root":
                                                {
                                                    backgroundColor:
                                                        "#FFFFFF",

                                                    borderRadius:
                                                        "11px",

                                                    "& fieldset":
                                                        {
                                                            borderColor:
                                                                "#C4B5FD",
                                                        },

                                                    "&:hover fieldset":
                                                        {
                                                            borderColor:
                                                                "#A78BFA",
                                                        },

                                                    "&.Mui-focused fieldset":
                                                        {
                                                            borderColor:
                                                                "#7C3AED",

                                                            borderWidth:
                                                                "2px",
                                                        },
                                                },
                                        }}
                                    />

                                )}

                            />

                        </Box>


                        {/* =================================================
                            SELECTED TEMPLATE PREVIEW
                        ================================================= */}

                        {selectedTemplate && (

                            <Box
                                sx={{
                                    p: 2,

                                    borderRadius:
                                        "12px",

                                    background:
                                        "linear-gradient(135deg, #F5F3FF 0%, #EEF2FF 100%)",

                                    border:
                                        "1px solid #DDD6FE",
                                }}
                            >

                                <Box
                                    sx={{
                                        display:
                                            "flex",

                                        alignItems:
                                            "center",

                                        gap: 1,

                                        mb: 1,
                                    }}
                                >

                                    <DescriptionIcon
                                        sx={{
                                            color:
                                                "#7C3AED",

                                            fontSize:
                                                19,
                                        }}
                                    />


                                    <Typography
                                        sx={{
                                            fontSize:
                                                "0.8rem",

                                            fontWeight:
                                                700,

                                            color:
                                                "#5B21B6",
                                        }}
                                    >
                                        Selected Template
                                    </Typography>

                                </Box>


                                <Typography
                                    sx={{
                                        fontSize:
                                            "0.82rem",

                                        fontWeight:
                                            650,

                                        color:
                                            "#1E293B",
                                    }}
                                >
                                    {
                                        selectedTemplate.template_name
                                    }
                                </Typography>


                                <Typography
                                    sx={{
                                        fontSize:
                                            "0.75rem",

                                        color:
                                            "#64748B",

                                        mt: 0.5,

                                        overflow:
                                            "hidden",

                                        textOverflow:
                                            "ellipsis",

                                        whiteSpace:
                                            "nowrap",
                                    }}
                                >
                                    Subject:{" "}
                                    {
                                        selectedTemplate.subject
                                    }
                                </Typography>

                            </Box>

                        )}


                        {/* =================================================
                            SEND BUTTON
                        ================================================= */}

                        <Button
                            variant="contained"

                            fullWidth

                            startIcon={
                                <SendIcon />
                            }

                            onClick={
                                handleSendEmail
                            }

                            disabled={
                                sending
                            }

                            sx={{
                                minHeight:
                                    48,

                                mt: 0.5,

                                borderRadius:
                                    "12px",

                                textTransform:
                                    "none",

                                fontSize:
                                    "0.95rem",

                                fontWeight:
                                    700,

                                background:
                                    "linear-gradient(135deg, #2563EB 0%, #4F46E5 55%, #7C3AED 100%)",

                                boxShadow:
                                    "0 7px 18px rgba(79,70,229,0.25)",

                                transition:
                                    "all 0.2s ease",

                                "&:hover": {
                                    background:
                                        "linear-gradient(135deg, #1D4ED8 0%, #4338CA 55%, #6D28D9 100%)",

                                    transform:
                                        "translateY(-2px)",

                                    boxShadow:
                                        "0 10px 24px rgba(79,70,229,0.32)",
                                },

                                "&:disabled": {
                                    background:
                                        "#A5B4FC",

                                    color:
                                        "#FFFFFF",
                                },
                            }}
                        >

                            {sending
                                ? "Sending..."
                                : "Send Email"
                            }

                        </Button>

                    </Stack>

                </Box>

            </Paper>


            {/* ====================================================
                EMAIL PROGRESS
            ==================================================== */}

            {job && (

                <Paper
                    elevation={0}

                    sx={{
                        mt: 3,

                        borderRadius:
                            "18px",

                        overflow:
                            "hidden",

                        border:
                            "1px solid #BFDBFE",

                        background:
                            "linear-gradient(135deg, #EFF6FF 0%, #EEF2FF 100%)",

                        boxShadow:
                            "0 8px 25px rgba(37,99,235,0.07)",
                    }}
                >

                    {/* PROGRESS HEADER */}

                    <Box
                        sx={{
                            px: 3,
                            py: 2,

                            display:
                                "flex",

                            justifyContent:
                                "space-between",

                            alignItems:
                                "center",

                            borderBottom:
                                "1px solid #DBEAFE",
                        }}
                    >

                        <Box
                            sx={{
                                display:
                                    "flex",

                                alignItems:
                                    "center",

                                gap: 1.2,
                            }}
                        >

                            <Box
                                sx={{
                                    width: 36,
                                    height: 36,

                                    borderRadius:
                                        "9px",

                                    display:
                                        "flex",

                                    alignItems:
                                        "center",

                                    justifyContent:
                                        "center",

                                    background:
                                        "#DBEAFE",

                                    color:
                                        "#2563EB",
                                }}
                            >

                                <ScheduleSendIcon
                                    fontSize="small"
                                />

                            </Box>


                            <Box>

                                <Typography
                                    sx={{
                                        fontSize:
                                            "0.95rem",

                                        fontWeight:
                                            750,

                                        color:
                                            "#1E293B",
                                    }}
                                >
                                    Email Progress
                                </Typography>


                                <Typography
                                    sx={{
                                        fontSize:
                                            "0.72rem",

                                        color:
                                            "#64748B",
                                    }}
                                >
                                    Background email job
                                </Typography>

                            </Box>

                        </Box>


                        {/* STATUS */}

                        <Box
                            sx={{
                                display:
                                    "flex",

                                alignItems:
                                    "center",

                                gap: 0.7,

                                px: 1.3,
                                py: 0.6,

                                borderRadius:
                                    "20px",

                                background:
                                    job.status ===
                                    "COMPLETED"
                                        ? "#D1FAE5"
                                        : job.status ===
                                          "FAILED"
                                            ? "#FEE2E2"
                                            : "#DBEAFE",

                                color:
                                    job.status ===
                                    "COMPLETED"
                                        ? "#047857"
                                        : job.status ===
                                          "FAILED"
                                            ? "#B91C1C"
                                            : "#1D4ED8",

                                fontSize:
                                    "0.7rem",

                                fontWeight:
                                    750,
                            }}
                        >

                            {job.status ===
                            "COMPLETED" ? (

                                <CheckCircleIcon
                                    sx={{
                                        fontSize:
                                            16
                                    }}
                                />

                            ) : job.status ===
                              "FAILED" ? (

                                <ErrorIcon
                                    sx={{
                                        fontSize:
                                            16
                                    }}
                                />

                            ) : (

                                <ScheduleSendIcon
                                    sx={{
                                        fontSize:
                                            16
                                    }}
                                />

                            )}

                            {job.status}

                        </Box>

                    </Box>


                    {/* PROGRESS CONTENT */}

                    <Box
                        sx={{
                            p: 3,
                        }}
                    >

                        {/* STAT CARDS */}

                        <Box
                            sx={{
                                display:
                                    "grid",

                                gridTemplateColumns:
                                    {
                                        xs:
                                            "1fr 1fr",

                                        sm:
                                            "repeat(3, 1fr)",
                                    },

                                gap: 1.5,

                                mb: 2.5,
                            }}
                        >

                            {/* TOTAL */}

                            <Box
                                sx={{
                                    p: 1.5,

                                    borderRadius:
                                        "11px",

                                    background:
                                        "#FFFFFF",

                                    border:
                                        "1px solid #DBEAFE",
                                }}
                            >

                                <Typography
                                    sx={{
                                        fontSize:
                                            "0.7rem",

                                        color:
                                            "#64748B",
                                    }}
                                >
                                    Total
                                </Typography>


                                <Typography
                                    sx={{
                                        fontSize:
                                            "1.3rem",

                                        fontWeight:
                                            750,

                                        color:
                                            "#2563EB",

                                        mt: 0.2,
                                    }}
                                >
                                    {
                                        job.total
                                    }
                                </Typography>

                            </Box>


                            {/* SENT */}

                            <Box
                                sx={{
                                    p: 1.5,

                                    borderRadius:
                                        "11px",

                                    background:
                                        "#ECFDF5",

                                    border:
                                        "1px solid #A7F3D0",
                                }}
                            >

                                <Typography
                                    sx={{
                                        fontSize:
                                            "0.7rem",

                                        color:
                                            "#64748B",
                                    }}
                                >
                                    Sent
                                </Typography>


                                <Typography
                                    sx={{
                                        fontSize:
                                            "1.3rem",

                                        fontWeight:
                                            750,

                                        color:
                                            "#059669",

                                        mt: 0.2,
                                    }}
                                >
                                    {
                                        job.sent
                                    }
                                </Typography>

                            </Box>


                            {/* FAILED */}

                            <Box
                                sx={{
                                    p: 1.5,

                                    borderRadius:
                                        "11px",

                                    background:
                                        "#FEF2F2",

                                    border:
                                        "1px solid #FECACA",
                                }}
                            >

                                <Typography
                                    sx={{
                                        fontSize:
                                            "0.7rem",

                                        color:
                                            "#64748B",
                                    }}
                                >
                                    Failed
                                </Typography>


                                <Typography
                                    sx={{
                                        fontSize:
                                            "1.3rem",

                                        fontWeight:
                                            750,

                                        color:
                                            "#DC2626",

                                        mt: 0.2,
                                    }}
                                >
                                    {
                                        job.failed
                                    }
                                </Typography>

                            </Box>

                        </Box>


                        {/* PROCESSED */}

                        <Box
                            sx={{
                                display:
                                    "flex",

                                justifyContent:
                                    "space-between",

                                mb: 0.8,
                            }}
                        >

                            <Typography
                                sx={{
                                    fontSize:
                                        "0.78rem",

                                    fontWeight:
                                        650,

                                    color:
                                        "#475569",
                                }}
                            >
                                Processed
                            </Typography>


                            <Typography
                                sx={{
                                    fontSize:
                                        "0.78rem",

                                    fontWeight:
                                        700,

                                    color:
                                        "#334155",
                                }}
                            >
                                {
                                    job.sent +
                                    job.failed
                                }
                                {" / "}
                                {
                                    job.total
                                }
                            </Typography>

                        </Box>


                        {/* PROGRESS BAR */}

                        <LinearProgress
                            variant="determinate"
                            value={
                                getProgress()
                            }

                            sx={{
                                height: 10,

                                borderRadius:
                                    "10px",

                                backgroundColor:
                                    "#DBEAFE",

                                "& .MuiLinearProgress-bar":
                                    {
                                        borderRadius:
                                            "10px",

                                        background:
                                            "linear-gradient(90deg, #2563EB, #4F46E5, #7C3AED)",
                                    },
                            }}
                        />


                        <Typography
                            align="right"

                            sx={{
                                mt: 0.8,

                                fontSize:
                                    "0.78rem",

                                fontWeight:
                                    750,

                                color:
                                    "#4F46E5",
                            }}
                        >
                            {
                                getProgress()
                                    .toFixed(1)
                            }%
                        </Typography>

                    </Box>

                </Paper>

            )}


            {/* ====================================================
                CONFIRMATION DIALOG
            ==================================================== */}

            <Dialog
                open={
                    confirmOpen
                }

                onClose={() => {

                    if (!sending) {

                        setConfirmOpen(
                            false
                        );

                    }

                }}

                PaperProps={{
                    sx: {
                        borderRadius:
                            "18px",

                        overflow:
                            "hidden",

                        background:
                            "linear-gradient(145deg, #F8FAFF 0%, #EEF2FF 100%)",

                        border:
                            "1px solid #D8DEEF",

                        boxShadow:
                            "0 20px 50px rgba(15,23,42,0.18)",
                    }
                }}
            >

                {/* DIALOG TITLE */}

                <DialogTitle
                    sx={{
                        display:
                            "flex",

                        alignItems:
                            "center",

                        gap: 1.2,

                        color:
                            "#1E293B",

                        fontWeight:
                            750,

                        borderBottom:
                            "1px solid #E2E8F0",
                    }}
                >

                    <Box
                        sx={{
                            width: 38,
                            height: 38,

                            borderRadius:
                                "10px",

                            display:
                                "flex",

                            alignItems:
                                "center",

                            justifyContent:
                                "center",

                            background:
                                "#DBEAFE",

                            color:
                                "#2563EB",
                        }}
                    >

                        <SendIcon
                            fontSize="small"
                        />

                    </Box>

                    Confirm Email Sending

                </DialogTitle>


                {/* DIALOG CONTENT */}

                <DialogContent
                    sx={{
                        pt: 3,
                        pb: 2,
                    }}
                >

                    <Typography
                        sx={{
                            color:
                                "#475569",

                            fontSize:
                                "0.9rem",

                            lineHeight:
                                1.6,
                        }}
                    >
                        {
                            confirmData?.message
                        }
                    </Typography>

                </DialogContent>


                {/* DIALOG ACTIONS */}

                <DialogActions
                    sx={{
                        px: 3,
                        pb: 2.5,

                        gap: 1,
                    }}
                >

                    <Button
                        onClick={() =>
                            setConfirmOpen(
                                false
                            )
                        }

                        disabled={
                            sending
                        }

                        startIcon={
                            <CloseIcon />
                        }

                        sx={{
                            borderRadius:
                                "9px",

                            textTransform:
                                "none",

                            fontWeight:
                                650,

                            color:
                                "#64748B",
                        }}
                    >
                        Cancel
                    </Button>


                    <Button
                        variant="contained"

                        onClick={
                            handleConfirmSend
                        }

                        disabled={
                            sending
                        }

                        startIcon={
                            <SendIcon />
                        }

                        sx={{
                            borderRadius:
                                "9px",

                            textTransform:
                                "none",

                            fontWeight:
                                700,

                            background:
                                "linear-gradient(135deg, #2563EB, #4F46E5)",

                            "&:hover": {
                                background:
                                    "linear-gradient(135deg, #1D4ED8, #4338CA)",
                            },
                        }}
                    >
                        Confirm Send
                    </Button>

                </DialogActions>

            </Dialog>


            {/* ====================================================
                NOTIFICATION
            ==================================================== */}

            <Snackbar
                open={
                    notification.open
                }

                autoHideDuration={
                    4000
                }

                onClose={
                    handleCloseNotification
                }

                anchorOrigin={{
                    vertical:
                        "top",

                    horizontal:
                        "right"
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
                        width:
                            "100%",

                        borderRadius:
                            "10px",

                        fontWeight:
                            600,
                    }}
                >

                    {
                        notification.message
                    }

                </Alert>

            </Snackbar>

        </Box>

    );

}


export default SendEmail;