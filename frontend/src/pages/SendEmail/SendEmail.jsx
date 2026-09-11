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

    useEffect(() => {
        EmployeeService.getAllEmployees()
            .then((response) => {
                setEmployees(response.data.data);
            })
            .catch((error) => {
                console.error("GET EMPLOYEES ERROR:", error);
                showNotification("Failed to load employees.", "error");
            });

        EmailTemplateService.getAllTemplates()
            .then((response) => {
                setTemplates(response.data.data);
            })
            .catch((error) => {
                console.error("GET TEMPLATES ERROR:", error);
                showNotification("Failed to load email templates.", "error");
            });
    }, []);

    const showNotification = (message, severity = "success") => {
        setNotification({
            open: true,
            message,
            severity
        });
    };

    const handleCloseNotification = () => {
        setNotification((previous) => ({
            ...previous,
            open: false
        }));
    };

    const departments = [
        ...new Set(
            employees
                .map((employee) => employee.department)
                .filter(Boolean)
        )
    ];

    const selectedEmployee =
        employees.find(
            (employee) =>
                String(employee.id) === String(employeeId)
        ) || null;

    const selectedTemplate =
        templates.find(
            (template) =>
                String(template.id) === String(templateId)
        ) || null;

    const handleSendEmail = () => {
        if (sending) return;

        if (!templateId) {
            showNotification(
                "Please select an email template.",
                "warning"
            );
            return;
        }

        if (sendMode === "INDIVIDUAL") {
            if (!employeeId) {
                showNotification(
                    "Please select an employee.",
                    "warning"
                );
                return;
            }

            const employee = employees.find(
                (item) =>
                    String(item.id) === String(employeeId)
            );

            setConfirmData({
                endpoint: "/send-template-email",
                data: {
                    employee_id: employeeId,
                    template_id: templateId
                },
                message: `Send email to ${employee?.name}?`
            });

            setConfirmOpen(true);
            return;
        }

        if (sendMode === "BULK") {
            setConfirmData({
                endpoint: "/send-bulk-email",
                data: {
                    template_id: templateId
                },
                message: `Send email to all ${employees.length} employees?`
            });

            setConfirmOpen(true);
            return;
        }

        if (sendMode === "DEPARTMENT") {
            if (!department) {
                showNotification(
                    "Please select a department.",
                    "warning"
                );
                return;
            }

            const departmentEmployees = employees.filter(
                (employee) =>
                    employee.department === department
            );

            setConfirmData({
                endpoint: "/send-department-email",
                data: {
                    department,
                    template_id: templateId
                },
                message: `Send email to ${departmentEmployees.length} employees in ${department} department?`
            });

            setConfirmOpen(true);
        }
    };

    const handleConfirmSend = () => {
        if (!confirmData) return;

        setConfirmOpen(false);
        setSending(true);
        setJob(null);

        api.post(
            confirmData.endpoint,
            confirmData.data
        )
            .then((response) => {
                console.log(
                    "EMAIL OPERATION SUCCESS:",
                    response.data
                );

                if (sendMode === "INDIVIDUAL") {
                    setSending(false);

                    showNotification(
                        "Email sent successfully!",
                        "success"
                    );

                    return;
                }

                const newJobId = response.data.job_id;

                setJobId(newJobId);

                if (sendMode === "BULK") {
                    showNotification(
                        `Bulk email started. Total employees: ${response.data.total}`,
                        "success"
                    );
                }

                if (sendMode === "DEPARTMENT") {
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

                const message =
                    error.response?.data?.message ||
                    "Error sending email. Check the backend.";

                showNotification(message, "error");
            });
    };

    useEffect(() => {
        if (!jobId) return;

        const checkJobStatus = () => {
            api.get(`/email-job/${jobId}`)
                .then((response) => {
                    const jobData =
                        response.data.data ||
                        response.data;

                    setJob(jobData);

                    if (
                        jobData.status === "COMPLETED"
                    ) {
                        setSending(false);
                        setJobId(null);

                        showNotification(
                            "Email job completed successfully.",
                            "success"
                        );
                    }

                    if (
                        jobData.status === "FAILED"
                    ) {
                        setSending(false);
                        setJobId(null);

                        showNotification(
                            "Email job failed.",
                            "error"
                        );
                    }
                })
                .catch((error) => {
                    console.error(
                        "EMAIL JOB STATUS ERROR:",
                        error
                    );
                });
        };

        checkJobStatus();

        const interval = setInterval(
            checkJobStatus,
            2000
        );

        return () => clearInterval(interval);
    }, [jobId]);

    const getProgress = () => {
        if (!job?.total) return 0;

        const processed =
            (Number(job.sent) || 0) +
            (Number(job.failed) || 0);

        return Math.min(
            (processed / Number(job.total)) * 100,
            100
        );
    };

    const fieldSx = {
        "& .MuiOutlinedInput-root": {
            borderRadius: "11px",
            backgroundColor: "rgba(255,255,255,0.035)",

            "& fieldset": {
                borderColor: "divider"
            },

            "&:hover fieldset": {
                borderColor: "primary.main"
            },

            "&.Mui-focused fieldset": {
                borderColor: "primary.main",
                borderWidth: "2px"
            }
        }
    };

    return (
        <Box
            sx={{
                width: "100%",
                minHeight: "calc(100vh - 120px)",
                pb: 4
            }}
        >
            {/* PAGE HEADER */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: {
                        xs: "flex-start",
                        sm: "center"
                    },
                    flexDirection: {
                        xs: "column",
                        sm: "row"
                    },
                    gap: 2,
                    mb: 3
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5
                    }}
                >
                    <Box
                        sx={{
                            width: 46,
                            height: 46,
                            borderRadius: "13px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background:
                                "linear-gradient(135deg, #2563EB, #4F46E5)",
                            color: "#fff",
                            boxShadow:
                                "0 8px 20px rgba(37,99,235,0.28)"
                        }}
                    >
                        <EmailIcon sx={{ fontSize: 25 }} />
                    </Box>

                    <Box>
                        <Typography
                            sx={{
                                fontSize: {
                                    xs: "1.7rem",
                                    sm: "2rem"
                                },
                                fontWeight: 750,
                                lineHeight: 1.15,
                                color: "text.primary"
                            }}
                        >
                            Send Email
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.5,
                                fontSize: "0.9rem",
                                color: "text.secondary"
                            }}
                        >
                            Send emails to employees
                        </Typography>
                    </Box>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.8,
                        px: 1.8,
                        py: 0.9,
                        borderRadius: "12px",
                        border: "1px solid",
                        borderColor:
                            "rgba(37,99,235,0.28)",
                        backgroundColor:
                            "rgba(37,99,235,0.08)",
                        color: "primary.main",
                        fontWeight: 700,
                        fontSize: "0.85rem"
                    }}
                >
                    <GroupsIcon sx={{ fontSize: 20 }} />
                    {employees.length} Employees
                </Box>
            </Box>

            {/* MAIN CONTENT - LIMITED WIDTH */}

            <Box
                sx={{
                    width: "100%",
                    maxWidth: {
                        xs: "100%",
                        sm: "90%",
                        md: "920px"
                    },
                    mx: "auto"
                }}
            >
                {/* EMAIL CONFIGURATION */}

                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: "20px",
                        overflow: "hidden",
                        border: "1px solid",
                        borderColor: "divider",
                        background:
                            "linear-gradient(145deg, rgba(37,99,235,0.10), rgba(124,58,237,0.08))",
                        backdropFilter: "blur(18px)",
                        boxShadow:
                            "0 15px 40px rgba(15,23,42,0.12)"
                    }}
                >
                    <Box
                        sx={{
                            px: {
                                xs: 2,
                                sm: 2.5
                            },
                            py: 1.8,
                            display: "flex",
                            alignItems: "center",
                            gap: 1.4,
                            borderBottom: "1px solid",
                            borderColor: "divider"
                        }}
                    >
                        <Box
                            sx={{
                                width: 38,
                                height: 38,
                                borderRadius: "10px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor:
                                    "rgba(37,99,235,0.14)",
                                color: "primary.main"
                            }}
                        >
                            <ScheduleSendIcon fontSize="small" />
                        </Box>

                        <Box>
                            <Typography
                                sx={{
                                    fontSize: "1rem",
                                    fontWeight: 750,
                                    color: "text.primary"
                                }}
                            >
                                Email Configuration
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: "0.75rem",
                                    color: "text.secondary",
                                    mt: 0.2
                                }}
                            >
                                Choose your recipients and an email template
                            </Typography>
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            p: {
                                xs: 2,
                                sm: 2.5
                            }
                        }}
                    >
                        <Stack spacing={2}>
                            {/* SEND MODE */}

                            <Box>
                                <Typography
                                    sx={{
                                        mb: 0.7,
                                        fontSize: "0.78rem",
                                        fontWeight: 700,
                                        color: "text.secondary"
                                    }}
                                >
                                    Send Mode
                                </Typography>

                                <TextField
                                    select
                                    value={sendMode}
                                    onChange={(event) => {
                                        setSendMode(
                                            event.target.value
                                        );
                                        setEmployeeId("");
                                        setDepartment("");
                                    }}
                                    fullWidth
                                    sx={fieldSx}
                                >
                                    <MenuItem value="INDIVIDUAL">
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1
                                            }}
                                        >
                                            <PersonIcon
                                                sx={{
                                                    color: "primary.main",
                                                    fontSize: 20
                                                }}
                                            />
                                            Individual Employee
                                        </Box>
                                    </MenuItem>

                                    <MenuItem value="BULK">
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1
                                            }}
                                        >
                                            <GroupsIcon
                                                sx={{
                                                    color: "#7C3AED",
                                                    fontSize: 20
                                                }}
                                            />
                                            All Employees
                                        </Box>
                                    </MenuItem>

                                    <MenuItem value="DEPARTMENT">
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1
                                            }}
                                        >
                                            <ApartmentIcon
                                                sx={{
                                                    color: "#0F766E",
                                                    fontSize: 20
                                                }}
                                            />
                                            Department
                                        </Box>
                                    </MenuItem>
                                </TextField>
                            </Box>

                            {/* EMPLOYEE */}

                            {sendMode === "INDIVIDUAL" && (
                                <Autocomplete
                                    options={employees}
                                    getOptionLabel={(employee) =>
                                        `${employee.employee_id} - ${employee.name}`
                                    }
                                    value={selectedEmployee}
                                    onChange={(event, newValue) => {
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
                                            placeholder="Search by employee ID or name"
                                            sx={fieldSx}
                                        />
                                    )}
                                />
                            )}

                            {/* DEPARTMENT */}

                            {sendMode === "DEPARTMENT" && (
                                <Autocomplete
                                    options={departments}
                                    value={department}
                                    onChange={(event, newValue) => {
                                        setDepartment(
                                            newValue || ""
                                        );
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Department"
                                            placeholder="Search department"
                                            sx={fieldSx}
                                        />
                                    )}
                                />
                            )}

                            {/* TEMPLATE */}

                            <Autocomplete
                                options={templates}
                                getOptionLabel={(template) =>
                                    template.template_name
                                }
                                value={selectedTemplate}
                                onChange={(event, newValue) => {
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
                                        sx={fieldSx}
                                    />
                                )}
                            />

                            {/* SEND BUTTON */}

                            <Button
                                variant="contained"
                                fullWidth
                                onClick={handleSendEmail}
                                disabled={sending}
                                startIcon={<SendIcon />}
                                sx={{
                                    minHeight: 52,
                                    mt: 0.5,
                                    borderRadius: "11px",
                                    textTransform: "none",
                                    fontSize: "0.95rem",
                                    fontWeight: 700,
                                    background:
                                        "linear-gradient(135deg, #2563EB, #4F46E5, #7C3AED)",
                                    boxShadow:
                                        "0 8px 20px rgba(37,99,235,0.22)",
                                    "&:hover": {
                                        background:
                                            "linear-gradient(135deg, #1D4ED8, #4338CA, #6D28D9)"
                                    }
                                }}
                            >
                                {sending
                                    ? "Sending..."
                                    : "Send Email"}
                            </Button>
                        </Stack>
                    </Box>
                </Paper>

                {/* EMAIL PROGRESS */}

                {job && (
                    <Paper
                        elevation={0}
                        sx={{
                            mt: 2.5,
                            borderRadius: "18px",
                            overflow: "hidden",
                            border: "1px solid",
                            borderColor: "divider",
                            background:
                                "linear-gradient(135deg, rgba(37,99,235,0.09), rgba(124,58,237,0.08))",
                            backdropFilter: "blur(18px)",
                            boxShadow:
                                "0 10px 30px rgba(15,23,42,0.10)"
                        }}
                    >
                        <Box
                            sx={{
                                px: 2.5,
                                py: 1.7,
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                borderBottom: "1px solid",
                                borderColor: "divider"
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1.2
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: "9px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor:
                                            "rgba(37,99,235,0.14)",
                                        color: "primary.main"
                                    }}
                                >
                                    <ScheduleSendIcon
                                        fontSize="small"
                                    />
                                </Box>

                                <Box>
                                    <Typography
                                        sx={{
                                            fontSize: "0.95rem",
                                            fontWeight: 750,
                                            color: "text.primary"
                                        }}
                                    >
                                        Email Progress
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontSize: "0.72rem",
                                            color: "text.secondary"
                                        }}
                                    >
                                        Background email job
                                    </Typography>
                                </Box>
                            </Box>

                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.7,
                                    px: 1.2,
                                    py: 0.55,
                                    borderRadius: "20px",
                                    backgroundColor:
                                        job.status === "COMPLETED"
                                            ? "rgba(16,185,129,0.14)"
                                            : job.status === "FAILED"
                                                ? "rgba(239,68,68,0.14)"
                                                : "rgba(37,99,235,0.14)",
                                    color:
                                        job.status === "COMPLETED"
                                            ? "success.main"
                                            : job.status === "FAILED"
                                                ? "error.main"
                                                : "primary.main",
                                    fontSize: "0.7rem",
                                    fontWeight: 750
                                }}
                            >
                                {job.status === "COMPLETED" ? (
                                    <CheckCircleIcon
                                        sx={{ fontSize: 16 }}
                                    />
                                ) : job.status === "FAILED" ? (
                                    <ErrorIcon
                                        sx={{ fontSize: 16 }}
                                    />
                                ) : (
                                    <ScheduleSendIcon
                                        sx={{ fontSize: 16 }}
                                    />
                                )}

                                {job.status}
                            </Box>
                        </Box>

                        <Box sx={{ p: 2.5 }}>
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: {
                                        xs: "1fr 1fr",
                                        sm: "repeat(3, 1fr)"
                                    },
                                    gap: 1.2,
                                    mb: 2
                                }}
                            >
                                <ProgressStat
                                    label="Total"
                                    value={job.total}
                                    color="primary.main"
                                />

                                <ProgressStat
                                    label="Sent"
                                    value={job.sent}
                                    color="success.main"
                                />

                                <ProgressStat
                                    label="Failed"
                                    value={job.failed}
                                    color="error.main"
                                />
                            </Box>

                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent:
                                        "space-between",
                                    alignItems: "center",
                                    mb: 0.8
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: "0.75rem",
                                        color: "text.secondary"
                                    }}
                                >
                                    Processed
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: "0.78rem",
                                        fontWeight: 700,
                                        color: "text.primary"
                                    }}
                                >
                                    {(Number(job.sent) || 0) +
                                        (Number(job.failed) || 0)}
                                    {" / "}
                                    {job.total}
                                </Typography>
                            </Box>

                            <LinearProgress
                                variant="determinate"
                                value={getProgress()}
                                sx={{
                                    height: 9,
                                    borderRadius: "10px",
                                    backgroundColor:
                                        "rgba(37,99,235,0.10)",
                                    "& .MuiLinearProgress-bar": {
                                        borderRadius: "10px",
                                        background:
                                            "linear-gradient(90deg, #2563EB, #4F46E5, #7C3AED)"
                                    }
                                }}
                            />

                            <Typography
                                align="right"
                                sx={{
                                    mt: 0.7,
                                    fontSize: "0.75rem",
                                    fontWeight: 750,
                                    color: "primary.main"
                                }}
                            >
                                {getProgress().toFixed(1)}%
                            </Typography>
                        </Box>
                    </Paper>
                )}
            </Box>

            {/* CONFIRMATION DIALOG */}

            <Dialog
                open={confirmOpen}
                onClose={() => {
                    if (!sending) {
                        setConfirmOpen(false);
                    }
                }}
                PaperProps={{
                    sx: {
                        width: {
                            xs: "calc(100% - 32px)",
                            sm: 460
                        },
                        maxWidth: 460,
                        borderRadius: "18px",
                        overflow: "hidden",
                        background:
                            "linear-gradient(145deg, rgba(248,250,255,0.98), rgba(238,242,255,0.98))",
                        border: "1px solid #D8DEEF"
                    }
                }}
            >
                <DialogTitle
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.2,
                        color: "#1E293B",
                        fontWeight: 750
                    }}
                >
                    <Box
                        sx={{
                            width: 38,
                            height: 38,
                            borderRadius: "10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "#DBEAFE",
                            color: "#2563EB"
                        }}
                    >
                        <SendIcon fontSize="small" />
                    </Box>

                    Confirm Email Sending
                </DialogTitle>

                <DialogContent sx={{ pt: 1 }}>
                    <Typography
                        sx={{
                            color: "#475569",
                            fontSize: "0.9rem",
                            lineHeight: 1.6
                        }}
                    >
                        {confirmData?.message}
                    </Typography>
                </DialogContent>

                <DialogActions
                    sx={{
                        px: 3,
                        pb: 2.5,
                        gap: 1
                    }}
                >
                    <Button
                        onClick={() =>
                            setConfirmOpen(false)
                        }
                        disabled={sending}
                        startIcon={<CloseIcon />}
                        sx={{
                            borderRadius: "9px",
                            textTransform: "none",
                            fontWeight: 650,
                            color: "#64748B"
                        }}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleConfirmSend}
                        disabled={sending}
                        startIcon={<SendIcon />}
                        sx={{
                            borderRadius: "9px",
                            textTransform: "none",
                            fontWeight: 700,
                            background:
                                "linear-gradient(135deg, #2563EB, #4F46E5)",
                            "&:hover": {
                                background:
                                    "linear-gradient(135deg, #1D4ED8, #4338CA)"
                            }
                        }}
                    >
                        Confirm Send
                    </Button>
                </DialogActions>
            </Dialog>

            {/* BOTTOM NOTIFICATION */}

            <Snackbar
                open={notification.open}
                autoHideDuration={4000}
                onClose={handleCloseNotification}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center"
                }}
                sx={{
                    bottom: {
                        xs: 20,
                        sm: 28
                    }
                }}
            >
                <Alert
                    onClose={handleCloseNotification}
                    severity={notification.severity}
                    variant="filled"
                    sx={{
                        width: "100%",
                        borderRadius: "10px",
                        fontWeight: 600
                    }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

function ProgressStat({
    label,
    value,
    color
}) {
    return (
        <Box
            sx={{
                p: 1.3,
                borderRadius: "11px",
                backgroundColor: "rgba(255,255,255,0.04)",
                border: "1px solid",
                borderColor: "divider"
            }}
        >
            <Typography
                sx={{
                    fontSize: "0.7rem",
                    color: "text.secondary"
                }}
            >
                {label}
            </Typography>

            <Typography
                sx={{
                    fontSize: "1.25rem",
                    fontWeight: 750,
                    color,
                    mt: 0.2
                }}
            >
                {value}
            </Typography>
        </Box>
    );
}

export default SendEmail;