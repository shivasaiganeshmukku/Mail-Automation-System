import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

function DashboardCard({ title, value }) {

    return (
        <Card
            sx={{
                height: "100%"
            }}
        >
            <CardContent>

                <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                >
                    {title}
                </Typography>

                <Typography variant="h3">
                    {value}
                </Typography>

            </CardContent>
        </Card>
    );
}

export default DashboardCard;