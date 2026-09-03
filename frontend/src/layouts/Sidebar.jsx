import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";

import { NavLink } from "react-router-dom";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import EmailIcon from "@mui/icons-material/Email";
import SendIcon from "@mui/icons-material/Send";
import HistoryIcon from "@mui/icons-material/History";
import SettingsIcon from "@mui/icons-material/Settings";
import CloseIcon from "@mui/icons-material/Close";


// ============================================================
// DRAWER WIDTH
// ============================================================

const drawerWidth = 270;


// ============================================================
// MENU ITEMS
// ============================================================

const menuItems = [

    {
        label: "Dashboard",
        path: "/",
        icon: <DashboardIcon />,
        color: "#2563EB",
        background: "#EFF6FF",
    },

    {
        label: "Employees",
        path: "/employees",
        icon: <PeopleIcon />,
        color: "#7C3AED",
        background: "#F5F3FF",
    },

    {
        label: "Email Templates",
        path: "/email-templates",
        icon: <EmailIcon />,
        color: "#0891B2",
        background: "#ECFEFF",
    },

    {
        label: "Send Email",
        path: "/send-email",
        icon: <SendIcon />,
        color: "#059669",
        background: "#ECFDF5",
    },

    {
        label: "Email Logs",
        path: "/email-logs",
        icon: <HistoryIcon />,
        color: "#EA580C",
        background: "#FFF7ED",
    },

    {
        label: "Settings",
        path: "/settings",
        icon: <SettingsIcon />,
        color: "#DB2777",
        background: "#FDF2F8",
    },

];


// ============================================================
// SIDEBAR
// ============================================================

