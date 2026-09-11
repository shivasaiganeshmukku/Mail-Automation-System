import { useState } from "react";

import Box from "@mui/material/Box";

import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";


const navbarHeight = 64;


function MainLayout({
    darkMode,
    toggleDarkMode
}) {

    const [mobileOpen, setMobileOpen] =
        useState(false);


    const handleMobileMenuOpen = () => {

        setMobileOpen(true);

    };


    const handleMobileMenuClose = () => {

        setMobileOpen(false);

    };


    return (

        <Box
            sx={{
                height: "100vh",

                width: "100%",

                overflow: "hidden",

                position: "relative",

                backgroundColor:
                    "background.default",

                color:
                    "text.primary",

                transition:
                    "background-color 0.35s ease, color 0.35s ease",

                "&::before": {

                    content: '""',

                    position: "absolute",

                    inset: 0,

                    pointerEvents: "none",

                    background: darkMode
                        ? `
                            radial-gradient(
                                circle at 10% 15%,
                                rgba(37, 99, 235, 0.16),
                                transparent 32%
                            ),
                            radial-gradient(
                                circle at 85% 20%,
                                rgba(124, 58, 237, 0.12),
                                transparent 30%
                            ),
                            radial-gradient(
                                circle at 70% 85%,
                                rgba(34, 197, 94, 0.06),
                                transparent 28%
                            ),
                            radial-gradient(
                                circle at 20% 80%,
                                rgba(249, 115, 22, 0.05),
                                transparent 25%
                            )
                        `
                        : `
                            radial-gradient(
                                circle at 10% 15%,
                                rgba(37, 99, 235, 0.10),
                                transparent 32%
                            ),
                            radial-gradient(
                                circle at 85% 20%,
                                rgba(124, 58, 237, 0.08),
                                transparent 30%
                            ),
                            radial-gradient(
                                circle at 70% 85%,
                                rgba(34, 197, 94, 0.04),
                                transparent 28%
                            ),
                            radial-gradient(
                                circle at 20% 80%,
                                rgba(249, 115, 22, 0.04),
                                transparent 25%
                            )
                        `,

                    transition:
                        "background 0.35s ease",

                    zIndex: 0
                }
            }}
        >

            {/* =================================================
                NAVBAR
            ================================================= */}

            <Navbar
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
                onMenuClick={handleMobileMenuOpen}
            />


            {/* =================================================
                CONTENT AREA
            ================================================= */}

            <Box
                sx={{
                    position: "relative",

                    zIndex: 1,

                    display: "flex",

                    height:
                        `calc(100vh - ${navbarHeight}px)`,

                    marginTop:
                        `${navbarHeight}px`,

                    width: "100%"
                }}
            >

                {/* =================================================
                    SIDEBAR
                ================================================= */}

                <Sidebar
                    mobileOpen={mobileOpen}
                    onClose={handleMobileMenuClose}
                />


                {/* =================================================
                    PAGE CONTENT
                ================================================= */}

                <Box
                    component="main"

                    sx={{
                        flexGrow: 1,

                        minWidth: 0,

                        height: "100%",

                        overflowY: "auto",

                        overflowX: "hidden",

                        px: {
                            xs: 2,
                            sm: 3,
                            md: 4
                        },

                        pt: {
                            xs: 3,
                            sm: 3,
                            md: 4
                        },

                        /*
                         * Extra bottom space.
                         * This allows the complete Recent Email
                         * Activity table to be visible when the
                         * user reaches the bottom of the page.
                         */
                        pb: 7,

                        backgroundColor:
                            "transparent",

                        color:
                            "text.primary",

                        transition:
                            "background-color 0.35s ease, color 0.35s ease",

                        scrollbarWidth:
                            "none",

                        "&::-webkit-scrollbar": {
                            display: "none"
                        }
                    }}
                >

                    <Outlet />

                </Box>

            </Box>

        </Box>

    );

}


export default MainLayout;