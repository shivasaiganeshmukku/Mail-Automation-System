import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import MenuIcon from "@mui/icons-material/Menu";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";


function Navbar({
    darkMode,
    toggleDarkMode,
    onMenuClick
}) {

    return (

        <AppBar
            position="fixed"
            elevation={0}
            sx={{
                /*
                =====================================================
                NAVBAR POSITION
                =====================================================
                */

                top: 0,

                left: 0,

                right: 0,

                width: "100%",

                height: 64,

                /*
                =====================================================
                GLASS BACKGROUND
                =====================================================
                */

                backgroundColor:
                    darkMode
                        ? "rgba(5, 10, 20, 0.78)"
                        : "rgba(255, 255, 255, 0.72)",

                backdropFilter:
                    "blur(18px)",

                WebkitBackdropFilter:
                    "blur(18px)",

                /*
                =====================================================
                BORDER
                =====================================================
                */

                borderBottom:
                    darkMode
                        ? "1px solid rgba(96, 165, 250, 0.16)"
                        : "1px solid rgba(37, 99, 235, 0.12)",

                /*
                =====================================================
                SHADOW
                =====================================================
                */

                boxShadow:
                    darkMode
                        ? "0 8px 30px rgba(0, 0, 0, 0.28)"
                        : "0 8px 30px rgba(37, 99, 235, 0.08)",

                /*
                =====================================================
                THEME TRANSITION
                =====================================================
                */

                transition:
                    "background-color 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease",

                /*
                =====================================================
                NAVBAR ABOVE SIDEBAR
                =====================================================
                */

                zIndex: (theme) =>
                    theme.zIndex.drawer + 2,

                /*
                =====================================================
                SUBTLE BLUE / PURPLE GLOW
                =====================================================
                */

                "&::before": {

                    content: '""',

                    position: "absolute",

                    top: 0,

                    left: 0,

                    right: 0,

                    height: 2,

                    background:
                        darkMode
                            ? "linear-gradient(90deg, #2563EB, #7C3AED, #0891B2)"
                            : "linear-gradient(90deg, #2563EB, #7C3AED, #0891B2)",

                    opacity:
                        darkMode ? 0.9 : 0.7,

                    pointerEvents: "none"
                }
            }}
        >

            <Toolbar
                sx={{
                    minHeight:
                        "64px !important",

                    height: 64,

                    px: {
                        xs: 1.5,
                        sm: 2.5,
                        md: 3
                    }
                }}
            >

                {/* =================================================
                    MOBILE MENU BUTTON
                ================================================= */}

                <IconButton
                    onClick={onMenuClick}
                    edge="start"
                    aria-label="Open navigation menu"
                    sx={{
                        display: {
                            xs: "flex",
                            md: "none"
                        },

                        mr: 1,

                        width: 40,

                        height: 40,

                        color:
                            "text.primary",

                        backgroundColor:
                            darkMode
                                ? "rgba(96, 165, 250, 0.08)"
                                : "rgba(37, 99, 235, 0.06)",

                        border:
                            darkMode
                                ? "1px solid rgba(96, 165, 250, 0.14)"
                                : "1px solid rgba(37, 99, 235, 0.10)",

                        transition:
                            "all 0.2s ease",

                        "&:hover": {

                            backgroundColor:
                                darkMode
                                    ? "rgba(96, 165, 250, 0.16)"
                                    : "rgba(37, 99, 235, 0.12)",

                            color:
                                "primary.main",

                            transform:
                                "translateY(-1px)"
                        }
                    }}
                >

                    <MenuIcon />

                </IconButton>


                {/* =================================================
                    APPLICATION NAME
                ================================================= */}

                <Box
                    sx={{
                        display: "flex",

                        alignItems: "center",

                        minWidth: 0
                    }}
                >

                    <Typography
                        noWrap
                        sx={{
                            fontSize: {
                                xs: "1rem",
                                sm: "1.15rem",
                                md: "1.2rem"
                            },

                            fontWeight: 700,

                            color:
                                "text.primary",

                            letterSpacing:
                                "-0.3px",

                            transition:
                                "color 0.35s ease"
                        }}
                    >
                        Mail Automation System
                    </Typography>

                </Box>


                {/* =================================================
                    RIGHT SIDE
                ================================================= */}

                <Box
                    sx={{
                        marginLeft: "auto",

                        display: "flex",

                        alignItems: "center",

                        gap: 1
                    }}
                >

                    {/* =================================================
                        DARK / LIGHT MODE BUTTON
                    ================================================= */}

                    <IconButton
                        onClick={toggleDarkMode}
                        aria-label={
                            darkMode
                                ? "Switch to light mode"
                                : "Switch to dark mode"
                        }
                        sx={{
                            width: 42,

                            height: 42,

                            color:
                                darkMode
                                    ? "#FBBF24"
                                    : "#1E3A8A",

                            backgroundColor:
                                darkMode
                                    ? "rgba(251, 191, 36, 0.10)"
                                    : "rgba(37, 99, 235, 0.08)",

                            border:
                                darkMode
                                    ? "1px solid rgba(251, 191, 36, 0.18)"
                                    : "1px solid rgba(37, 99, 235, 0.14)",

                            transition:
                                "all 0.25s ease",

                            "&:hover": {

                                color:
                                    darkMode
                                        ? "#FCD34D"
                                        : "#2563EB",

                                backgroundColor:
                                    darkMode
                                        ? "rgba(251, 191, 36, 0.18)"
                                        : "rgba(37, 99, 235, 0.14)",

                                transform:
                                    "rotate(12deg) scale(1.04)"
                            }
                        }}
                    >

                        {darkMode ? (
                            <LightModeIcon />
                        ) : (
                            <DarkModeIcon />
                        )}

                    </IconButton>


                    {/* =================================================
                        PROFILE
                    ================================================= */}

                    <Box
                        sx={{
                            width: {
                                xs: 34,
                                sm: 36
                            },

                            height: {
                                xs: 34,
                                sm: 36
                            },

                            flexShrink: 0,

                            borderRadius: "50%",

                            display: "flex",

                            alignItems: "center",

                            justifyContent: "center",

                            background:
                                darkMode
                                    ? "linear-gradient(135deg, rgba(96,165,250,0.25), rgba(167,139,250,0.25))"
                                    : "linear-gradient(135deg, rgba(37,99,235,0.14), rgba(124,58,237,0.14))",

                            color:
                                "primary.main",

                            border:
                                darkMode
                                    ? "1px solid rgba(96, 165, 250, 0.20)"
                                    : "1px solid rgba(37, 99, 235, 0.14)",

                            fontWeight: 700,

                            fontSize: {
                                xs: "0.78rem",
                                sm: "0.82rem"
                            },

                            boxShadow:
                                darkMode
                                    ? "0 4px 15px rgba(37, 99, 235, 0.18)"
                                    : "0 4px 15px rgba(37, 99, 235, 0.08)",

                            transition:
                                "all 0.25s ease",

                            "&:hover": {

                                transform:
                                    "translateY(-1px) scale(1.03)"
                            }
                        }}
                    >
                        MS
                    </Box>

                </Box>

            </Toolbar>

        </AppBar>
    );
}


export default Navbar;