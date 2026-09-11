import { createTheme } from "@mui/material/styles";


/*
=========================================================
LIGHT THEME
=========================================================
*/

export const lightTheme = createTheme({

    palette: {

        mode: "light",


        /*
        =================================================
        PRIMARY
        =================================================
        */

        primary: {
            main: "#2563EB",
            light: "#60A5FA",
            dark: "#1D4ED8",
            contrastText: "#FFFFFF",
        },


        /*
        =================================================
        SECONDARY
        =================================================
        */

        secondary: {
            main: "#7C3AED",
            light: "#A78BFA",
            dark: "#6D28D9",
            contrastText: "#FFFFFF",
        },


        /*
        =================================================
        SUCCESS
        =================================================
        */

        success: {
            main: "#16A34A",
            light: "#4ADE80",
            dark: "#15803D",
            contrastText: "#FFFFFF",
        },


        /*
        =================================================
        WARNING
        =================================================
        */

        warning: {
            main: "#F59E0B",
            light: "#FBBF24",
            dark: "#D97706",
            contrastText: "#111827",
        },


        /*
        =================================================
        ERROR
        =================================================
        */

        error: {
            main: "#DC2626",
            light: "#F87171",
            dark: "#B91C1C",
            contrastText: "#FFFFFF",
        },


        /*
        =================================================
        INFO
        =================================================
        */

        info: {
            main: "#0891B2",
            light: "#22D3EE",
            dark: "#0E7490",
            contrastText: "#FFFFFF",
        },


        /*
        =================================================
        BACKGROUND
        =================================================
        */

        background: {

            default: "#EEF4FF",

            paper: "rgba(255, 255, 255, 0.72)",

        },


        /*
        =================================================
        TEXT
        =================================================
        */

        text: {

            primary: "#172033",

            secondary: "#64748B",

        },


        /*
        =================================================
        DIVIDER
        =================================================
        */

        divider: "rgba(37, 99, 235, 0.14)",

    },


    /*
    =====================================================
    GLOBAL SHAPE
    =====================================================
    */

    shape: {

        borderRadius: 12,

    },


    /*
    =====================================================
    TYPOGRAPHY
    =====================================================
    */

    typography: {

        fontFamily:
            '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',

        h1: {
            fontWeight: 700,
        },

        h2: {
            fontWeight: 700,
        },

        h3: {
            fontWeight: 700,
        },

        h4: {
            fontWeight: 700,
        },

        h5: {
            fontWeight: 600,
        },

        h6: {
            fontWeight: 600,
        },

        button: {
            fontWeight: 600,
            textTransform: "none",
        },

    },


    /*
    =====================================================
    COMPONENT DEFAULTS
    =====================================================
    */

    components: {

        MuiPaper: {

            defaultProps: {
                elevation: 0,
            },

            styleOverrides: {

                root: {

                    backgroundColor:
                        "rgba(255, 255, 255, 0.68)",

                    backdropFilter:
                        "blur(16px)",

                    WebkitBackdropFilter:
                        "blur(16px)",

                    border:
                        "1px solid rgba(37, 99, 235, 0.10)",

                },

            },

        },


        MuiCard: {

            styleOverrides: {

                root: {

                    backgroundColor:
                        "rgba(255, 255, 255, 0.68)",

                    backdropFilter:
                        "blur(16px)",

                    WebkitBackdropFilter:
                        "blur(16px)",

                    border:
                        "1px solid rgba(37, 99, 235, 0.10)",

                    boxShadow:
                        "0 8px 30px rgba(37, 99, 235, 0.08)",

                },

            },

        },


        MuiButton: {

            styleOverrides: {

                root: {

                    borderRadius: 10,

                    boxShadow: "none",

                },

            },

        },


        MuiTextField: {

            defaultProps: {

                size: "small",

            },

        },


        MuiOutlinedInput: {

            styleOverrides: {

                root: {

                    borderRadius: 10,

                    backgroundColor:
                        "rgba(255, 255, 255, 0.55)",

                },

            },

        },

    },

});


