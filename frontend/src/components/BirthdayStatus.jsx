import { useEffect, useState } from "react";

import api from "../services/api";

import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";

import CakeIcon from "@mui/icons-material/Cake";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import BusinessIcon from "@mui/icons-material/Business";
import WorkIcon from "@mui/icons-material/Work";


// ============================================================
// STATUS COLORS
// ============================================================

const statusStyle = (status) => {

    switch (status) {

        case "SUCCESS":
            return {
                color: "#047857",
                background: "#ECFDF5"
            };

        case "PARTIAL":
            return {
                color: "#B45309",
                background: "#FFFBEB"
            };

        case "FAILED":
            return {
                color: "#B91C1C",
                background: "#FEF2F2"
            };

        default:
            return {
                color: "#475569",
                background: "#F1F5F9"
            };
    }
};


// ============================================================
// MAIN COMPONENT
// ============================================================

function BirthdayStatus() {

    const [data, setData] = useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(null);


    // ========================================================
    // LOAD BIRTHDAY DATA
    // ========================================================

    useEffect(() => {

        const loadBirthdayStatus = async () => {

            try {

                const response = await api.get(
                    "/birthday-status"
                );

                setData(response.data);

            } catch (error) {

                console.error(
                    "BIRTHDAY STATUS ERROR:",
                    error
                );

                setError(
                    "Unable to load birthday status."
                );

            } finally {

                setLoading(false);

            }

        };

        loadBirthdayStatus();

    }, []);


    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {

        return (

            <Paper
                elevation={0}
                sx={{
                    mt: 3,
                    p: 5,
                    borderRadius: 4,
                    textAlign: "center",
                    border: "1px solid #7fb0ef",
                    background: "#f7dee7"
                }}
            >

                <CircularProgress
                    size={35}
                />

                <Typography
                    sx={{
                        mt: 2,
                        color: "#64748B"
                    }}
                >
                    Loading birthday status...
                </Typography>

            </Paper>

        );

    }


    // ========================================================
    // ERROR
    // ========================================================

    if (error) {

        return (

            <Alert
                severity="error"
                sx={{
                    mt: 3,
                    borderRadius: 3
                }}
            >
                {error}
            </Alert>

        );

    }


    if (!data) {
        return null;
    }


    // ========================================================
    // MAIN CARD
    // ========================================================

    return (

        <Paper
            elevation={0}
            sx={{
                mt: 3,

                p: {
                    xs: 2,
                    sm: 3,
                    md: 4
                },

                borderRadius: 4,

                border:
                    "1px solid #b1ccf1",

                background:
                    "#f9f0f0",

                transition:
                    "all 0.25s ease",

                "&:hover": {
                    boxShadow:
                        "0 10px 30px rgba(15,23,42,0.06)"
                }
            }}
        >


            {/* =================================================
                HEADER
            ================================================= */}

            <Box
                sx={{
                    display: "flex",

                    justifyContent:
                        "space-between",

                    alignItems: "center",

                    gap: 2,

                    flexWrap: "wrap",

                    mb: 3
                }}
            >

                <Box
                    sx={{
                        display: "flex",

                        alignItems: "center",

                        gap: 2
                    }}
                >

                    <Avatar
                        sx={{
                            width: 52,
                            height: 52,

                            background:
                                "#FFF7ED",

                            color:
                                "#EA580C"
                        }}
                    >
                        <CakeIcon />
                    </Avatar>


                    <Box>

                        <Typography
                            sx={{
                                fontSize:
                                    "1.4rem",

                                fontWeight: 700,

                                color:
                                    "#1E293B"
                            }}
                        >
                            Birthday Status
                        </Typography>


                        <Typography
                            variant="body2"
                            sx={{
                                color:
                                    "#64748B"
                            }}
                        >
                            Today's birthday announcements
                        </Typography>

                    </Box>

                </Box>


                {/* DATE */}

                <Chip
                    label={data.date}
                    sx={{
                        fontWeight: 600,

                        color:
                            "#C2410C",

                        background:
                            "#efd1b0",

                        border:
                            "1px solid #FED7AA"
                    }}
                />

            </Box>


            <Divider
                sx={{
                    mb: 1
                }}
            />


            {/* =================================================
                TODAY'S BIRTHDAYS
            ================================================= */}

            <SectionTitle
                icon={<CakeIcon />}
                title="Today's Birthdays"
                color="#EA580C"
            />


            {data.total_birthdays === 0 ? (

                <Alert
                    severity="info"
                    sx={{
                        mb: 5,
                        borderRadius: 2
                    }}
                >
                    No birthdays today.
                </Alert>

            ) : (

                <Grid
                    container
                    spacing={1}
                    sx={{
                        mb: 5
                    }}
                >

                    {data.birthdays.map(
                        (employee) => (

                            <Grid
                                key={employee.id}
                                size={{
                                    xs: 12,
                                    sm: 6,
                                    md: 4
                                }}
                            >

                                <BirthdayEmployee
                                    employee={
                                        employee
                                    }
                                />

                            </Grid>

                        )
                    )}

                </Grid>

            )}


            {/* =================================================
                SEPARATOR
            ================================================= */}

            <Divider
                sx={{
                    my: 3,
                    borderColor:
                        "#f6f7f8"
                }}
            />


            {/* =================================================
                DEPARTMENT STATUS
            ================================================= */}

            <SectionTitle
                icon={<PeopleIcon />}
                title="Department Status"
                color="#7C3AED"
            />


            <Grid
                container
                spacing={2}
                sx={{
                    mb: 4
                }}
            >

                {data.departments.map(
                    (department) => (

                        <Grid
                            key={
                                department.department
                            }
                            size={{
                                xs: 12,
                                md: 6
                            }}
                        >

                            <DepartmentCard
                                department={
                                    department
                                }
                            />

                        </Grid>

                    )
                )}

            </Grid>


            {/* =================================================
                BIRTHDAY JOB
            ================================================= */}

            {data.job && (

                <>
                    <Divider
                        sx={{
                            my: 5,
                            borderColor:
                                "#E2E8F0"
                        }}
                    />

                    <SectionTitle
                        icon={<WorkIcon />}
                        title="Birthday Job"
                        color="#2563EB"
                    />

                    <JobCard
                        job={data.job}
                    />
                </>

            )}

        </Paper>

    );

}


