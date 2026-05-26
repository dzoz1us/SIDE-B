import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { Role } from "../types";
import { useAuth } from "./AuthContext";
import { getEnsembles } from "../services/ensembles";
import { getRecords, getTopSellers } from "../services/records";
import { getBranches } from "../services/branches";
import { getMyReservations } from "../services/reservations";

interface AppContextType {
  role: Role;
  setRole: (r: Role) => void;
  page: string;
  params: Record<string, any>;
  navigate: (page: string, params?: Record<string, any>) => void;
  currentUser: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    status: string;
    is_active: boolean;
  } | null;

  ensembles: any[];
  records: any[];
  branches: any[];
  bookings: any[];
  topRecords: any[];

  refreshEnsembles: () => void;
  refreshRecords: () => void;
  refreshBookings: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { user, handleLogout } = useAuth();
  const [role, setRoleState] = useState<Role>("guest");
  const [page, setPage] = useState("home");
  const [params, setParams] = useState<Record<string, any>>({});

  const [ensembles, setEnsembles] = useState<any[]>([]);
  const [records, setRecords] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [topRecords, setTopRecords] = useState<any[]>([]);

  // currentUser из AuthContext
  const currentUser = user ? {
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    role: user.role,
    status: user.is_active ? "active" : "blocked",
    is_active: user.is_active,
  } : null;

  useEffect(() => {
    getEnsembles().then(setEnsembles).catch(console.error);
    getRecords().then(setRecords).catch(console.error);
    getBranches().then(setBranches).catch(console.error);
    getTopSellers().then(setTopRecords).catch(console.error);
  }, []);

  useEffect(() => {
    if (user) {
      getMyReservations().then(setBookings).catch(console.error);
    } else {
      setBookings([]);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      setRoleState(user.role as Role);
    } else {
      setRoleState("guest");
    }
  }, [user]);

  function setRole(r: Role) {
    if (r === "guest") {
      handleLogout();
      setPage("home");
      setParams({});
    }
  }

  function navigate(newPage: string, newParams: Record<string, any> = {}) {
    setPage(newPage);
    setParams(newParams);
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 0);
  }

  const refreshEnsembles = useCallback(() => {
    getEnsembles().then(setEnsembles).catch(console.error);
  }, []);

  const refreshRecords = useCallback(() => {
    getRecords().then(setRecords).catch(console.error);
    getTopSellers().then(setTopRecords).catch(console.error);
  }, []);

  const refreshBookings = useCallback(() => {
    if (user) {
      getMyReservations().then(setBookings).catch(console.error);
    }
  }, [user]);

  return (
    <AppContext.Provider value={{
      role, setRole, page, params, navigate, currentUser,
      ensembles, records, branches, bookings, topRecords,
      refreshEnsembles, refreshRecords, refreshBookings,
    }}>
      {children}
    </AppContext.Provider>
  );
}