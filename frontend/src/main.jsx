import { StrictMode, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";

import { ThemeProvider } from "@mui/material/styles";

import "./index.css";
import App from "./App.jsx";

import { lightTheme, darkTheme } from "./theme";


function Root() {

    const [darkMode, setDarkMode] = useState(() => {

        const savedMode =
            localStorage.getItem("darkMode");

        return savedMode === "true";

    });


    const theme = useMemo(() => {

        return darkMode
            ? darkTheme
            : lightTheme;

    }, [darkMode]);


    const toggleDarkMode = () => {

        setDarkMode((previous) => {

            const newMode = !previous;

            localStorage.setItem(
                "darkMode",
                newMode
            );

            return newMode;

        });

    };


    return (

        <ThemeProvider theme={theme}>

            <App
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
            />

        </ThemeProvider>

    );

}


createRoot(
    document.getElementById("root")
).render(

    <StrictMode>

        <Root />

    </StrictMode>

);