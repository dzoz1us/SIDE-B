import React from "react";
import { AppProvider, useApp } from "../context/AppContext";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

// Guest pages
import HomePage from "../pages/guest/HomePage";
import EnsemblesPage from "../pages/guest/EnsemblesPage";
import EnsemblePage from "../pages/guest/EnsemblePage";
import MusicianPage from "../pages/guest/MusicianPage";
import RecordsPage from "../pages/guest/RecordsPage";
import RecordPage from "../pages/guest/RecordPage";
import BestsellersPage from "../pages/guest/BestsellersPage";
import BranchesPage from "../pages/guest/BranchesPage";
import LoginPage from "../pages/guest/LoginPage";
import RegisterPage from "../pages/guest/RegisterPage";

// User pages
import MyBookingsPage from "../pages/user/MyBookingsPage";

// Manager pages
import ManagerDashboard from "../pages/manager/ManagerDashboard";
import ManagerRecords from "../pages/manager/ManagerRecords";
import ManagerRecordForm from "../pages/manager/ManagerRecordForm";
import ManagerActiveBookings from "../pages/manager/ManagerActiveBookings";
import ManagerBookingHistory from "../pages/manager/ManagerBookingHistory";
import ManagerStatistics from "../pages/manager/ManagerStatistics";
import ManagerWarehouse from "../pages/manager/ManagerWarehouse";
import ManagerOfflineSale from "../pages/manager/ManagerOfflineSale";

// Admin pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminEnsembles from "../pages/admin/AdminEnsembles";
import AdminEnsembleForm from "../pages/admin/AdminEnsembleForm";
import AdminEnsembleMembers from "../pages/admin/AdminEnsembleMembers";
import AdminMusicians from "../pages/admin/AdminMusicians";
import AdminMusicianForm from "../pages/admin/AdminMusicianForm";
import AdminCompositions from "../pages/admin/AdminCompositions";
import AdminTracklist from "../pages/admin/AdminTracklist";
import AdminBranches from "../pages/admin/AdminBranches";
import AdminBranchForm from "../pages/admin/AdminBranchForm";
import AdminManagers from "../pages/admin/AdminManagers";
import AdminManagerForm from "../pages/admin/AdminManagerForm";
import AdminLogs from "../pages/admin/AdminLogs";

// Error pages
import NotFound from "../pages/NotFound";
import Forbidden from "../pages/Forbidden";

type Role = "guest" | "customer" | "manager" | "admin";

const ROLE_LEVEL: Record<Role, number> = {
  guest: 0,
  customer: 1,
  manager: 2,
  admin: 3,
};

function requireRole(minRole: Role, currentRole: Role): boolean {
  return ROLE_LEVEL[currentRole] >= ROLE_LEVEL[minRole];
}

function Router() {
  const { page, role, currentUser } = useApp();

  function guard(minRole: Role, component: React.ReactElement): React.ReactElement {
    if (!requireRole(minRole, role)) return <Forbidden />;
    if ((minRole === "manager" || minRole === "admin") && currentUser && !currentUser.is_active){
      return <Forbidden />;
    }
    return component;
  }

  switch (page) {
    // Public pages
    case "home":          return <HomePage />;
    case "ensembles":     return <EnsemblesPage />;
    case "ensemble":      return <EnsemblePage />;
    case "musician":      return <MusicianPage />;
    case "records":       return <RecordsPage />;
    case "record":        return <RecordPage />;
    case "bestsellers":   return <BestsellersPage />;
    case "branches":      return <BranchesPage />;
    case "login":         return <LoginPage />;
    case "register":      return <RegisterPage />;

    // User pages
    case "my-bookings":   return guard("customer", <MyBookingsPage />);

    // Manager pages
    case "manager":                   return guard("manager", <ManagerDashboard />);
    case "manager-records":           return guard("manager", <ManagerRecords />);
    case "manager-record-form":       return guard("manager", <ManagerRecordForm />);
    case "manager-active-bookings":   return guard("manager", <ManagerActiveBookings />);
    case "manager-booking-history":   return guard("manager", <ManagerBookingHistory />);
    case "manager-statistics":        return guard("manager", <ManagerStatistics />);
    case "manager-warehouse":         return guard("manager", <ManagerWarehouse />);
    case "manager-offline-sale":      return guard("manager", <ManagerOfflineSale />);

    // Admin pages
    case "admin":                     return guard("admin", <AdminDashboard />);
    case "admin-ensembles":           return guard("admin", <AdminEnsembles />);
    case "admin-ensemble-form":       return guard("admin", <AdminEnsembleForm />);
    case "admin-ensemble-members":    return guard("admin", <AdminEnsembleMembers />);
    case "admin-musicians":           return guard("admin", <AdminMusicians />);
    case "admin-musician-form":       return guard("admin", <AdminMusicianForm />);
    case "admin-compositions":        return guard("admin", <AdminCompositions />);
    case "admin-tracklist":           return guard("admin", <AdminTracklist />);
    case "admin-branches":            return guard("admin", <AdminBranches />);
    case "admin-branch-form":         return guard("admin", <AdminBranchForm />);
    case "admin-managers":            return guard("admin", <AdminManagers />);
    case "admin-manager-form":        return guard("admin", <AdminManagerForm />);
    case "admin-logs":                return guard("admin", <AdminLogs />);

    default: return <NotFound />;
  }
}

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1">
          <Router />
        </main>
        <Footer />
      </div>
    </AppProvider>
  );
}
