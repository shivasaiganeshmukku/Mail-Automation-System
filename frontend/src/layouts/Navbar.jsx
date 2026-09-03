import { useState } from "react";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";

import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import EmailIcon from "@mui/icons-material/Email";
import SendIcon from "@mui/icons-material/Send";
import HistoryIcon from "@mui/icons-material/History";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

import { Link, useLocation } from "react-router-dom";


const drawerWidth = 270;


function Navbar({
    darkMode,
    toggleDarkMode
}) {

    const [open, setOpen] = useState(false);

    const location = useLocation();


    const toggleDrawer = (state) => {
        setOpen(state);
    };


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


    return (
        <>
            {/* ================================================= */}
            {/* NAVBAR */}
            {/* ================================================= */}

            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    backgroundColor: "#498be9",
                    color: "#1E293B",

                    borderBottom:
                        "1px solid #abc1dd",

                    zIndex: (theme) =>
                        theme.zIndex.drawer + 1
                }}
            >

                <Toolbar
                    sx={{
                        minHeight: "64px !important",

                        px: {
                            xs: 1.5,
                            sm: 3
                        }
                    }}
                >

                    {/* MENU BUTTON */}

                    <IconButton
                        onClick={() =>
                            toggleDrawer(true)
                        }
                        edge="start"
                        sx={{
                            mr: 1,

                            color: "#334155",

                            transition:
                                "all 0.2s ease",

                            "&:hover": {
                                backgroundColor:
                                    "#F1F5F9",

                                transform:
                                    "scale(1.05)"
                            }
                        }}
                    >

                        <MenuIcon />

                    </IconButton>


                    {/* APPLICATION NAME */}

                    <Typography
                        sx={{
                            fontSize: {
                                xs: "1rem",
                                sm: "1.15rem"
                            },

                            fontWeight: 700,

                            color: "#1E293B",

                            letterSpacing:
                                "-0.2px"
                        }}
                    >
                        Mail Automation System
                    </Typography>


                    {/* RIGHT SIDE */}

                    <Box
                        sx={{
                            marginLeft: "auto",

                            display: "flex",

                            alignItems: "center"
                        }}
                    >
                        <IconButton
                            onClick={toggleDarkMode}
                            sx={{
                                mr: 1,

                                width: 42,
                                height: 42,

                                color: "text.primary",

                                backgroundColor:
                                    "rgba(255,255,255,0.18)",

                                border:
                                    "1px solid rgba(255,255,255,0.25)",

                                transition:
                                    "all 0.2s ease",

                                "&:hover": {
                                    backgroundColor:
                                        "rgba(255,255,255,0.30)",

                                    transform:
                                        "rotate(15deg)"
                                }
                            }}
                        >
                            {darkMode ? (
                                <LightModeIcon />
                            ) : (
                                <DarkModeIcon />
                            )}
                        </IconButton>

                        <Box
                            sx={{
                                width: 34,
                                height: 34,

                                borderRadius: "50%",

                                display: "flex",

                                alignItems: "center",

                                justifyContent:
                                    "center",

                                backgroundColor:
                                    "#b6cfef",

                                color: "#2563EB",

                                fontWeight: 700,

                                fontSize: "0.85rem"
                            }}
                        >
                            MS
                        </Box>

                    </Box>

                </Toolbar>

            </AppBar>


            {/* ================================================= */}
            {/* NAVIGATION DRAWER */}
            {/* ================================================= */}

            <Drawer
                anchor="left"
                open={open}
                onClose={() =>
                    toggleDrawer(false)
                }

                PaperProps={{
                    sx: {
                        width: {
                            xs: "82%",
                            sm: drawerWidth
                        },

                        maxWidth: drawerWidth,

                        backgroundColor:
                            "#f7e6e6",

                        borderRight:
                            "1px solid #c3d6ee",

                        boxShadow:
                            "8px 0 30px rgba(15,23,42,0.08)"
                    }
                }}

                transitionDuration={{
                    enter: 280,
                    exit: 220
                }}
            >

                {/* DRAWER HEADER */}

                <Box
                    sx={{
                        height: 64,

                        display: "flex",

                        alignItems: "center",

                        px: 2.5
                    }}
                >

                    <Box>

                        <Typography
                            sx={{
                                fontWeight: 700,

                                fontSize:
                                    "1.05rem",

                                color:
                                    "#1E293B"
                            }}
                        >
                            Mail Automation
                        </Typography>

                        <Typography
                            variant="caption"
                            sx={{
                                color:
                                    "#64748B"
                            }}
                        >
                            Management System
                        </Typography>

                    </Box>

                </Box>


                <Divider />


                {/* NAVIGATION ITEMS */}

                <List
                    sx={{
                        px: 1.5,
                        py: 2
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
                                    mb: 0.5
                                }}
                            >

                                <ListItemButton
                                    component={Link}
                                    to={item.path}

                                    onClick={() =>
                                        toggleDrawer(
                                            false
                                        )
                                    }

                                    sx={{
                                        minHeight: 46,

                                        borderRadius: 2,

                                        px: 1.5,

                                        color: isActive
                                            ? "#2563EB"
                                            : "#475569",

                                        backgroundColor:
                                            isActive
                                                ? "#afccf1"
                                                : "transparent",

                                        transition:
                                            "all 0.2s ease",

                                        "&:hover": {
                                            backgroundColor:
                                                isActive
                                                    ? "#DBEAFE"
                                                    : "#e5f2ff",

                                            color:
                                                "#2563EB",

                                            transform:
                                                "translateX(3px)"
                                        }
                                    }}
                                >

                                    <ListItemIcon
                                        sx={{
                                            minWidth: 38,

                                            color:
                                                "inherit",

                                            transition:
                                                "color 0.2s ease"
                                        }}
                                    >
                                        {item.icon}
                                    </ListItemIcon>


                                    <ListItemText
                                        primary={
                                            item.label
                                        }

                                        primaryTypographyProps={{
                                            fontSize:
                                                "0.92rem",

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

            </Drawer>

        </>
    );
}


export default Navbar;