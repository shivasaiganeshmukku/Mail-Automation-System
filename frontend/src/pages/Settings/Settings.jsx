import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

function Settings() {
    return (
        <Box>
            <Typography
                variant="h4"
                sx={{
                    fontWeight: 700,
                    color: "#1E293B",
                    mb: 1
                }}
            >
                Settings
            </Typography>

            <Typography
                sx={{
                    color: "#64748B",
                    mb: 3
                }}
            >
                Manage your Mail Automation System settings.
            </Typography>

            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    borderRadius: 3,
                    border: "1px solid #E2E8F0",
                    backgroundColor: "#FFFFFF"
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        mb: 2
                    }}
                >
                    General Settings
                </Typography>

                <Divider sx={{ mb: 2 }} />

                <Typography color="text.secondary">
                    Settings options will be added here.
                </Typography>
            </Paper>
        </Box>
    );
}

export default Settings;