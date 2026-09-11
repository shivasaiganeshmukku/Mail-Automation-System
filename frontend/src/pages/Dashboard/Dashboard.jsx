import { useEffect, useState } from "react";

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";

import DashboardService from "../../services/dashboardService";
import DashboardCard from "../../components/DashboardCard";
import EmailLogService from "../../services/emailLogService";
import BirthdayStatus from "../../components/BirthdayStatus";

import RefreshIcon from "@mui/icons-material/Refresh";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import EmailIcon from "@mui/icons-material/Email";
import DescriptionIcon from "@mui/icons-material/Description";
import PeopleIcon from "@mui/icons-material/People";


// ============================================================
// DASHBOARD
// ============================================================

function Dashboard() {

    const [summary, setSummary] = useState(null);

    const [recentLogs, setRecentLogs] = useState([]);

    const [logsLoading, setLogsLoading] = useState(true);

    const [refreshing, setRefreshing] = useState(false);


    // ========================================================
    // LOAD RECENT EMAIL LOGS
    // ========================================================

    const loadRecentLogs = async (
        showRefreshLoading = false
    ) => {

        if (showRefreshLoading) {
            setRefreshing(true);
        }

        try {

            const response =
                await EmailLogService.getAllLogs();

            const logs =
                response.data?.data;

            setRecentLogs(
                Array.isArray(logs)
                    ? logs.slice(0, 5)
                    : []
            );

        } catch (error) {

            console.error(
                "GET RECENT EMAIL LOGS ERROR:",
                error
            );

            setRecentLogs([]);

        } finally {

            setLogsLoading(false);

            if (showRefreshLoading) {
                setRefreshing(false);
            }

        }

    };


    // ========================================================
    // LOAD DASHBOARD DATA
    // ========================================================

    useEffect(() => {

        DashboardService.getSummary()

            .then((response) => {

                setSummary(
                    response.data.data
                );

            })

            .catch((error) => {

                console.error(
                    "GET DASHBOARD SUMMARY ERROR:",
                    error
                );

            });


        loadRecentLogs();

    }, []);


    // ========================================================
    // DASHBOARD LOADING
    // ========================================================

    if (!summary) {

        return (

            <Box
                sx={{
                    minHeight: 200,

                    display: "flex",

                    alignItems: "center",

                    justifyContent: "center",

                    color: "text.secondary"
                }}
            >

                <CircularProgress
                    size={30}
                />

            </Box>

        );

    }


    // ========================================================
    // MAIN DASHBOARD
    // ========================================================

    return (

        <Grid
            container
            spacing={2.25}

            sx={{
                pb: 5
            }}
        >

            {/* =================================================
                TOTAL EMPLOYEES
            ================================================= */}

            <Grid
                size={{
                    xs: 12,
                    md: 6,
                    lg: 3
                }}
            >

                <DashboardCard
                    title="Total Employees"
                    value={summary.total_employees}
                />

            </Grid>


            {/* =================================================
                TOTAL TEMPLATES
            ================================================= */}

            <Grid
                size={{
                    xs: 12,
                    md: 6,
                    lg: 3
                }}
            >

                <DashboardCard
                    title="Total Templates"
                    value={summary.total_templates}
                />

            </Grid>


            {/* =================================================
                EMAILS SENT
            ================================================= */}

            <Grid
                size={{
                    xs: 12,
                    md: 6,
                    lg: 3
                }}
            >

                <DashboardCard
                    title="Emails Sent"
                    value={summary.emails_sent}
                />

            </Grid>


            {/* =================================================
                FAILED EMAILS
            ================================================= */}

            <Grid
                size={{
                    xs: 12,
                    md: 6,
                    lg: 3
                }}
            >

                <DashboardCard
                    title="Failed Emails"
                    value={summary.emails_failed}
                />

            </Grid>


            {/* =================================================
                BIRTHDAY STATUS
            ================================================= */}

            <Grid
                size={{
                    xs: 12
                }}
            >

                <BirthdayStatus />

            </Grid>


            {/* =================================================
                RECENT EMAIL ACTIVITY
            ================================================= */}

            <Grid
                size={{
                    xs: 12
                }}
            >

                <RecentEmailActivity
                    logs={recentLogs}
                    loading={logsLoading}
                    refreshing={refreshing}
                    onRefresh={() =>
                        loadRecentLogs(true)
                    }
                />

            </Grid>

        </Grid>

    );

}


