import { useState } from "react";
import { Search, ChevronDown, X, LogOut, BookOpen, BarChart2, Settings } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { Btn } from "../ui";

export default function Header() {
  const { role, navigate } = useApp();
  const { user, handleLogout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navLinks = [
    { label: "Ансамбли", page: "ensembles" },
    { label: "Пластинки", page: "records" },
    { label: "Лидеры продаж", page: "bestsellers" },
    { label: "Филиалы", page: "branches" },
  ];

  function onLogout() {
    handleLogout();
    setUserMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between gap-4">
        <button onClick={() => navigate("home")}
          className="font-display text-xl font-bold text-primary tracking-[0.15em] flex-shrink-0 hover:text-primary/80 transition-colors">
          SIDE B
        </button>

        <nav className="hidden md:flex items-center gap-5 flex-1 justify-center">
          {navLinks.map(l => (
            <button key={l.page} onClick={() => navigate(l.page)}
              className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {l.label}
            </button>
          ))}
          {(role === "manager" || role === "admin") && (
            <button onClick={() => navigate("manager")}
              className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Панель управления
            </button>
          )}
          {role === "admin" && (
            <button onClick={() => navigate("admin")}
              className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Администрирование
            </button>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <button onClick={() => setSearchOpen(v => !v)}
            className="p-2 text-muted-foreground hover:text-primary transition-colors">
            <Search size={16} />
          </button>

          {role === "guest" ? (
            <Btn variant="outline" onClick={() => navigate("login")} className="text-xs px-3 py-1.5">
              Войти
            </Btn>
          ) : (
            <div className="relative">
              <button onClick={() => setUserMenuOpen(v => !v)}
                className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors">
                <div className="w-7 h-7 bg-primary/20 border border-primary/40 flex items-center justify-center text-primary text-xs font-bold">
                  {(user?.first_name || "U")[0]}
                </div>
                <span className="hidden sm:block text-sm">{user?.first_name || "Пользователь"}</span>
                <ChevronDown size={13} className={`transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-52 bg-card border border-border shadow-2xl z-20">
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-sm font-medium text-foreground">{user?.first_name} {user?.last_name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                    {role !== "admin" && (
                      <button onClick={() => { navigate("my-bookings"); setUserMenuOpen(false); }}
                        className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-secondary hover:text-primary transition-colors flex items-center gap-2">
                        <BookOpen size={14} /> Мои брони
                      </button>
                    )}
                    {(role === "manager" || role === "admin") && (
                      <button onClick={() => { navigate("manager"); setUserMenuOpen(false); }}
                        className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-secondary hover:text-primary transition-colors flex items-center gap-2">
                        <BarChart2 size={14} /> Панель управления
                      </button>
                    )}
                    {role === "admin" && (
                      <button onClick={() => { navigate("admin"); setUserMenuOpen(false); }}
                        className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-secondary hover:text-primary transition-colors flex items-center gap-2">
                        <Settings size={14} /> Администрирование
                      </button>
                    )}
                    <div className="border-t border-border" />
                    <button onClick={onLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-muted-foreground hover:text-red-400 hover:bg-secondary transition-colors flex items-center gap-2">
                      <LogOut size={14} /> Выйти
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-border bg-card px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <Search size={15} className="text-muted-foreground flex-shrink-0" />
            <input autoFocus type="text" placeholder="Поиск по пластинкам и ансамблям..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && searchQuery.trim()) { navigate("records", { search: searchQuery }); setSearchOpen(false); } }}
              className="flex-1 bg-transparent text-foreground placeholder-muted-foreground text-sm focus:outline-none" />
            <button onClick={() => setSearchOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X size={15} />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}