// ============================================================
// SECTION TITLE
// ============================================================

function SectionTitle({
    icon,
    title,
    color
}) {

    return (

        <Box
            sx={{
                display: "flex",

                alignItems: "center",

                gap: 1,

                mb: 2
            }}
        >

            <Box
                sx={{
                    display: "flex",
                    color
                }}
            >
                {icon}
            </Box>


            <Typography
                variant="h6"
                sx={{
                    fontWeight: 700,
                    color: "#1E293B"
                }}
            >
                {title}
            </Typography>

        </Box>

    );

}


// ============================================================
// BIRTHDAY EMPLOYEE CARD
// ============================================================

function BirthdayEmployee({
    employee
}) {

    return (

        <Paper
            elevation={0}
            sx={{
                p: 2.5,

                height: "100%",

                borderRadius: 3,

                border:
                    "1px solid #FED7AA",

                background:
                    "linear-gradient(135deg, #FFF7ED 0%, #FFFFFF 100%)",

                position:
                    "relative",

                overflow:
                    "hidden",

                transition:
                    "all 0.25s ease",

                "&:hover": {

                    transform:
                        "translateY(-5px)",

                    boxShadow:
                        "0 12px 30px rgba(234,88,12,0.12)",

                    borderColor:
                        "#FDBA74"
                },

                "&::after": {

                    content: '""',

                    position:
                        "absolute",

                    width: 80,
                    height: 80,

                    borderRadius:
                        "50%",

                    backgroundColor:
                        "rgba(234,88,12,0.06)",

                    right: -25,
                    bottom: -25,

                    pointerEvents:
                        "none"
                }
            }}
        >

            <Box
                sx={{
                    position:
                        "relative",

                    zIndex: 1
                }}
            >

                {/* HEADER */}

                <Box
                    sx={{
                        display: "flex",

                        alignItems:
                            "center",

                        gap: 2
                    }}
                >

                    <Avatar
                        sx={{
                            background:
                                "#FFF7ED",

                            color:
                                "#EA580C",

                            fontWeight: 700
                        }}
                    >
                        {employee.name
                            ?.charAt(0)
                            ?.toUpperCase()}
                    </Avatar>


                    <Box
                        sx={{
                            minWidth: 0
                        }}
                    >

                        <Typography
                            sx={{
                                fontWeight: 700,

                                color:
                                    "#1E293B",

                                overflow:
                                    "hidden",

                                textOverflow:
                                    "ellipsis",

                                whiteSpace:
                                    "nowrap"
                            }}
                        >
                            {employee.name}
                        </Typography>


                        <Typography
                            variant="body2"
                            sx={{
                                color:
                                    "#64748B"
                            }}
                        >
                            {employee.employee_id}
                        </Typography>

                    </Box>

                </Box>


                {/* EMAIL */}

                <Typography
                    variant="body2"
                    sx={{
                        mt: 2,

                        color:
                            "#475569",

                        overflowWrap:
                            "anywhere"
                    }}
                >
                    {employee.email}
                </Typography>


                {/* DEPARTMENT */}

                <Chip
                    icon={
                        <BusinessIcon />
                    }

                    label={
                        employee.department
                    }

                    size="small"

                    sx={{
                        mt: 1.5,

                        color:
                            "#C2410C",

                        background:
                            "#FFF7ED"
                    }}
                />

            </Box>

        </Paper>

    );

}


