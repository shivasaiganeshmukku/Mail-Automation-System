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


        /*
        Search all important fields
        */

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


        /*
        Status filter
        */

        const matchesStatus =
            statusFilter === "ALL" ||
            String(log.status ?? "").toUpperCase() ===
                statusFilter;


        /*
        Date filter
        */

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


    return (

        <>

            {/* ================================================= */}
            {/* PAGE TITLE */}
            {/* ================================================= */}

            <Typography
                variant="h4"
                sx={{
                    mb: 3
                }}
            >
                Email Logs
            </Typography>


            {/* ================================================= */}
            {/* STATISTICS */}
            {/* ================================================= */}

            <Box
                sx={{
                    display: "flex",
                    gap: 2,
                    mb: 3,
                    flexWrap: "wrap"
                }}
            >

                <Paper
                    sx={{
                        p: 2,
                        minWidth: 180
                    }}
                >

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Total Emails
                    </Typography>

                    <Typography variant="h5">
                        {totalLogs}
                    </Typography>

                </Paper>


                <Paper
                    sx={{
                        p: 2,
                        minWidth: 180
                    }}
                >

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Successful
                    </Typography>

                    <Typography
                        variant="h5"
                        color="success.main"
                    >
                        {successfulLogs}
                    </Typography>

                </Paper>


                <Paper
                    sx={{
                        p: 2,
                        minWidth: 180
                    }}
                >

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Failed
                    </Typography>

                    <Typography
                        variant="h5"
                        color="error.main"
                    >
                        {failedLogs}
                    </Typography>

                </Paper>

            </Box>


            {/* ================================================= */}
            {/* FILTER AREA */}
            {/* ================================================= */}

            <Paper
                sx={{
                    p: 2,
                    mb: 3
                }}
            >

                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                        alignItems: "center",
                        flexWrap: "wrap"
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
                            minWidth: 250
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
                            minWidth: 160
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
                            minWidth: 180
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
                    >
                        Clear
                    </Button>

                </Box>


                {/* FILTER RESULT */}

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mt: 2
                    }}
                >

                    Showing{" "}
                    <strong>
                        {filteredLogs.length}
                    </strong>{" "}
                    of{" "}
                    <strong>
                        {totalLogs}
                    </strong>{" "}
                    email logs

                </Typography>

            </Paper>


            {/* ================================================= */}
            {/* TABLE */}
            {/* ================================================= */}

            <TableContainer
                component={Paper}
                sx={{
                    overflowX: "auto"
                }}
            >

                <Table
                    sx={{
                        minWidth: 1100
                    }}
                >

                    <TableHead>

                        <TableRow>

                            <TableCell>
                                ID
                            </TableCell>

                            <TableCell>
                                Employee
                            </TableCell>

                            <TableCell>
                                Template
                            </TableCell>

                            <TableCell>
                                Recipient
                            </TableCell>

                            <TableCell>
                                Subject
                            </TableCell>

                            <TableCell>
                                Status
                            </TableCell>

                            <TableCell>
                                Error
                            </TableCell>

                            <TableCell>
                                Sent At
                            </TableCell>

                        </TableRow>

                    </TableHead>


                    <TableBody>

                        {loading ? (

                            <TableRow>

                                <TableCell
                                    colSpan={8}
                                    align="center"
                                >

                                    Loading email logs...

                                </TableCell>

                            </TableRow>

                        ) : paginatedLogs.length === 0 ? (

                            <TableRow>

                                <TableCell
                                    colSpan={8}
                                    align="center"
                                >

                                    <Typography
                                        sx={{
                                            py: 3
                                        }}
                                    >
                                        No email logs found.
                                    </Typography>

                                </TableCell>

                            </TableRow>

                        ) : (

                            paginatedLogs.map(
                                (log) => (

                                    <TableRow
                                        key={log.id}
                                        hover
                                    >

                                        {/* ID */}

                                        <TableCell>
                                            {log.id}
                                        </TableCell>


                                        {/* EMPLOYEE */}

                                        <TableCell>

                                            <Typography
                                                variant="body2"
                                                fontWeight="bold"
                                            >
                                                {log.employee_name ||
                                                    "Unknown"}
                                            </Typography>

                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                            >
                                                {log.employee_id}
                                            </Typography>

                                        </TableCell>


                                        {/* TEMPLATE */}

                                        <TableCell>

                                            {log.template_name ||
                                                "No Template"}

                                        </TableCell>


                                        {/* RECIPIENT */}

                                        <TableCell>

                                            {log.recipient_email}

                                        </TableCell>


                                        {/* SUBJECT */}

                                        <TableCell>

                                            {log.subject}

                                        </TableCell>


                                        {/* STATUS */}

                                        <TableCell>

                                            <Chip
                                                label={
                                                    log.status
                                                }
                                                color={
                                                    String(
                                                        log.status
                                                    ).toUpperCase() ===
                                                    "SUCCESS"
                                                        ? "success"
                                                        : "error"
                                                }
                                                size="small"
                                            />

                                        </TableCell>


                                        {/* ERROR */}

                                        <TableCell>

                                            {String(
                                                log.status
                                            ).toUpperCase() ===
                                                "FAILED" &&
                                            log.error_message ? (

                                                <Button
                                                    size="small"
                                                    color="error"
                                                    onClick={() =>
                                                        openErrorDialog(
                                                            log
                                                        )
                                                    }
                                                >
                                                    View Error
                                                </Button>

                                            ) : (

                                                "—"

                                            )}

                                        </TableCell>


                                        {/* DATE */}

                                        <TableCell>

                                            {log.sent_at
                                                ? new Date(
                                                    log.sent_at
                                                ).toLocaleString()
                                                : "—"}

                                        </TableCell>

                                    </TableRow>

                                )
                            )

                        )}

                    </TableBody>

                </Table>


                {/* ================================================= */}
                {/* PAGINATION */}
                {/* ================================================= */}

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
                />

            </TableContainer>


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
                                    mb: 1
                                }}
                            >
                                <strong>
                                    Log ID:
                                </strong>{" "}
                                {selectedError.id}
                            </Typography>


                            <Typography
                                sx={{
                                    mb: 1
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
                                    mb: 1
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
                                    mb: 2
                                }}
                            >
                                <strong>
                                    Status:
                                </strong>{" "}

                                <Chip
                                    label={
                                        selectedError.status
                                    }
                                    color="error"
                                    size="small"
                                />

                            </Typography>


                            <Alert
                                severity="error"
                            >

                                {selectedError.error_message ||
                                    "No error message available."}

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

        </>

    );

}


export default EmailLogs;