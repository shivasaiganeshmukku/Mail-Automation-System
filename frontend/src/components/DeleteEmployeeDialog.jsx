import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

function DeleteEmployeeDialog({
    open,
    employee,
    handleClose,
    handleConfirm
}) {

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
        >

            <DialogTitle>
                Delete Employee
            </DialogTitle>

            <DialogContent>

                <Typography>
                    Are you sure you want to delete this employee?
                </Typography>

                {employee && (
                    <Typography sx={{ mt: 2 }}>
                        <strong>
                            {employee.employee_id}
                        </strong>
                        {" - "}
                        {employee.name}
                    </Typography>
                )}

            </DialogContent>

            <DialogActions>

                <Button onClick={handleClose}>
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    color="error"
                    onClick={handleConfirm}
                >
                    Delete
                </Button>

            </DialogActions>

        </Dialog>
    );
}

export default DeleteEmployeeDialog;