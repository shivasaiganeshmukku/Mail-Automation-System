import { useEffect, useState } from "react";

import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";

import AddIcon from "@mui/icons-material/Add";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import PeopleIcon from "@mui/icons-material/People";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import EmployeeService from "../../services/employeeService";
import EmployeeDialog from "../../components/EmployeeDialog";
import DeleteEmployeeDialog from "../../components/DeleteEmployeeDialog";


// ============================================================
// DEPARTMENT COLORS
// ============================================================

const getDepartmentStyle = (department) => {

    const styles = {

        // BLUE
        IT: {
            color: "#2563EB",
            background: "#EFF6FF",
            border: "#BFDBFE",
        },

        // PINK
        HR: {
            color: "#DB2777",
            background: "#FDF2F8",
            border: "#FBCFE8",
        },

        // GREEN
        Finance: {
            color: "#059669",
            background: "#ECFDF5",
            border: "#A7F3D0",
        },

        // AMBER
        Sales: {
            color: "#D97706",
            background: "#FFFBEB",
            border: "#FDE68A",
        },

        // VIOLET
        Marketing: {
            color: "#7C3AED",
            background: "#F5F3FF",
            border: "#DDD6FE",
        },

        // TEAL
        Operations: {
            color: "#0F766E",
            background: "#F0FDFA",
            border: "#99F6E4",
        },

    };

    return (
        styles[department] || {
            color: "#475569",
            background: "#F8FAFC",
            border: "#CBD5E1",
        }
    );
};


// ============================================================
// EMPLOYEE STATUS COLORS
// ============================================================

const getStatusStyle = (status) => {

    if (status) {

        return {
            color: "#047857",
            background: "#ECFDF5",
            border: "#A7F3D0",
        };

    }

    return {
        color: "#B91C1C",
        background: "#FEF2F2",
        border: "#FECACA",
    };
};


// ============================================================
// MAIN COMPONENT
// ============================================================

