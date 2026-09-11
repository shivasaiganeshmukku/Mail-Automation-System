import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import PeopleIcon from "@mui/icons-material/People";
import DescriptionIcon from "@mui/icons-material/Description";
import SendIcon from "@mui/icons-material/Send";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";


function DashboardCard({
    title,
    value
}) {

    /*
    =========================================================
    CARD CONFIGURATION
    =========================================================
    */

    const cardConfig = {

        "Total Employees": {

            color: "#2374f7",

            lightBackground:
                "rgba(50, 127, 249, 0.09)",

            darkBackground:
                "rgba(59, 130, 246, 0.14)",

            icon: <PeopleIcon />

        },


        "Total Templates": {

            color: "#8553f9",

            lightBackground:
                "rgba(139, 92, 246, 0.09)",

            darkBackground:
                "rgba(139, 92, 246, 0.14)",

            icon: <DescriptionIcon />

        },


        "Emails Sent": {

            color: "#09bf82",

            lightBackground:
                "rgba(16, 185, 129, 0.09)",

            darkBackground:
                "rgba(16, 185, 129, 0.14)",

            icon: <SendIcon />

        },


        "Failed Emails": {

            color: "#EF4444",

            lightBackground:
                "rgba(239, 68, 68, 0.08)",

            darkBackground:
                "rgba(239, 68, 68, 0.13)",

            icon: <WarningAmberIcon />

        }

    };


    /*
    =========================================================
    FALLBACK
    =========================================================
    */

    const config =
        cardConfig[title] || {

            color: "#3B82F6",

            lightBackground:
                "rgba(59, 130, 246, 0.09)",

            darkBackground:
                "rgba(59, 130, 246, 0.14)",

            icon: <DescriptionIcon />

        };


    return (

        <Card
            elevation={0}
            sx={{
                /*
                =================================================
                COMPACT CARD SIZE
                =================================================
                */

                height: "100%",

                minHeight: 125,

                borderRadius: 2.5,

                position: "relative",

                overflow: "hidden",


                /*
                =================================================
                GLASS BACKGROUND
                =================================================
                */

                backgroundColor:
                    (theme) =>
                        theme.palette.mode === "dark"
                            ? config.darkBackground
                            : config.lightBackground,

                backdropFilter:
                    "blur(16px)",

                WebkitBackdropFilter:
                    "blur(16px)",


                /*
                =================================================
                BORDER
                =================================================
                */

                border:
                    `1px solid ${config.color}22`,


                /*
                =================================================
                SHADOW
                =================================================
                */

                boxShadow:
                    (theme) =>
                        theme.palette.mode === "dark"
                            ? "0 8px 25px rgba(0, 0, 0, 0.22)"
                            : "0 8px 25px rgba(15, 23, 42, 0.06)",


                /*
                =================================================
                TRANSITION
                =================================================
                */

                transition:
                    "transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease",


                /*
                =================================================
                HOVER
                =================================================
                */

                "&:hover": {

                    transform:
                        "translateY(-3px)",

                    boxShadow:
                        `0 12px 28px ${config.color}20`,

                    borderColor:
                        `${config.color}45`
                },


                /*
                =================================================
                DECORATIVE GLOW
                =================================================
                */

                "&::after": {

                    content: '""',

                    position: "absolute",

                    width: 75,

                    height: 75,

                    borderRadius: "50%",

                    backgroundColor:
                        `${config.color}0D`,

                    right: -25,

                    bottom: -25,

                    pointerEvents: "none"
                }

            }}
        >

            <CardContent
                sx={{
                    /*
                    =================================================
                    COMPACT PADDING
                    =================================================
                    */

                    p: 2,

                    "&:last-child": {
                        pb: 2
                    },

                    position: "relative",

                    zIndex: 1
                }}
            >

                {/* =================================================
                    HEADER
                ================================================= */}

                <Box
                    sx={{
                        display: "flex",

                        alignItems: "center",

                        justifyContent:
                            "space-between",

                        mb: 1.4
                    }}
                >

                    <Typography
                        sx={{
                            fontSize:
                                "0.80rem",

                            fontWeight: 600,

                            color:
                                "text.secondary",

                            letterSpacing:
                                "0.2px",

                            lineHeight: 1.2
                        }}
                    >
                        {title}
                    </Typography>


                    {/* =================================================
                        ICON
                    ================================================= */}

                    <Box
                        sx={{
                            width: 34,

                            height: 34,

                            flexShrink: 0,

                            borderRadius: 1.8,

                            display: "flex",

                            alignItems: "center",

                            justifyContent: "center",

                            backgroundColor:
                                `${config.color}16`,

                            color:
                                config.color,

                            border:
                                `1px solid ${config.color}18`,

                            "& svg": {

                                fontSize: 19

                            }
                        }}
                    >
                        {config.icon}
                    </Box>

                </Box>


                {/* =================================================
                    VALUE
                ================================================= */}

                <Typography
                    sx={{
                        fontSize: {
                            xs: "1.75rem",
                            sm: "1.9rem"
                        },

                        fontWeight: 700,

                        lineHeight: 1,

                        color:
                            "text.primary",

                        letterSpacing:
                            "-0.6px"
                    }}
                >
                    {value}
                </Typography>


                {/* =================================================
                    STATUS
                ================================================= */}

                <Typography
                    sx={{
                        mt: 1,

                        fontSize:
                            "0.68rem",

                        fontWeight: 500,

                        color:
                            config.color,

                        lineHeight: 1.2
                    }}
                >
                    {title === "Failed Emails"
                        ? "Requires attention"
                        : "System overview"}
                </Typography>

            </CardContent>

        </Card>

    );
}


export default DashboardCard;