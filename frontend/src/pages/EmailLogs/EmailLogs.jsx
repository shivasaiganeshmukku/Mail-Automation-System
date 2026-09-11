import { useEffect, useState } from "react";

import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

import RefreshIcon from "@mui/icons-material/Refresh";
import EmailIcon from "@mui/icons-material/Email";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

import EmailLogService from "../../services/emailLogService";


function EmailLogs() {

    const [logs, setLogs] = useState([]);

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] = useState("ALL");

    const [loading, setLoading] = useState(false);

    const [selectedError, setSelectedError] = useState(null);


    /*
    ============================================================
    LOAD EMAIL LOGS
    ============================================================
    */

    const loadLogs = () => {

        setLoading(true);

        EmailLogService.getAllLogs()

            .then((response) => {

                console.log(
                    "EMAIL LOGS:",
                    response.data.data
                );

                setLogs(
                    response.data.data || []
                );

            })

            .catch((error) => {

                console.error(
                    "GET EMAIL LOGS ERROR:",
                    error
                );

                setLogs([]);

            })

            .finally(() => {

                setLoading(false);

            });

    };


    /*
    ============================================================
    INITIAL LOAD
    ============================================================
    */

    useEffect(() => {

        loadLogs();

    }, []);


    /*
    ============================================================
    SEARCH + STATUS FILTER
    ============================================================
    */

    const filteredLogs = logs.filter((log) => {

        const searchText =
            search.trim().toLowerCase();


        const searchableText = [

            log.id,

            log.employee_id,

            log.employee_name,

            log.template_id,

            log.template_name,

            log.recipient_email,

            log.subject,

            log.status,

            log.error_message

        ]

            .map((value) =>
                String(value ?? "").toLowerCase()
            )

            .join(" ");


        const matchesSearch =
            searchText === "" ||
            searchableText.includes(searchText);


        const matchesStatus =
            statusFilter === "ALL" ||
            String(log.status ?? "").toUpperCase() ===
                statusFilter;


        return (
            matchesSearch &&
            matchesStatus
        );

    });


    /*
    ============================================================
    STATISTICS
    ============================================================
    */

    const totalLogs =
        logs.length;


    const successfulLogs =
        logs.filter(
            (log) =>
                String(log.status ?? "").toUpperCase() ===
                "SUCCESS"
        ).length;


    const failedLogs =
        logs.filter(
            (log) =>
                String(log.status ?? "").toUpperCase() ===
                "FAILED"
        ).length;


    /*
    ============================================================
    ERROR DIALOG
    ============================================================
    */

    const openErrorDialog = (log) => {

        setSelectedError(log);

    };


    const closeErrorDialog = () => {

        setSelectedError(null);

    };


    /*
    ============================================================
    STAT CARD
    ============================================================
    */

    const StatCard = ({
        title,
        value,
        icon,
        background,
        iconColor
    }) => {

        return (

            <Paper
                elevation={0}

                sx={{
                    flex: 1,

                    minWidth: {
                        xs: "100%",
                        sm: "180px"
                    },

                    p: 1.8,

                    borderRadius: 2.5,

                    background:
                        background,

                    border:
                        "1px solid",

                    borderColor:
                        "divider",

                    backdropFilter:
                        "blur(14px)",

                    display:
                        "flex",

                    alignItems:
                        "center",

                    gap: 1.5
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

                        backgroundColor:
                            "rgba(255,255,255,0.10)",

                        color:
                            iconColor
                    }}
                >

                    {icon}

                </Box>


                <Box>

                    <Typography
                        sx={{
                            fontSize:
                                "0.72rem",

                            color:
                                "text.secondary",

                            fontWeight:
                                600
                        }}
                    >
                        {title}
                    </Typography>


                    <Typography
                        sx={{
                            mt: 0.2,

                            fontSize:
                                "1.3rem",

                            lineHeight:
                                1.1,

                            fontWeight:
                                750,

                            color:
                                "text.primary"
                        }}
                    >
                        {value}
                    </Typography>

                </Box>

            </Paper>

        );

    };


    /*
    ============================================================
    UI
    ============================================================
    */

    return (

        <Box
            sx={{
                width: "100%",

                minHeight:
                    "calc(100vh - 120px)",

                /*
                Bottom space
                */

                pb: {
                    xs: 8,
                    sm: 10,
                    md: 12
                }
            }}
        >

            {/* ================================================= */}
            {/* PAGE HEADER */}
            {/* ================================================= */}

            <Box
                sx={{
                    display:
                        "flex",

                    justifyContent:
                        "space-between",

                    alignItems: {
                        xs: "flex-start",
                        sm: "center"
                    },

                    flexDirection: {
                        xs: "column",
                        sm: "row"
                    },

                    gap: 2,

                    mb: 2.5
                }}
            >

                <Box>

                    <Box
                        sx={{
                            display:
                                "flex",

                            alignItems:
                                "center",

                            gap: 1.2
                        }}
                    >

                        <Box
                            sx={{
                                width: 42,
                                height: 42,

                                borderRadius:
                                    "11px",

                                display:
                                    "flex",

                                alignItems:
                                    "center",

                                justifyContent:
                                    "center",

                                background:
                                    "linear-gradient(135deg, #2563EB, #4F46E5)",

                                color:
                                    "#FFFFFF"
                            }}
                        >

                            <EmailIcon />

                        </Box>


                        <Box>

                            <Typography
                                sx={{
                                    fontSize: {
                                        xs: "1.35rem",
                                        sm: "1.6rem"
                                    },

                                    fontWeight:
                                        750,

                                    color:
                                        "text.primary",

                                    lineHeight:
                                        1.2
                                }}
                            >
                                Email Logs
                            </Typography>


                            <Typography
                                sx={{
                                    mt: 0.35,

                                    fontSize:
                                        "0.78rem",

                                    color:
                                        "text.secondary"
                                }}
                            >
                                View email sending history and results
                            </Typography>

                        </Box>

                    </Box>

                </Box>


                {/* ================================================= */}
                {/* REFRESH */}
                {/* ================================================= */}

                <Tooltip
                    title="Refresh email logs"
                >

                    <IconButton
                        onClick={
                            loadLogs
                        }

                        disabled={
                            loading
                        }

                        sx={{
                            width: 38,
                            height: 38,

                            borderRadius:
                                "10px",

                            color:
                                "#2563EB",

                            backgroundColor:
                                "rgba(37,99,235,0.10)",

                            "&:hover": {
                                backgroundColor:
                                    "rgba(37,99,235,0.18)"
                            }
                        }}
                    >

                        {loading ? (

                            <CircularProgress
                                size={19}
                                color="inherit"
                            />

                        ) : (

                            <RefreshIcon
                                sx={{
                                    fontSize:
                                        20
                                }}
                            />

                        )}

                    </IconButton>

                </Tooltip>

            </Box>


            {/* ================================================= */}
            {/* STATISTICS */}
            {/* ================================================= */}

            <Box
                sx={{
                    display:
                        "flex",

                    gap: 1.5,

                    flexWrap:
                        "wrap",

                    mb: 2.5
                }}
            >

                <StatCard
                    title="Total Emails"

                    value={
                        totalLogs
                    }

                    icon={
                        <EmailIcon
                            sx={{
                                fontSize:
                                    20
                            }}
                        />
                    }

                    background="linear-gradient(135deg, rgba(37,99,235,0.10), rgba(79,70,229,0.06))"

                    iconColor="#2563EB"
                />


                <StatCard
                    title="Successful"

                    value={
                        successfulLogs
                    }

                    icon={
                        <CheckCircleIcon
                            sx={{
                                fontSize:
                                    20
                            }}
                        />
                    }

                    background="linear-gradient(135deg, rgba(16,185,129,0.10), rgba(34,197,94,0.06))"

                    iconColor="#10B981"
                />


                <StatCard
                    title="Failed"

                    value={
                        failedLogs
                    }

                    icon={
                        <ErrorIcon
                            sx={{
                                fontSize:
                                    20
                            }}
                        />
                    }

                    background="linear-gradient(135deg, rgba(239,68,68,0.10), rgba(248,113,113,0.06))"

                    iconColor="#EF4444"
                />

            </Box>


            {/* ================================================= */}
            {/* SEARCH + STATUS */}
            {/* ================================================= */}

            <Paper
                elevation={0}

                sx={{
                    p: 1.5,

                    mb: 2,

                    borderRadius:
                        2.5,

                    backgroundColor:
                        "background.paper",

                    border:
                        "1px solid",

                    borderColor:
                        "divider",

                    backdropFilter:
                        "blur(16px)"
                }}
            >

                <Box
                    sx={{
                        display:
                            "flex",

                        gap: 1.5,

                        flexWrap:
                            "wrap"
                    }}
                >

                    <TextField
                        size="small"

                        label="Search"

                        value={
                            search
                        }

                        onChange={(
                            event
                        ) =>
                            setSearch(
                                event.target.value
                            )
                        }

                        sx={{
                            flex: 1,

                            minWidth: {
                                xs: "100%",
                                sm: "300px"
                            }
                        }}
                    />


                    <TextField
                        select

                        size="small"

                        label="Status"

                        value={
                            statusFilter
                        }

                        onChange={(
                            event
                        ) =>
                            setStatusFilter(
                                event.target.value
                            )
                        }

                        sx={{
                            width: {
                                xs: "100%",
                                sm: "170px"
                            }
                        }}
                    >

                        <MenuItem value="ALL">
                            All
                        </MenuItem>

                        <MenuItem value="SUCCESS">
                            Success
                        </MenuItem>

                        <MenuItem value="FAILED">
                            Failed
                        </MenuItem>

                    </TextField>

                </Box>

            </Paper>


            {/* ================================================= */}
            {/* TABLE */}
            {/* ================================================= */}

            <Paper
                elevation={0}

                sx={{
                    borderRadius:
                        2.5,

                    overflow:
                        "hidden",

                    backgroundColor:
                        "background.paper",

                    border:
                        "1px solid",

                    borderColor:
                        "divider",

                    backdropFilter:
                        "blur(18px)"
                }}
            >

                <TableContainer
                    sx={{
                        /*
                        TABLE ITSELF IS MOVABLE.
                        PAGE IS NOT CHANGED.

                        Scrollbar is hidden.
                        */

                        maxHeight: {
                            xs: "calc(100vh - 390px)",

                            sm: "calc(100vh - 370px)",

                            md: "calc(100vh - 350px)"
                        },

                        overflow:
                            "auto",

                        "&::-webkit-scrollbar": {
                            display:
                                "none"
                        },

                        scrollbarWidth:
                            "none",

                        msOverflowStyle:
                            "none"
                    }}
                >

                    <Table
                        stickyHeader

                        size="small"

                        sx={{
                            minWidth:
                                1100,

                            "& .MuiTableCell-root": {
                                py: 1.15,
                                px: 1.5
                            },

                            "& .MuiTableBody-root .MuiTableRow-root": {
                                height: 54
                            }
                        }}
                    >

                        {/* ================================================= */}
                        {/* TABLE HEADER */}
                        {/* ================================================= */}

                        <TableHead>

                            <TableRow
                                sx={{
                                    height:
                                        52
                                }}
                            >

                                {[
                                    "ID",
                                    "Employee",
                                    "Template",
                                    "Recipient",
                                    "Subject",
                                    "Status",
                                    "Error",
                                    "Sent At"
                                ].map(
                                    (
                                        heading
                                    ) => (

                                        <TableCell
                                            key={
                                                heading
                                            }

                                            sx={{
                                                /*
                                                Keep header visible
                                                while table moves.
                                                */

                                                position:
                                                    "sticky",

                                                top:
                                                    0,

                                                zIndex:
                                                    3,

                                                height:
                                                    52,

                                                py:
                                                    1.5,

                                                px:
                                                    1.5,

                                                fontWeight:
                                                    700,

                                                fontSize:
                                                    "0.78rem",

                                                color:
                                                    "text.secondary",

                                                /*
                                                Light transparent
                                                table header.
                                                */

                                                backgroundColor:
                                                    "background.paper",

                                                backdropFilter:
                                                    "none",

                                                /*
                                                Separates header
                                                from first row.
                                                */

                                                borderBottom:
                                                    "2px solid",

                                                borderColor:
                                                    "divider",

                                                whiteSpace:
                                                    "nowrap",

                                                verticalAlign:
                                                    "middle"
                                            }}
                                        >

                                            {
                                                heading
                                            }

                                        </TableCell>

                                    )
                                )}

                            </TableRow>

                        </TableHead>


                        {/* ================================================= */}
                        {/* TABLE BODY */}
                        {/* ================================================= */}

                        <TableBody>

                            {filteredLogs.length === 0 ? (

                                <TableRow>

                                    <TableCell
                                        colSpan={
                                            8
                                        }

                                        align="center"

                                        sx={{
                                            py:
                                                6,

                                            color:
                                                "text.secondary"
                                        }}
                                    >

                                        No email logs found.

                                    </TableCell>

                                </TableRow>

                            ) : (

                                filteredLogs.map(
                                    (
                                        log
                                    ) => {

                                        const isSuccess =
                                            String(
                                                log.status ?? ""
                                            ).toUpperCase() ===
                                            "SUCCESS";


                                        return (

                                            <TableRow
                                                key={
                                                    log.id
                                                }

                                                hover

                                                sx={{
                                                    height:
                                                        54,

                                                    "&:last-child td": {
                                                        borderBottom:
                                                            0
                                                    }
                                                }}
                                            >

                                                {/* ID */}

                                                <TableCell
                                                    sx={{
                                                        verticalAlign:
                                                            "middle"
                                                    }}
                                                >

                                                    {
                                                        log.id
                                                    }

                                                </TableCell>


                                                {/* EMPLOYEE */}

                                                <TableCell
                                                    sx={{
                                                        verticalAlign:
                                                            "middle"
                                                    }}
                                                >

                                                    {
                                                        log.employee_name ||
                                                        log.employee_id ||
                                                        "—"
                                                    }

                                                </TableCell>


                                                {/* TEMPLATE */}

                                                <TableCell
                                                    sx={{
                                                        verticalAlign:
                                                            "middle"
                                                    }}
                                                >

                                                    {
                                                        log.template_name ||
                                                        log.template_id ||
                                                        "—"
                                                    }

                                                </TableCell>


                                                {/* RECIPIENT */}

                                                <TableCell
                                                    sx={{
                                                        verticalAlign:
                                                            "middle"
                                                    }}
                                                >

                                                    {
                                                        log.recipient_email ||
                                                        "—"
                                                    }

                                                </TableCell>


                                                {/* SUBJECT */}

                                                <TableCell
                                                    sx={{
                                                        maxWidth:
                                                            240,

                                                        verticalAlign:
                                                            "middle"
                                                    }}
                                                >

                                                    <Typography
                                                        sx={{
                                                            fontSize:
                                                                "0.8rem",

                                                            whiteSpace:
                                                                "nowrap",

                                                            overflow:
                                                                "hidden",

                                                            textOverflow:
                                                                "ellipsis"
                                                        }}
                                                    >

                                                        {
                                                            log.subject ||
                                                            "—"
                                                        }

                                                    </Typography>

                                                </TableCell>


                                                {/* STATUS */}

                                                <TableCell
                                                    align="center"

                                                    sx={{
                                                        verticalAlign:
                                                            "middle"
                                                    }}
                                                >

                                                    <Tooltip
                                                        title={
                                                            isSuccess
                                                                ? "Email sent successfully"
                                                                : "Email sending failed"
                                                        }
                                                    >

                                                        <Box
                                                            sx={{
                                                                width:
                                                                    30,

                                                                height:
                                                                    30,

                                                                borderRadius:
                                                                    "8px",

                                                                display:
                                                                    "flex",

                                                                alignItems:
                                                                    "center",

                                                                justifyContent:
                                                                    "center",

                                                                color:
                                                                    isSuccess
                                                                        ? "#10B981"
                                                                        : "#EF4444",

                                                                backgroundColor:
                                                                    isSuccess
                                                                        ? "rgba(16,185,129,0.10)"
                                                                        : "rgba(239,68,68,0.10)"
                                                            }}
                                                        >

                                                            {isSuccess ? (

                                                                <CheckCircleIcon
                                                                    sx={{
                                                                        fontSize:
                                                                            19
                                                                    }}
                                                                />

                                                            ) : (

                                                                <ErrorIcon
                                                                    sx={{
                                                                        fontSize:
                                                                            19
                                                                    }}
                                                                />

                                                            )}

                                                        </Box>

                                                    </Tooltip>

                                                </TableCell>


                                                {/* ERROR */}

                                                <TableCell
                                                    align="center"

                                                    sx={{
                                                        verticalAlign:
                                                            "middle"
                                                    }}
                                                >

                                                    {!isSuccess &&
                                                    log.error_message ? (

                                                        <Tooltip
                                                            title="View error details"
                                                        >

                                                            <IconButton
                                                                size="small"

                                                                onClick={() =>
                                                                    openErrorDialog(
                                                                        log
                                                                    )
                                                                }

                                                                sx={{
                                                                    width:
                                                                        30,

                                                                    height:
                                                                        30,

                                                                    borderRadius:
                                                                        "8px",

                                                                    color:
                                                                        "#FACC15",

                                                                    backgroundColor:
                                                                        "rgba(250,204,21,0.10)",

                                                                    "&:hover": {
                                                                        backgroundColor:
                                                                            "rgba(250,204,21,0.18)"
                                                                    }
                                                                }}
                                                            >

                                                                {/* WARNING TRIANGLE */}

                                                                <Typography
                                                                    component="span"

                                                                    sx={{
                                                                        fontSize:
                                                                            "20px",

                                                                        lineHeight:
                                                                            1,

                                                                        fontWeight:
                                                                            700
                                                                    }}
                                                                >

                                                                    ⚠

                                                                </Typography>

                                                            </IconButton>

                                                        </Tooltip>

                                                    ) : (

                                                        <Typography
                                                            sx={{
                                                                color:
                                                                    "text.disabled",

                                                                fontSize:
                                                                    "0.9rem"
                                                            }}
                                                        >

                                                            —

                                                        </Typography>

                                                    )}

                                                </TableCell>


                                                {/* SENT AT */}

                                                <TableCell
                                                    sx={{
                                                        whiteSpace:
                                                            "nowrap",

                                                        verticalAlign:
                                                            "middle"
                                                    }}
                                                >

                                                    {
                                                        log.sent_at
                                                            ? new Date(
                                                                log.sent_at
                                                            ).toLocaleString()
                                                            : "—"
                                                    }

                                                </TableCell>

                                            </TableRow>

                                        );

                                    }
                                )

                            )}

                        </TableBody>

                    </Table>

                </TableContainer>

            </Paper>


            {/* ================================================= */}
            {/* ERROR DETAILS DIALOG */}
            {/* ================================================= */}

            <Dialog
                open={
                    selectedError !== null
                }

                onClose={
                    closeErrorDialog
                }

                fullWidth

                maxWidth="md"
            >

                <DialogTitle>
                    Email Error Details
                </DialogTitle>


                <DialogContent>

                    {selectedError && (

                        <>

                            <Typography
                                sx={{
                                    mb:
                                        1
                                }}
                            >

                                <strong>
                                    Log ID:
                                </strong>{" "}

                                {
                                    selectedError.id
                                }

                            </Typography>


                            <Typography
                                sx={{
                                    mb:
                                        1
                                }}
                            >

                                <strong>
                                    Employee:
                                </strong>{" "}

                                {
                                    selectedError.employee_name ||
                                    selectedError.employee_id
                                }

                            </Typography>


                            <Typography
                                sx={{
                                    mb:
                                        1
                                }}
                            >

                                <strong>
                                    Recipient:
                                </strong>{" "}

                                {
                                    selectedError.recipient_email
                                }

                            </Typography>


                            <Typography
                                sx={{
                                    mb:
                                        2
                                }}
                            >

                                <strong>
                                    Status:
                                </strong>{" "}

                                {
                                    selectedError.status
                                }

                            </Typography>


                            <Alert
                                severity="error"
                            >

                                {
                                    selectedError.error_message ||
                                    "No error message available."
                                }

                            </Alert>

                        </>

                    )}

                </DialogContent>


                <DialogActions>

                    <Button
                        onClick={
                            closeErrorDialog
                        }
                    >
                        Close
                    </Button>

                </DialogActions>

            </Dialog>

        </Box>

    );

}


export default EmailLogs;