function Employees() {

    const [employees, setEmployees] = useState([]);

    const [open, setOpen] = useState(false);

    const [editingEmployee, setEditingEmployee] = useState(null);

    const [deletingEmployee, setDeletingEmployee] = useState(null);

    const [uploading, setUploading] = useState(false);


    // ============================================================
    // LOAD EMPLOYEES
    // ============================================================

    useEffect(() => {

        loadEmployees();

    }, []);


    const loadEmployees = () => {

        EmployeeService.getAllEmployees()

            .then((response) => {

                console.log(
                    "EMPLOYEE LIST FROM API:",
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

            });

    };


    // ============================================================
    // OPEN ADD EMPLOYEE DIALOG
    // ============================================================

    const handleOpen = () => {

        setEditingEmployee(null);

        setOpen(true);

    };


    // ============================================================
    // EDIT EMPLOYEE
    // ============================================================

    const handleEdit = (employee) => {

        setEditingEmployee(employee);

        setOpen(true);

    };


    // ============================================================
    // CLOSE EMPLOYEE DIALOG
    // ============================================================

    const handleClose = () => {

        setOpen(false);

    };


    // ============================================================
    // OPEN DELETE DIALOG
    // ============================================================

    const handleDelete = (employee) => {

        setDeletingEmployee(employee);

    };


    // ============================================================
    // CLOSE DELETE DIALOG
    // ============================================================

    const handleDeleteClose = () => {

        setDeletingEmployee(null);

    };


    // ============================================================
    // CONFIRM DELETE
    // ============================================================

    const handleDeleteConfirm = () => {

        if (!deletingEmployee) {

            return;

        }


        EmployeeService.deleteEmployee(
            deletingEmployee.id
        )

            .then((response) => {

                console.log(
                    "EMPLOYEE DELETED:",
                    response.data
                );

                alert(
                    "Employee deleted successfully!"
                );

                setDeletingEmployee(null);

                loadEmployees();

            })

            .catch((error) => {

                console.error(
                    "DELETE EMPLOYEE ERROR:",
                    error
                );


                if (error.response) {

                    alert(
                        "Error deleting employee: " +
                        JSON.stringify(
                            error.response.data
                        )
                    );

                } else {

                    alert(
                        "Error deleting employee. " +
                        "Check the backend."
                    );

                }

            });

    };


    // ============================================================
    // EXCEL UPLOAD
    // ============================================================

    const handleExcelUpload = (event) => {

        const file = event.target.files[0];


        if (!file) {

            return;

        }


        // Check Excel extension

        if (
            !file.name
                .toLowerCase()
                .endsWith(".xlsx")
        ) {

            alert(
                "Please select an Excel (.xlsx) file."
            );

            event.target.value = "";

            return;

        }


        setUploading(true);


        EmployeeService.uploadEmployees(file)

            .then((response) => {

                console.log(
                    "EXCEL UPLOAD RESPONSE:",
                    response.data
                );


                const data = response.data;


                alert(
                    "Excel upload completed!\n\n" +

                    "Total Records: " +
                    (data.total_records ?? 0) +

                    "\nImported: " +
                    (data.imported_records ?? 0) +

                    "\nSkipped: " +
                    (data.skipped_records ?? 0)
                );


                loadEmployees();

            })

            .catch((error) => {

                console.error(
                    "EXCEL UPLOAD ERROR:",
                    error
                );


                if (error.response) {

                    const errorData =
                        error.response.data;


                    let message =
                        errorData.message ||
                        "Excel upload failed.";


                    // Missing columns

                    if (
                        errorData.missing_columns &&
                        errorData.missing_columns.length > 0
                    ) {

                        message +=
                            "\n\nMissing columns:\n" +
                            errorData.missing_columns.join(
                                ", "
                            );

                    }


                    // Validation errors

                    if (
                        errorData.errors &&
                        errorData.errors.length > 0
                    ) {

                        message +=
                            "\n\nValidation Errors:\n";


                        errorData.errors
                            .slice(0, 10)
                            .forEach((item) => {

                                message +=
                                    `Row ${item.row}: ` +
                                    `${item.field} - ` +
                                    `${item.message}\n`;

                            });


                        if (
                            errorData.errors.length > 10
                        ) {

                            message +=
                                "\nOnly the first 10 errors are shown.";

                        }

                    }


                    alert(message);

                } else {

                    alert(
                        "Excel upload failed. " +
                        "Check the backend."
                    );

                }

            })

            .finally(() => {

                setUploading(false);

                event.target.value = "";

            });

    };


    // ============================================================
    // UI
    // ============================================================

    return (

        <Box
            sx={{
                width: "100%",
                minHeight: "calc(100vh - 120px)",
            }}
        >

            {/* ==================================================
                PAGE HEADER
            ================================================== */}

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

                {/* ==================================================
                    TITLE
                ================================================== */}

                <Box>

                    <Box
                        sx={{
                            display: "flex",

                            alignItems:
                                "center",

                            gap: 1.5,
                        }}
                    >

                        {/* TITLE ICON */}

                        <Box
                            sx={{
                                width: 44,
                                height: 44,

                                borderRadius:
                                    "12px",

                                display: "flex",

                                alignItems:
                                    "center",

                                justifyContent:
                                    "center",

                                background:
                                    "linear-gradient(135deg, #2563EB, #4F46E5)",

                                color: "#FFFFFF",

                                boxShadow:
                                    "0 6px 16px rgba(37, 99, 235, 0.20)",
                            }}
                        >

                            <PeopleIcon />

                        </Box>


                        {/* TITLE TEXT */}

                        <Box>

                            <Typography
                                sx={{
                                    fontSize: {
                                        xs: "1.45rem",
                                        sm: "1.7rem",
                                    },

                                    fontWeight: 750,

                                    color:
                                        "#1E293B",

                                    lineHeight: 1.2,
                                }}
                            >
                                Employee Management
                            </Typography>


                            <Typography
                                sx={{
                                    mt: 0.5,

                                    fontSize:
                                        "0.85rem",

                                    color:
                                        "#64748B",
                                }}
                            >
                                Manage employees and organization records
                            </Typography>

                        </Box>

                    </Box>

                </Box>


                {/* ==================================================
                    ACTION BUTTONS
                ================================================== */}

                <Box
                    sx={{
                        display: "flex",

                        gap: 1.5,

                        flexWrap: "wrap",

                        width: {
                            xs: "100%",
                            sm: "auto",
                        },
                    }}
                >

                    {/* ==================================================
                        UPLOAD EXCEL
                    ================================================== */}

                    <Button
                        variant="outlined"

                        component="label"

                        startIcon={
                            <UploadFileIcon />
                        }

                        disabled={uploading}

                        sx={{
                            minHeight: 44,

                            px: 2,

                            borderRadius:
                                "11px",

                            borderColor:
                                "#FED7AA",

                            color:
                                "#EA580C",

                            backgroundColor:
                                "#FFF7ED",

                            fontWeight: 600,

                            transition:
                                "all 0.2s ease",

                            "&:hover": {

                                borderColor:
                                    "#FB923C",

                                backgroundColor:
                                    "#FFEDD5",

                                transform:
                                    "translateY(-2px)",
                            },
                        }}
                    >

                        {uploading
                            ? "Uploading..."
                            : "Upload Excel"
                        }


                        <input
                            type="file"

                            hidden

                            accept=".xlsx"

                            onChange={
                                handleExcelUpload
                            }
                        />

                    </Button>


                    {/* ==================================================
                        ADD EMPLOYEE
                    ================================================== */}

                    <Button
                        variant="contained"

                        startIcon={
                            <AddIcon />
                        }

                        onClick={
                            handleOpen
                        }

                        sx={{
                            minHeight: 44,

                            px: 2.2,

                            borderRadius:
                                "11px",

                            background:
                                "linear-gradient(135deg, #2563EB, #4F46E5)",

                            fontWeight: 600,

                            boxShadow:
                                "0 6px 15px rgba(37, 99, 235, 0.20)",

                            transition:
                                "all 0.2s ease",

                            "&:hover": {

                                background:
                                    "linear-gradient(135deg, #1D4ED8, #4338CA)",

                                transform:
                                    "translateY(-2px)",

                                boxShadow:
                                    "0 9px 20px rgba(37, 99, 235, 0.28)",
                            },
                        }}
                    >

                        Add Employee

                    </Button>

                </Box>

            </Box>


            {/* ==================================================
                EMPLOYEE TABLE CARD
            ================================================== */}

            <Paper
                elevation={0}

                sx={{
                    borderRadius:
                        "18px",

                    border:
                        "1px solid #DCE3EF",

                    background:
                        "linear-gradient(135deg, #F8FAFC 0%, #EEF4FF 100%)",

                    overflow:
                        "hidden",

                    boxShadow:
                        "0 8px 25px rgba(15, 23, 42, 0.06)",
                }}
            >

                {/* ==================================================
                    TABLE HEADER
                ================================================== */}

                <Box
                    sx={{
                        px: {
                            xs: 2,
                            sm: 2.5,
                        },

                        py: 2,

                        display:
                            "flex",

                        justifyContent:
                            "space-between",

                        alignItems:
                            "center",

                        borderBottom:
                            "1px solid #D7E0EC",

                        background:
                            "linear-gradient(135deg, #EAF2FF 0%, #F1F5F9 100%)",
                    }}
                >

                    <Box>

                        <Typography
                            sx={{
                                fontSize:
                                    "1rem",

                                fontWeight:
                                    700,

                                color:
                                    "#1E293B",
                            }}
                        >
                            Employees
                        </Typography>


                        <Typography
                            sx={{
                                fontSize:
                                    "0.75rem",

                                color:
                                    "#64748B",

                                mt: 0.3,
                            }}
                        >

                            {employees.length} employee

                            {employees.length !== 1
                                ? "s"
                                : ""}

                        </Typography>

                    </Box>


                    {/* RECORD COUNT */}

                    <Chip
                        icon={
                            <PeopleIcon />
                        }

                        label={
                            `${employees.length} Records`
                        }

                        size="small"

                        sx={{
                            color:
                                "#2563EB",

                            backgroundColor:
                                "#E0ECFF",

                            border:
                                "1px solid #C7D8F5",

                            fontWeight:
                                600,

                            "& .MuiChip-icon": {
                                color:
                                    "#2563EB",
                            },
                        }}
                    />

                </Box>


                {/* ==================================================
                    SCROLLABLE TABLE
                ================================================== */}

                <TableContainer
                    sx={{
                        maxHeight: 560,

                        overflow:
                            "auto",

                        // Chrome / Edge / Safari

                        "&::-webkit-scrollbar": {
                            width: 8,
                            height: 8,
                        },

                        "&::-webkit-scrollbar-track": {
                            background:
                                "#E8EDF4",
                        },

                        "&::-webkit-scrollbar-thumb": {
                            background:
                                "#B8C4D4",

                            borderRadius:
                                10,
                        },

                        "&::-webkit-scrollbar-thumb:hover": {
                            background:
                                "#94A3B8",
                        },

                        // Firefox

                        scrollbarWidth:
                            "thin",

                        scrollbarColor:
                            "#B8C4D4 #E8EDF4",
                    }}
                >

                    <Table
                        stickyHeader

                        sx={{
                            minWidth:
                                950,

                            backgroundColor:
                                "#F3F6FA",

                            "& .MuiTableBody-root": {
                                backgroundColor:
                                    "#F3F6FA",
                            },
                        }}
                    >

                        {/* ==================================================
                            TABLE HEAD
                        ================================================== */}

                        <TableHead>

                            <TableRow>

                                {/* EMPLOYEE ID */}

                                <TableCell
                                    sx={{
                                        minWidth:
                                            130,

                                        position:
                                            "sticky",

                                        top: 0,

                                        zIndex: 5,

                                        background:
                                            "#E8EEF7",

                                        color:
                                            "#334155",

                                        fontWeight:
                                            700,

                                        fontSize:
                                            "0.75rem",

                                        textTransform:
                                            "uppercase",

                                        letterSpacing:
                                            "0.04em",

                                        borderBottom:
                                            "1px solid #D5DEEA",
                                    }}
                                >
                                    Employee ID
                                </TableCell>


                                {/* NAME */}

                                <TableCell
                                    sx={{
                                        minWidth:
                                            190,

                                        background:
                                            "#E8EEF7",

                                        color:
                                            "#334155",

                                        fontWeight:
                                            700,

                                        fontSize:
                                            "0.75rem",

                                        textTransform:
                                            "uppercase",

                                        letterSpacing:
                                            "0.04em",

                                        borderBottom:
                                            "1px solid #D5DEEA",
                                    }}
                                >
                                    Name
                                </TableCell>


                                {/* EMAIL */}

                                <TableCell
                                    sx={{
                                        minWidth:
                                            280,

                                        background:
                                            "#E8EEF7",

                                        color:
                                            "#334155",

                                        fontWeight:
                                            700,

                                        fontSize:
                                            "0.75rem",

                                        textTransform:
                                            "uppercase",

                                        letterSpacing:
                                            "0.04em",

                                        borderBottom:
                                            "1px solid #D5DEEA",
                                    }}
                                >
                                    Email
                                </TableCell>


                                {/* DEPARTMENT */}

                                <TableCell
                                    sx={{
                                        minWidth:
                                            160,

                                        background:
                                            "#E8EEF7",

                                        color:
                                            "#334155",

                                        fontWeight:
                                            700,

                                        fontSize:
                                            "0.75rem",

                                        textTransform:
                                            "uppercase",

                                        letterSpacing:
                                            "0.04em",

                                        borderBottom:
                                            "1px solid #D5DEEA",
                                    }}
                                >
                                    Department
                                </TableCell>


                                {/* STATUS */}

                                <TableCell
                                    sx={{
                                        minWidth:
                                            130,

                                        background:
                                            "#E8EEF7",

                                        color:
                                            "#334155",

                                        fontWeight:
                                            700,

                                        fontSize:
                                            "0.75rem",

                                        textTransform:
                                            "uppercase",

                                        letterSpacing:
                                            "0.04em",

                                        borderBottom:
                                            "1px solid #D5DEEA",
                                    }}
                                >
                                    Status
                                </TableCell>


                                {/* ACTIONS */}

                                <TableCell
                                    sx={{
                                        minWidth:
                                            180,

                                        background:
                                            "#E8EEF7",

                                        color:
                                            "#334155",

                                        fontWeight:
                                            700,

                                        fontSize:
                                            "0.75rem",

                                        textTransform:
                                            "uppercase",

                                        letterSpacing:
                                            "0.04em",

                                        borderBottom:
                                            "1px solid #D5DEEA",
                                    }}
                                >
                                    Actions
                                </TableCell>

                            </TableRow>

                        </TableHead>


                        {/* ==================================================
                            TABLE BODY
                        ================================================== */}

                        <TableBody>

                            {employees.length === 0 ? (

                                <TableRow>

                                    <TableCell
                                        colSpan={6}

                                        sx={{
                                            py: 8,

                                            textAlign:
                                                "center",

                                            borderBottom:
                                                "none",

                                            backgroundColor:
                                                "#F3F6FA",
                                        }}
                                    >

                                        <PeopleIcon
                                            sx={{
                                                fontSize:
                                                    45,

                                                color:
                                                    "#94A3B8",

                                                mb: 1,
                                            }}
                                        />


                                        <Typography
                                            sx={{
                                                fontWeight:
                                                    600,

                                                color:
                                                    "#475569",
                                            }}
                                        >
                                            No employees found
                                        </Typography>


                                        <Typography
                                            sx={{
                                                fontSize:
                                                    "0.8rem",

                                                color:
                                                    "#94A3B8",

                                                mt: 0.5,
                                            }}
                                        >
                                            Add an employee or
                                            upload an Excel file.
                                        </Typography>

                                    </TableCell>

                                </TableRow>

                            ) : (

                                employees.map(
                                    (employee) => {

                                        const departmentStyle =
                                            getDepartmentStyle(
                                                employee.department
                                            );

                                        const statusStyle =
                                            getStatusStyle(
                                                employee.status
                                            );

                                        return (

                                            <TableRow
                                                key={
                                                    employee.id
                                                }

                                                sx={{
                                                    transition:
                                                        "all 0.2s ease",

                                                    "& td": {
                                                        backgroundColor:
                                                            "#F3F6FA",

                                                        borderColor:
                                                            "#DCE3EA",
                                                    },

                                                    "&:hover": {

                                                        "& td": {
                                                            backgroundColor:
                                                                "#E8F0FC",

                                                            borderColor:
                                                                "#D8E2EF",
                                                        },
                                                    },

                                                    "&:last-child td": {
                                                        borderBottom:
                                                            "none",
                                                    },
                                                }}
                                            >

                                                {/* ==================================================
                                                    EMPLOYEE ID
                                                ================================================== */}

                                                <TableCell
                                                    sx={{
                                                        fontWeight:
                                                            700,

                                                        color:
                                                            "#2563EB",

                                                        fontSize:
                                                            "0.85rem",
                                                    }}
                                                >
                                                    {
                                                        employee.employee_id
                                                    }
                                                </TableCell>


                                                {/* ==================================================
                                                    NAME
                                                ================================================== */}

                                                <TableCell>

                                                    <Box
                                                        sx={{
                                                            display:
                                                                "flex",

                                                            alignItems:
                                                                "center",

                                                            gap: 1.5,
                                                        }}
                                                    >

                                                        <Avatar
                                                            sx={{
                                                                width:
                                                                    34,

                                                                height:
                                                                    34,

                                                                fontSize:
                                                                    "0.8rem",

                                                                fontWeight:
                                                                    700,

                                                                color:
                                                                    "#2563EB",

                                                                backgroundColor:
                                                                    "#DBEAFE",
                                                            }}
                                                        >

                                                            {
                                                                employee.name
                                                                    ?.charAt(
                                                                        0
                                                                    )
                                                                    ?.toUpperCase()
                                                            }

                                                        </Avatar>


                                                        <Typography
                                                            sx={{
                                                                fontWeight:
                                                                    600,

                                                                color:
                                                                    "#1E293B",

                                                                fontSize:
                                                                    "0.875rem",
                                                            }}
                                                        >
                                                            {
                                                                employee.name
                                                            }
                                                        </Typography>

                                                    </Box>

                                                </TableCell>


                                                {/* ==================================================
                                                    EMAIL
                                                ================================================== */}

                                                <TableCell>

                                                    <Typography
                                                        sx={{
                                                            color:
                                                                "#64748B",

                                                            fontSize:
                                                                "0.85rem",

                                                            whiteSpace:
                                                                "nowrap",
                                                        }}
                                                    >
                                                        {
                                                            employee.email
                                                        }
                                                    </Typography>

                                                </TableCell>


                                                {/* ==================================================
                                                    DEPARTMENT
                                                ================================================== */}

                                                <TableCell>

                                                    <Chip
                                                        label={
                                                            employee.department
                                                        }

                                                        size="small"

                                                        sx={{
                                                            color:
                                                                departmentStyle.color,

                                                            backgroundColor:
                                                                departmentStyle.background,

                                                            border:
                                                                `1px solid ${departmentStyle.border}`,

                                                            fontWeight:
                                                                600,

                                                            fontSize:
                                                                "0.72rem",
                                                        }}
                                                    />

                                                </TableCell>


                                                {/* ==================================================
                                                    STATUS
                                                ================================================== */}

                                                <TableCell>

                                                    <Chip
                                                        icon={
                                                            employee.status
                                                                ? (
                                                                    <CheckCircleIcon />
                                                                )
                                                                : (
                                                                    <CancelIcon />
                                                                )
                                                        }

                                                        label={
                                                            employee.status
                                                                ? "Active"
                                                                : "Inactive"
                                                        }

                                                        size="small"

                                                        sx={{
                                                            color:
                                                                statusStyle.color,

                                                            backgroundColor:
                                                                statusStyle.background,

                                                            border:
                                                                `1px solid ${statusStyle.border}`,

                                                            fontWeight:
                                                                600,

                                                            fontSize:
                                                                "0.72rem",

                                                            "& .MuiChip-icon": {
                                                                color:
                                                                    statusStyle.color,

                                                                fontSize:
                                                                    "16px",
                                                            },
                                                        }}
                                                    />

                                                </TableCell>


                                                {/* ==================================================
                                                    ACTIONS
                                                ================================================== */}

                                                <TableCell>

                                                    <Box
                                                        sx={{
                                                            display:
                                                                "flex",

                                                            gap: 1,
                                                        }}
                                                    >

                                                        {/* EDIT */}

                                                        <Button
                                                            variant="outlined"

                                                            size="small"

                                                            startIcon={
                                                                <EditIcon />
                                                            }

                                                            onClick={() =>
                                                                handleEdit(
                                                                    employee
                                                                )
                                                            }

                                                            sx={{
                                                                borderRadius:
                                                                    "8px",

                                                                borderColor:
                                                                    "#BFDBFE",

                                                                color:
                                                                    "#2563EB",

                                                                backgroundColor:
                                                                    "#EFF6FF",

                                                                fontWeight:
                                                                    600,

                                                                textTransform:
                                                                    "none",

                                                                "&:hover": {

                                                                    borderColor:
                                                                        "#93C5FD",

                                                                    backgroundColor:
                                                                        "#DBEAFE",

                                                                    transform:
                                                                        "translateY(-1px)",
                                                                },
                                                            }}
                                                        >
                                                            Edit
                                                        </Button>


                                                        {/* DELETE */}

                                                        <Button
                                                            variant="outlined"

                                                            size="small"

                                                            startIcon={
                                                                <DeleteIcon />
                                                            }

                                                            onClick={() =>
                                                                handleDelete(
                                                                    employee
                                                                )
                                                            }

                                                            sx={{
                                                                borderRadius:
                                                                    "8px",

                                                                borderColor:
                                                                    "#FECACA",

                                                                color:
                                                                    "#DC2626",

                                                                backgroundColor:
                                                                    "#FEF2F2",

                                                                fontWeight:
                                                                    600,

                                                                textTransform:
                                                                    "none",

                                                                "&:hover": {

                                                                    borderColor:
                                                                        "#FCA5A5",

                                                                    backgroundColor:
                                                                        "#FEE2E2",

                                                                    transform:
                                                                        "translateY(-1px)",
                                                                },
                                                            }}
                                                        >
                                                            Delete
                                                        </Button>

                                                    </Box>

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


            {/* ==================================================
                ADD / EDIT EMPLOYEE DIALOG
            ================================================== */}

            <EmployeeDialog

                open={
                    open
                }

                handleClose={
                    handleClose
                }

                onEmployeeCreated={
                    loadEmployees
                }

                editingEmployee={
                    editingEmployee
                }

            />


            {/* ==================================================
                DELETE EMPLOYEE DIALOG
            ================================================== */}

            <DeleteEmployeeDialog

                open={
                    Boolean(
                        deletingEmployee
                    )
                }

                employee={
                    deletingEmployee
                }

                handleClose={
                    handleDeleteClose
                }

                handleConfirm={
                    handleDeleteConfirm
                }

            />

        </Box>

    );

}


export default Employees;