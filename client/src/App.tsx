import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import CheckSkinLq from "./pages/CheckSkinLq/CheckSkinLq";
import CheckInfoGarena from "./pages/CheckInfoGarena/CheckInfoGarena";
import TableDataSkinLq from "./components/tables/BasicTables/TableDataSkinLq";
import GhepAnhLienQuan from "./pages/GhepAnhLienQuan/GhepAnhLienQuan";
import SpamGarena from "./pages/SpamGarena/SpamGarena";
import UserTable from "./pages/UserTable/UserTable";
import AuthRoute from "./router/AuthRoute.tsx"

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>

            {/* Route chính */}
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<AuthRoute><SignIn /></AuthRoute>} />
            <Route path="/signup" element={<AuthRoute><SignUp /></AuthRoute>} />
            {/* Route con */}

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tool liên quân */}
            <Route path="/check-thong-tin-garena" element={<CheckInfoGarena />} />
            <Route path="/check-skin-lien-quan" element={<CheckSkinLq />} />
            <Route path="/ghep-anh-lien-quan" element={<GhepAnhLienQuan />} />
            <Route path="/spam-acc-garena" element={<SpamGarena />} />
            <Route path="/data-skin" element={<TableDataSkinLq />} />
            <Route path="/basic-tables" element={<BasicTables />} />

            <Route path="/get-all-user" element={<UserTable />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>

           {/* Layout riêng cho admin */}
        {/* <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/reports" element={<AdminReports />} />
          </Route>
        </Route> */}


          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
