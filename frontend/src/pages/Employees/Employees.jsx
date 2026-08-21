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

import AddIcon from "@mui/icons-material/Add";
import UploadFileIcon from "@mui/icons-material/UploadFile";

import EmployeeService from "../../services/employeeService";
import EmployeeDialog from "../../components/EmployeeDialog";
import DeleteEmployeeDialog from "../../components/DeleteEmployeeDialog";


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


        // No file selected

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


                // Refresh employee table

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


                    // Show missing columns

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


                    // Show validation errors

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

                // Reset file input so the same
                // file can be selected again

                event.target.value = "";

            });

    };


    // ============================================================
    // UI
    // ============================================================

    return (

        <>

            {/* ================================================== */}
            {/* PAGE HEADER */}
            {/* ================================================== */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3
                }}
            >

                <Typography variant="h4">
                    Employee Management
                </Typography>


                <Box
                    sx={{
                        display: "flex",
                        gap: 2
                    }}
                >

                    {/* ========================================== */}
                    {/* UPLOAD EXCEL */}
                    {/* ========================================== */}

                    <Button
                        variant="outlined"
                        component="label"
                        startIcon={
                            <UploadFileIcon />
                        }
                        disabled={uploading}
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


                    {/* ========================================== */}
                    {/* ADD EMPLOYEE */}
                    {/* ========================================== */}

                    <Button
                        variant="contained"
                        startIcon={
                            <AddIcon />
                        }
                        onClick={
                            handleOpen
                        }
                    >
                        Add Employee
                    </Button>

                </Box>

            </Box>


            {/* ================================================== */}
            {/* EMPLOYEE TABLE */}
            {/* ================================================== */}

            <TableContainer
                component={Paper}
            >

                <Table>

                    <TableHead>

                        <TableRow>

                            <TableCell>
                                Employee ID
                            </TableCell>

                            <TableCell>
                                Name
                            </TableCell>

                            <TableCell>
                                Email
                            </TableCell>

                            <TableCell>
                                Department
                            </TableCell>

                            <TableCell>
                                Status
                            </TableCell>

                            <TableCell>
                                Actions
                            </TableCell>

                        </TableRow>

                    </TableHead>


                    <TableBody>

                        {employees.map(
                            (employee) => (

                                <TableRow
                                    key={
                                        employee.id
                                    }
                                >

                                    <TableCell>
                                        {
                                            employee.employee_id
                                        }
                                    </TableCell>


                                    <TableCell>
                                        {
                                            employee.name
                                        }
                                    </TableCell>


                                    <TableCell>
                                        {
                                            employee.email
                                        }
                                    </TableCell>


                                    <TableCell>
                                        {
                                            employee.department
                                        }
                                    </TableCell>


                                    <TableCell>

                                        {
                                            employee.status
                                                ? "Active"
                                                : "Inactive"
                                        }

                                    </TableCell>


                                    <TableCell>

                                        {/* EDIT */}

                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() =>
                                                handleEdit(
                                                    employee
                                                )
                                            }
                                        >
                                            Edit
                                        </Button>


                                        {/* DELETE */}

                                        <Button
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            sx={{
                                                ml: 1
                                            }}
                                            onClick={() =>
                                                handleDelete(
                                                    employee
                                                )
                                            }
                                        >
                                            Delete
                                        </Button>

                                    </TableCell>

                                </TableRow>

                            )
                        )}

                    </TableBody>

                </Table>

            </TableContainer>


            {/* ================================================== */}
            {/* ADD / EDIT EMPLOYEE DIALOG */}
            {/* ================================================== */}

            <EmployeeDialog

                open={open}

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


            {/* ================================================== */}
            {/* DELETE EMPLOYEE DIALOG */}
            {/* ================================================== */}

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

        </>

    );

}


export default Employees;