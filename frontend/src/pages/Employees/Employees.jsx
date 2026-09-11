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
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

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
// DEPARTMENT STYLE
// ============================================================

const getDepartmentStyle = (department) => {

    const styles = {

        IT: {
            color: "#60A5FA",
            background: "rgba(37, 99, 235, 0.12)",
            border: "rgba(96, 165, 250, 0.35)",
        },

        HR: {
            color: "#F472B6",
            background: "rgba(219, 39, 119, 0.12)",
            border: "rgba(244, 114, 182, 0.35)",
        },

        Finance: {
            color: "#34D399",
            background: "rgba(5, 150, 105, 0.12)",
            border: "rgba(52, 211, 153, 0.35)",
        },

        Sales: {
            color: "#FBBF24",
            background: "rgba(217, 119, 6, 0.12)",
            border: "rgba(251, 191, 36, 0.35)",
        },

        Marketing: {
            color: "#A78BFA",
            background: "rgba(124, 58, 237, 0.12)",
            border: "rgba(167, 139, 250, 0.35)",
        },

        Operations: {
            color: "#2DD4BF",
            background: "rgba(15, 118, 110, 0.12)",
            border: "rgba(45, 212, 191, 0.35)",
        },

    };

    return (
        styles[department] || {
            color: "text.secondary",
            background: "action.hover",
            border: "divider",
        }
    );
};


// ============================================================
// STATUS STYLE
// ============================================================

