import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Dashboard from "./pages/Dashboard/Dashboard";
import Employees from "./pages/Employees/Employees";
import EmailTemplates from "./pages/EmailTemplates/EmailTemplates";
import SendEmail from "./pages/SendEmail/SendEmail";
import EmailLogs from "./pages/EmailLogs/EmailLogs";



function App() {
    return (
        <BrowserRouter>

            <Routes>

                <Route path="/" element={<MainLayout />}>

                    <Route
                        index
                        element={<Dashboard />}
                    />

                    <Route
                        path="employees"
                        element={<Employees />}
                    />

                    <Route
                        path="email-templates"
                        element={<EmailTemplates />}
                    />

                    <Route
                        path="send-email"
                        element={<SendEmail />}
                    />

                    <Route
                        path="email-logs"
                        element={<EmailLogs />}
                    />

                </Route>

            </Routes>

        </BrowserRouter>
    );
}

export default App;