// ============================================================
// RECENT EMAIL ACTIVITY
// ============================================================

function RecentEmailActivity({
    logs,
    loading,
    refreshing,
    onRefresh
}) {

    return (

        <Paper
            elevation={0}

            sx={{
                width: "100%",

                borderRadius: 2.5,

                overflow: "hidden",

                backgroundColor:
                    (theme) =>
                        theme.palette.mode === "dark"
                            ? "rgba(15, 23, 42, 0.58)"
                            : "rgba(255, 255, 255, 0.58)",

                backdropFilter:
                    "blur(18px)",

                WebkitBackdropFilter:
                    "blur(18px)",

                border: "1px solid",

                borderColor:
                    "divider",

                boxShadow:
                    (theme) =>
                        theme.palette.mode === "dark"
                            ? "0 8px 25px rgba(0, 0, 0, 0.16)"
                            : "0 8px 25px rgba(15, 23, 42, 0.05)"
            }}
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <Box
                sx={{
                    display: "flex",

                    alignItems: "center",

                    gap: 1,

                    px: 2,

                    py: 1.35,

                    borderBottom: "1px solid",

                    borderColor: "divider"
                }}
            >

                {/* =================================================
                    REFRESH BUTTON
                ================================================= */}

                <IconButton
                    onClick={onRefresh}
                    disabled={refreshing}

                    aria-label={
                        "Refresh recent email activity"
                    }

                    sx={{
                        width: 36,

                        height: 36,

                        flexShrink: 0,

                        borderRadius: 1.8,

                        backgroundColor:
                            (theme) =>
                                theme.palette.mode === "dark"
                                    ? "rgba(96, 165, 250, 0.10)"
                                    : "rgba(37, 99, 235, 0.08)",

                        color: "primary.main",

                        border: "1px solid",

                        borderColor:
                            (theme) =>
                                theme.palette.mode === "dark"
                                    ? "rgba(96, 165, 250, 0.16)"
                                    : "rgba(37, 99, 235, 0.12)",

                        transition:
                            "all 0.2s ease",

                        "&:hover": {

                            backgroundColor:
                                (theme) =>
                                    theme.palette.mode === "dark"
                                        ? "rgba(96, 165, 250, 0.18)"
                                        : "rgba(37, 99, 235, 0.13)",

                            color:
                                "primary.main",

                            transform:
                                refreshing
                                    ? "none"
                                    : "rotate(25deg)"
                        },

                        "&.Mui-disabled": {

                            color:
                                "primary.main",

                            opacity:
                                0.7
                        }
                    }}
                >

                    <RefreshIcon
                        sx={{
                            fontSize: 20,

                            animation:
                                refreshing
                                    ? "recentActivityRefresh 0.9s linear infinite"
                                    : "none",

                            "@keyframes recentActivityRefresh": {

                                from: {
                                    transform: "rotate(0deg)"
                                },

                                to: {
                                    transform: "rotate(360deg)"
                                }

                            }
                        }}
                    />

                </IconButton>


                {/* =================================================
                    TITLE
                ================================================= */}

                <Typography
                    sx={{
                        fontSize: "1.05rem",

                        fontWeight: 700,

                        lineHeight: 1.2,

                        color: "text.primary"
                    }}
                >
                    Recent Email Activity
                </Typography>

            </Box>


            {/* =================================================
                LOADING
            ================================================= */}

            {loading ? (

                <ActivityLoading />

            ) : logs.length === 0 ? (

                <EmptyActivity />

            ) : (

                /* =================================================
                   TABLE
                ================================================= */

                <TableContainer
                    sx={{
                        width: "100%",

                        overflowX: "auto",

                        scrollbarWidth: "none",

                        "&::-webkit-scrollbar": {
                            display: "none"
                        }
                    }}
                >

                    <Table
                        size="small"

                        sx={{
                            minWidth: 720
                        }}
                    >

                        {/* =================================================
                            TABLE HEADER
                        ================================================= */}

                        <TableHead>

                            <TableRow
                                sx={{
                                    backgroundColor:
                                        (theme) =>
                                            theme.palette.mode === "dark"
                                                ? "rgba(96, 165, 250, 0.045)"
                                                : "rgba(37, 99, 235, 0.035)"
                                }}
                            >

                                <ActivityHeader
                                    icon={
                                        <PeopleIcon />
                                    }

                                    title="Employee"
                                />


                                <ActivityHeader
                                    icon={
                                        <DescriptionIcon />
                                    }

                                    title="Template"
                                />


                                <ActivityHeader
                                    icon={
                                        <EmailIcon />
                                    }

                                    title="Recipient"
                                />


                                <ActivityHeader
                                    title="Status"
                                />


                                <ActivityHeader
                                    title="Sent At"
                                />

                            </TableRow>

                        </TableHead>


                        {/* =================================================
                            TABLE BODY
                        ================================================= */}

                        <TableBody>

                            {logs
                                .filter(
                                    (log) =>
                                        log &&
                                        typeof log === "object"
                                )
                                .map(
                                    (log, index) => (

                                        <ActivityRow
                                            key={
                                                log.id ??
                                                `recent-email-${index}`
                                            }

                                            log={log}
                                        />

                                    )
                                )}

                        </TableBody>

                    </Table>

                </TableContainer>

            )}

        </Paper>

    );

}


