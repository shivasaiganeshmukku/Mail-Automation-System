import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import PeopleIcon from "@mui/icons-material/People";
import DescriptionIcon from "@mui/icons-material/Description";
import SendIcon from "@mui/icons-material/Send";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";


function DashboardCard({ title, value }) {

    const cardConfig = {

        "Total Employees": {
            color: "#2563EB",
            lightColor: "#EFF6FF",
            icon: <PeopleIcon />
        },

        "Total Templates": {
            color: "#7C3AED",
            lightColor: "#F5F3FF",
            icon: <DescriptionIcon />
        },

        "Emails Sent": {
            color: "#059669",
            lightColor: "#ECFDF5",
            icon: <SendIcon />
        },

        "Failed Emails": {
            color: "#DC2626",
            lightColor: "#FEF2F2",
            icon: <WarningAmberIcon />
        }

    };


    const config = cardConfig[title] || {
        color: "#2563EB",
        lightColor: "#EFF6FF",
        icon: <DescriptionIcon />
    };


    return (

        <Card
            elevation={0}
            sx={{
                height: "100%",
                minHeight: 150,

                borderRadius: 3,

                border: `1px solid ${config.color}20`,

                background: `
                    linear-gradient(
                        135deg,
                        ${config.lightColor} 0%,
                        #feecec 100%
                    )
                `,

                position: "relative",
                overflow: "hidden",

                transition: "all 0.25s ease",

                "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: `0 12px 30px ${config.color}25`,
                    borderColor: `${config.color}50`
                },

                "&::after": {
                    content: '""',
                    position: "absolute",

                    width: 90,
                    height: 90,

                    borderRadius: "50%",

                    backgroundColor: `${config.color}10`,

                    right: -25,
                    bottom: -30
                }
            }}
        >

            <CardContent
                sx={{
                    p: 3,
                    position: "relative",
                    zIndex: 1
                }}
            >

                {/* HEADER */}

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 2
                    }}
                >

                    <Typography
                        sx={{
                            fontSize: "0.9rem",
                            fontWeight: 600,
                            color: "#64748B",
                            letterSpacing: "0.3px"
                        }}
                    >
                        {title}
                    </Typography>


                    {/* ICON */}

                    <Box
                        sx={{
                            width: 42,
                            height: 42,

                            borderRadius: 2,

                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",

                            backgroundColor: `${config.color}15`,
                            color: config.color
                        }}
                    >
                        {config.icon}
                    </Box>

                </Box>


                {/* VALUE */}

                <Typography
                    sx={{
                        fontSize: "2.3rem",
                        fontWeight: 700,
                        lineHeight: 1,

                        color: "#1E293B"
                    }}
                >
                    {value}
                </Typography>


                {/* SMALL STATUS */}

                <Typography
                    sx={{
                        mt: 1.5,
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        color: config.color
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