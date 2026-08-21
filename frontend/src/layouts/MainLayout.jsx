import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";

import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function MainLayout() {

    return (
        <>
            <Navbar />

            <Box sx={{ display: "flex" }}>

                <Sidebar />

                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: 3
                    }}
                >
                    <Toolbar />

                    <Outlet />

                </Box>

            </Box>
        </>
    );
}

export default MainLayout;