import { useEffect, useState } from "react";

import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";

import axios from "axios";


function BirthdayStatus() {

    const [data, setData] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);


    // ============================================================
    // GET BIRTHDAY STATUS
    // ============================================================

    const loadBirthdayStatus = async () => {

        try {

            setLoading(true);

            setError(null);

            const response = await axios.get(
                "http://127.0.0.1:5000/api/v1/birthday-status"
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


    // ============================================================
    // LOAD WHEN COMPONENT OPENS
    // ============================================================

    useEffect(() => {

        loadBirthdayStatus();

    }, []);


    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {

        return (

            <Paper
                sx={{
                    p: 3,
                    textAlign: "center"
                }}
            >

                <CircularProgress />

                <Typography
                    sx={{ mt: 2 }}
                >
                    Loading birthday status...
                </Typography>

            </Paper>

        );

    }


    // ============================================================
    // ERROR
    // ============================================================

    if (error) {

        return (

            <Paper sx={{ p: 3 }}>

                <Alert severity="error">
                    {error}
                </Alert>

            </Paper>

        );

    }


    // ============================================================
    // NO DATA
    // ============================================================

    if (!data) {

        return (

            <Paper sx={{ p: 3 }}>

                <Typography>
                    No birthday information available.
                </Typography>

            </Paper>

        );

    }


    return (

        <Paper
            sx={{
                p: 3,
                mt: 3
            }}
        >

            {/* ================================================== */}
            {/* HEADER */}
            {/* ================================================== */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2
                }}
            >

                <Typography
                    variant="h5"
                    fontWeight="bold"
                >
                    🎂 Birthday Status
                </Typography>

                <Chip
                    label={data.date}
                    variant="outlined"
                />

            </Box>


            <Divider sx={{ mb: 3 }} />


            {/* ================================================== */}
            {/* TODAY'S BIRTHDAYS */}
            {/* ================================================== */}

            <Typography
                variant="h6"
                sx={{ mb: 2 }}
            >
                Today's Birthdays
            </Typography>


            {data.total_birthdays === 0 ? (

                <Alert severity="info">
                    No birthdays today.
                </Alert>

            ) : (

                <Grid
                    container
                    spacing={2}
                    sx={{ mb: 4 }}
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

                                <Paper
                                    variant="outlined"
                                    sx={{
                                        p: 2
                                    }}
                                >

                                    <Typography
                                        variant="h6"
                                    >
                                        🎉 {employee.name}
                                    </Typography>

                                    <Typography
                                        color="text.secondary"
                                    >
                                        {employee.employee_id}
                                    </Typography>

                                    <Typography
                                        sx={{ mt: 1 }}
                                    >
                                        {employee.email}
                                    </Typography>

                                    <Chip
                                        label={
                                            employee.department
                                        }
                                        size="small"
                                        sx={{
                                            mt: 1
                                        }}
                                    />

                                </Paper>

                            </Grid>

                        )
                    )}

                </Grid>

            )}


            {/* ================================================== */}
            {/* DEPARTMENT STATUS */}
            {/* ================================================== */}

            <Typography
                variant="h6"
                sx={{ mb: 2 }}
            >
                Department Status
            </Typography>


            <Grid
                container
                spacing={2}
            >

                {data.departments.map(
                    (department) => (

                        <Grid
                            key={department.department}
                            size={{
                                xs: 12,
                                md: 6
                            }}
                        >

                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 2
                                }}
                            >

                                {/* Department Header */}

                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent:
                                            "space-between",
                                        alignItems:
                                            "center",
                                        mb: 2
                                    }}
                                >

                                    <Typography
                                        variant="h6"
                                        fontWeight="bold"
                                    >
                                        {department.department}
                                    </Typography>


                                    <Chip
                                        label={
                                            department.status
                                        }
                                        color={
                                            department.status ===
                                            "SUCCESS"
                                                ? "success"
                                                : department.status ===
                                                  "PARTIAL"
                                                ? "warning"
                                                : department.status ===
                                                  "FAILED"
                                                ? "error"
                                                : "default"
                                        }
                                        size="small"
                                    />

                                </Box>


                                <Divider
                                    sx={{ mb: 2 }}
                                />


                                {/* Birthday Count */}

                                <Box sx={{ mb: 1 }}>

                                    <Typography>
                                        🎂 Birthdays:{" "}
                                        <strong>
                                            {
                                                department
                                                    .birthday_count
                                            }
                                        </strong>
                                    </Typography>

                                </Box>


                                {/* Recipients */}

                                <Box sx={{ mb: 1 }}>

                                    <Typography>
                                        👥 Recipients:{" "}
                                        <strong>
                                            {
                                                department
                                                    .announcement_recipients
                                            }
                                        </strong>
                                    </Typography>

                                </Box>


                                {/* Sent */}

                                <Box sx={{ mb: 1 }}>

                                    <Typography>
                                        ✅ Sent:{" "}
                                        <strong>
                                            {
                                                department.sent
                                            }
                                        </strong>
                                    </Typography>

                                </Box>


                                {/* Failed */}

                                <Box>

                                    <Typography>
                                        ❌ Failed:{" "}
                                        <strong>
                                            {
                                                department.failed
                                            }
                                        </strong>
                                    </Typography>

                                </Box>


                                {/* Birthday Employees */}

                                {department.birthdays &&
                                    department.birthdays
                                        .length > 0 && (

                                    <Box
                                        sx={{
                                            mt: 2
                                        }}
                                    >

                                        <Typography
                                            variant="subtitle2"
                                            sx={{
                                                mb: 1
                                            }}
                                        >
                                            Birthday Employee
                                        </Typography>


                                        {department.birthdays.map(
                                            (employee) => (

                                                <Typography
                                                    key={
                                                        employee.id
                                                    }
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    🎉{" "}
                                                    {
                                                        employee.name
                                                    }
                                                </Typography>

                                            )
                                        )}

                                    </Box>

                                )}

                            </Paper>

                        </Grid>

                    )
                )}

            </Grid>


            {/* ================================================== */}
            {/* JOB STATUS */}
            {/* ================================================== */}

            {data.job && (

                <Box sx={{ mt: 4 }}>

                    <Typography
                        variant="h6"
                        sx={{ mb: 2 }}
                    >
                        Birthday Job
                    </Typography>


                    <Paper
                        variant="outlined"
                        sx={{ p: 2 }}
                    >

                        <Grid
                            container
                            spacing={2}
                        >

                            <Grid
                                size={{
                                    xs: 12,
                                    sm: 6,
                                    md: 3
                                }}
                            >

                                <Typography
                                    color="text.secondary"
                                >
                                    Job ID
                                </Typography>

                                <Typography
                                    fontWeight="bold"
                                >
                                    #{data.job.id}
                                </Typography>

                            </Grid>


                            <Grid
                                size={{
                                    xs: 12,
                                    sm: 6,
                                    md: 3
                                }}
                            >

                                <Typography
                                    color="text.secondary"
                                >
                                    Total
                                </Typography>

                                <Typography
                                    fontWeight="bold"
                                >
                                    {data.job.total}
                                </Typography>

                            </Grid>


                            <Grid
                                size={{
                                    xs: 12,
                                    sm: 6,
                                    md: 3
                                }}
                            >

                                <Typography
                                    color="text.secondary"
                                >
                                    Sent
                                </Typography>

                                <Typography
                                    fontWeight="bold"
                                >
                                    {data.job.sent}
                                </Typography>

                            </Grid>


                            <Grid
                                size={{
                                    xs: 12,
                                    sm: 6,
                                    md: 3
                                }}
                            >

                                <Typography
                                    color="text.secondary"
                                >
                                    Failed
                                </Typography>

                                <Typography
                                    fontWeight="bold"
                                >
                                    {data.job.failed}
                                </Typography>

                            </Grid>

                        </Grid>


                        <Box sx={{ mt: 2 }}>

                            <Chip
                                label={data.job.status}
                                color={
                                    data.job.status ===
                                    "SUCCESS"
                                        ? "success"
                                        : "error"
                                }
                            />

                        </Box>

                    </Paper>

                </Box>

            )}

        </Paper>

    );

}


export default BirthdayStatus;