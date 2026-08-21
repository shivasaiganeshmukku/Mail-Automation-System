import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";

import EmployeeService from "../services/employeeService";

import { useEffect, useState } from "react";

function EmployeeDialog({ open, handleClose, onEmployeeCreated, editingEmployee }) {

    const [employee, setEmployee] = useState({
        employee_id: "",
        name: "",
        email: "",
        dob: "",
        department: "",
        designation: "",
        status: true
    });

    useEffect(() => {
        if (editingEmployee) {
            setEmployee({
                employee_id: editingEmployee.employee_id || "",
                name: editingEmployee.name || "",
                email: editingEmployee.email || "",
                dob: editingEmployee.dob || "",
                department: editingEmployee.department || "",
                designation: editingEmployee.designation || "",
                status: editingEmployee.status ?? true
            });
        } else {
            setEmployee({
                employee_id: "",
                name: "",
                email: "",
                dob: "",
                department: "",
                designation: "",
                status: true
            });
        }
    }, [editingEmployee]);


    const handleChange = (event) => {

        const { name, value, checked, type } = event.target;

        setEmployee({
            ...employee,
            [name]: type === "checkbox" ? checked : value
        });

    };

    const handleSave = () => {

        console.log("SAVE BUTTON CLICKED");
        console.log("Employee data:", employee);

        if (editingEmployee) {

            EmployeeService.updateEmployee(
                editingEmployee.id,
                employee
            )
                .then((response) => {

                    console.log(
                        "EMPLOYEE UPDATED:",
                        response.data
                    );

                    alert("Employee updated successfully!");

                    onEmployeeCreated();

                    handleClose();
                })
                .catch((error) => {

                    console.error(
                        "UPDATE EMPLOYEE ERROR:",
                        error
                    );

                    if (error.response) {
                        alert(
                            "Error updating employee: " +
                            JSON.stringify(error.response.data)
                        );
                    } else {
                        alert(
                            "Error updating employee. Check the backend."
                        );
                    }

                });

        } else {

            EmployeeService.createEmployee(employee)
                .then((response) => {

                    console.log(
                        "EMPLOYEE CREATED:",
                        response.data
                    );

                    alert("Employee created successfully!");

                    onEmployeeCreated();

                    handleClose();
                })
                .catch((error) => {

                    console.error(
                        "CREATE EMPLOYEE ERROR:",
                        error
                    );

                    if (error.response) {
                        alert(
                            "Error creating employee: " +
                            JSON.stringify(error.response.data)
                        );
                    } else {
                        alert(
                            "Error creating employee. Check the backend."
                        );
                    }

                });
        }
    };



    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>
                Add Employee
            </DialogTitle>

            <DialogContent>

                <Stack spacing={2} sx={{ mt: 1 }}>

                    <TextField
                        label="Employee ID"
                        name="employee_id"
                        value={employee.employee_id}
                        onChange={handleChange}
                        fullWidth
                    />

                    <TextField
                        label="Name"
                        name="name"
                        value={employee.name}
                        onChange={handleChange}
                        fullWidth
                    />

                    <TextField
                        label="Email"
                        name="email"
                        value={employee.email}
                        onChange={handleChange}
                        fullWidth
                    />

                    <TextField
                        label="Date of Birth"
                        name="dob"
                        type="date"
                        value={employee.dob}
                        onChange={handleChange}
                        fullWidth
                        InputLabelProps={{
                            shrink: true
                        }}
                    />

                    <TextField
                        label="Department"
                        name="department"
                        value={employee.department}
                        onChange={handleChange}
                        fullWidth
                    />

                    <TextField
                        label="Designation"
                        name="designation"
                        value={employee.designation}
                        onChange={handleChange}
                        fullWidth
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                name="status"
                                checked={employee.status}
                                onChange={handleChange}
                            />
                        }
                        label="Active"
                    />

                </Stack>

            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose}>
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    onClick={handleSave}
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default EmployeeDialog;