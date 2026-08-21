import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

function DeleteTemplateDialog({
    open,
    template,
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
                Delete Email Template
            </DialogTitle>

            <DialogContent>

                <Typography>
                    Are you sure you want to delete this email template?
                </Typography>

                {template && (
                    <Typography sx={{ mt: 2 }}>
                        <strong>
                            {template.template_name}
                        </strong>
                        {" - "}
                        {template.subject}
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

export default DeleteTemplateDialog;