const getStatusStyle = (status) => {

    if (status) {

        return {
            color: "#34D399",
            background: "rgba(16, 185, 129, 0.12)",
            border: "rgba(52, 211, 153, 0.35)",
        };

    }

    return {
        color: "#F87171",
        background: "rgba(239, 68, 68, 0.12)",
        border: "rgba(248, 113, 113, 0.35)",
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
    // OPEN ADD EMPLOYEE
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

        setEditingEmployee(null);

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
                    (data.total_rows ?? 0) +

                    "\nImported: " +
                    (data.inserted ?? 0) +

                    "\nFailed: " +
                    (data.failed ?? 0)
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
                    justifyContent: "space-between",

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
                            alignItems: "center",
                            gap: 1.5,
                        }}
                    >

                        <Box
                            sx={{
                                width: 44,
                                height: 44,

                                borderRadius: "13px",

                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",

                                background:
                                    "linear-gradient(135deg, #2563EB, #4F46E5)",

                                color: "#FFFFFF",

                                boxShadow:
                                    "0 8px 22px rgba(37, 99, 235, 0.24)",

                                flexShrink: 0,
                            }}
                        >

                            <PeopleIcon />

                        </Box>


                        <Box>

                            <Typography
                                sx={{
                                    fontSize: {
                                        xs: "1.45rem",
                                        sm: "1.7rem",
                                    },

                                    fontWeight: 750,

                                    color: "text.primary",

                                    lineHeight: 1.2,
                                }}
                            >
                                Employee Management
                            </Typography>


                            <Typography
                                sx={{
                                    mt: 0.5,

                                    fontSize: "0.85rem",

                                    color: "text.secondary",
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
                        gap: 1.2,
                        flexWrap: "wrap",

                        width: {
                            xs: "100%",
                            sm: "auto",
                        },
                    }}
                >

                    {/* UPLOAD EXCEL */}

                    <Button
                        variant="outlined"
                        component="label"
                        startIcon={<UploadFileIcon />}
                        disabled={uploading}

                        sx={{
                            minHeight: 42,

                            px: 1.8,

                            borderRadius: "10px",

                            borderColor:
                                "rgba(245, 158, 11, 0.45)",

                            color:
                                "#F59E0B",

                            backgroundColor:
                                "rgba(245, 158, 11, 0.08)",

                            fontWeight: 650,

                            textTransform: "none",

                            "&:hover": {

                                borderColor:
                                    "#F59E0B",

                                backgroundColor:
                                    "rgba(245, 158, 11, 0.14)",

                                transform:
                                    "translateY(-1px)",
                            },

                            transition:
                                "all 0.2s ease",
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
                            onChange={handleExcelUpload}
                        />

                    </Button>


                    {/* ADD EMPLOYEE */}

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleOpen}

                        sx={{
                            minHeight: 42,

                            px: 2,

                            borderRadius: "10px",

                            background:
                                "linear-gradient(135deg, #2563EB, #4F46E5)",

                            fontWeight: 650,

                            textTransform: "none",

                            boxShadow:
                                "0 7px 18px rgba(37, 99, 235, 0.22)",

                            "&:hover": {

                                background:
                                    "linear-gradient(135deg, #1D4ED8, #4338CA)",

                                transform:
                                    "translateY(-1px)",

                                boxShadow:
                                    "0 10px 22px rgba(37, 99, 235, 0.30)",
                            },

                            transition:
                                "all 0.2s ease",
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
                    borderRadius: "16px",

                    border:
                        "1px solid",

                    borderColor:
                        "divider",

                    background:
                        "rgba(255, 255, 255, 0.035)",

                    backdropFilter:
                        "blur(16px)",

                    WebkitBackdropFilter:
                        "blur(16px)",

                    overflow: "hidden",

                    boxShadow:
                        "0 10px 30px rgba(15, 23, 42, 0.08)",
                }}
            >

                {/* ==================================================
                    TABLE HEADER
                ================================================== */}

                <Box
                    sx={{
                        px: {
                            xs: 1.8,
                            sm: 2.2,
                        },

                        py: 1.45,

                        display: "flex",

                        justifyContent: "space-between",

                        alignItems: "center",

                        borderBottom:
                            "1px solid",

                        borderColor:
                            "divider",

                        background:
                            "rgba(37, 99, 235, 0.055)",
                    }}
                >

                    <Box>

                        <Typography
                            sx={{
                                fontSize: "0.95rem",

                                fontWeight: 700,

                                color:
                                    "text.primary",
                            }}
                        >
                            Employees
                        </Typography>


                        <Typography
                            sx={{
                                fontSize: "0.72rem",

                                color:
                                    "text.secondary",

                                mt: 0.25,
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
                        icon={<PeopleIcon />}

                        label={`${employees.length} Records`}

                        size="small"

                        sx={{
                            height: 30,

                            color:
                                "primary.main",

                            backgroundColor:
                                "rgba(37, 99, 235, 0.10)",

                            border:
                                "1px solid",

                            borderColor:
                                "rgba(37, 99, 235, 0.22)",

                            fontWeight: 650,

                            "& .MuiChip-icon": {
                                color:
                                    "primary.main",

                                fontSize: 17,
                            },
                        }}
                    />

                </Box>


                {/* ==================================================
                    TABLE
                ================================================== */}

                <TableContainer
                    sx={{
                        maxHeight: 560,

                        overflow: "auto",

                        scrollbarWidth: "none",

                        "&::-webkit-scrollbar": {
                            display: "none",
                        },
                    }}
                >

                    <Table
                        stickyHeader

                        sx={{
                            minWidth: 950,

                            "& .MuiTableCell-root": {
                                borderColor:
                                    "divider",
                            },
                        }}
                    >

                        {/* ==================================================
                            TABLE HEAD
                        ================================================== */}

                        <TableHead>

                            <TableRow>

                                {[
                                    ["Employee ID", 130],
                                    ["Name", 190],
                                    ["Email", 280],
                                    ["Department", 160],
                                    ["Status", 130],
                                    ["Actions", 170],
                                ].map(([label, minWidth]) => (

                                    <TableCell
                                        key={label}

                                        sx={{
                                            minWidth,

                                            position: "sticky",

                                            top: 0,

                                            zIndex: 5,

                                            background:
                                                "background.paper",

                                            color:
                                                "text.secondary",

                                            fontWeight: 750,

                                            fontSize: "0.7rem",

                                            textTransform:
                                                "uppercase",

                                            letterSpacing:
                                                "0.05em",

                                            borderBottom:
                                                "1px solid",

                                            borderColor:
                                                "divider",

                                            py: 1.4,
                                        }}
                                    >
                                        {label}
                                    </TableCell>

                                ))}

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
                                        }}
                                    >

                                        <Box
                                            sx={{
                                                width: 52,
                                                height: 52,

                                                mx: "auto",
                                                mb: 1.5,

                                                borderRadius: "14px",

                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",

                                                background:
                                                    "rgba(37, 99, 235, 0.10)",

                                                color:
                                                    "primary.main",
                                            }}
                                        >

                                            <PeopleIcon />

                                        </Box>


                                        <Typography
                                            sx={{
                                                fontWeight: 650,

                                                color:
                                                    "text.primary",
                                            }}
                                        >
                                            No employees found
                                        </Typography>


                                        <Typography
                                            sx={{
                                                fontSize: "0.8rem",

                                                color:
                                                    "text.secondary",

                                                mt: 0.5,
                                            }}
                                        >
                                            Add an employee or upload an Excel file.
                                        </Typography>

                                    </TableCell>

                                </TableRow>

                            ) : (

                                employees.map((employee) => {

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
                                            key={employee.id}

                                            sx={{
                                                transition:
                                                    "background-color 0.18s ease",

                                                "&:hover": {

                                                    "& td": {
                                                        backgroundColor:
                                                            "action.hover",
                                                    },
                                                },

                                                "&:last-child td": {
                                                    borderBottom:
                                                        "none",
                                                },
                                            }}
                                        >

                                            {/* EMPLOYEE ID */}

                                            <TableCell
                                                sx={{
                                                    fontWeight: 700,

                                                    color:
                                                        "primary.main",

                                                    fontSize:
                                                        "0.82rem",

                                                    py: 1.35,
                                                }}
                                            >
                                                {employee.employee_id}
                                            </TableCell>


                                            {/* NAME */}

                                            <TableCell>

                                                <Box
                                                    sx={{
                                                        display: "flex",

                                                        alignItems:
                                                            "center",

                                                        gap: 1.2,
                                                    }}
                                                >

                                                    <Avatar
                                                        sx={{
                                                            width: 32,
                                                            height: 32,

                                                            fontSize:
                                                                "0.75rem",

                                                            fontWeight: 700,

                                                            color:
                                                                "primary.main",

                                                            backgroundColor:
                                                                "rgba(37, 99, 235, 0.12)",

                                                            border:
                                                                "1px solid",

                                                            borderColor:
                                                                "rgba(37, 99, 235, 0.20)",
                                                        }}
                                                    >
                                                        {employee.name
                                                            ?.charAt(0)
                                                            ?.toUpperCase()}
                                                    </Avatar>


                                                    <Typography
                                                        sx={{
                                                            fontWeight: 600,

                                                            color:
                                                                "text.primary",

                                                            fontSize:
                                                                "0.84rem",
                                                        }}
                                                    >
                                                        {employee.name}
                                                    </Typography>

                                                </Box>

                                            </TableCell>


                                            {/* EMAIL */}

                                            <TableCell>

                                                <Typography
                                                    sx={{
                                                        color:
                                                            "text.secondary",

                                                        fontSize:
                                                            "0.81rem",

                                                        whiteSpace:
                                                            "nowrap",
                                                    }}
                                                >
                                                    {employee.email}
                                                </Typography>

                                            </TableCell>


                                            {/* DEPARTMENT */}

                                            <TableCell>

                                                <Chip
                                                    label={
                                                        employee.department ||
                                                        "—"
                                                    }

                                                    size="small"

                                                    sx={{
                                                        height: 27,

                                                        color:
                                                            departmentStyle.color,

                                                        backgroundColor:
                                                            departmentStyle.background,

                                                        border:
                                                            `1px solid ${departmentStyle.border}`,

                                                        fontWeight: 650,

                                                        fontSize:
                                                            "0.69rem",
                                                    }}
                                                />

                                            </TableCell>


                                            {/* STATUS */}

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
                                                        height: 27,

                                                        color:
                                                            statusStyle.color,

                                                        backgroundColor:
                                                            statusStyle.background,

                                                        border:
                                                            `1px solid ${statusStyle.border}`,

                                                        fontWeight: 650,

                                                        fontSize:
                                                            "0.69rem",

                                                        "& .MuiChip-icon": {
                                                            color:
                                                                statusStyle.color,

                                                            fontSize:
                                                                15,
                                                        },
                                                    }}
                                                />

                                            </TableCell>


                                            {/* ACTIONS */}

                                            <TableCell>

                                                <Box
                                                    sx={{
                                                        display:
                                                            "flex",

                                                        alignItems:
                                                            "center",

                                                        gap: 0.5,
                                                    }}
                                                >

                                                    <Tooltip title="Edit employee">

                                                        <IconButton
                                                            size="small"

                                                            onClick={() =>
                                                                handleEdit(
                                                                    employee
                                                                )
                                                            }

                                                            sx={{
                                                                width: 32,
                                                                height: 32,

                                                                color:
                                                                    "primary.main",

                                                                backgroundColor:
                                                                    "rgba(37, 99, 235, 0.09)",

                                                                border:
                                                                    "1px solid",

                                                                borderColor:
                                                                    "rgba(37, 99, 235, 0.18)",

                                                                "&:hover": {
                                                                    backgroundColor:
                                                                        "rgba(37, 99, 235, 0.16)",

                                                                    transform:
                                                                        "translateY(-1px)",
                                                                },

                                                                transition:
                                                                    "all 0.18s ease",
                                                            }}
                                                        >
                                                            <EditIcon
                                                                sx={{
                                                                    fontSize:
                                                                        17,
                                                                }}
                                                            />
                                                        </IconButton>

                                                    </Tooltip>


                                                    <Tooltip title="Delete employee">

                                                        <IconButton
                                                            size="small"

                                                            onClick={() =>
                                                                handleDelete(
                                                                    employee
                                                                )
                                                            }

                                                            sx={{
                                                                width: 32,
                                                                height: 32,

                                                                color:
                                                                    "error.main",

                                                                backgroundColor:
                                                                    "rgba(239, 68, 68, 0.08)",

                                                                border:
                                                                    "1px solid",

                                                                borderColor:
                                                                    "rgba(239, 68, 68, 0.18)",

                                                                "&:hover": {
                                                                    backgroundColor:
                                                                        "rgba(239, 68, 68, 0.15)",

                                                                    transform:
                                                                        "translateY(-1px)",
                                                                },

                                                                transition:
                                                                    "all 0.18s ease",
                                                            }}
                                                        >
                                                            <DeleteIcon
                                                                sx={{
                                                                    fontSize:
                                                                        17,
                                                                }}
                                                            />
                                                        </IconButton>

                                                    </Tooltip>

                                                </Box>

                                            </TableCell>

                                        </TableRow>

                                    );

                                })

                            )}

                        </TableBody>

                    </Table>

                </TableContainer>

            </Paper>


            {/* ==================================================
                ADD / EDIT EMPLOYEE DIALOG
            ================================================== */}

            <EmployeeDialog
                open={open}
                handleClose={handleClose}
                onEmployeeCreated={loadEmployees}
                editingEmployee={editingEmployee}
            />


            {/* ==================================================
                DELETE EMPLOYEE DIALOG
            ================================================== */}

            <DeleteEmployeeDialog
                open={Boolean(deletingEmployee)}
                employee={deletingEmployee}
                handleClose={handleDeleteClose}
                handleConfirm={handleDeleteConfirm}
            />

        </Box>

    );

}


export default Employees;