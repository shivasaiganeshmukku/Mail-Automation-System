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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";


import EmailTemplateService from "../../services/emailTemplateService";
import EmailTemplateDialog from "../../components/EmailTemplateDialog";
import DeleteTemplateDialog from "../../components/DeleteTemplateDialog";



function EmailTemplates() {

    const [templates, setTemplates] = useState([]);
    const [open, setOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState(null);
    const [deletingTemplate, setDeletingTemplate] = useState(null);


    const loadTemplates = () => {

        EmailTemplateService.getAllTemplates()
            .then((response) => {

                console.log(
                    "TEMPLATES FROM API:",
                    response.data.data
                );

                setTemplates(response.data.data);

            })
            .catch((error) => {

                console.error(
                    "GET TEMPLATES ERROR:",
                    error
                );

            });
    };

    useEffect(() => {
        loadTemplates();
    }, []);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleEdit = (template) => {
        setEditingTemplate(template);
        setOpen(true);
    };

    const handleDelete = (template) => {
        setDeletingTemplate(template);
    };
    const handleDeleteClose = () => {
        setDeletingTemplate(null);
    };

    const handleDeleteConfirm = () => {

        if (!deletingTemplate) {
            return;
        }

        EmailTemplateService.deleteTemplate(
            deletingTemplate.id
        )
            .then((response) => {

                console.log(
                    "TEMPLATE DELETED:",
                    response.data
                );

                alert("Email template deleted successfully!");

                setDeletingTemplate(null);

                loadTemplates();
            })
            .catch((error) => {

                console.error(
                    "DELETE TEMPLATE ERROR:",
                    error
                );

                if (error.response) {

                    alert(
                        "Error deleting template: " +
                        JSON.stringify(error.response.data)
                    );

                } else {

                    alert(
                        "Error deleting template. Check the backend."
                    );

                }

            });
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3
                }}
            >
                <Typography variant="h4">
                    Email Templates
                </Typography>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpen}
                >
                    Add Template
                </Button>
            </Box>

            <TableContainer component={Paper}>

                <Table>

                    <TableHead>

                        <TableRow>

                            <TableCell>
                                ID
                            </TableCell>

                            <TableCell>
                                Template Name
                            </TableCell>

                            <TableCell>
                                Subject
                            </TableCell>

                            <TableCell>
                                Body
                            </TableCell>

                            <TableCell>
                                Actions
                            </TableCell>

                            


                        </TableRow>

                    </TableHead>

                    <TableBody>

                        {templates.map((template) => (

                            <TableRow key={template.id}>

                                <TableCell>
                                    {template.id}
                                </TableCell>

                                <TableCell>
                                    {template.template_name}
                                </TableCell>

                                <TableCell>
                                    {template.subject}
                                </TableCell>

                                <TableCell>
                                    {template.body}
                                </TableCell>

                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<EditIcon />}
                                        onClick={() => handleEdit(template)}
                                    >
                                        Edit
                                    </Button>

                                    <Button
                                        variant="outlined"
                                        color="error"
                                        size="small"
                                        startIcon={<DeleteIcon />}
                                        sx={{ ml: 1 }}
                                        onClick={() => handleDelete(template)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>

                            </TableRow>

                        ))}

                    </TableBody>

                </Table>

            </TableContainer>

            <EmailTemplateDialog
                open={open}
                handleClose={handleClose}
                onTemplateCreated={loadTemplates}
                editingTemplate={editingTemplate}
            />
            <DeleteTemplateDialog
                open={Boolean(deletingTemplate)}
                template={deletingTemplate}
                handleClose={handleDeleteClose}
                handleConfirm={handleDeleteConfirm}
            />

        </>

    );
}

export default EmailTemplates;