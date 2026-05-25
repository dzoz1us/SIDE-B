import React, { createContext, useContext, useState } from "react";
import type { Role, Ensemble, Musician, EnsembleMember, Composition, Track, Branch, VinylRecord, RecordBranch, AppUser, Booking, ActionLog } from "../types";
import {
  INIT_ENSEMBLES, INIT_MUSICIANS, INIT_MEMBERS, INIT_COMPOSITIONS,
  INIT_TRACKS, INIT_BRANCHES, INIT_RECORDS, INIT_RECORD_BRANCHES,
  INIT_USERS, INIT_BOOKINGS, INIT_LOGS,
} from "../data/mockData";

interface AppContextType {
  role: Role;
  setRole: (r: Role) => void;
  page: string;
  params: Record<string, any>;
  navigate: (page: string, params?: Record<string, any>) => void;
  currentUser: AppUser | null;

  ensembles: Ensemble[];
  setEnsembles: React.Dispatch<React.SetStateAction<Ensemble[]>>;
  musicians: Musician[];
  setMusicians: React.Dispatch<React.SetStateAction<Musician[]>>;
  members: EnsembleMember[];
  setMembers: React.Dispatch<React.SetStateAction<EnsembleMember[]>>;
  compositions: Composition[];
  setCompositions: React.Dispatch<React.SetStateAction<Composition[]>>;
  tracks: Track[];
  setTracks: React.Dispatch<React.SetStateAction<Track[]>>;
  branches: Branch[];
  setBranches: React.Dispatch<React.SetStateAction<Branch[]>>;
  records: VinylRecord[];
  setRecords: React.Dispatch<React.SetStateAction<VinylRecord[]>>;
  recordBranches: RecordBranch[];
  setRecordBranches: React.Dispatch<React.SetStateAction<RecordBranch[]>>;
  users: AppUser[];
  setUsers: React.Dispatch<React.SetStateAction<AppUser[]>>;
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  actionLogs: ActionLog[];
  setActionLogs: React.Dispatch<React.SetStateAction<ActionLog[]>>;
}

const AppContext = createContext<AppContextType | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role>("guest");
  const [page, setPage] = useState("home");
  const [params, setParams] = useState<Record<string, any>>({});

  const [ensembles, setEnsembles] = useState(INIT_ENSEMBLES);
  const [musicians, setMusicians] = useState(INIT_MUSICIANS);
  const [members, setMembers] = useState(INIT_MEMBERS);
  const [compositions, setCompositions] = useState(INIT_COMPOSITIONS);
  const [tracks, setTracks] = useState(INIT_TRACKS);
  const [branches, setBranches] = useState(INIT_BRANCHES);
  const [records, setRecords] = useState(INIT_RECORDS);
  const [recordBranches, setRecordBranches] = useState(INIT_RECORD_BRANCHES);
  const [users, setUsers] = useState(INIT_USERS);
  const [bookings, setBookings] = useState(INIT_BOOKINGS);
  const [actionLogs, setActionLogs] = useState(INIT_LOGS);

  function setRole(r: Role) {
    setRoleState(r);
    if (r === "guest") {
      setPage("home");
      setParams({});
    }
  }

  function navigate(newPage: string, newParams: Record<string, any> = {}) {
    setPage(newPage);
    setParams(newParams);
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 0);
  }

  const currentUser = role === "guest" ? null : (users.find(u => u.role === role) ?? null);

  return (
    <AppContext.Provider value={{
      role, setRole, page, params, navigate, currentUser,
      ensembles, setEnsembles,
      musicians, setMusicians,
      members, setMembers,
      compositions, setCompositions,
      tracks, setTracks,
      branches, setBranches,
      records, setRecords,
      recordBranches, setRecordBranches,
      users, setUsers,
      bookings, setBookings,
      actionLogs, setActionLogs,
    }}>
      {children}
    </AppContext.Provider>
  );
}
