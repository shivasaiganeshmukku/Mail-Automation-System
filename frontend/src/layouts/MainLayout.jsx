import Box from "@mui/material/Box";
import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";


function MainLayout({ darkMode, toggleDarkMode }) {

    return (

        <Box
            sx={{
                minHeight: "100vh",

                backgroundColor:
                    "background.default",

                color:
                    "text.primary",

                transition:
                    "background-color 0.25s ease, color 0.25s ease",
            }}
        >

            {/* =========================================
                NAVBAR
            ========================================= */}

            <Navbar darkMode={darkMode}
    toggleDarkMode={toggleDarkMode}/>


            {/* =========================================
                PAGE CONTENT
            ========================================= */}

            <Box
                component="main"
                sx={{

                    minHeight: "100vh",

                    pt: {
                        xs: 10,
                        sm: 11
                    },

                    px: {
                        xs: 2,
                        sm: 3,
                        md: 4
                    },

                    pb: 4,

                    overflowX: "hidden",

                    backgroundColor:
                        "background.default",

                    transition:
                        "background-color 0.25s ease",
                }}
            >

                <Outlet />

            </Box>

        </Box>

    );

}


export default MainLayout;