import { useEffect, useState } from "react";

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";

import DashboardService from "../../services/dashboardService";
import DashboardCard from "../../components/DashboardCard";
import EmailLogService from "../../services/emailLogService";
import BirthdayStatus from "../../components/BirthdayStatus";


function Dashboard() {

    const [summary, setSummary] = useState(null);
    const [recentLogs, setRecentLogs] = useState([]);


    useEffect(() => {

        DashboardService.getSummary()
            .then((response) => {

                setSummary(
                    response.data.data
                );

            })
            .catch((error) => {

                console.error(
                    "GET DASHBOARD SUMMARY ERROR:",
                    error
                );

            });


        EmailLogService.getAllLogs()
            .then((response) => {

                setRecentLogs(
                    response.data.data.slice(0, 5)
                );

            })
            .catch((error) => {

                console.error(
                    "GET RECENT EMAIL LOGS ERROR:",
                    error
                );

            });

    }, []);


    if (!summary) {

        return (
            <h2>
                Loading...
            </h2>
        );

    }


    return (

        <Grid
            container
            spacing={3}
        >

            {/* ================================= */}
            {/* TOTAL EMPLOYEES */}
            {/* ================================= */}

            <Grid
                size={{
                    xs: 12,
                    md: 6,
                    lg: 3
                }}
            >

                <DashboardCard
                    title="Total Employees"
                    value={
                        summary.total_employees
                    }
                />

            </Grid>


            {/* ================================= */}
            {/* TOTAL TEMPLATES */}
            {/* ================================= */}

            <Grid
                size={{
                    xs: 12,
                    md: 6,
                    lg: 3
                }}
            >

                <DashboardCard
                    title="Total Templates"
                    value={
                        summary.total_templates
                    }
                />

            </Grid>


            {/* ================================= */}
            {/* EMAILS SENT */}
            {/* ================================= */}

            <Grid
                size={{
                    xs: 12,
                    md: 6,
                    lg: 3
                }}
            >

                <DashboardCard
                    title="Emails Sent"
                    value={
                        summary.emails_sent
                    }
                />

            </Grid>


            {/* ================================= */}
            {/* FAILED EMAILS */}
            {/* ================================= */}

            <Grid
                size={{
                    xs: 12,
                    md: 6,
                    lg: 3
                }}
            >

                <DashboardCard
                    title="Failed Emails"
                    value={
                        summary.emails_failed
                    }
                />

            </Grid>


            {/* ================================= */}
            {/* BIRTHDAY STATUS */}
            {/* ================================= */}

            <Grid
                size={{
                    xs: 12
                }}
            >

                <BirthdayStatus />

            </Grid>


            {/* ================================= */}
            {/* RECENT EMAIL ACTIVITY */}
            {/* ================================= */}

            <Grid
                size={{
                    xs: 12
                }}
            >

                <Typography
                    variant="h5"
                    sx={{
                        mb: 2
                    }}
                >
                    Recent Email Activity
                </Typography>


                <TableContainer
                    component={Paper}
                >

                    <Table>

                        <TableHead>

                            <TableRow>

                                <TableCell>
                                    Employee
                                </TableCell>

                                <TableCell>
                                    Template
                                </TableCell>

                                <TableCell>
                                    Recipient
                                </TableCell>

                                <TableCell>
                                    Status
                                </TableCell>

                                <TableCell>
                                    Sent At
                                </TableCell>

                            </TableRow>

                        </TableHead>


                        <TableBody>

                            {recentLogs.map(
                                (log) => (

                                    <TableRow
                                        key={log.id}
                                    >

                                        <TableCell>
                                            {
                                                log.employee_id
                                            }
                                        </TableCell>


                                        <TableCell>
                                            {
                                                log.template_id
                                            }
                                        </TableCell>


                                        <TableCell>
                                            {
                                                log.recipient_email
                                            }
                                        </TableCell>


                                        <TableCell>

                                            <Chip
                                                label={
                                                    log.status
                                                }
                                                color={
                                                    log.status ===
                                                    "SUCCESS"
                                                        ? "success"
                                                        : "error"
                                                }
                                                size="small"
                                            />

                                        </TableCell>


                                        <TableCell>

                                            {new Date(
                                                log.sent_at
                                            ).toLocaleString()}

                                        </TableCell>

                                    </TableRow>

                                )
                            )}

                        </TableBody>

                    </Table>

                </TableContainer>

            </Grid>
            
            

        </Grid>

    );

}


export default Dashboard;