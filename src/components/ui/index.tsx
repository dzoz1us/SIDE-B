import { X, ChevronLeft, ChevronRight } from "lucide-react";

export function Btn({ children, variant = "primary", onClick, className = "", type = "button", disabled = false }: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const base = "inline-flex items-center gap-2 px-4 py-2 font-medium transition-all duration-200 text-sm cursor-pointer select-none";
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98]",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "text-muted-foreground hover:text-foreground hover:bg-secondary",
    danger: "bg-destructive/10 text-red-400 border border-red-900/50 hover:bg-destructive/20",
    outline: "border border-primary text-primary hover:bg-primary/10",
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`${base} ${variants[variant]} ${disabled ? "opacity-50 !cursor-not-allowed" : ""} ${className}`}
    >
      {children}
    </button>
  );
}

export function FormInput({ label, placeholder, value, onChange, type = "text", className = "", required = false }: {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  className?: string;
  required?: boolean;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {label}{required && <span className="text-primary ml-0.5">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        required={required}
        className="bg-secondary border border-border text-foreground placeholder-muted-foreground px-3 py-2.5 text-sm focus:outline-none focus:border-primary/60 transition-colors w-full"
      />
    </div>
  );
}

export function FormTextarea({ label, placeholder, value, onChange, rows = 4, className = "" }: {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</label>}
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={rows}
        className="bg-secondary border border-border text-foreground placeholder-muted-foreground px-3 py-2.5 text-sm focus:outline-none focus:border-primary/60 transition-colors resize-none w-full"
      />
    </div>
  );
}

export function SelectInput({ label, value, onChange, options, className = "" }: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</label>}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="bg-secondary border border-border text-foreground px-3 py-2.5 text-sm focus:outline-none focus:border-primary/60 transition-colors appearance-none cursor-pointer w-full"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

export function Badge({ children, variant = "default" }: {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "gold";
}) {
  const variants = {
    default: "bg-secondary text-muted-foreground",
    success: "bg-green-900/30 text-green-400 border border-green-900/50",
    warning: "bg-yellow-900/30 text-yellow-400 border border-yellow-900/50",
    danger: "bg-red-900/30 text-red-400 border border-red-900/50",
    gold: "bg-primary/15 text-primary border border-primary/30",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: "active" | "completed" | "cancelled" | "expired" }) {
  const map: Record<string, React.ReactNode> = {
    active: <Badge variant="success">Активна</Badge>,
    completed: <Badge variant="default">Завершена</Badge>,
    cancelled: <Badge variant="warning">Отменена</Badge>,
    expired: <Badge variant="danger">Просрочена</Badge>,
  };
  return <>{map[status]}</>;
}

export function Modal({ open, onClose, title, children, size = "md" }: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  if (!open) return null;
  const sizes = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-lg", xl: "max-w-2xl" };
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-card border border-border w-full ${sizes[size]} max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="font-display text-lg font-semibold text-foreground">{title}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1">
            <X size={18} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export function ConfirmModal({ open, onClose, onConfirm, title, message }: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <p className="text-muted-foreground text-sm mb-5">{message}</p>
      <div className="flex gap-3 justify-end">
        <Btn variant="ghost" onClick={onClose}>Отмена</Btn>
        <Btn variant="danger" onClick={() => { onConfirm(); onClose(); }}>Удалить</Btn>
      </div>
    </Modal>
  );
}

export function Pagination({ page, totalPages, onPage }: {
  page: number;
  totalPages: number;
  onPage: (p: number) => void;
}) {
  if (totalPages <= 1) return null;
  const pages: number[] = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="flex items-center gap-1 mt-6 justify-center">
      <button onClick={() => onPage(page - 1)} disabled={page === 1}
        className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-30 transition-colors">
        <ChevronLeft size={16} />
      </button>
      {pages.map(p => (
        <button key={p} onClick={() => onPage(p)}
          className={`w-8 h-8 text-sm transition-colors ${p === page ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>
          {p}
        </button>
      ))}
      <button onClick={() => onPage(page + 1)} disabled={page === totalPages}
        className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-30 transition-colors">
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

export function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      <h2 className="font-display text-2xl font-semibold text-foreground">{title}</h2>
      {subtitle && <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>}
      <div className="mt-3 h-px bg-gradient-to-r from-primary/50 via-primary/20 to-transparent" />
    </div>
  );
}

export function PageTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">{title}</h1>
        {subtitle && <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>}
        <div className="mt-3 h-0.5 w-16 bg-primary/60" />
      </div>
      {action && <div className="flex-shrink-0 mt-1">{action}</div>}
    </div>
  );
}

export function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider border-b border-border bg-secondary/50 whitespace-nowrap ${className}`}>
      {children}
    </th>
  );
}

export function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <td className={`px-4 py-3 text-sm text-foreground border-b border-border/40 ${className}`}>
      {children}
    </td>
  );
}

export function Tr({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <tr className={`hover:bg-secondary/30 transition-colors ${className}`}>
      {children}
    </tr>
  );
}

export function TableWrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto border border-border">
      <table className="w-full text-sm min-w-[600px]">{children}</table>
    </div>
  );
}

export function EmptyState({ message = "Ничего не найдено" }: { message?: string }) {
  return (
    <div className="py-16 text-center text-muted-foreground">
      <div className="text-4xl mb-3 opacity-30">◎</div>
      <p>{message}</p>
    </div>
  );
}

export function FilterBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap gap-3 mb-6 p-4 bg-card border border-border">
      {children}
    </div>
  );
}

export function StockDot({ qty }: { qty: number }) {
  if (qty === 0) return <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-1.5" />;
  if (qty <= 2) return <span className="inline-block w-2 h-2 rounded-full bg-yellow-500 mr-1.5" />;
  return <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1.5" />;
}