// ============================================================
// ACTIVITY HEADER
// ============================================================

function ActivityHeader({
    icon,
    title
}) {

    return (

        <TableCell
            sx={{
                py: 1.25,

                px: 1.75,

                borderBottom: "1px solid",

                borderColor: "divider",

                color: "text.secondary",

                fontSize: "0.70rem",

                fontWeight: 700,

                whiteSpace: "nowrap"
            }}
        >

            <Box
                sx={{
                    display: "flex",

                    alignItems: "center",

                    gap: 0.65
                }}
            >

                {icon && (

                    <Box
                        sx={{
                            display: "flex",

                            color: "text.secondary",

                            "& svg": {
                                fontSize: 15
                            }
                        }}
                    >

                        {icon}

                    </Box>

                )}

                {title}

            </Box>

        </TableCell>

    );

}


// ============================================================
// ACTIVITY ROW
// ============================================================

function ActivityRow({
    log
}) {

    if (!log) {
        return null;
    }


    const isSuccess =
        String(
            log.status || ""
        ).toUpperCase() === "SUCCESS";


    const employeeId =
        log.employee_id !== null &&
        log.employee_id !== undefined
            ? String(log.employee_id)
            : "-";


    const templateText =
        log.template_id !== null &&
        log.template_id !== undefined
            ? `Template ${log.template_id}`
            : "Birthday / Custom";


    const recipientEmail =
        log.recipient_email ||
        "-";


    return (

        <TableRow
            sx={{
                transition:
                    "background-color 0.18s ease",

                "&:hover": {

                    backgroundColor:
                        (theme) =>
                            theme.palette.mode === "dark"
                                ? "rgba(96, 165, 250, 0.045)"
                                : "rgba(37, 99, 235, 0.035)"
                },

                "&:last-child td": {

                    borderBottom:
                        "none"
                }
            }}
        >

            {/* =================================================
                EMPLOYEE
            ================================================= */}

            <TableCell
                sx={{
                    py: 1.35,

                    px: 1.75,

                    color: "text.primary",

                    fontSize: "0.75rem",

                    fontWeight: 600,

                    borderBottom: "1px solid",

                    borderColor: "divider",

                    whiteSpace: "nowrap"
                }}
            >

                <Box
                    sx={{
                        display: "flex",

                        alignItems: "center",

                        gap: 0.8
                    }}
                >

                    <Box
                        sx={{
                            width: 28,

                            height: 28,

                            flexShrink: 0,

                            display: "flex",

                            alignItems: "center",

                            justifyContent: "center",

                            borderRadius: "50%",

                            backgroundColor:
                                (theme) =>
                                    theme.palette.mode === "dark"
                                        ? "rgba(96, 165, 250, 0.10)"
                                        : "rgba(37, 99, 235, 0.08)",

                            color: "primary.main",

                            fontSize: "0.62rem",

                            fontWeight: 700
                        }}
                    >

                        {employeeId.slice(0, 3)}

                    </Box>


                    {employeeId}

                </Box>

            </TableCell>


            {/* =================================================
                TEMPLATE
            ================================================= */}

            <TableCell
                sx={{
                    py: 1.35,

                    px: 1.75,

                    color: "text.secondary",

                    fontSize: "0.73rem",

                    borderBottom: "1px solid",

                    borderColor: "divider",

                    whiteSpace: "nowrap"
                }}
            >

                {templateText}

            </TableCell>


            {/* =================================================
                RECIPIENT
            ================================================= */}

            <TableCell
                sx={{
                    py: 1.35,

                    px: 1.75,

                    color: "text.primary",

                    fontSize: "0.73rem",

                    borderBottom: "1px solid",

                    borderColor: "divider",

                    maxWidth: 320
                }}
            >

                <Typography
                    component="span"

                    sx={{
                        display: "block",

                        overflow: "hidden",

                        textOverflow: "ellipsis",

                        whiteSpace: "nowrap",

                        fontSize: "inherit",

                        color: "inherit"
                    }}
                >

                    {recipientEmail}

                </Typography>

            </TableCell>


            {/* =================================================
                STATUS - SYMBOL ONLY
            ================================================= */}

            <TableCell
                sx={{
                    py: 1.35,

                    px: 1.75,

                    borderBottom: "1px solid",

                    borderColor: "divider"
                }}
            >

                {isSuccess ? (

                    <CheckCircleIcon
                        titleAccess="Email sent successfully"

                        sx={{
                            display: "block",

                            fontSize: 21,

                            color: "success.main"
                        }}
                    />

                ) : (

                    <ErrorIcon
                        titleAccess="Email sending failed"

                        sx={{
                            display: "block",

                            fontSize: 21,

                            color: "error.main"
                        }}
                    />

                )}

            </TableCell>


            {/* =================================================
                SENT AT
            ================================================= */}

            <TableCell
                sx={{
                    py: 1.35,

                    px: 1.75,

                    color: "text.secondary",

                    fontSize: "0.70rem",

                    borderBottom: "1px solid",

                    borderColor: "divider",

                    whiteSpace: "nowrap"
                }}
            >

                {formatDate(
                    log.sent_at
                )}

            </TableCell>

        </TableRow>

    );

}


