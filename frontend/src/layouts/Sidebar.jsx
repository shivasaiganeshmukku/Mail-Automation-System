import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";


import { Link } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import EmailIcon from "@mui/icons-material/Email";
import SendIcon from "@mui/icons-material/Send";
import HistoryIcon from "@mui/icons-material/History";


const drawerWidth = 240;

function Sidebar() {
    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: drawerWidth,
                    boxSizing: "border-box"
                }
            }}
        >
            <Toolbar />

            <List>

                <ListItem disablePadding>
                    <ListItemButton  component={Link} to="/">
                        <ListItemIcon>
                            <DashboardIcon />
                        </ListItemIcon>

                        <ListItemText primary="Dashboard" />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/employees">
                        <ListItemIcon>
                            <PeopleIcon />
                        </ListItemIcon>

                        <ListItemText primary="Employees" />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton
                        component={Link}
                        to="/email-templates"
                    >
                        <ListItemIcon>
                            <EmailIcon />
                        </ListItemIcon>

                        <ListItemText primary="Email Templates" />
                    </ListItemButton>
                </ListItem>


                <ListItem disablePadding>
                    <ListItemButton
                        component={Link}
                        to="/send-email"
                    >
                        <ListItemIcon>
                            <SendIcon />
                        </ListItemIcon>

                        <ListItemText primary="Send Email" />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton
                        component={Link}
                        to="/email-logs"
                    >
                        <ListItemIcon>
                            <HistoryIcon />
                        </ListItemIcon>

                        <ListItemText primary="Email Logs" />
                    </ListItemButton>
                </ListItem>

            </List>

        </Drawer>
    );
}

export default Sidebar;