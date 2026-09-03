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


    // ============================================================
    // LOAD TEMPLATES
    // ============================================================

    const loadTemplates = () => {

        EmailTemplateService.getAllTemplates()

            .then((response) => {

                console.log(
                    "TEMPLATES FROM API:",
                    response.data.data
                );

                setTemplates(
                    response.data.data
                );

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


    // ============================================================
    // OPEN ADD TEMPLATE
    // ============================================================

    const handleOpen = () => {

        setEditingTemplate(null);

        setOpen(true);

    };


    // ============================================================
    // EDIT TEMPLATE
    // ============================================================

    const handleEdit = (template) => {

        setEditingTemplate(template);

        setOpen(true);

    };


    // ============================================================
    // DELETE TEMPLATE
    // ============================================================

    const handleDelete = (template) => {

        setDeletingTemplate(template);

    };


    const handleDeleteClose = () => {

        setDeletingTemplate(null);

    };


    // ============================================================
    // CONFIRM DELETE
    // ============================================================

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

                alert(
                    "Email template deleted successfully!"
                );

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
                        JSON.stringify(
                            error.response.data
                        )
                    );

                } else {

                    alert(
                        "Error deleting template. Check the backend."
                    );

                }

            });

    };


    // ============================================================
    // CLOSE DIALOG
    // ============================================================

    const handleClose = () => {

        setOpen(false);

        setEditingTemplate(null);

    };


    // ============================================================
    // UI
    // ============================================================

    return (

        <Box
            sx={{
                width: "100%",
                minHeight: "calc(100vh - 120px)",

                // PAGE BACKGROUND
                backgroundColor: "#c4d7f8",

                borderRadius: "14px",

                p:1,

                pb: 4,
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

                {/* PAGE TITLE */}

                <Box>

                    <Typography
                        sx={{
                            fontSize: {
                                xs: "1.7rem",
                                sm: "2rem",
                            },

                            fontWeight: 750,

                            color: "#172554",

                            lineHeight: 1.2,
                        }}
                    >
                        Email Templates
                    </Typography>


                    <Typography
                        sx={{
                            mt: 0.6,

                            fontSize: "0.88rem",

                            color: "#475b78",
                        }}
                    >
                        Create and manage reusable email templates
                    </Typography>

                </Box>


                {/* ADD TEMPLATE BUTTON */}

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

                        px: 2.4,

                        borderRadius: "11px",

                        background:
                            "linear-gradient(135deg, #2563EB, #4F46E5)",

                        fontWeight: 650,

                        textTransform: "none",

                        boxShadow:
                            "0 6px 16px rgba(37, 99, 235, 0.22)",

                        transition:
                            "all 0.2s ease",

                        "&:hover": {

                            background:
                                "linear-gradient(135deg, #1D4ED8, #4338CA)",

                            transform:
                                "translateY(-2px)",

                            boxShadow:
                                "0 9px 20px rgba(37, 99, 235, 0.30)",
                        },
                    }}
                >
                    Add Template
                </Button>

            </Box>


            {/* ==================================================
                TEMPLATE TABLE CARD
            ================================================== */}

            <Paper
                elevation={0}

                sx={{
                    borderRadius: "18px",

                    border:
                        "1px solid #b0c8ea",

                    // IMPORTANT:
                    // NO PURE WHITE
                    background:
                        "linear-gradient(135deg, #E8F0FA 0%, #EDF2F7 100%)",

                    overflow: "hidden",

                    boxShadow:
                        "0 8px 25px rgba(30, 64, 175, 0.08)",
                }}
            >

                {/* ==================================================
                    TABLE TOP HEADER
                ================================================== */}

                <Box
                    sx={{
                        px: {
                            xs: 2,
                            sm: 2.5,
                        },

                        py: 2,

                        display: "flex",

                        justifyContent:
                            "space-between",

                        alignItems: "center",

                        background:
                            "linear-gradient(135deg, #DCE7FF 0%, #E7E1FF 100%)",

                        borderBottom:
                            "1px solid #C5D3EA",
                    }}
                >

                    <Box>

                        <Typography
                            sx={{
                                fontSize: "1rem",

                                fontWeight: 700,

                                color: "#172554",
                            }}
                        >
                            Email Templates
                        </Typography>


                        <Typography
                            sx={{
                                mt: 0.3,

                                fontSize: "0.75rem",

                                color: "#64748B",
                            }}
                        >
                            {templates.length} template
                            {templates.length !== 1
                                ? "s"
                                : ""}
                        </Typography>

                    </Box>


                    {/* RECORD COUNT */}

                    <Box
                        sx={{
                            px: 1.5,

                            py: 0.7,

                            borderRadius: "20px",

                            backgroundColor:
                                "#D8E5FF",

                            border:
                                "1px solid #B9CEFA",

                            color: "#2563EB",

                            fontSize: "0.75rem",

                            fontWeight: 700,
                        }}
                    >
                        {templates.length} Records
                    </Box>

                </Box>


                {/* ==================================================
                    SCROLLABLE TABLE
                ================================================== */}

                <TableContainer
                    sx={{
                        maxHeight: 560,

                        overflow: "auto",

                        "&::-webkit-scrollbar": {
                            width: 8,
                            height: 8,
                        },

                        "&::-webkit-scrollbar-track": {
                            background: "#DCE5F0",
                        },

                        "&::-webkit-scrollbar-thumb": {
                            background: "#9FB4D0",

                            borderRadius: 10,
                        },

                        "&::-webkit-scrollbar-thumb:hover": {
                            background: "#7F9BBC",
                        },

                        scrollbarWidth: "thin",

                        scrollbarColor:
                            "#9FB4D0 #DCE5F0",
                    }}
                >

                    <Table
                        stickyHeader

                        sx={{
                            minWidth: 1000,

                            backgroundColor:
                                "#EAF1F8",
                        }}
                    >

                        {/* ==================================================
                            TABLE HEAD
                        ================================================== */}

                        <TableHead>

                            <TableRow>

                                {/* ID */}

                                <TableCell
                                    sx={{
                                        minWidth: 70,

                                        position: "sticky",

                                        top: 0,

                                        zIndex: 5,

                                        background:
                                            "linear-gradient(135deg, #5B7CFA, #6366D9)",

                                        color: "#F8FAFC",

                                        fontWeight: 700,

                                        fontSize: "0.75rem",

                                        textTransform:
                                            "uppercase",

                                        letterSpacing:
                                            "0.04em",

                                        borderBottom:
                                            "1px solid #7D8EE8",
                                    }}
                                >
                                    ID
                                </TableCell>


                                {/* TEMPLATE NAME */}

                                <TableCell
                                    sx={{
                                        minWidth: 190,

                                        position: "sticky",

                                        top: 0,

                                        zIndex: 5,

                                        background:
                                            "linear-gradient(135deg, #5B7CFA, #6366D9)",

                                        color: "#F8FAFC",

                                        fontWeight: 700,

                                        fontSize: "0.75rem",

                                        textTransform:
                                            "uppercase",

                                        letterSpacing:
                                            "0.04em",

                                        borderBottom:
                                            "1px solid #7D8EE8",
                                    }}
                                >
                                    Template Name
                                </TableCell>


                                {/* SUBJECT */}

                                <TableCell
                                    sx={{
                                        minWidth: 260,

                                        position: "sticky",

                                        top: 0,

                                        zIndex: 5,

                                        background:
                                            "linear-gradient(135deg, #5B7CFA, #6366D9)",

                                        color: "#F8FAFC",

                                        fontWeight: 700,

                                        fontSize: "0.75rem",

                                        textTransform:
                                            "uppercase",

                                        letterSpacing:
                                            "0.04em",

                                        borderBottom:
                                            "1px solid #7D8EE8",
                                    }}
                                >
                                    Subject
                                </TableCell>


                                {/* BODY */}

                                <TableCell
                                    sx={{
                                        minWidth: 360,

                                        position: "sticky",

                                        top: 0,

                                        zIndex: 5,

                                        background:
                                            "linear-gradient(135deg, #5B7CFA, #6366D9)",

                                        color: "#F8FAFC",

                                        fontWeight: 700,

                                        fontSize: "0.75rem",

                                        textTransform:
                                            "uppercase",

                                        letterSpacing:
                                            "0.04em",

                                        borderBottom:
                                            "1px solid #7D8EE8",
                                    }}
                                >
                                    Body
                                </TableCell>


                                {/* ACTIONS */}

                                <TableCell
                                    sx={{
                                        minWidth: 210,

                                        position: "sticky",

                                        top: 0,

                                        zIndex: 5,

                                        background:
                                            "linear-gradient(135deg, #5B7CFA, #6366D9)",

                                        color: "#F8FAFC",

                                        fontWeight: 700,

                                        fontSize: "0.75rem",

                                        textTransform:
                                            "uppercase",

                                        letterSpacing:
                                            "0.04em",

                                        borderBottom:
                                            "1px solid #7D8EE8",
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

                            {templates.length === 0 ? (

                                <TableRow>

                                    <TableCell
                                        colSpan={5}

                                        sx={{
                                            py: 8,

                                            textAlign:
                                                "center",

                                            backgroundColor:
                                                "#EAF1F8",

                                            borderBottom:
                                                "none",
                                        }}
                                    >

                                        <Typography
                                            sx={{
                                                fontWeight: 600,

                                                color: "#475569",
                                            }}
                                        >
                                            No email templates found
                                        </Typography>


                                        <Typography
                                            sx={{
                                                mt: 0.5,

                                                fontSize: "0.8rem",

                                                color: "#64748B",
                                            }}
                                        >
                                            Create your first email template.
                                        </Typography>

                                    </TableCell>

                                </TableRow>

                            ) : (

                                templates.map(
                                    (template, index) => (

                                        <TableRow
                                            key={
                                                template.id
                                            }

                                            sx={{
                                                backgroundColor:
                                                    index % 2 === 0
                                                        ? "#EAF1F8"
                                                        : "#E2EBF5",

                                                transition:
                                                    "all 0.2s ease",

                                                "&:hover": {
                                                    backgroundColor:
                                                        "#D8E5F5",

                                                    "& td": {
                                                        borderColor:
                                                            "#B8C9DF",
                                                    },
                                                },

                                                "&:last-child td": {
                                                    borderBottom:
                                                        "none",
                                                },
                                            }}
                                        >

                                            {/* ==================================================
                                                ID
                                            ================================================== */}

                                            <TableCell
                                                sx={{
                                                    fontWeight: 700,

                                                    color:
                                                        "#2563EB",

                                                    fontSize:
                                                        "0.85rem",

                                                    borderBottom:
                                                        "1px solid #CFDCEB",
                                                }}
                                            >
                                                {template.id}
                                            </TableCell>


                                            {/* ==================================================
                                                TEMPLATE NAME
                                            ================================================== */}

                                            <TableCell
                                                sx={{
                                                    borderBottom:
                                                        "1px solid #CFDCEB",
                                                }}
                                            >

                                                <Typography
                                                    sx={{
                                                        fontWeight: 650,

                                                        color:
                                                            "#172554",

                                                        fontSize:
                                                            "0.875rem",
                                                    }}
                                                >
                                                    {
                                                        template.template_name
                                                    }
                                                </Typography>

                                            </TableCell>


                                            {/* ==================================================
                                                SUBJECT
                                            ================================================== */}

                                            <TableCell
                                                sx={{
                                                    borderBottom:
                                                        "1px solid #CFDCEB",
                                                }}
                                            >

                                                <Typography
                                                    sx={{
                                                        fontWeight: 500,

                                                        color:
                                                            "#1D4ED8",

                                                        fontSize:
                                                            "0.85rem",
                                                    }}
                                                >
                                                    {
                                                        template.subject
                                                    }
                                                </Typography>

                                            </TableCell>


                                            {/* ==================================================
                                                BODY
                                            ================================================== */}

                                            <TableCell
                                                sx={{
                                                    borderBottom:
                                                        "1px solid #CFDCEB",

                                                    maxWidth: 400,
                                                }}
                                            >

                                                <Typography
                                                    sx={{
                                                        color:
                                                            "#475569",

                                                        fontSize:
                                                            "0.85rem",

                                                        lineHeight:
                                                            1.5,

                                                        display:
                                                            "-webkit-box",

                                                        WebkitLineClamp:
                                                            3,

                                                        WebkitBoxOrient:
                                                            "vertical",

                                                        overflow:
                                                            "hidden",
                                                    }}
                                                >
                                                    {
                                                        template.body
                                                    }
                                                </Typography>

                                            </TableCell>


                                            {/* ==================================================
                                                ACTIONS
                                            ================================================== */}

                                            <TableCell
                                                sx={{
                                                    borderBottom:
                                                        "1px solid #CFDCEB",
                                                }}
                                            >

                                                <Box
                                                    sx={{
                                                        display:
                                                            "flex",

                                                        gap: 1,

                                                        flexWrap:
                                                            "wrap",
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
                                                                template
                                                            )
                                                        }

                                                        sx={{
                                                            borderRadius:
                                                                "8px",

                                                            borderColor:
                                                                "#93B4F4",

                                                            color:
                                                                "#2563EB",

                                                            backgroundColor:
                                                                "#E2ECFF",

                                                            fontWeight:
                                                                600,

                                                            textTransform:
                                                                "none",

                                                            transition:
                                                                "all 0.2s ease",

                                                            "&:hover": {
                                                                borderColor:
                                                                    "#60A5FA",

                                                                backgroundColor:
                                                                    "#D5E4FF",

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
                                                                template
                                                            )
                                                        }

                                                        sx={{
                                                            borderRadius:
                                                                "8px",

                                                            borderColor:
                                                                "#FCA5A5",

                                                            color:
                                                                "#DC2626",

                                                            backgroundColor:
                                                                "#FEECEC",

                                                            fontWeight:
                                                                600,

                                                            textTransform:
                                                                "none",

                                                            transition:
                                                                "all 0.2s ease",

                                                            "&:hover": {
                                                                borderColor:
                                                                    "#F87171",

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

                                    )

                                )

                            )}

                        </TableBody>

                    </Table>

                </TableContainer>

            </Paper>


            {/* ==================================================
                ADD / EDIT TEMPLATE DIALOG
            ================================================== */}

            <EmailTemplateDialog

                open={
                    open
                }

                handleClose={
                    handleClose
                }

                onTemplateCreated={
                    loadTemplates
                }

                editingTemplate={
                    editingTemplate
                }

            />


            {/* ==================================================
                DELETE TEMPLATE DIALOG
            ================================================== */}

            <DeleteTemplateDialog

                open={
                    Boolean(
                        deletingTemplate
                    )
                }

                template={
                    deletingTemplate
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


export default EmailTemplates;