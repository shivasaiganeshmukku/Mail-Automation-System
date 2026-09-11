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
import Button from "@mui/material/Button";

import CakeIcon from "@mui/icons-material/Cake";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import BusinessIcon from "@mui/icons-material/Business";
import WorkIcon from "@mui/icons-material/Work";
import SendIcon from "@mui/icons-material/Send";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";


// ============================================================
// BIRTHDAY COLORS
// ============================================================

const birthdayColors = {
    primary: "#EA580C",
    dark: "#C2410C",
    light: "#FB923C",

    lightBackground:
        "rgba(234, 88, 12, 0.07)",

    darkBackground:
        "rgba(234, 88, 12, 0.13)"
};


// ============================================================
// STATUS COLORS
// ============================================================

const statusStyle = (
    status,
    mode = "light"
) => {

    if (mode === "dark") {

        switch (status) {

            case "SUCCESS":
                return {
                    color: "#34D399",
                    background:
                        "rgba(16, 185, 129, 0.14)"
                };

            case "PARTIAL":
                return {
                    color: "#FBBF24",
                    background:
                        "rgba(245, 158, 11, 0.14)"
                };

            case "FAILED":
                return {
                    color: "#F87171",
                    background:
                        "rgba(239, 68, 68, 0.14)"
                };

            default:
                return {
                    color: "#94A3B8",
                    background:
                        "rgba(148, 163, 184, 0.12)"
                };
        }
    }


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
// DEPARTMENT COLORS
// ============================================================

const departmentColors = [

    {
        color: "#2563EB",
        lightBackground:
            "rgba(37, 99, 235, 0.08)",
        darkBackground:
            "rgba(37, 99, 235, 0.14)"
    },

    {
        color: "#7C3AED",
        lightBackground:
            "rgba(124, 58, 237, 0.08)",
        darkBackground:
            "rgba(124, 58, 237, 0.14)"
    },

    {
        color: "#059669",
        lightBackground:
            "rgba(5, 150, 105, 0.08)",
        darkBackground:
            "rgba(5, 150, 105, 0.14)"
    },

    {
        color: "#EA580C",
        lightBackground:
            "rgba(234, 88, 12, 0.08)",
        darkBackground:
            "rgba(234, 88, 12, 0.14)"
    },

    {
        color: "#0891B2",
        lightBackground:
            "rgba(8, 145, 178, 0.08)",
        darkBackground:
            "rgba(8, 145, 178, 0.14)"
    },

    {
        color: "#DB2777",
        lightBackground:
            "rgba(219, 39, 119, 0.08)",
        darkBackground:
            "rgba(219, 39, 119, 0.14)"
    }
];


// ============================================================
// GET DEPARTMENT CONFIG
// ============================================================

function getDepartmentConfig(
    departmentName
) {

    const index =
        departmentName
            ?.split("")
            .reduce(
                (sum, char) =>
                    sum +
                    char.charCodeAt(0),
                0
            ) %
        departmentColors.length;

    return (
        departmentColors[index] ||
        departmentColors[0]
    );
}


// ============================================================
// MAIN COMPONENT
// ============================================================

function BirthdayStatus() {

    const [data, setData] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(null);

    const [sendingEmployeeId, setSendingEmployeeId] =
        useState(null);

    const [selectedEmployee, setSelectedEmployee] =
        useState(null);

    const [hoveredEmployee, setHoveredEmployee] =
        useState(null);

    const [panelLocked, setPanelLocked] =
        useState(false);


    // ========================================================
    // LOAD BIRTHDAY DATA
    // ========================================================

    const loadBirthdayStatus =
        async () => {

            try {

                const response =
                    await api.get(
                        "/birthday-status"
                    );

                setData(
                    response.data
                );

                setError(null);

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


    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(() => {

        loadBirthdayStatus();

    }, []);


    // ========================================================
    // OUTSIDE CLICK
    // ========================================================

    useEffect(() => {

        const handleOutsideClick =
            (event) => {

                if (
                    !event.target.closest(
                        "[data-birthday-interactive='true']"
                    )
                ) {

                    setSelectedEmployee(
                        null
                    );

                    setHoveredEmployee(
                        null
                    );

                    setPanelLocked(
                        false
                    );

                }

            };


        if (selectedEmployee) {

            document.addEventListener(
                "mousedown",
                handleOutsideClick
            );

        }


        return () => {

            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );

        };

    }, [selectedEmployee]);


    // ========================================================
    // FIND EMPLOYEE DEPARTMENT
    // ========================================================

    const getEmployeeDepartment =
        (employee) => {

            if (!employee) {
                return null;
            }

            return (
                data?.departments?.find(
                    (department) =>
                        department.department ===
                        employee.department
                ) || null
            );

        };


    // ========================================================
    // MOUSE ENTER
    // ========================================================

    const handleEmployeeMouseEnter =
        (employee) => {

            if (!panelLocked) {

                setHoveredEmployee(
                    employee
                );

            }

        };


    // ========================================================
    // MOUSE LEAVE
    // ========================================================

    const handleEmployeeMouseLeave =
        () => {

            if (!panelLocked) {

                setHoveredEmployee(
                    null
                );

            }

        };


    // ========================================================
    // EMPLOYEE CLICK
    // ========================================================

    const handleEmployeeClick =
        (employee) => {

            setSelectedEmployee(
                employee
            );

            setHoveredEmployee(
                employee
            );

            setPanelLocked(
                true
            );

        };


    // ========================================================
    // BACK BUTTON
    // ========================================================

    const handleBack = () => {

        setSelectedEmployee(
            null
        );

        setHoveredEmployee(
            null
        );

        setPanelLocked(
            false
        );

    };


    // ========================================================
    // SEND MANUAL WISHES
    // ========================================================

    const handleSendWishes =
        async (employee) => {

            if (!employee) {
                return;
            }


            if (sendingEmployeeId) {
                return;
            }


            try {

                setSendingEmployeeId(
                    employee.id
                );

                setError(null);


                const response =
                    await api.post(
                        `/birthday-send/${employee.id}`
                    );


                console.log(
                    "BIRTHDAY SEND RESPONSE:",
                    response.data
                );


                await loadBirthdayStatus();


                /*
                 * Keep the department card open.
                 *
                 * After reloading the birthday data,
                 * find the updated employee and keep
                 * the department panel selected.
                 */

                setData((currentData) => {

                    return currentData;

                });

            } catch (error) {

                console.error(
                    "MANUAL BIRTHDAY SEND ERROR:",
                    error
                );

                const message =
                    error.response?.data?.message ||
                    "Unable to send birthday wishes.";

                setError(
                    message
                );

            } finally {

                setSendingEmployeeId(
                    null
                );

            }

        };


    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {

        return (

            <Paper
                elevation={0}

                sx={{
                    mt: 3,

                    p: 4,

                    borderRadius: 3,

                    textAlign: "center",

                    backgroundColor:
                        "background.paper",

                    border:
                        "1px solid",

                    borderColor:
                        "divider"
                }}
            >

                <CircularProgress
                    size={32}
                />


                <Typography
                    sx={{
                        mt: 1.5,

                        color:
                            "text.secondary"
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

    if (error && !data) {

        return (

            <Alert
                severity="error"

                sx={{
                    mt: 3,

                    borderRadius: 2
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
    // ACTIVE EMPLOYEE
    // ========================================================

    const activeEmployee =
        selectedEmployee ||
        hoveredEmployee;


    const activeDepartment =
        getEmployeeDepartment(
            activeEmployee
        );


    // ========================================================
    // MAIN BIRTHDAY CONTAINER
    // ========================================================

    return (

        <Paper
            elevation={0}

            sx={{
                mt: 3,

                p: {
                    xs: 2,

                    sm: 2.5,

                    md: 3
                },

                borderRadius: 3,

                backgroundColor:
                    "background.paper",

                color:
                    "text.primary",

                border:
                    "1px solid",

                borderColor:
                    "divider",

                backdropFilter:
                    "blur(18px)",

                WebkitBackdropFilter:
                    "blur(18px)",

                transition:
                    "background-color 0.35s ease, border-color 0.35s ease"
            }}
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <Box
                sx={{
                    display:
                        "flex",

                    justifyContent:
                        "space-between",

                    alignItems:
                        "center",

                    gap:
                        2,

                    flexWrap:
                        "wrap",

                    mb:
                        2.5
                }}
            >

                <Box
                    sx={{
                        display:
                            "flex",

                        alignItems:
                            "center",

                        gap:
                            1.5
                    }}
                >

                    <Avatar
                        sx={{
                            width:
                                44,

                            height:
                                44,

                            backgroundColor:
                                "rgba(234, 88, 12, 0.10)",

                            color:
                                birthdayColors.primary
                        }}
                    >

                        <CakeIcon />

                    </Avatar>


                    <Box>

                        <Typography
                            sx={{
                                fontSize:
                                    "1.2rem",

                                fontWeight:
                                    700,

                                color:
                                    "text.primary"
                            }}
                        >
                            Birthday Status
                        </Typography>


                        <Typography
                            sx={{
                                color:
                                    "text.secondary",

                                fontSize:
                                    "0.78rem"
                            }}
                        >
                            Today's birthday announcements
                        </Typography>

                    </Box>

                </Box>


                <Chip
                    label={
                        data.date
                    }

                    size="small"

                    sx={{
                        fontWeight:
                            600,

                        color:
                            "warning.dark",

                        backgroundColor:
                            "rgba(245, 158, 11, 0.10)",

                        border:
                            "1px solid",

                        borderColor:
                            "rgba(245, 158, 11, 0.20)"
                    }}
                />

            </Box>


            <Divider
                sx={{
                    mb:
                        2.5
                }}
            />


            {/* =================================================
                TODAY'S BIRTHDAYS
            ================================================= */}

            <SectionTitle
                icon={
                    <CakeIcon />
                }

                title={
                    "Today's Birthdays"
                }

                color={
                    birthdayColors.primary
                }
            />


            {/* =================================================
                NO BIRTHDAYS
            ================================================= */}

            {data.total_birthdays === 0 ? (

                <NoBirthdays />

            ) : (

                <Box
                    sx={{
                        width:
                            "100%",

                        minHeight:
                            132
                    }}
                >

                    <Grid
                        container
                        spacing={1.5}

                        sx={{
                            alignItems:
                                "stretch"
                        }}
                    >

                        {/* =================================================
                            BIRTHDAY EMPLOYEES
                        ================================================= */}

                        {data.birthdays.map(
                            (employee) => {

                                const isActive =
                                    activeEmployee?.id ===
                                    employee.id;

                                return (

                                    <Grid
                                        key={
                                            employee.id
                                        }

                                        size={{
                                            xs: 12,
                                            sm: 6,
                                            md: 4
                                        }}
                                    >

                                        <BirthdayEmployeeWrapper
                                            employee={
                                                employee
                                            }

                                            isActive={
                                                isActive
                                            }

                                            panelLocked={
                                                panelLocked
                                            }

                                            activeDepartment={
                                                isActive
                                                    ? activeDepartment
                                                    : null
                                            }

                                            sending={
                                                sendingEmployeeId ===
                                                employee.id
                                            }

                                            onSend={
                                                handleSendWishes
                                            }

                                            onMouseEnter={() =>
                                                handleEmployeeMouseEnter(
                                                    employee
                                                )
                                            }

                                            onMouseLeave={
                                                handleEmployeeMouseLeave
                                            }

                                            onClick={() =>
                                                handleEmployeeClick(
                                                    employee
                                                )
                                            }

                                            onBack={
                                                handleBack
                                            }

                                        />

                                    </Grid>

                                );

                            }
                        )}


                        {/* =================================================
                            CELEBRATION
                        ================================================= */}

                        {data.total_birthdays === 1 && (

                            <Grid
                                size={{
                                    xs: 12,
                                    md: 8
                                }}

                                sx={{
                                    display: {
                                        xs: "none",
                                        md: "block"
                                    }
                                }}
                            >

                                <BirthdayCelebration />

                            </Grid>

                        )}

                    </Grid>

                </Box>

            )}


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <Alert
                    severity="error"

                    sx={{
                        mt:
                            2,

                        borderRadius:
                            2
                    }}
                >
                    {error}
                </Alert>

            )}


            {/* =================================================
                BIRTHDAY JOB
            ================================================= */}

            {data.job && (

                <>

                    <Divider
                        sx={{
                            my:
                                3
                        }}
                    />

                    <SectionTitle
                        icon={
                            <WorkIcon />
                        }

                        title={
                            "Birthday Job"
                        }

                        color={
                            "#2563EB"
                        }
                    />

                    <JobCard
                        job={
                            data.job
                        }
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
                display:
                    "flex",

                alignItems:
                    "center",

                gap:
                    1,

                mb:
                    1.5
            }}
        >

            <Box
                sx={{
                    display:
                        "flex",

                    color
                }}
            >
                {icon}
            </Box>


            <Typography
                sx={{
                    fontWeight:
                        700,

                    fontSize:
                        "1rem",

                    color:
                        "text.primary"
                }}
            >
                {title}
            </Typography>

        </Box>

    );

}


// ============================================================
// NO BIRTHDAYS
// ============================================================

function NoBirthdays() {

    return (

        <Box
            sx={{
                height:
                    82,

                width:
                    "100%",

                borderRadius:
                    2.5,

                display:
                    "flex",

                alignItems:
                    "center",

                justifyContent:
                    "center",

                gap: {
                    xs: 1,

                    sm: 2
                },

                px:
                    2,

                backgroundColor:
                    "rgba(234, 88, 12, 0.035)",

                border:
                    "1px dashed",

                borderColor:
                    "rgba(234, 88, 12, 0.18)",

                overflow:
                    "hidden",

                position:
                    "relative"
            }}
        >

            <Typography
                sx={{
                    fontSize:
                        "1.5rem",

                    animation:
                        "emptyCake 2.2s ease-in-out infinite",

                    "@keyframes emptyCake": {

                        "0%, 100%": {

                            transform:
                                "translateY(0)"
                        },

                        "50%": {

                            transform:
                                "translateY(-4px)"
                        }
                    }
                }}
            >
                🎂
            </Typography>


            <Box
                sx={{
                    textAlign:
                        "center"
                }}
            >

                <Typography
                    sx={{
                        fontSize:
                            "0.88rem",

                        fontWeight:
                            700,

                        color:
                            "text.primary"
                    }}
                >
                    No Birthdays Today
                </Typography>


                <Typography
                    sx={{
                        mt:
                            0.2,

                        fontSize:
                            "0.67rem",

                        color:
                            "text.secondary"
                    }}
                >
                    No employee birthdays are scheduled for today.
                </Typography>

            </Box>


            <Box
                sx={{
                    display: {
                        xs: "none",

                        sm: "flex"
                    },

                    alignItems:
                        "center",

                    gap:
                        0.5,

                    px:
                        1,

                    py:
                        0.45,

                    borderRadius:
                        2,

                    backgroundColor:
                        "rgba(16, 185, 129, 0.08)"
                }}
            >

                <CheckCircleIcon
                    sx={{
                        fontSize:
                            15,

                        color:
                            "success.main"
                    }}
                />


                <Typography
                    sx={{
                        fontSize:
                            "0.63rem",

                        fontWeight:
                            600,

                        color:
                            "success.main"
                    }}
                >
                    All clear
                </Typography>

            </Box>


            <Typography
                sx={{
                    fontSize:
                        "0.75rem",

                    animation:
                        "emptySparkle 2s ease-in-out infinite",

                    "@keyframes emptySparkle": {

                        "0%, 100%": {

                            opacity:
                                0.25,

                            transform:
                                "scale(0.8)"
                        },

                        "50%": {

                            opacity:
                                1,

                            transform:
                                "scale(1.15)"
                        }
                    }
                }}
            >
                ✨
            </Typography>

        </Box>

    );

}


// ============================================================
// BIRTHDAY CELEBRATION
// ============================================================

function BirthdayCelebration() {

    return (

        <Box
            sx={{
                position:
                    "relative",

                height:
                    128,

                width:
                    "100%",

                borderRadius:
                    2.5,

                overflow:
                    "hidden",

                display:
                    "flex",

                alignItems:
                    "center",

                justifyContent:
                    "center",

                backgroundColor:
                    (theme) =>
                        theme.palette.mode === "dark"
                            ? "rgba(5, 150, 105, 0.06)"
                            : "rgba(5, 150, 105, 0.035)",

                border:
                    "1px solid",

                borderColor:
                    (theme) =>
                        theme.palette.mode === "dark"
                            ? "rgba(52, 211, 153, 0.15)"
                            : "rgba(5, 150, 105, 0.12)"
            }}
        >

            <Box
                sx={{
                    position:
                        "absolute",

                    left:
                        "15%",

                    bottom:
                        -18,

                    width:
                        16,

                    height:
                        22,

                    borderRadius:
                        "50% 50% 45% 45%",

                    backgroundColor:
                        "rgba(37, 99, 235, 0.18)",

                    animation:
                        "birthdayFloatOne 4s ease-in-out infinite",

                    "@keyframes birthdayFloatOne": {

                        "0%": {

                            transform:
                                "translateY(0) rotate(-4deg)"
                        },

                        "50%": {

                            transform:
                                "translateY(-65px) rotate(5deg)"
                        },

                        "100%": {

                            transform:
                                "translateY(-130px) rotate(-4deg)",

                            opacity:
                                0
                        }
                    }
                }}
            />


            <Box
                sx={{
                    position:
                        "absolute",

                    right:
                        "17%",

                    bottom:
                        -18,

                    width:
                        16,

                    height:
                        22,

                    borderRadius:
                        "50% 50% 45% 45%",

                    backgroundColor:
                        "rgba(234, 88, 12, 0.18)",

                    animation:
                        "birthdayFloatTwo 4.5s ease-in-out infinite 0.8s",

                    "@keyframes birthdayFloatTwo": {

                        "0%": {

                            transform:
                                "translateY(0) rotate(4deg)"
                        },

                        "50%": {

                            transform:
                                "translateY(-70px) rotate(-5deg)"
                        },

                        "100%": {

                            transform:
                                "translateY(-135px) rotate(4deg)",

                            opacity:
                                0
                        }
                    }
                }}
            />


            <Box
                sx={{
                    position:
                        "relative",

                    zIndex:
                        3,

                    display:
                        "flex",

                    flexDirection: {
                        xs: "column",

                        sm: "row"
                    },

                    alignItems:
                        "center",

                    justifyContent:
                        "center",

                    gap: {
                        xs: 0.4,

                        sm: 1
                    }
                }}
            >

                <Typography
                    sx={{
                        fontSize:
                            "1.2rem",

                        animation:
                            "birthdayCake 2s ease-in-out infinite",

                        "@keyframes birthdayCake": {

                            "0%, 100%": {

                                transform:
                                    "translateY(0) rotate(-3deg)"
                            },

                            "50%": {

                                transform:
                                    "translateY(-4px) rotate(3deg)"
                            }
                        }
                    }}
                >
                    🎂
                </Typography>


                <Box
                    sx={{
                        textAlign:
                            "center"
                    }}
                >

                    <Box
                        sx={{
                            display:
                                "flex",

                            alignItems:
                                "center",

                            justifyContent:
                                "center",

                            gap:
                                0.7
                        }}
                    >

                        <Typography
                            sx={{
                                fontSize:
                                    "0.92rem",

                                fontWeight:
                                    700,

                                color:
                                    "text.primary"
                            }}
                        >
                            Happy Birthday!
                        </Typography>


                        <Typography
                            sx={{
                                fontSize:
                                    "1rem",

                                animation:
                                    "partyPop 1.8s ease-in-out infinite",

                                "@keyframes partyPop": {

                                    "0%, 100%": {

                                        transform:
                                            "scale(1)"
                                    },

                                    "50%": {

                                        transform:
                                            "scale(1.18) rotate(8deg)"
                                    }
                                }
                            }}
                        >
                            🎉
                        </Typography>

                    </Box>


                    <Typography
                        sx={{
                            mt:
                                0.3,

                            fontSize:
                                "0.68rem",

                            color:
                                "text.secondary"
                        }}
                    >
                        Wishing you a wonderful day!
                    </Typography>

                </Box>


                <Typography
                    sx={{
                        display: {
                            xs: "none",

                            sm: "block"
                        },

                        fontSize:
                            "0.9rem",

                        animation:
                            "sparkle 2s ease-in-out infinite",

                        "@keyframes sparkle": {

                            "0%, 100%": {

                                opacity:
                                    0.25,

                                transform:
                                    "scale(0.8)"
                            },

                            "50%": {

                                opacity:
                                    1,

                                transform:
                                    "scale(1.15)"
                            }
                        }
                    }}
                >
                    ✨
                </Typography>

            </Box>

        </Box>

    );

}


// ============================================================
// BIRTHDAY EMPLOYEE WRAPPER
// ============================================================

function BirthdayEmployeeWrapper({
    employee,
    isActive,
    panelLocked,
    activeDepartment,
    sending,
    onSend,
    onMouseEnter,
    onMouseLeave,
    onClick,
    onBack
}) {

    return (

        <Box
            data-birthday-interactive="true"

            onMouseEnter={
                onMouseEnter
            }

            onMouseLeave={
                onMouseLeave
            }

            sx={{
                position:
                    "relative",

                width:
                    "100%",

                height:
                    128,

                overflow:
                    "visible"
            }}
        >

            <BirthdayEmployee
                employee={
                    employee
                }

                sending={
                    sending
                }

                onSend={
                    onSend
                }

                active={
                    isActive
                }

                onClick={
                    onClick
                }

            />


            {/* =================================================
                DEPARTMENT OVERLAY
            ================================================= */}

            {isActive &&
                activeDepartment && (

                    <DepartmentDetailCard
                        employee={
                            employee
                        }

                        department={
                            activeDepartment
                        }

                        locked={
                            panelLocked
                        }

                        sending={
                            sending
                        }

                        onSend={
                            onSend
                        }

                        onBack={
                            onBack
                        }

                    />

                )}

        </Box>

    );

}


// ============================================================
// BIRTHDAY EMPLOYEE CARD
// ============================================================

function BirthdayEmployee({
    employee,
    sending,
    onSend,
    active,
    onClick
}) {

    return (

        <Paper
            elevation={0}

            onClick={
                onClick
            }

            sx={{
                position:
                    "absolute",

                inset:
                    0,

                zIndex:
                    active
                        ? 1
                        : 2,

                p:
                    1.75,

                height:
                    128,

                boxSizing:
                    "border-box",

                borderRadius:
                    2.5,

                border:
                    "1px solid",

                borderColor:
                    active
                        ? "rgba(5, 150, 105, 0.45)"
                        : "rgba(5, 150, 105, 0.20)",

                backgroundColor:
                    active
                        ? "rgba(5, 150, 105, 0.09)"
                        : "rgba(5, 150, 105, 0.055)",

                backdropFilter:
                    "blur(12px)",

                WebkitBackdropFilter:
                    "blur(12px)",

                cursor:
                    "pointer",

                overflow:
                    "hidden",

                transition:
                    "all 0.22s ease",

                "&:hover": {

                    transform:
                        "translateY(-2px)",

                    borderColor:
                        "rgba(5, 150, 105, 0.42)",

                    backgroundColor:
                        "rgba(5, 150, 105, 0.10)",

                    boxShadow:
                        "0 8px 22px rgba(5, 150, 105, 0.10)"
                },

                "&::after": {

                    content:
                        '""',

                    position:
                        "absolute",

                    width:
                        65,

                    height:
                        65,

                    borderRadius:
                        "50%",

                    backgroundColor:
                        "rgba(5, 150, 105, 0.06)",

                    right:
                        -20,

                    bottom:
                        -20,

                    pointerEvents:
                        "none"
                }
            }}
        >

            <Box
                sx={{
                    position:
                        "relative",

                    zIndex:
                        1
                }}
            >

                {/* =================================================
                    EMPLOYEE HEADER
                ================================================= */}

                <Box
                    sx={{
                        display:
                            "flex",

                        alignItems:
                            "center",

                        gap:
                            1.25
                    }}
                >

                    <Avatar
                        sx={{
                            width:
                                38,

                            height:
                                38,

                            flexShrink:
                                0,

                            backgroundColor:
                                "rgba(234, 88, 12, 0.11)",

                            color:
                                birthdayColors.primary,

                            fontWeight:
                                700,

                            fontSize:
                                "0.85rem"
                        }}
                    >
                        {employee.name
                            ?.charAt(0)
                            ?.toUpperCase()}
                    </Avatar>


                    <Box
                        sx={{
                            minWidth:
                                0
                        }}
                    >

                        <Typography
                            sx={{
                                fontWeight:
                                    700,

                                fontSize:
                                    "0.88rem",

                                color:
                                    "text.primary",

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
                            sx={{
                                color:
                                    "text.secondary",

                                fontSize:
                                    "0.70rem",

                                mt:
                                    0.2
                            }}
                        >
                            {employee.employee_id}
                        </Typography>

                    </Box>

                </Box>


                {/* =================================================
                    EMAIL
                ================================================= */}

                <Typography
                    sx={{
                        mt:
                            1,

                        fontSize:
                            "0.70rem",

                        color:
                            "text.secondary",

                        overflow:
                            "hidden",

                        textOverflow:
                            "ellipsis",

                        whiteSpace:
                            "nowrap"
                    }}
                >
                    {employee.email}
                </Typography>


                {/* =================================================
                    BOTTOM
                ================================================= */}

                <Box
                    sx={{
                        mt:
                            0.8,

                        display:
                            "flex",

                        justifyContent:
                            "space-between",

                        alignItems:
                            "center",

                        gap:
                            1
                    }}
                >

                    <Chip
                        icon={
                            <BusinessIcon
                                sx={{
                                    fontSize:
                                        "15px !important"
                                }}
                            />
                        }

                        label={
                            employee.department ||
                            "No Department"
                        }

                        size="small"

                        sx={{
                            maxWidth:
                                "70%",

                            height:
                                24,

                            color:
                                "#047857",

                            backgroundColor:
                                "rgba(5, 150, 105, 0.08)",

                            border:
                                "1px solid rgba(5, 150, 105, 0.12)",

                            "& .MuiChip-label": {

                                overflow:
                                    "hidden",

                                textOverflow:
                                    "ellipsis",

                                whiteSpace:
                                    "nowrap",

                                fontSize:
                                    "0.66rem"
                            }
                        }}
                    />


                    {/* =================================================
                        SEND STATUS
                    ================================================= */}

                    {employee.wishes_sent ? (

                        <Chip
                            icon={
                                <CheckCircleIcon
                                    sx={{
                                        fontSize:
                                            "15px !important"
                                    }}
                                />
                            }

                            label="Sent"

                            size="small"

                            sx={{
                                height:
                                    24,

                                fontWeight:
                                    700,

                                fontSize:
                                    "0.66rem",

                                color:
                                    "success.main",

                                backgroundColor:
                                    "rgba(16, 185, 129, 0.10)"
                            }}
                        />

                    ) : (

                        <Button
                            variant="contained"

                            size="small"

                            startIcon={
                                sending
                                    ? (
                                        <CircularProgress
                                            size={13}
                                            color="inherit"
                                        />
                                    )
                                    : (
                                        <SendIcon
                                            sx={{
                                                fontSize:
                                                    "15px !important"
                                            }}
                                        />
                                    )
                            }

                            disabled={
                                sending
                            }

                            onClick={(event) => {

                                event.stopPropagation();

                                onSend(
                                    employee
                                );

                            }}

                            sx={{
                                minWidth:
                                    0,

                                px:
                                    1.1,

                                py:
                                    0.45,

                                textTransform:
                                    "none",

                                fontWeight:
                                    700,

                                fontSize:
                                    "0.66rem",

                                borderRadius:
                                    1.5,

                                backgroundColor:
                                    "#059669",

                                "&:hover": {

                                    backgroundColor:
                                        "#047857"
                                }
                            }}
                        >
                            {sending
                                ? "Sending"
                                : "Send Wishes"}
                        </Button>

                    )}

                </Box>

            </Box>

        </Paper>

    );

}


// ============================================================
// DEPARTMENT DETAIL OVERLAY
// ============================================================

function DepartmentDetailCard({
    employee,
    department,
    locked,
    sending,
    onSend,
    onBack
}) {

    const config =
        getDepartmentConfig(
            department.department
        );


    return (

        <Paper
            elevation={0}

            data-birthday-interactive="true"

            sx={{
                position:
                    "absolute",

                inset:
                    0,

                zIndex:
                    20,

                width:
                    "100%",

                height:
                    128,

                boxSizing:
                    "border-box",

                p:
                    1.4,

                borderRadius:
                    2.5,

                border:
                    "1px solid",

                borderColor:
                    `${config.color}55`,

                /*
                 * Opaque background so the birthday
                 * card underneath is not visible.
                 */

                backgroundColor:
                    (theme) =>
                        theme.palette.mode === "dark"
                            ? "rgba(15, 23, 42, 0.985)"
                            : "rgba(255, 255, 255, 0.985)",

                backdropFilter:
                    "blur(22px)",

                WebkitBackdropFilter:
                    "blur(22px)",

                boxShadow:
                    "0 12px 30px rgba(15, 23, 42, 0.18)",

                overflow:
                    "hidden",

                animation:
                    "birthdayDepartmentIn 0.16s ease",

                "@keyframes birthdayDepartmentIn": {

                    from: {

                        opacity:
                            0,

                        transform:
                            "scale(0.97)"
                    },

                    to: {

                        opacity:
                            1,

                        transform:
                            "scale(1)"
                    }
                },

                "&::before": {

                    content:
                        '""',

                    position:
                        "absolute",

                    top:
                        0,

                    left:
                        0,

                    width:
                        "100%",

                    height:
                        3,

                    background:
                        `linear-gradient(
                            90deg,
                            ${config.color},
                            transparent
                        )`
                }
            }}
        >

            <Box
                sx={{
                    position:
                        "relative",

                    zIndex:
                        1,

                    height:
                        "100%",

                    display:
                        "flex",

                    flexDirection:
                        "column"
                }}
            >

                {/* =================================================
                    HEADER
                ================================================= */}

                <Box
                    sx={{
                        display:
                            "flex",

                        alignItems:
                            "center",

                        justifyContent:
                            "space-between",

                        gap:
                            1,

                        mb:
                            0.7
                    }}
                >

                    <Box
                        sx={{
                            display:
                                "flex",

                            alignItems:
                                "center",

                            gap:
                                0.8,

                            minWidth:
                                0
                        }}
                    >

                        <PeopleIcon
                            sx={{
                                fontSize:
                                    18,

                                color:
                                    config.color,

                                flexShrink:
                                    0
                            }}
                        />


                        <Typography
                            sx={{
                                fontSize:
                                    "0.82rem",

                                fontWeight:
                                    700,

                                color:
                                    "text.primary",

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

                    </Box>


                    {locked && (

                        <Button
                            size="small"

                            startIcon={
                                <ArrowBackIcon
                                    sx={{
                                        fontSize:
                                            "14px !important"
                                    }}
                                />
                            }

                            onClick={(event) => {

                                event.stopPropagation();

                                onBack();

                            }}

                            sx={{
                                minWidth:
                                    "auto",

                                px:
                                    0.8,

                                py:
                                    0.25,

                                borderRadius:
                                    1.2,

                                color:
                                    "text.secondary",

                                fontSize:
                                    "0.63rem",

                                fontWeight:
                                    600,

                                textTransform:
                                    "none",

                                "&:hover": {

                                    color:
                                        "primary.main",

                                    backgroundColor:
                                        "rgba(37, 99, 235, 0.08)"
                                }
                            }}
                        >
                            Back
                        </Button>

                    )}

                </Box>


                <Divider
                    sx={{
                        mb:
                            0.7
                    }}
                />


                {/* =================================================
                    DETAILS
                ================================================= */}

                <Box
                    sx={{
                        display:
                            "grid",

                        gridTemplateColumns:
                            "1.25fr 1fr 1fr 1fr",

                        gap:
                            0.65
                    }}
                >

                    <CompactDepartmentInfo
                        label="Birthday"
                        value={
                            employee.name
                        }
                        color={
                            birthdayColors.primary
                        }
                    />


                    <CompactDepartmentInfo
                        label="People"
                        value={
                            department.announcement_recipients
                        }
                        color={
                            "#2563EB"
                        }
                    />


                    <CompactDepartmentInfo
                        label="Sent"
                        value={
                            department.sent
                        }
                        color={
                            "#059669"
                        }
                    />


                    <CompactDepartmentInfo
                        label="Failed"
                        value={
                            department.failed
                        }
                        color={
                            "#DC2626"
                        }
                    />

                </Box>


                {/* =================================================
                    BOTTOM ACTION AREA
                ================================================= */}

                <Box
                    sx={{
                        mt:
                            "auto",

                        display:
                            "flex",

                        alignItems:
                            "center",

                        justifyContent:
                            "space-between",

                        gap:
                            1
                    }}
                >

                    {/* STATUS */}

                    <DepartmentStatusChip
                        status={
                            department.status
                        }
                    />


                    {/* =================================================
                        SEND WISHES
                    ================================================= */}

                    {employee.wishes_sent ? (

                        <Chip
                            icon={
                                <CheckCircleIcon
                                    sx={{
                                        fontSize:
                                            "15px !important"
                                    }}
                                />
                            }

                            label="Sent"

                            size="small"

                            sx={{
                                height:
                                    24,

                                fontWeight:
                                    700,

                                fontSize:
                                    "0.66rem",

                                color:
                                    "success.main",

                                backgroundColor:
                                    "rgba(16, 185, 129, 0.10)"
                            }}
                        />

                    ) : (

                        <Button
                            variant="contained"

                            size="small"

                            startIcon={
                                sending
                                    ? (
                                        <CircularProgress
                                            size={13}
                                            color="inherit"
                                        />
                                    )
                                    : (
                                        <SendIcon
                                            sx={{
                                                fontSize:
                                                    "15px !important"
                                            }}
                                        />
                                    )
                            }

                            disabled={
                                sending
                            }

                            onClick={(event) => {

                                event.stopPropagation();

                                onSend(
                                    employee
                                );

                            }}

                            sx={{
                                minWidth:
                                    0,

                                px:
                                    1.1,

                                py:
                                    0.45,

                                borderRadius:
                                    1.5,

                                textTransform:
                                    "none",

                                fontWeight:
                                    700,

                                fontSize:
                                    "0.66rem",

                                backgroundColor:
                                    "#059669",

                                "&:hover": {

                                    backgroundColor:
                                        "#047857"
                                }
                            }}
                        >
                            {sending
                                ? "Sending"
                                : "Send Wishes"}
                        </Button>

                    )}

                </Box>

            </Box>

        </Paper>

    );

}


// ============================================================
// COMPACT DEPARTMENT INFO
// ============================================================

function CompactDepartmentInfo({
    label,
    value,
    color
}) {

    return (

        <Box
            sx={{
                minWidth:
                    0,

                px:
                    0.75,

                py:
                    0.45,

                borderRadius:
                    1.2,

                backgroundColor:
                    `${color}08`,

                border:
                    `1px solid ${color}12`
            }}
        >

            <Typography
                sx={{
                    fontSize:
                        "0.56rem",

                    color:
                        "text.secondary",

                    lineHeight:
                        1.1,

                    mb:
                        0.2
                }}
            >
                {label}
            </Typography>


            <Typography
                sx={{
                    fontSize:
                        "0.64rem",

                    fontWeight:
                        700,

                    color:
                        "text.primary",

                    overflow:
                        "hidden",

                    textOverflow:
                        "ellipsis",

                    whiteSpace:
                        "nowrap"
                }}
            >
                {value}
            </Typography>

        </Box>

    );

}


// ============================================================
// DEPARTMENT STATUS
// ============================================================

function DepartmentStatusChip({
    status
}) {

    return (

        <Chip
            label={
                status
            }

            size="small"

            sx={{
                height:
                    20,

                fontSize:
                    "0.58rem",

                fontWeight:
                    700,

                color:
                    (theme) =>
                        statusStyle(
                            status,
                            theme.palette.mode
                        ).color,

                backgroundColor:
                    (theme) =>
                        statusStyle(
                            status,
                            theme.palette.mode
                        ).background
            }}
        />

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
                p:
                    1.75,

                borderRadius:
                    2.5,

                border:
                    "1px solid",

                borderColor:
                    "divider",

                backgroundColor:
                    "rgba(37, 99, 235, 0.05)"
            }}
        >

            <Grid
                container
                spacing={1.5}
            >

                <JobStat
                    title="Job ID"

                    value={
                        `#${job.id}`
                    }
                />


                <JobStat
                    title="Total"

                    value={
                        job.total
                    }
                />


                <JobStat
                    title="Sent"

                    value={
                        job.sent
                    }
                />


                <JobStat
                    title="Failed"

                    value={
                        job.failed
                    }

                    color={
                        "#DC2626"
                    }
                />

            </Grid>


            <Divider
                sx={{
                    my:
                        1.5
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

                size="small"

                sx={{
                    height:
                        26,

                    fontWeight:
                        700,

                    color:
                        style.color,

                    backgroundColor:
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
    color = "text.primary"
}) {

    return (

        <Grid
            size={{
                xs: 6,

                sm: 3
            }}
        >

            <Typography
                sx={{
                    fontSize:
                        "0.65rem",

                    color:
                        "text.secondary"
                }}
            >
                {title}
            </Typography>


            <Typography
                sx={{
                    fontSize:
                        "1.15rem",

                    fontWeight:
                        700,

                    color
                }}
            >
                {value}
            </Typography>

        </Grid>

    );

}


export default BirthdayStatus;