// ============================================================
// DEPARTMENT CARD
// ============================================================

function DepartmentCard({
    department
}) {

    const status =
        statusStyle(
            department.status
        );


    // ========================================================
    // DEPARTMENT COLORS
    // ========================================================

    const departmentColors = [

        {
            color: "#2563EB",
            lightColor: "#EFF6FF"
        },

        {
            color: "#7C3AED",
            lightColor: "#F5F3FF"
        },

        {
            color: "#059669",
            lightColor: "#ECFDF5"
        },

        {
            color: "#EA580C",
            lightColor: "#FFF7ED"
        },

        {
            color: "#0891B2",
            lightColor: "#ECFEFF"
        },

        {
            color: "#DB2777",
            lightColor: "#FDF2F8"
        }

    ];


    // ========================================================
    // CREATE STABLE COLOR
    // ========================================================

    const departmentIndex =
        department.department
            ?.split("")
            .reduce(
                (sum, char) =>
                    sum +
                    char.charCodeAt(0),
                0
            ) %
        departmentColors.length;


    const config =
        departmentColors[
            departmentIndex
        ] ||
        departmentColors[0];


    return (

        <Paper
            elevation={0}
            sx={{
                height: "100%",

                minHeight: 250,

                p: 2.5,

                borderRadius: 3,

                border:
                    `1px solid ${config.color}20`,

                background: `
                    linear-gradient(
                        135deg,
                        ${config.lightColor} 0%,
                        #f9eaea 100%
                    )
                `,

                position:
                    "relative",

                overflow:
                    "hidden",

                transition:
                    "all 0.25s ease",

                "&:hover": {

                    transform:
                        "translateY(-5px)",

                    boxShadow:
                        `0 12px 30px ${config.color}25`,

                    borderColor:
                        `${config.color}50`
                },

                "&::after": {

                    content: '""',

                    position:
                        "absolute",

                    width: 110,
                    height: 110,

                    borderRadius:
                        "50%",

                    backgroundColor:
                        `${config.color}10`,

                    right: -35,
                    bottom: -40,

                    pointerEvents:
                        "none"
                }
            }}
        >

            <Box
                sx={{
                    position:
                        "relative",

                    zIndex: 1
                }}
            >

                {/* =================================================
                    HEADER
                ================================================= */}

                <Box
                    sx={{
                        display: "flex",

                        justifyContent:
                            "space-between",

                        alignItems:
                            "center",

                        gap: 2,

                        mb: 2
                    }}
                >

                    {/* DEPARTMENT */}

                    <Box
                        sx={{
                            display: "flex",

                            alignItems:
                                "center",

                            gap: 1.5,

                            minWidth: 0
                        }}
                    >

                        <Box
                            sx={{
                                width: 42,
                                height: 42,

                                flexShrink: 1,

                                borderRadius: 2,

                                display: "flex",

                                alignItems:
                                    "center",

                                justifyContent:
                                    "center",

                                backgroundColor:
                                    `${config.color}15`,

                                color:
                                    config.color
                            }}
                        >

                            <PeopleIcon />

                        </Box>


                        <Box
                            sx={{
                                minWidth: 0
                            }}
                        >

                            <Typography
                                sx={{
                                    fontSize:
                                        "0.95rem",

                                    fontWeight: 700,

                                    color:
                                        "#1E293B",

                                    overflow:
                                        "hidden",

                                    textOverflow:
                                        "ellipsis",

                                    whiteSpace:
                                        "nowrap"
                                }}
                            >
                                {department.department}
                            </Typography>


                            <Typography
                                sx={{
                                    fontSize:
                                        "0.72rem",

                                    color:
                                        "#64748B",

                                    mt: 0.3
                                }}
                            >
                                Department
                            </Typography>

                        </Box>

                    </Box>


                    {/* STATUS */}

                    <Chip
                        label={
                            department.status
                        }

                        size="small"

                        sx={{
                            flexShrink: 0,

                            fontWeight: 700,

                            fontSize:
                                "0.7rem",

                            color:
                                status.color,

                            backgroundColor:
                                status.background,

                            border:
                                `1px solid ${status.color}20`
                        }}
                    />

                </Box>


                {/* =================================================
                    DIVIDER
                ================================================= */}

                <Divider
                    sx={{
                        mb: 2,

                        borderColor:
                            `${config.color}15`
                    }}
                />


                {/* =================================================
                    STATISTICS
                ================================================= */}

                <Grid
                    container
                    spacing={1.5}
                >

                    <DepartmentStat
                        title="Birthdays"

                        value={
                            department.birthday_count
                        }

                        color="#EA580C"

                        background="#f8dcbb"
                    />


                    <DepartmentStat
                        title="Recipients"

                        value={
                            department.announcement_recipients
                        }

                        color="#7C3AED"

                        background="#d2caf7"
                    />


                    <DepartmentStat
                        title="Sent"

                        value={
                            department.sent
                        }

                        color="#059669"

                        background="#cef3e1"
                    />


                    <DepartmentStat
                        title="Failed"

                        value={
                            department.failed
                        }

                        color="#DC2626"

                        background="#f0c5c5"
                    />

                </Grid>


                {/* =================================================
                    BIRTHDAY EMPLOYEES
                ================================================= */}

                {department.birthdays?.length > 0 && (

                    <Box
                        sx={{
                            mt: 2,

                            p: 1.5,

                            borderRadius: 2,

                            background:
                                `${config.color}08`,

                            border:
                                `1px solid ${config.color}12`
                        }}
                    >

                        <Typography
                            variant="caption"
                            sx={{
                                fontWeight: 700,

                                color:
                                    "#4f607a",

                                display:
                                    "block",

                                mb: 1
                            }}
                        >
                            Birthday Employees
                        </Typography>


                        {department.birthdays.map(
                            (employee) => (

                                <Box
                                    key={
                                        employee.id
                                    }

                                    sx={{
                                        display:
                                            "flex",

                                        alignItems:
                                            "center",

                                        gap: 1,

                                        mt: 0.7
                                    }}
                                >

                                    <CakeIcon
                                        sx={{
                                            fontSize:
                                                17,

                                            color:
                                                "#EA580C"
                                        }}
                                    />


                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color:
                                                "#475569",

                                            fontWeight:
                                                500
                                        }}
                                    >
                                        {employee.name}
                                    </Typography>

                                </Box>

                            )
                        )}

                    </Box>

                )}

            </Box>

        </Paper>

    );

}


