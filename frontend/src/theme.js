import { createTheme } from "@mui/material/styles";


export const lightTheme = createTheme({

    palette: {

        mode: "light",

        primary: {
            main: "#2563EB",
        },

        secondary: {
            main: "#7C3AED",
        },

        success: {
            main: "#16A34A",
        },

        error: {
            main: "#DC2626",
        },

        warning: {
            main: "#F59E0B",
        },

        background: {

            default: "#F1F5F9",

            paper: "#FFFFFF",

        },

        text: {

            primary: "#172554",

            secondary: "#64748B",

        },

        divider: "#CBD5E1",

    },

});


export const darkTheme = createTheme({

    palette: {

        mode: "dark",

        primary: {
            main: "#60A5FA",
        },

        secondary: {
            main: "#A78BFA",
        },

        success: {
            main: "#34D399",
        },

        error: {
            main: "#F87171",
        },

        warning: {
            main: "#FBBF24",
        },

        background: {

            default: "#0F172A",

            paper: "#1E293B",

        },

        text: {

            primary: "#F8FAFC",

            secondary: "#CBD5E1",

        },

        divider: "#334155",

    },

});