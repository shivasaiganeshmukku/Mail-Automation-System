import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import EmailIcon from "@mui/icons-material/Email";
import SendIcon from "@mui/icons-material/Send";
import HistoryIcon from "@mui/icons-material/History";
import CloseIcon from "@mui/icons-material/Close";

import { Link, useLocation } from "react-router-dom";


const drawerWidth = 270;


function Sidebar({
    mobileOpen,
    onClose
}) {

    const location = useLocation();


    /*
    =========================================================
    NAVIGATION ITEMS
    =========================================================
    */

    const menuItems = [
        {
            label: "Dashboard",
            path: "/",
            icon: <DashboardIcon />
        },
        {
            label: "Employees",
            path: "/employees",
            icon: <PeopleIcon />
        },
        {
            label: "Email Templates",
            path: "/email-templates",
            icon: <EmailIcon />
        },
        {
            label: "Send Email",
            path: "/send-email",
            icon: <SendIcon />
        },
        {
            label: "Email Logs",
            path: "/email-logs",
            icon: <HistoryIcon />
        }
    ];


    /*
    =========================================================
    SIDEBAR CONTENT
    =========================================================
    */

    const drawerContent = (

        <Box
            sx={{
                height: "100%",

                display: "flex",

                flexDirection: "column",

                position: "relative",

                overflow: "hidden",

                /*
                =============================================
                GLASS BACKGROUND
                =============================================
                */

                backgroundColor:
                    "background.paper",

                backdropFilter:
                    "blur(18px)",

                WebkitBackdropFilter:
                    "blur(18px)",

                color:
                    "text.primary",

                transition:
                    "background-color 0.35s ease, color 0.35s ease",

                /*
                =============================================
                SUBTLE ACCENT GLOW
                =============================================
                */

                "&::before": {

                    content: '""',

                    position: "absolute",

                    top: 0,

                    left: 0,

                    width: "100%",

                    height: 180,

                    background:
                        "radial-gradient(circle at 20% 10%, rgba(37, 99, 235, 0.12), transparent 65%)",

                    pointerEvents: "none"
                }
            }}
        >

            {/* =================================================
                SIDEBAR HEADER
            ================================================= */}

            <Box
                sx={{
                    minHeight: 64,

                    display: "flex",

                    alignItems: "center",

                    justifyContent:
                        "space-between",

                    px: 2.25,

                    position: "relative",

                    zIndex: 1
                }}
            >

                <Box
                    sx={{
                        minWidth: 0
                    }}
                >

                    <Typography
                        noWrap
                        sx={{
                            fontWeight: 700,

                            fontSize:
                                "1.02rem",

                            color:
                                "text.primary",

                            letterSpacing:
                                "-0.2px"
                        }}
                    >
                        Mail Automation
                    </Typography>


                    <Typography
                        variant="caption"
                        noWrap
                        sx={{
                            color:
                                "text.secondary",

                            fontSize:
                                "0.76rem"
                        }}
                    >
                        Management System
                    </Typography>

                </Box>


                {/* =================================================
                    MOBILE CLOSE BUTTON
                ================================================= */}

                <IconButton
                    onClick={onClose}
                    aria-label="Close navigation menu"
                    sx={{
                        display: {
                            xs: "flex",
                            md: "none"
                        },

                        width: 38,

                        height: 38,

                        color:
                            "text.secondary",

                        backgroundColor:
                            "rgba(37, 99, 235, 0.06)",

                        border:
                            "1px solid rgba(37, 99, 235, 0.10)",

                        transition:
                            "all 0.2s ease",

                        "&:hover": {

                            color:
                                "primary.main",

                            backgroundColor:
                                "rgba(37, 99, 235, 0.12)",

                            transform:
                                "scale(1.04)"
                        }
                    }}
                >

                    <CloseIcon />

                </IconButton>

            </Box>


            {/* =================================================
                HEADER DIVIDER
            ================================================= */}

            <Divider
                sx={{
                    borderColor:
                        "divider"
                }}
            />


            {/* =================================================
                NAVIGATION
            ================================================= */}

            <List
                sx={{
                    px: 1.5,

                    py: 2,

                    position: "relative",

                    zIndex: 1
                }}
            >

                {menuItems.map((item) => {

                    const isActive =
                        location.pathname ===
                        item.path;


                    return (

                        <ListItem
                            key={item.path}
                            disablePadding
                            sx={{
                                mb: 0.65
                            }}
                        >

                            <ListItemButton
                                component={Link}
                                to={item.path}

                                onClick={() => {

                                    if (onClose) {
                                        onClose();
                                    }

                                }}

                                sx={{
                                    minHeight: 44,

                                    borderRadius: 2.2,

                                    px: 1.35,

                                    position: "relative",

                                    overflow: "hidden",

                                    color:
                                        isActive
                                            ? "primary.main"
                                            : "text.secondary",

                                    backgroundColor:
                                        isActive
                                            ? "rgba(37, 99, 235, 0.12)"
                                            : "transparent",

                                    border:
                                        isActive
                                            ? "1px solid rgba(37, 99, 235, 0.16)"
                                            : "1px solid transparent",

                                    transition:
                                        "all 0.2s ease",

                                    /*
                                    =================================
                                    ACTIVE LEFT INDICATOR
                                    =================================
                                    */

                                    "&::before": {

                                        content: '""',

                                        position: "absolute",

                                        left: 0,

                                        top: "22%",

                                        width: isActive
                                            ? 3
                                            : 0,

                                        height: "56%",

                                        borderRadius:
                                            "0 4px 4px 0",

                                        backgroundColor:
                                            "primary.main",

                                        transition:
                                            "width 0.2s ease"
                                    },


                                    /*
                                    =================================
                                    HOVER
                                    =================================
                                    */

                                    "&:hover": {

                                        color:
                                            "primary.main",

                                        backgroundColor:
                                            isActive
                                                ? "rgba(37, 99, 235, 0.16)"
                                                : "rgba(37, 99, 235, 0.07)",

                                        border:
                                            isActive
                                                ? "1px solid rgba(37, 99, 235, 0.20)"
                                                : "1px solid rgba(37, 99, 235, 0.08)",

                                        transform:
                                            "translateX(2px)"
                                    }
                                }}
                            >

                                {/* =================================
                                    ICON
                                ================================= */}

                                <ListItemIcon
                                    sx={{
                                        minWidth: 38,

                                        color:
                                            "inherit",

                                        display: "flex",

                                        alignItems: "center",

                                        transition:
                                            "color 0.2s ease"
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>


                                {/* =================================
                                    TEXT
                                ================================= */}

                                <ListItemText
                                    primary={
                                        item.label
                                    }

                                    primaryTypographyProps={{
                                        fontSize:
                                            "0.90rem",

                                        fontWeight:
                                            isActive
                                                ? 600
                                                : 500
                                    }}
                                />

                            </ListItemButton>

                        </ListItem>

                    );

                })}

            </List>


            {/* =================================================
                FLEXIBLE SPACE
            ================================================= */}

            <Box
                sx={{
                    flexGrow: 1
                }}
            />


            {/* =================================================
                SIDEBAR FOOTER
            ================================================= */}

            <Box
                sx={{
                    px: 2,

                    py: 1.75,

                    position: "relative",

                    zIndex: 1,

                    borderTop:
                        "1px solid",

                    borderColor:
                        "divider"
                }}
            >

                <Typography
                    variant="caption"
                    sx={{
                        color:
                            "text.secondary",

                        fontSize:
                            "0.72rem"
                    }}
                >
                    Mail Automation System
                </Typography>

            </Box>

        </Box>
    );


    return (

        <>
            {/* =================================================
                DESKTOP SIDEBAR
            ================================================= */}

            <Drawer
                variant="permanent"

                sx={{
                    display: {
                        xs: "none",
                        md: "block"
                    },

                    width:
                        drawerWidth,

                    flexShrink: 0,

                    "& .MuiDrawer-paper": {

                        width:
                            drawerWidth,

                        boxSizing:
                            "border-box",

                        top: 64,

                        height:
                            "calc(100vh - 64px)",

                        backgroundColor:
                            "background.paper",

                        backdropFilter:
                            "blur(18px)",

                        WebkitBackdropFilter:
                            "blur(18px)",

                        borderRight:
                            "1px solid",

                        borderColor:
                            "divider",

                        boxShadow:
                            "none",

                        overflowX:
                            "hidden"
                    }
                }}
            >

                {drawerContent}

            </Drawer>


            {/* =================================================
                MOBILE SIDEBAR
            ================================================= */}

            <Drawer
                variant="temporary"

                anchor="left"

                open={
                    mobileOpen
                }

                onClose={
                    onClose
                }

                ModalProps={{
                    keepMounted: true
                }}

                transitionDuration={{
                    enter: 260,

                    exit: 200
                }}

                sx={{
                    display: {
                        xs: "block",
                        md: "none"
                    },

                    "& .MuiDrawer-paper": {

                        width: {
                            xs: "82%",
                            sm: drawerWidth
                        },

                        maxWidth:
                            drawerWidth,

                        boxSizing:
                            "border-box",

                        backgroundColor:
                            "background.paper",

                        backdropFilter:
                            "blur(18px)",

                        WebkitBackdropFilter:
                            "blur(18px)",

                        borderRight:
                            "1px solid",

                        borderColor:
                            "divider",

                        boxShadow:
                            "8px 0 35px rgba(0, 0, 0, 0.18)"
                    }
                }}
            >

                {drawerContent}

            </Drawer>

        </>
    );
}


export default Sidebar;