// ============================================================
// DEPARTMENT STAT
// ============================================================

function DepartmentStat({
    title,
    value,
    color,
    background
}) {

    return (

        <Grid
            size={{
                xs: 6
            }}
        >

            <Box
                sx={{
                    p: 1.5,

                    borderRadius: 2,

                    background,

                    transition:
                        "all 0.2s ease",

                    "&:hover": {

                        transform:
                            "translateY(-2px)"
                    }
                }}
            >

                <Typography
                    sx={{
                        fontSize:
                            "0.72rem",

                        fontWeight: 500,

                        color:
                            "#5b697d"
                    }}
                >
                    {title}
                </Typography>


                <Typography
                    sx={{
                        mt: 0.3,

                        fontSize:
                            "1.25rem",

                        fontWeight: 700,

                        color
                    }}
                >
                    {value}
                </Typography>

            </Box>

        </Grid>

    );

}


// ============================================================
// JOB CARD
// ============================================================

function JobCard({
    job
}) {

    const style =
        statusStyle(
            job.status
        );


    return (

        <Paper
            elevation={0}
            sx={{
                p: 2.5,

                borderRadius: 3,

                border:
                    "1px solid #E2E8F0",

                background:
                    "linear-gradient(135deg, #EFF6FF 0%, #FFFFFF 100%)",

                position:
                    "relative",

                overflow:
                    "hidden",

                transition:
                    "all 0.25s ease",

                "&:hover": {

                    transform:
                        "translateY(-4px)",

                    boxShadow:
                        "0 10px 25px rgba(37,99,235,0.10)"
                }
            }}
        >

            <Grid
                container
                spacing={2}
            >

                <JobStat
                    title="Job ID"
                    value={`#${job.id}`}
                />


                <JobStat
                    title="Total"
                    value={job.total}
                />


                <JobStat
                    title="Sent"
                    value={job.sent}
                    color="#059669"
                />


                <JobStat
                    title="Failed"
                    value={job.failed}
                    color="#DC2626"
                />

            </Grid>


            <Divider
                sx={{
                    my: 2
                }}
            />


            <Chip
                icon={
                    job.status === "SUCCESS"
                        ? <CheckCircleIcon />
                        : <ErrorIcon />
                }

                label={
                    job.status
                }

                sx={{
                    fontWeight: 700,

                    color:
                        style.color,

                    background:
                        style.background
                }}
            />

        </Paper>

    );

}


// ============================================================
// JOB STAT
// ============================================================

function JobStat({
    title,
    value,
    color = "#1E293B"
}) {

    return (

        <Grid
            size={{
                xs: 6,
                sm: 3
            }}
        >

            <Typography
                variant="caption"
                sx={{
                    color:
                        "#64748B"
                }}
            >
                {title}
            </Typography>


            <Typography
                sx={{
                    fontSize:
                        "1.35rem",

                    fontWeight: 700,

                    color
                }}
            >
                {value}
            </Typography>

        </Grid>

    );

}


export default BirthdayStatus;