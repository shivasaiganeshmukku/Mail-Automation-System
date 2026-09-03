import { useEffect, useState } from "react";

import TablePagination from "@mui/material/TablePagination";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Alert from "@mui/material/Alert";

import RefreshIcon from "@mui/icons-material/Refresh";
import ClearIcon from "@mui/icons-material/Clear";
import EmailIcon from "@mui/icons-material/Email";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";


import EmailLogService from "../../services/emailLogService";


function EmailLogs() {

    const [logs, setLogs] = useState([]);

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] = useState("ALL");

    const [dateFilter, setDateFilter] = useState("");

    const [page, setPage] = useState(0);

    const [rowsPerPage, setRowsPerPage] = useState(25);

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
    SEARCH + FILTER
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


        let matchesDate = true;


        if (dateFilter) {

            if (!log.sent_at) {

                matchesDate = false;

            } else {

                const logDate =
                    new Date(log.sent_at);

                const year =
                    logDate.getFullYear();

                const month =
                    String(
                        logDate.getMonth() + 1
                    ).padStart(2, "0");

                const day =
                    String(
                        logDate.getDate()
                    ).padStart(2, "0");

                const formattedDate =
                    `${year}-${month}-${day}`;

                matchesDate =
                    formattedDate === dateFilter;

            }

        }


        return (
            matchesSearch &&
            matchesStatus &&
            matchesDate
        );

    });


    /*
    ============================================================
    PAGINATION
    ============================================================
    */

    const paginatedLogs =
        filteredLogs.slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage
        );


    /*
    ============================================================
    RESET PAGE WHEN FILTER CHANGES
    ============================================================
    */

    useEffect(() => {

        setPage(0);

    }, [
        search,
        statusFilter,
        dateFilter
    ]);


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
    CLEAR FILTERS
    ============================================================
    */

    const clearFilters = () => {

        setSearch("");

        setStatusFilter("ALL");

        setDateFilter("");

        setPage(0);

    };


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
    STATUS STYLE
    ============================================================
    */

    const getStatusStyle = (status) => {

        const normalizedStatus =
            String(status ?? "").toUpperCase();


        if (normalizedStatus === "SUCCESS") {

            return {
                color: "#047857",
                background: "#D1FAE5",
                border: "#6EE7B7",
            };

        }


        return {
            color: "#B91C1C",
            background: "#FEE2E2",
            border: "#FCA5A5",
        };

    };


    return (

        <Box
            sx={{
                width: "100%",
                minHeight: "calc(100vh - 120px)",
            }}
        >

            {/* ================================================= */}
            {/* PAGE HEADER */}
            {/* ================================================= */}

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 3,
                }}
            >

                <Box
                    sx={{
                        width: 44,
                        height: 44,
                        borderRadius: "12px",

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",

                        background:
                            "linear-gradient(135deg, #2563EB, #4F46E5)",

                        color: "#FFFFFF",

                        boxShadow:
                            "0 6px 16px rgba(37, 99, 235, 0.20)",
                    }}
                >
                    <EmailIcon />
                </Box>


                <Box>

                    <Typography
                        sx={{
                            fontSize: {
                                xs: "1.45rem",
                                sm: "1.7rem",
                            },

                            fontWeight: 750,

                            color: "#1E293B",

                            lineHeight: 1.2,
                        }}
                    >
                        Email Logs
                    </Typography>


                    <Typography
                        sx={{
                            mt: 0.5,

                            fontSize: "0.85rem",

                            color: "#64748B",
                        }}
                    >
                        Track email delivery history and status
                    </Typography>

                </Box>

            </Box>


            {/* ================================================= */}
            {/* STATISTICS */}
            {/* ================================================= */}

            <Box
                sx={{
                    display: "grid",

                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(3, 1fr)",
                    },

                    gap: 2,

                    mb: 3,
                }}
            >

                {/* TOTAL */}

                <Paper
                    elevation={0}
                    sx={{
                        p: 2.2,

                        borderRadius: "14px",

                        border:
                            "1px solid #DBEAFE",

                        background:
                            "linear-gradient(135deg, #EFF6FF 0%, #E0E7FF 100%)",

                        boxShadow:
                            "0 5px 18px rgba(15, 23, 42, 0.04)",
                    }}
                >

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                        }}
                    >

                        <Box
                            sx={{
                                width: 40,
                                height: 40,

                                borderRadius: "10px",

                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",

                                backgroundColor: "#DBEAFE",

                                color: "#2563EB",
                            }}
                        >
                            <EmailIcon />
                        </Box>


                        <Box>

                            <Typography
                                sx={{
                                    fontSize: "0.78rem",
                                    color: "#64748B",
                                    fontWeight: 600,
                                }}
                            >
                                Total Emails
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: "1.55rem",
                                    fontWeight: 750,
                                    color: "#1E3A8A",
                                }}
                            >
                                {totalLogs}
                            </Typography>

                        </Box>

                    </Box>

                </Paper>


                {/* SUCCESS */}

                <Paper
                    elevation={0}
                    sx={{
                        p: 2.2,

                        borderRadius: "14px",

                        border:
                            "1px solid #A7F3D0",

                        background:
                            "linear-gradient(135deg, #ECFDF5 0%, #DFF7EC 100%)",

                        boxShadow:
                            "0 5px 18px rgba(15, 23, 42, 0.04)",
                    }}
                >

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                        }}
                    >

                        <Box
                            sx={{
                                width: 40,
                                height: 40,

                                borderRadius: "10px",

                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",

                                backgroundColor: "#D1FAE5",

                                color: "#059669",
                            }}
                        >
                            <CheckCircleIcon />
                        </Box>


                        <Box>

                            <Typography
                                sx={{
                                    fontSize: "0.78rem",
                                    color: "#64748B",
                                    fontWeight: 600,
                                }}
                            >
                                Successful
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: "1.55rem",
                                    fontWeight: 750,
                                    color: "#047857",
                                }}
                            >
                                {successfulLogs}
                            </Typography>

                        </Box>

                    </Box>

                </Paper>


                {/* FAILED */}

                <Paper
                    elevation={0}
                    sx={{
                        p: 2.2,

                        borderRadius: "14px",

                        border:
                            "1px solid #FECACA",

                        background:
                            "linear-gradient(135deg, #FEF2F2 0%, #FDE8E8 100%)",

                        boxShadow:
                            "0 5px 18px rgba(15, 23, 42, 0.04)",
                    }}
                >

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                        }}
                    >

                        <Box
                            sx={{
                                width: 40,
                                height: 40,

                                borderRadius: "10px",

                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",

                                backgroundColor: "#FEE2E2",

                                color: "#DC2626",
                            }}
                        >
                            <ErrorIcon />
                        </Box>


                        <Box>

                            <Typography
                                sx={{
                                    fontSize: "0.78rem",
                                    color: "#64748B",
                                    fontWeight: 600,
                                }}
                            >
                                Failed
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: "1.55rem",
                                    fontWeight: 750,
                                    color: "#B91C1C",
                                }}
                            >
                                {failedLogs}
                            </Typography>

                        </Box>

                    </Box>

                </Paper>

            </Box>


            {/* ================================================= */}
            {/* FILTER AREA */}
            {/* ================================================= */}

            <Paper
                elevation={0}
                sx={{
                    p: 2.2,

                    mb: 3,

                    borderRadius: "16px",

                    border:
                        "1px solid #D8DEEE",

                    background:
                        "linear-gradient(135deg, #F0F4FF 0%, #F8FAFC 100%)",

                    boxShadow:
                        "0 6px 20px rgba(15, 23, 42, 0.04)",
                }}
            >

                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                        alignItems: "center",
                        flexWrap: "wrap",
                    }}
                >

                    {/* SEARCH */}

                    <TextField
                        label="Search"
                        placeholder="Employee, ID, email, subject..."
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                        sx={{
                            flex: 1,
                            minWidth: 250,

                            "& .MuiOutlinedInput-root": {
                                backgroundColor: "#FFFFFF",

                                borderRadius: "10px",

                                "& fieldset": {
                                    borderColor: "#CBD5E1",
                                },

                                "&:hover fieldset": {
                                    borderColor: "#93C5FD",
                                },

                                "&.Mui-focused fieldset": {
                                    borderColor: "#2563EB",
                                },
                            },
                        }}
                    />


                    {/* STATUS */}

                    <TextField
                        select
                        label="Status"
                        value={statusFilter}
                        onChange={(event) =>
                            setStatusFilter(
                                event.target.value
                            )
                        }
                        sx={{
                            minWidth: 160,

                            "& .MuiOutlinedInput-root": {
                                backgroundColor: "#FFFFFF",

                                borderRadius: "10px",

                                "& fieldset": {
                                    borderColor: "#CBD5E1",
                                },

                                "&.Mui-focused fieldset": {
                                    borderColor: "#2563EB",
                                },
                            },
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


                    {/* DATE */}

                    <TextField
                        type="date"
                        label="Date"
                        value={dateFilter}
                        onChange={(event) =>
                            setDateFilter(
                                event.target.value
                            )
                        }
                        InputLabelProps={{
                            shrink: true
                        }}
                        sx={{
                            minWidth: 180,

                            "& .MuiOutlinedInput-root": {
                                backgroundColor: "#FFFFFF",

                                borderRadius: "10px",

                                "& fieldset": {
                                    borderColor: "#CBD5E1",
                                },

                                "&.Mui-focused fieldset": {
                                    borderColor: "#2563EB",
                                },
                            },
                        }}
                    />


                    {/* REFRESH */}

                    <Button
                        variant="contained"
                        startIcon={
                            <RefreshIcon />
                        }
                        onClick={loadLogs}
                        disabled={loading}

                        sx={{
                            minHeight: 44,

                            px: 2,

                            borderRadius: "10px",

                            background:
                                "linear-gradient(135deg, #2563EB, #4F46E5)",

                            fontWeight: 600,

                            boxShadow:
                                "0 5px 14px rgba(37, 99, 235, 0.18)",

                            "&:hover": {
                                background:
                                    "linear-gradient(135deg, #1D4ED8, #4338CA)",

                                transform:
                                    "translateY(-1px)",
                            },
                        }}
                    >
                        Refresh
                    </Button>


                    {/* CLEAR */}

                    <Button
                        variant="outlined"
                        startIcon={
                            <ClearIcon />
                        }
                        onClick={clearFilters}

                        sx={{
                            minHeight: 44,

                            px: 2,

                            borderRadius: "10px",

                            borderColor: "#CBD5E1",

                            color: "#475569",

                            backgroundColor: "#F8FAFC",

                            fontWeight: 600,

                            "&:hover": {
                                borderColor: "#94A3B8",

                                backgroundColor: "#F1F5F9",
                            },
                        }}
                    >
                        Clear
                    </Button>

                </Box>


                {/* FILTER RESULT */}

                <Typography
                    sx={{
                        mt: 2,

                        fontSize: "0.78rem",

                        color: "#64748B",
                    }}
                >

                    Showing{" "}
                    <strong
                        style={{
                            color: "#334155"
                        }}
                    >
                        {filteredLogs.length}
                    </strong>{" "}
                    of{" "}
                    <strong
                        style={{
                            color: "#334155"
                        }}
                    >
                        {totalLogs}
                    </strong>{" "}
                    email logs

                </Typography>

            </Paper>


            {/* ================================================= */}
            {/* TABLE CARD */}
            {/* ================================================= */}

            <Paper
                elevation={0}
                sx={{
                    borderRadius: "18px",

                    overflow: "hidden",

                    border:
                        "1px solid #D7DDF0",

                    background:
                        "linear-gradient(135deg, #EEF2FF 0%, #F1F5F9 100%)",

                    boxShadow:
                        "0 8px 25px rgba(15, 23, 42, 0.05)",
                }}
            >

                {/* TABLE TITLE */}

                <Box
                    sx={{
                        px: {
                            xs: 2,
                            sm: 2.5,
                        },

                        py: 2,

                        display: "flex",

                        justifyContent: "space-between",

                        alignItems: "center",

                        borderBottom:
                            "1px solid #D8DEEE",

                        background:
                            "linear-gradient(135deg, #E0E7FF 0%, #EDE9FE 100%)",
                    }}
                >

                    <Box>

                        <Typography
                            sx={{
                                fontSize: "1rem",
                                fontWeight: 700,
                                color: "#1E293B",
                            }}
                        >
                            Email Activity
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.3,
                                fontSize: "0.75rem",
                                color: "#64748B",
                            }}
                        >
                            Email delivery history
                        </Typography>

                    </Box>


                    <Chip
                        icon={<EmailIcon />}
                        label={`${filteredLogs.length} Records`}
                        size="small"

                        sx={{
                            color: "#2563EB",

                            backgroundColor:
                                "#DBEAFE",

                            border:
                                "1px solid #BFDBFE",

                            fontWeight: 600,

                            "& .MuiChip-icon": {
                                color: "#2563EB",
                            },
                        }}
                    />

                </Box>


                {/* TABLE */}

                <TableContainer
                    sx={{
                        maxHeight: 560,

                        overflow: "auto",

                        backgroundColor: "#F8FAFC",

                        "&::-webkit-scrollbar": {
                            width: 8,
                            height: 8,
                        },

                        "&::-webkit-scrollbar-track": {
                            background: "#E2E8F0",
                        },

                        "&::-webkit-scrollbar-thumb": {
                            background: "#94A3B8",
                            borderRadius: 10,
                        },

                        "&::-webkit-scrollbar-thumb:hover": {
                            background: "#64748B",
                        },

                        scrollbarWidth: "thin",

                        scrollbarColor:
                            "#94A3B8 #E2E8F0",
                    }}
                >

                    <Table
                        stickyHeader
                        sx={{
                            minWidth: 1100,

                            backgroundColor: "#F8FAFC",
                        }}
                    >

                        {/* ================================================= */}
                        {/* TABLE HEAD */}
                        {/* ================================================= */}

                        <TableHead>

                            <TableRow>

                                <TableCell
                                    sx={{
                                        minWidth: 70,

                                        position: "sticky",
                                        top: 0,

                                        zIndex: 5,

                                        background:
                                            "#E0E7FF",

                                        color: "#475569",

                                        fontWeight: 700,

                                        fontSize: "0.73rem",

                                        textTransform:
                                            "uppercase",

                                        letterSpacing:
                                            "0.04em",

                                        borderBottom:
                                            "1px solid #C7D2FE",
                                    }}
                                >
                                    ID
                                </TableCell>


                                <TableCell
                                    sx={{
                                        minWidth: 170,

                                        background:
                                            "#E0E7FF",

                                        color: "#475569",

                                        fontWeight: 700,

                                        fontSize: "0.73rem",

                                        textTransform:
                                            "uppercase",

                                        letterSpacing:
                                            "0.04em",

                                        borderBottom:
                                            "1px solid #C7D2FE",
                                    }}
                                >
                                    Employee
                                </TableCell>


                                <TableCell
                                    sx={{
                                        minWidth: 170,

                                        background:
                                            "#E0E7FF",

                                        color: "#475569",

                                        fontWeight: 700,

                                        fontSize: "0.73rem",

                                        textTransform:
                                            "uppercase",

                                        letterSpacing:
                                            "0.04em",

                                        borderBottom:
                                            "1px solid #C7D2FE",
                                    }}
                                >
                                    Template
                                </TableCell>


                                <TableCell
                                    sx={{
                                        minWidth: 240,

                                        background:
                                            "#E0E7FF",

                                        color: "#475569",

                                        fontWeight: 700,

                                        fontSize: "0.73rem",

                                        textTransform:
                                            "uppercase",

                                        letterSpacing:
                                            "0.04em",

                                        borderBottom:
                                            "1px solid #C7D2FE",
                                    }}
                                >
                                    Recipient
                                </TableCell>


                                <TableCell
                                    sx={{
                                        minWidth: 220,

                                        background:
                                            "#E0E7FF",

                                        color: "#475569",

                                        fontWeight: 700,

                                        fontSize: "0.73rem",

                                        textTransform:
                                            "uppercase",

                                        letterSpacing:
                                            "0.04em",

                                        borderBottom:
                                            "1px solid #C7D2FE",
                                    }}
                                >
                                    Subject
                                </TableCell>


                                <TableCell
                                    sx={{
                                        minWidth: 120,

                                        background:
                                            "#E0E7FF",

                                        color: "#475569",

                                        fontWeight: 700,

                                        fontSize: "0.73rem",

                                        textTransform:
                                            "uppercase",

                                        letterSpacing:
                                            "0.04em",

                                        borderBottom:
                                            "1px solid #C7D2FE",
                                    }}
                                >
                                    Status
                                </TableCell>


                                <TableCell
                                    sx={{
                                        minWidth: 130,

                                        background:
                                            "#E0E7FF",

                                        color: "#475569",

                                        fontWeight: 700,

                                        fontSize: "0.73rem",

                                        textTransform:
                                            "uppercase",

                                        letterSpacing:
                                            "0.04em",

                                        borderBottom:
                                            "1px solid #C7D2FE",
                                    }}
                                >
                                    Error
                                </TableCell>


                                <TableCell
                                    sx={{
                                        minWidth: 190,

                                        background:
                                            "#E0E7FF",

                                        color: "#475569",

                                        fontWeight: 700,

                                        fontSize: "0.73rem",

                                        textTransform:
                                            "uppercase",

                                        letterSpacing:
                                            "0.04em",

                                        borderBottom:
                                            "1px solid #C7D2FE",
                                    }}
                                >
                                    Sent At
                                </TableCell>

                            </TableRow>

                        </TableHead>


                        {/* ================================================= */}
                        {/* TABLE BODY */}
                        {/* ================================================= */}

                        <TableBody>

                            {loading ? (

                                <TableRow>

                                    <TableCell
                                        colSpan={8}
                                        align="center"

                                        sx={{
                                            py: 7,

                                            color: "#64748B",

                                            backgroundColor:
                                                "#F8FAFC",
                                        }}
                                    >

                                        <Typography
                                            sx={{
                                                fontWeight: 600,
                                            }}
                                        >
                                            Loading email logs...
                                        </Typography>

                                    </TableCell>

                                </TableRow>

                            ) : paginatedLogs.length === 0 ? (

                                <TableRow>

                                    <TableCell
                                        colSpan={8}
                                        align="center"

                                        sx={{
                                            py: 7,

                                            backgroundColor:
                                                "#F8FAFC",
                                        }}
                                    >

                                        <EmailIcon
                                            sx={{
                                                fontSize: 42,

                                                color: "#94A3B8",

                                                mb: 1,
                                            }}
                                        />

                                        <Typography
                                            sx={{
                                                fontWeight: 600,

                                                color: "#475569",
                                            }}
                                        >
                                            No email logs found.
                                        </Typography>

                                        <Typography
                                            sx={{
                                                mt: 0.5,

                                                fontSize: "0.8rem",

                                                color: "#94A3B8",
                                            }}
                                        >
                                            Try changing your filters.
                                        </Typography>

                                    </TableCell>

                                </TableRow>

                            ) : (

                                paginatedLogs.map(
                                    (log) => {

                                        const statusStyle =
                                            getStatusStyle(
                                                log.status
                                            );

                                        return (

                                            <TableRow
                                                key={log.id}

                                                hover

                                                sx={{
                                                    backgroundColor:
                                                        "#F8FAFC",

                                                    transition:
                                                        "all 0.2s ease",

                                                    "&:hover": {
                                                        backgroundColor:
                                                            "#EFF6FF",

                                                        "& td": {
                                                            borderColor:
                                                                "#BFDBFE",
                                                        },
                                                    },

                                                    "&:last-child td": {
                                                        borderBottom:
                                                            "none",
                                                    },
                                                }}
                                            >

                                                {/* ID */}

                                                <TableCell
                                                    sx={{
                                                        fontWeight: 700,

                                                        color: "#2563EB",

                                                        fontSize:
                                                            "0.84rem",

                                                        borderColor:
                                                            "#E2E8F0",
                                                    }}
                                                >
                                                    {log.id}
                                                </TableCell>


                                                {/* EMPLOYEE */}

                                                <TableCell
                                                    sx={{
                                                        borderColor:
                                                            "#E2E8F0",
                                                    }}
                                                >

                                                    <Typography
                                                        sx={{
                                                            fontSize:
                                                                "0.84rem",

                                                            fontWeight:
                                                                650,

                                                            color:
                                                                "#1E293B",
                                                        }}
                                                    >
                                                        {log.employee_name ||
                                                            "Unknown"}
                                                    </Typography>

                                                    <Typography
                                                        sx={{
                                                            fontSize:
                                                                "0.72rem",

                                                            color:
                                                                "#64748B",

                                                            mt: 0.2,
                                                        }}
                                                    >
                                                        {log.employee_id}
                                                    </Typography>

                                                </TableCell>


                                                {/* TEMPLATE */}

                                                <TableCell
                                                    sx={{
                                                        color:
                                                            "#475569",

                                                        fontSize:
                                                            "0.83rem",

                                                        borderColor:
                                                            "#E2E8F0",
                                                    }}
                                                >

                                                    {log.template_name ||
                                                        "No Template"}

                                                </TableCell>


                                                {/* RECIPIENT */}

                                                <TableCell
                                                    sx={{
                                                        color:
                                                            "#475569",

                                                        fontSize:
                                                            "0.83rem",

                                                        whiteSpace:
                                                            "nowrap",

                                                        borderColor:
                                                            "#E2E8F0",
                                                    }}
                                                >

                                                    {log.recipient_email}

                                                </TableCell>


                                                {/* SUBJECT */}

                                                <TableCell
                                                    sx={{
                                                        color:
                                                            "#334155",

                                                        fontSize:
                                                            "0.83rem",

                                                        maxWidth: 260,

                                                        borderColor:
                                                            "#E2E8F0",
                                                    }}
                                                >

                                                    <Typography
                                                        sx={{
                                                            fontSize:
                                                                "0.83rem",

                                                            overflow:
                                                                "hidden",

                                                            textOverflow:
                                                                "ellipsis",

                                                            whiteSpace:
                                                                "nowrap",
                                                        }}
                                                    >
                                                        {log.subject}
                                                    </Typography>

                                                </TableCell>


                                                {/* STATUS */}

                                                <TableCell
                                                    sx={{
                                                        borderColor:
                                                            "#E2E8F0",
                                                    }}
                                                >

                                                    <Chip
                                                        icon={
                                                            String(
                                                                log.status
                                                            ).toUpperCase() ===
                                                            "SUCCESS"
                                                                ? (
                                                                    <CheckCircleIcon />
                                                                )
                                                                : (
                                                                    <ErrorIcon />
                                                                )
                                                        }

                                                        label={
                                                            log.status
                                                        }

                                                        size="small"

                                                        sx={{
                                                            color:
                                                                statusStyle.color,

                                                            backgroundColor:
                                                                statusStyle.background,

                                                            border:
                                                                `1px solid ${statusStyle.border}`,

                                                            fontWeight: 650,

                                                            fontSize:
                                                                "0.7rem",

                                                            "& .MuiChip-icon": {
                                                                color:
                                                                    statusStyle.color,

                                                                fontSize:
                                                                    "16px",
                                                            },
                                                        }}
                                                    />

                                                </TableCell>


                                                {/* ERROR */}

                                                <TableCell
                                                    sx={{
                                                        borderColor:
                                                            "#E2E8F0",
                                                    }}
                                                >

                                                    {String(
                                                        log.status
                                                    ).toUpperCase() ===
                                                        "FAILED" &&
                                                    log.error_message ? (

                                                        <Button
                                                            size="small"

                                                            startIcon={
                                                                <ErrorIcon />
                                                            }

                                                            onClick={() =>
                                                                openErrorDialog(
                                                                    log
                                                                )
                                                            }

                                                            sx={{
                                                                color:
                                                                    "#DC2626",

                                                                fontWeight:
                                                                    600,

                                                                textTransform:
                                                                    "none",

                                                                borderRadius:
                                                                    "7px",

                                                                "&:hover": {
                                                                    backgroundColor:
                                                                        "#FEE2E2",
                                                                },
                                                            }}
                                                        >
                                                            View Error
                                                        </Button>

                                                    ) : (

                                                        <Typography
                                                            sx={{
                                                                color:
                                                                    "#94A3B8",
                                                            }}
                                                        >
                                                            —
                                                        </Typography>

                                                    )}

                                                </TableCell>


                                                {/* DATE */}

                                                <TableCell
                                                    sx={{
                                                        color:
                                                            "#64748B",

                                                        fontSize:
                                                            "0.8rem",

                                                        whiteSpace:
                                                            "nowrap",

                                                        borderColor:
                                                            "#E2E8F0",
                                                    }}
                                                >

                                                    {log.sent_at
                                                        ? new Date(
                                                            log.sent_at
                                                        ).toLocaleString()
                                                        : "—"}

                                                </TableCell>

                                            </TableRow>

                                        );

                                    }
                                )

                            )}

                        </TableBody>

                    </Table>

                </TableContainer>


                {/* ================================================= */}
                {/* PAGINATION */}
                {/* ================================================= */}

                <Box
                    sx={{
                        background:
                            "#F1F5F9",

                        borderTop:
                            "1px solid #D8DEEE",
                    }}
                >

                    <TablePagination
                        component="div"

                        count={
                            filteredLogs.length
                        }

                        page={page}

                        onPageChange={(
                            event,
                            newPage
                        ) => {

                            setPage(newPage);

                        }}

                        rowsPerPage={
                            rowsPerPage
                        }

                        onRowsPerPageChange={(
                            event
                        ) => {

                            setRowsPerPage(
                                parseInt(
                                    event.target.value,
                                    10
                                )
                            );

                            setPage(0);

                        }}

                        rowsPerPageOptions={[
                            10,
                            25,
                            50,
                            100
                        ]}

                        sx={{
                            color: "#475569",

                            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                                fontSize: "0.78rem",
                            },
                        }}
                    />

                </Box>

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

                PaperProps={{
                    sx: {
                        borderRadius: "16px",

                        border:
                            "1px solid #FECACA",

                        background:
                            "#FFF7F7",

                        boxShadow:
                            "0 18px 45px rgba(15, 23, 42, 0.15)",
                    }
                }}
            >

                <DialogTitle
                    sx={{
                        color: "#991B1B",

                        fontWeight: 700,

                        background:
                            "linear-gradient(135deg, #FEE2E2, #FEF2F2)",

                        borderBottom:
                            "1px solid #FECACA",
                    }}
                >
                    Email Error Details
                </DialogTitle>


                <DialogContent
                    sx={{
                        pt: 3,
                    }}
                >

                    {selectedError && (

                        <>

                            <Typography
                                sx={{
                                    mb: 1.5,

                                    color: "#475569",
                                }}
                            >
                                <strong
                                    style={{
                                        color: "#1E293B"
                                    }}
                                >
                                    Log ID:
                                </strong>{" "}
                                {selectedError.id}
                            </Typography>


                            <Typography
                                sx={{
                                    mb: 1.5,

                                    color: "#475569",
                                }}
                            >
                                <strong
                                    style={{
                                        color: "#1E293B"
                                    }}
                                >
                                    Employee:
                                </strong>{" "}
                                {
                                    selectedError.employee_name ||
                                    selectedError.employee_id
                                }
                            </Typography>


                            <Typography
                                sx={{
                                    mb: 1.5,

                                    color: "#475569",
                                }}
                            >
                                <strong
                                    style={{
                                        color: "#1E293B"
                                    }}
                                >
                                    Recipient:
                                </strong>{" "}
                                {
                                    selectedError.recipient_email
                                }
                            </Typography>


                            <Typography
                                sx={{
                                    mb: 2,

                                    display: "flex",

                                    alignItems: "center",

                                    gap: 1,

                                    color: "#475569",
                                }}
                            >
                                <strong
                                    style={{
                                        color: "#1E293B"
                                    }}
                                >
                                    Status:
                                </strong>


                                <Chip
                                    icon={<ErrorIcon />}

                                    label={
                                        selectedError.status
                                    }

                                    size="small"

                                    sx={{
                                        color: "#B91C1C",

                                        backgroundColor:
                                            "#FEE2E2",

                                        border:
                                            "1px solid #FCA5A5",

                                        fontWeight: 650,

                                        "& .MuiChip-icon": {
                                            color: "#DC2626",
                                        },
                                    }}
                                />

                            </Typography>


                            <Alert
                                severity="error"

                                sx={{
                                    borderRadius: "10px",

                                    border:
                                        "1px solid #FECACA",

                                    backgroundColor:
                                        "#FEF2F2",
                                }}
                            >

                                {selectedError.error_message ||
                                    "No error message available."}

                            </Alert>

                        </>

                    )}

                </DialogContent>


                <DialogActions
                    sx={{
                        px: 3,
                        pb: 2,
                    }}
                >

                    <Button
                        onClick={
                            closeErrorDialog
                        }

                        sx={{
                            color: "#475569",

                            borderRadius: "8px",

                            fontWeight: 600,

                            "&:hover": {
                                backgroundColor:
                                    "#F1F5F9",
                            },
                        }}
                    >
                        Close
                    </Button>

                </DialogActions>

            </Dialog>

        </Box>

    );

}


export default EmailLogs;