// ============================================================
// DATE FORMAT
// ============================================================

function formatDate(
    dateValue
) {

    if (!dateValue) {
        return "-";
    }


    const date =
        new Date(dateValue);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "-";

    }


    return date.toLocaleString();

}


// ============================================================
// ACTIVITY LOADING
// ============================================================

function ActivityLoading() {

    return (

        <Box
            sx={{
                minHeight: 135,

                display: "flex",

                flexDirection: "column",

                alignItems: "center",

                justifyContent: "center",

                gap: 1
            }}
        >

            <CircularProgress
                size={27}
            />


            <Typography
                sx={{
                    fontSize: "0.72rem",

                    color: "text.secondary"
                }}
            >
                Loading recent email activity...
            </Typography>

        </Box>

    );

}


// ============================================================
// EMPTY ACTIVITY
// ============================================================

function EmptyActivity() {

    return (

        <Box
            sx={{
                minHeight: 110,

                display: "flex",

                alignItems: "center",

                justifyContent: "center",

                gap: 1.5,

                px: 2
            }}
        >

            <Box
                sx={{
                    width: 38,

                    height: 38,

                    flexShrink: 0,

                    display: "flex",

                    alignItems: "center",

                    justifyContent: "center",

                    borderRadius: 2,

                    backgroundColor:
                        (theme) =>
                            theme.palette.mode === "dark"
                                ? "rgba(96, 165, 250, 0.10)"
                                : "rgba(37, 99, 235, 0.08)",

                    color: "primary.main"
                }}
            >

                <EmailIcon
                    sx={{
                        fontSize: 20
                    }}
                />

            </Box>


            <Box>

                <Typography
                    sx={{
                        fontSize: "0.85rem",

                        fontWeight: 700,

                        color: "text.primary"
                    }}
                >
                    No email activity yet
                </Typography>


                <Typography
                    sx={{
                        mt: 0.3,

                        fontSize: "0.68rem",

                        color: "text.secondary"
                    }}
                >
                    Sent email activity will appear here.
                </Typography>

            </Box>

        </Box>

    );

}


export default Dashboard;