/*
=========================================================
DARK THEME
=========================================================
*/

export const darkTheme = createTheme({

    palette: {

        mode: "dark",


        /*
        =================================================
        PRIMARY
        =================================================
        */

        primary: {
            main: "#60A5FA",
            light: "#93C5FD",
            dark: "#2563EB",
            contrastText: "#07111F",
        },


        /*
        =================================================
        SECONDARY
        =================================================
        */

        secondary: {
            main: "#A78BFA",
            light: "#C4B5FD",
            dark: "#7C3AED",
            contrastText: "#10051F",
        },


        /*
        =================================================
        SUCCESS
        =================================================
        */

        success: {
            main: "#34D399",
            light: "#6EE7B7",
            dark: "#059669",
            contrastText: "#052E1B",
        },


        /*
        =================================================
        WARNING
        =================================================
        */

        warning: {
            main: "#FBBF24",
            light: "#FCD34D",
            dark: "#F59E0B",
            contrastText: "#1C1400",
        },


        /*
        =================================================
        ERROR
        =================================================
        */

        error: {
            main: "#F87171",
            light: "#FCA5A5",
            dark: "#EF4444",
            contrastText: "#2B0505",
        },


        /*
        =================================================
        INFO
        =================================================
        */

        info: {
            main: "#22D3EE",
            light: "#67E8F9",
            dark: "#0891B2",
            contrastText: "#02171C",
        },


        /*
        =================================================
        BACKGROUND
        =================================================
        */

        background: {

            default: "#08111F",

            paper: "rgba(15, 23, 42, 0.58)",

        },


        /*
        =================================================
        TEXT
        =================================================
        */

        text: {

            primary: "#F8FAFC",

            secondary: "#94A3B8",

        },


        /*
        =================================================
        DIVIDER
        =================================================
        */

        divider: "rgba(96, 165, 250, 0.16)",

    },


    /*
    =====================================================
    GLOBAL SHAPE
    =====================================================
    */

    shape: {

        borderRadius: 12,

    },


    /*
    =====================================================
    TYPOGRAPHY
    =====================================================
    */

    typography: {

        fontFamily:
            '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',

        h1: {
            fontWeight: 700,
        },

        h2: {
            fontWeight: 700,
        },

        h3: {
            fontWeight: 700,
        },

        h4: {
            fontWeight: 700,
        },

        h5: {
            fontWeight: 600,
        },

        h6: {
            fontWeight: 600,
        },

        button: {
            fontWeight: 600,
            textTransform: "none",
        },

    },


    /*
    =====================================================
    COMPONENT DEFAULTS
    =====================================================
    */

    components: {

        MuiPaper: {

            defaultProps: {
                elevation: 0,
            },

            styleOverrides: {

                root: {

                    backgroundColor:
                        "rgba(15, 23, 42, 0.62)",

                    backdropFilter:
                        "blur(18px)",

                    WebkitBackdropFilter:
                        "blur(18px)",

                    border:
                        "1px solid rgba(96, 165, 250, 0.12)",

                },

            },

        },


        MuiCard: {

            styleOverrides: {

                root: {

                    backgroundColor:
                        "rgba(15, 23, 42, 0.62)",

                    backdropFilter:
                        "blur(18px)",

                    WebkitBackdropFilter:
                        "blur(18px)",

                    border:
                        "1px solid rgba(96, 165, 250, 0.12)",

                    boxShadow:
                        "0 10px 35px rgba(0, 0, 0, 0.28)",

                },

            },

        },


        MuiButton: {

            styleOverrides: {

                root: {

                    borderRadius: 10,

                    boxShadow: "none",

                },

            },

        },


        MuiTextField: {

            defaultProps: {

                size: "small",

            },

        },


        MuiOutlinedInput: {

            styleOverrides: {

                root: {

                    borderRadius: 10,

                    backgroundColor:
                        "rgba(15, 23, 42, 0.55)",

                },

            },

        },

    },

});