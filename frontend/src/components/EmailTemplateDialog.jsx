import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";

import { useEffect, useState } from "react";

import EmailTemplateService from "../services/emailTemplateService";

function EmailTemplateDialog({
    open,
    handleClose,
    onTemplateCreated,
    editingTemplate
}) {

    const [template, setTemplate] = useState({
        template_name: "",
        subject: "",
        body: ""
    });

    useEffect(() => {

        if (editingTemplate) {

            setTemplate({
                template_name: editingTemplate.template_name,
                subject: editingTemplate.subject,
                body: editingTemplate.body
            });

        } else {

            setTemplate({
                template_name: "",
                subject: "",
                body: ""
            });

        }

    }, [editingTemplate, open]);

    const handleChange = (event) => {

        const { name, value } = event.target;

        setTemplate({
            ...template,
            [name]: value
        });

    };

    const handleSave = () => {

        console.log("SAVE TEMPLATE CLICKED");
        console.log("Template data:", template);

        if (editingTemplate) {

            EmailTemplateService.updateTemplate(
                editingTemplate.id,
                template
            )
                .then((response) => {

                    console.log(
                        "TEMPLATE UPDATED:",
                        response.data
                    );

                    alert("Email template updated successfully!");

                    onTemplateCreated();

                    handleClose();

                })
                .catch((error) => {

                    console.error(
                        "UPDATE TEMPLATE ERROR:",
                        error
                    );

                    if (error.response) {

                        alert(
                            "Error updating template: " +
                            JSON.stringify(error.response.data)
                        );

                    } else {

                        alert(
                            "Error updating template. Check the backend."
                        );

                    }

                });

        } else {

            EmailTemplateService.createTemplate(template)
                .then((response) => {

                    console.log(
                        "TEMPLATE CREATED:",
                        response.data
                    );

                    alert("Email template created successfully!");

                    onTemplateCreated();

                    handleClose();

                })
                .catch((error) => {

                    console.error(
                        "CREATE TEMPLATE ERROR:",
                        error
                    );

                    if (error.response) {

                        alert(
                            "Error creating template: " +
                            JSON.stringify(error.response.data)
                        );

                    } else {

                        alert(
                            "Error creating template. Check the backend."
                        );

                    }

                });
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
        >

            <DialogTitle>
                Add Email Template
            </DialogTitle>

            <DialogContent>

                <Stack spacing={2} sx={{ mt: 1 }}>

                    <TextField
                        label="Template Name"
                        name="template_name"
                        value={template.template_name}
                        onChange={handleChange}
                        fullWidth
                    />

                    <TextField
                        label="Subject"
                        name="subject"
                        value={template.subject}
                        onChange={handleChange}
                        fullWidth
                    />

                    <TextField
                        label="Body"
                        name="body"
                        value={template.body}
                        onChange={handleChange}
                        multiline
                        rows={8}
                        fullWidth
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

export default EmailTemplateDialog;