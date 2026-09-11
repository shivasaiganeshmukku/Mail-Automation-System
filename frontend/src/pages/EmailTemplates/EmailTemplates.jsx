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
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DescriptionIcon from "@mui/icons-material/Description";

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
                        "Error deleting template. " +
                        "Check the backend."
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
                                    "linear-gradient(135deg, #7C3AED, #4F46E5)",

                                color: "#FFFFFF",

                                boxShadow:
                                    "0 8px 22px rgba(124, 58, 237, 0.24)",

                                flexShrink: 0,
                            }}
                        >

                            <DescriptionIcon />

                        </Box>


                        <Box>

                            <Typography
                                sx={{
                                    fontSize: {
                                        xs: "1.45rem",
                                        sm: "1.7rem",
                                    },

                                    fontWeight: 750,

                                    color:
                                        "text.primary",

                                    lineHeight: 1.2,
                                }}
                            >
                                Email Templates
                            </Typography>


                            <Typography
                                sx={{
                                    mt: 0.5,

                                    fontSize:
                                        "0.85rem",

                                    color:
                                        "text.secondary",
                                }}
                            >
                                Create and manage reusable email templates
                            </Typography>

                        </Box>

                    </Box>

                </Box>


                {/* ==================================================
                    ADD TEMPLATE
                ================================================== */}

                <Tooltip title="Add email template">

                    <IconButton
                        onClick={handleOpen}

                        sx={{
                            width: 42,
                            height: 42,

                            borderRadius: "11px",

                            color: "#FFFFFF",

                            background:
                                "linear-gradient(135deg, #7C3AED, #4F46E5)",

                            boxShadow:
                                "0 7px 18px rgba(124, 58, 237, 0.22)",

                            "&:hover": {

                                background:
                                    "linear-gradient(135deg, #6D28D9, #4338CA)",

                                transform:
                                    "translateY(-1px)",

                                boxShadow:
                                    "0 10px 22px rgba(124, 58, 237, 0.30)",
                            },

                            transition:
                                "all 0.2s ease",

                            flexShrink: 0,
                        }}
                    >

                        <AddIcon />

                    </IconButton>

                </Tooltip>

            </Box>


            {/* ==================================================
                TEMPLATE TABLE CARD
            ================================================== */}

            <Paper
                elevation={0}

                sx={{
                    borderRadius: "16px",

                    border: "1px solid",

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

                        justifyContent:
                            "space-between",

                        alignItems: "center",

                        borderBottom:
                            "1px solid",

                        borderColor:
                            "divider",

                        background:
                            "rgba(124, 58, 237, 0.055)",
                    }}
                >

                    <Box>

                        <Typography
                            sx={{
                                fontSize:
                                    "0.95rem",

                                fontWeight:
                                    700,

                                color:
                                    "text.primary",
                            }}
                        >
                            Email Templates
                        </Typography>


                        <Typography
                            sx={{
                                fontSize:
                                    "0.72rem",

                                color:
                                    "text.secondary",

                                mt: 0.25,
                            }}
                        >

                            {templates.length} template
                            {templates.length !== 1
                                ? "s"
                                : ""}

                        </Typography>

                    </Box>


                    {/* RECORD COUNT */}

                    <Chip
                        icon={
                            <DescriptionIcon />
                        }

                        label={
                            `${templates.length} Records`
                        }

                        size="small"

                        sx={{
                            height: 30,

                            color:
                                "#A78BFA",

                            backgroundColor:
                                "rgba(124, 58, 237, 0.10)",

                            border:
                                "1px solid",

                            borderColor:
                                "rgba(124, 58, 237, 0.22)",

                            fontWeight:
                                650,

                            "& .MuiChip-icon": {
                                color:
                                    "#A78BFA",

                                fontSize:
                                    17,
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
                                    ["ID", 70],
                                    ["Template Name", 190],
                                    ["Subject", 260],
                                    ["Body", 390],
                                    ["Actions", 120],
                                ].map(([label, minWidth]) => (

                                    <TableCell
                                        key={label}

                                        sx={{
                                            minWidth,

                                            position:
                                                "sticky",

                                            top: 0,

                                            zIndex: 5,

                                            background:
                                                "background.paper",

                                            color:
                                                "text.secondary",

                                            fontWeight:
                                                750,

                                            fontSize:
                                                "0.7rem",

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

                            {templates.length === 0 ? (

                                <TableRow>

                                    <TableCell
                                        colSpan={5}

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

                                                borderRadius:
                                                    "14px",

                                                display:
                                                    "flex",

                                                alignItems:
                                                    "center",

                                                justifyContent:
                                                    "center",

                                                background:
                                                    "rgba(124, 58, 237, 0.10)",

                                                color:
                                                    "#A78BFA",
                                            }}
                                        >

                                            <DescriptionIcon />

                                        </Box>


                                        <Typography
                                            sx={{
                                                fontWeight:
                                                    650,

                                                color:
                                                    "text.primary",
                                            }}
                                        >
                                            No email templates found
                                        </Typography>


                                        <Typography
                                            sx={{
                                                fontSize:
                                                    "0.8rem",

                                                color:
                                                    "text.secondary",

                                                mt: 0.5,
                                            }}
                                        >
                                            Create your first email template.
                                        </Typography>

                                    </TableCell>

                                </TableRow>

                            ) : (

                                templates.map((template) => (

                                    <TableRow
                                        key={
                                            template.id
                                        }

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

                                        {/* ==================================================
                                            ID
                                        ================================================== */}

                                        <TableCell
                                            sx={{
                                                fontWeight:
                                                    700,

                                                color:
                                                    "#A78BFA",

                                                fontSize:
                                                    "0.82rem",

                                                py: 1.35,
                                            }}
                                        >
                                            {template.id}
                                        </TableCell>


                                        {/* ==================================================
                                            TEMPLATE NAME
                                        ================================================== */}

                                        <TableCell>

                                            <Box
                                                sx={{
                                                    display:
                                                        "flex",

                                                    alignItems:
                                                        "center",

                                                    gap: 1.1,
                                                }}
                                            >

                                                <Box
                                                    sx={{
                                                        width: 32,
                                                        height: 32,

                                                        borderRadius:
                                                            "9px",

                                                        display:
                                                            "flex",

                                                        alignItems:
                                                            "center",

                                                        justifyContent:
                                                            "center",

                                                        background:
                                                            "rgba(124, 58, 237, 0.10)",

                                                        color:
                                                            "#A78BFA",

                                                        border:
                                                            "1px solid",

                                                        borderColor:
                                                            "rgba(124, 58, 237, 0.18)",

                                                        flexShrink: 0,
                                                    }}
                                                >

                                                    <DescriptionIcon
                                                        sx={{
                                                            fontSize:
                                                                17,
                                                        }}
                                                    />

                                                </Box>


                                                <Typography
                                                    sx={{
                                                        fontWeight:
                                                            650,

                                                        color:
                                                            "text.primary",

                                                        fontSize:
                                                            "0.84rem",
                                                    }}
                                                >
                                                    {
                                                        template.template_name
                                                    }
                                                </Typography>

                                            </Box>

                                        </TableCell>


                                        {/* ==================================================
                                            SUBJECT
                                        ================================================== */}

                                        <TableCell>

                                            <Typography
                                                sx={{
                                                    color:
                                                        "primary.main",

                                                    fontWeight:
                                                        550,

                                                    fontSize:
                                                        "0.82rem",

                                                    whiteSpace:
                                                        "nowrap",

                                                    overflow:
                                                        "hidden",

                                                    textOverflow:
                                                        "ellipsis",

                                                    maxWidth:
                                                        280,
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
                                                maxWidth:
                                                    390,
                                            }}
                                        >

                                            <Typography
                                                sx={{
                                                    color:
                                                        "text.secondary",

                                                    fontSize:
                                                        "0.8rem",

                                                    lineHeight:
                                                        1.5,

                                                    display:
                                                        "-webkit-box",

                                                    WebkitLineClamp:
                                                        2,

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

                                        <TableCell>

                                            <Box
                                                sx={{
                                                    display:
                                                        "flex",

                                                    alignItems:
                                                        "center",

                                                    gap:
                                                        0.6,
                                                }}
                                            >

                                                {/* EDIT */}

                                                <Tooltip
                                                    title="Edit template"
                                                >

                                                    <IconButton
                                                        size="small"

                                                        onClick={() =>
                                                            handleEdit(
                                                                template
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


                                                {/* DELETE */}

                                                <Tooltip
                                                    title="Delete template"
                                                >

                                                    <IconButton
                                                        size="small"

                                                        onClick={() =>
                                                            handleDelete(
                                                                template
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

                                ))

                            )}

                        </TableBody>

                    </Table>

                </TableContainer>

            </Paper>


            {/* ==================================================
                ADD / EDIT TEMPLATE DIALOG
            ================================================== */}

            <EmailTemplateDialog
                open={open}
                handleClose={handleClose}
                onTemplateCreated={loadTemplates}
                editingTemplate={editingTemplate}
            />


            {/* ==================================================
                DELETE TEMPLATE DIALOG
            ================================================== */}

            <DeleteTemplateDialog
                open={Boolean(deletingTemplate)}
                template={deletingTemplate}
                handleClose={handleDeleteClose}
                handleConfirm={handleDeleteConfirm}
            />

        </Box>

    );

}


export default EmailTemplates;