function Sidebar({ mobileOpen, onClose, isMobile }) {


    // ========================================================
    // DRAWER CONTENT
    // ========================================================

    const drawerContent = (

        <Box
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",

                // Glass background
                background:
                    "rgba(151, 179, 234, 0.88)",

                backdropFilter: "blur(18px)",
                WebkitBackdropFilter: "blur(18px)",

                color: "#395178",
            }}
        >


            {/* =================================================
                HEADER
            ================================================= */}

            <Box
                sx={{
                    minHeight: 72,

                    px: 2.5,

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",

                    borderBottom:
                        "1px solid rgba(226, 232, 240, 0.8)",
                }}
            >

                {/* BRAND */}

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                    }}
                >

                    {/* LOGO */}

                    <Box
                        sx={{
                            width: 42,
                            height: 42,

                            borderRadius: "12px",

                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",

                            background:
                                "linear-gradient(135deg, #2563EB, #7C3AED)",

                            color: "#ffffff",

                            fontSize: "19px",
                            fontWeight: 800,

                            boxShadow:
                                "0 6px 16px rgba(37, 99, 235, 0.25)",
                        }}
                    >
                        M
                    </Box>


                    {/* TITLE */}

                    <Box>

                        <Typography
                            sx={{
                                fontSize: "15px",
                                fontWeight: 700,
                                color: "#172033",
                                lineHeight: 1.2,
                            }}
                        >
                            Mail Automation
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: "11px",
                                color: "#8992A3",
                                mt: 0.3,
                            }}
                        >
                            Admin Panel
                        </Typography>

                    </Box>

                </Box>


                {/* MOBILE CLOSE */}

                {isMobile && (

                    <IconButton
                        onClick={onClose}
                        sx={{
                            color: "#64748B",

                            "&:hover": {
                                backgroundColor:
                                    "rgba(100, 116, 139, 0.10)",
                            },
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                )}

            </Box>


            {/* =================================================
                MENU TITLE
            ================================================= */}

            <Box
                sx={{
                    px: 2.5,
                    pt: 3,
                    pb: 1.5,
                }}
            >

                <Typography
                    sx={{
                        fontSize: "10px",
                        fontWeight: 800,

                        color: "#94A3B8",

                        textTransform: "uppercase",

                        letterSpacing: "0.12em",
                    }}
                >
                    Main Menu
                </Typography>

            </Box>


            {/* =================================================
                NAVIGATION
            ================================================= */}

            <List
                sx={{
                    px: 1.5,
                    py: 0,
                }}
            >

                {menuItems.map((item) => (

                    <ListItem
                        key={item.path}
                        disablePadding
                        sx={{
                            mb: 0.8,
                        }}
                    >

                        <ListItemButton
                            component={NavLink}
                            to={item.path}

                            onClick={
                                isMobile
                                    ? onClose
                                    : undefined
                            }

                            end={item.path === "/"}

                            sx={{
                                minHeight: 50,

                                px: 1.5,

                                borderRadius: "12px",

                                position: "relative",

                                color: "#64748B",

                                transition:
                                    "all 0.25s ease",

                                "& .MuiListItemIcon-root": {
                                    minWidth: 42,

                                    color: item.color,

                                    transition:
                                        "all 0.25s ease",
                                },

                                "& .MuiListItemText-primary": {
                                    fontSize: "14px",
                                    fontWeight: 550,

                                    transition:
                                        "all 0.25s ease",
                                },


                                // =================================
                                // HOVER
                                // =================================

                                "&:hover": {
                                    backgroundColor:
                                        item.background,

                                    color: item.color,

                                    transform:
                                        "translateX(4px)",

                                    boxShadow:
                                        `0 5px 14px ${item.color}12`,

                                    "& .MuiListItemIcon-root": {
                                        color: item.color,

                                        transform:
                                            "scale(1.08)",
                                    },

                                    "& .MuiListItemText-primary": {
                                        color: item.color,
                                        fontWeight: 650,
                                    },
                                },


                                // =================================
                                // ACTIVE
                                // =================================

                                "&.active": {
                                    background:
                                        `linear-gradient(
                                            135deg,
                                            ${item.background},
                                            rgba(244, 238, 238, 0.95)
                                        )`,

                                    color: item.color,

                                    boxShadow:
                                        `0 6px 18px ${item.color}18`,

                                    "& .MuiListItemIcon-root": {
                                        color: item.color,
                                    },

                                    "& .MuiListItemText-primary": {
                                        color: item.color,
                                        fontWeight: 700,
                                    },

                                    "&::before": {
                                        content: '""',

                                        position: "absolute",

                                        left: 0,

                                        top: "9px",

                                        bottom: "9px",

                                        width: "4px",

                                        borderRadius:
                                            "0 6px 6px 0",

                                        backgroundColor:
                                            item.color,
                                    },
                                },

                            }}
                        >

                            <ListItemIcon>
                                {item.icon}
                            </ListItemIcon>

                            <ListItemText
                                primary={item.label}
                            />

                        </ListItemButton>

                    </ListItem>

                ))}

            </List>


            {/* =================================================
                SPACER
            ================================================= */}

            <Box
                sx={{
                    flexGrow: 1,
                }}
            />


            {/* =================================================
                BOTTOM SECTION
            ================================================= */}

            <Box>

                <Divider
                    sx={{
                        borderColor:
                            "rgba(229, 237, 246, 0.8)",
                    }}
                />

                <Box
                    sx={{
                        px: 2.5,
                        py: 2.5,
                    }}
                >

                    <Typography
                        sx={{
                            fontSize: "11px",
                            color: "#94A3B8",
                            textAlign: "center",
                            fontWeight: 600,
                        }}
                    >
                        Mail Automation System
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: "10px",
                            color: "#CBD5E1",
                            textAlign: "center",
                            mt: 0.5,
                        }}
                    >
                        v1.0.0
                    </Typography>

                </Box>

            </Box>

        </Box>

    );


    // ============================================================
    // DRAWER
    // ============================================================

    return (

        <Drawer
            variant="temporary"

            open={mobileOpen}

            onClose={onClose}

            ModalProps={{
                keepMounted: true,
            }}

            sx={{

                // ================================================
                // BACKDROP
                // ================================================

                "& .MuiBackdrop-root": {
                    backgroundColor:
                        "rgba(15, 23, 42, 0.38)",

                    backdropFilter:
                        "blur(3px)",
                },


                // ================================================
                // DRAWER PAPER
                // ================================================

                "& .MuiDrawer-paper": {

                    width: drawerWidth,

                    boxSizing: "border-box",

                    border: "none",

                    background:
                        "rgba(175, 197, 238, 0.88)",

                    backdropFilter:
                        "blur(18px)",

                    WebkitBackdropFilter:
                        "blur(18px)",

                    boxShadow:
                        "8px 0 35px rgba(15, 23, 42, 0.12)",

                    overflowX: "hidden",
                },

            }}
        >

            {drawerContent}

        </Drawer>

    );

}


export default Sidebar;