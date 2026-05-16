"use client";
import { useState, useEffect, useMemo } from "react";

const API_BASE = "http://localhost:2027/api";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

/* ── Types ── */
interface EmployeeInfo {
  id?: number;
  employeeId?: string;
  name?: string;
  department?: string;
}

interface Salary {
  id: number;
  employee: EmployeeInfo;
  month: number;
  year: number;
  basicSalary: number;
  allowances: number;
  overtimePay: number;
  grossSalary: number;
  netSalary: number;
  epfDeduction: number;
  etfDeduction: number;
  otherDeductions: number;
  totalDaysWorked: number;
  totalLeaves: number;
  status: string;
  generatedDate?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

interface BadgeProps {
  status: string;
}

interface StatusStyle {
  bg: string;
  color: string;
  label: string;
}

type StatusMap = {
  [key: string]: StatusStyle;
};

/* ── Badge ── */
function Badge({ status }: BadgeProps) {
  const map: StatusMap = {
    APPROVED: { bg: "#d1fae5", color: "#065f46", label: "Approved" },
    PENDING:  { bg: "#fef3c7", color: "#92400e", label: "Pending"  },
    REJECTED: { bg: "#fee2e2", color: "#991b1b", label: "Rejected" },
  };
  const s: StatusStyle = map[status] ?? { bg: "#f3f4f6", color: "#374151", label: status };
  return (
    <span style={{
      background: s.bg, color: s.color,
      padding: "2px 10px", borderRadius: 9999,
      fontSize: 12, fontWeight: 600, whiteSpace: "nowrap"
    }}>{s.label}</span>
  );
}

/* ── Button style helper ── */
function btnStyle(bg: string): React.CSSProperties {
  return {
    padding: "5px 10px", background: bg, color: "#fff",
    border: "none", borderRadius: 6, cursor: "pointer",
    fontSize: 14
  };
}

/* ── Select style ── */
const selStyle: React.CSSProperties = {
  padding: "7px 12px", border: "1px solid #d1d5db",
  borderRadius: 7, fontSize: 13, background: "#fff",
  color: "#374151", cursor: "pointer", outline: "none"
};

/* ── Detail row label/value styles ── */
const detailLabel: React.CSSProperties = {
  margin: "10px 0 2px", fontSize: 11, color: "#6b7280",
  fontWeight: 600, textTransform: "uppercase"
};
const detailVal: React.CSSProperties = {
  margin: 0, fontSize: 14, fontWeight: 500, color: "#111827"
};

/* ── Toast type ── */
interface Toast {
  type: "success" | "error";
  msg: string;
}

/* ══════════════════════════════════════════
   Main Component
══════════════════════════════════════════ */
export default function AdminSalaryPage() {
  const [salaries,      setSalaries]      = useState<Salary[]>([]);
  const [loading,       setLoading]       = useState<boolean>(true);
  const [error,         setError]         = useState<string | null>(null);

  /* search / filter */
  const [search,        setSearch]        = useState<string>("");
  const [filterMonth,   setFilterMonth]   = useState<string>("");
  const [filterYear,    setFilterYear]    = useState<string>("");
  const [filterStatus,  setFilterStatus]  = useState<string>("");

  /* modal */
  const [selected,      setSelected]      = useState<Salary | null>(null);
  const [actionToast,   setActionToast]   = useState<Toast | null>(null);

  /* ── load ── */
  const load = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const res  = await fetch(`${API_BASE}/payroll/all`, { credentials: "include" });
      const json: ApiResponse<Salary[]> = await res.json();
      if (json.success) setSalaries(json.data ?? []);
      else setError(json.message ?? "Unknown error");
    } catch (e: unknown) {
      setError("Failed to connect: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  /* ── unique years ── */
  const years = useMemo<number[]>(() => {
    const s = new Set(salaries.map((sal) => sal.year));
    return Array.from(s).sort((a, b) => b - a);
  }, [salaries]);

  /* ── filtered list ── */
  const filtered = useMemo<Salary[]>(() => {
    const q = search.toLowerCase().trim();
    return salaries.filter((s) => {
      const emp       = s.employee ?? {};
      const name      = (emp.name        ?? "").toLowerCase();
      const eid       = (emp.employeeId  ?? String(emp.id ?? "")).toLowerCase();
      const dept      = (emp.department  ?? "").toLowerCase();
      const monthName = (MONTHS[(s.month ?? 1) - 1] ?? "").toLowerCase();

      const matchSearch =
        !q ||
        name.includes(q) ||
        eid.includes(q) ||
        dept.includes(q) ||
        String(s.month).includes(q) ||
        String(s.year).includes(q) ||
        monthName.includes(q) ||
        String(s.netSalary).includes(q) ||
        String(s.basicSalary).includes(q);

      const matchMonth  = !filterMonth  || String(s.month)  === filterMonth;
      const matchYear   = !filterYear   || String(s.year)   === filterYear;
      const matchStatus = !filterStatus || s.status         === filterStatus;

      return matchSearch && matchMonth && matchYear && matchStatus;
    });
  }, [salaries, search, filterMonth, filterYear, filterStatus]);

  /* ── stats ── */
  const stats = useMemo(() => ({
    total:    salaries.length,
    pending:  salaries.filter((s) => s.status === "PENDING").length,
    approved: salaries.filter((s) => s.status === "APPROVED").length,
    totalNet: salaries.reduce((acc, s) => acc + (s.netSalary ?? 0), 0),
  }), [salaries]);

  /* ── show toast helper ── */
  const showToast = (type: "success" | "error", msg: string) => {
    setActionToast({ type, msg });
    setTimeout(() => setActionToast(null), 3500);
  };

  /* ── approve ── */
  const approve = async (id: number): Promise<void> => {
    try {
      const res  = await fetch(`${API_BASE}/payroll/approve/${id}`, {
        method: "PUT", credentials: "include"
      });
      const json: ApiResponse<string> = await res.json();
      if (json.success) { showToast("success", "Salary approved!"); load(); }
      else showToast("error", json.message ?? "Approval failed");
    } catch (e: unknown) {
      showToast("error", "Error: " + (e instanceof Error ? e.message : String(e)));
    }
  };

  /* ── delete ── */
  const deleteRec = async (id: number): Promise<void> => {
    if (!window.confirm("Delete this salary record? This cannot be undone.")) return;
    try {
      const res  = await fetch(`${API_BASE}/payroll/delete/${id}`, {
        method: "DELETE", credentials: "include"
      });
      const json: ApiResponse<string> = await res.json();
      if (json.success) {
        showToast("success", "Record deleted.");
        setSelected(null);
        load();
      } else {
        showToast("error", json.message ?? "Delete failed");
      }
    } catch (e: unknown) {
      showToast("error", "Error: " + (e instanceof Error ? e.message : String(e)));
    }
  };

  /* ── download ── */
  const downloadPdf = (id: number): void => {
    window.open(`${API_BASE}/payroll/download/${id}`, "_blank");
  };

  /* ── clear filters ── */
  const clearFilters = (): void => {
    setSearch(""); setFilterMonth(""); setFilterYear(""); setFilterStatus("");
  };

  const hasFilters = !!(search || filterMonth || filterYear || filterStatus);

  /* ══════════ RENDER ══════════ */
  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", color: "#111827", padding: 0 }}>

      {/* Toast */}
      {actionToast && (
        <div style={{
          position: "fixed", top: 24, right: 24, zIndex: 9999,
          background: actionToast.type === "success" ? "#d1fae5" : "#fee2e2",
          color:      actionToast.type === "success" ? "#065f46" : "#991b1b",
          padding: "12px 20px", borderRadius: 10, fontWeight: 600,
          boxShadow: "0 4px 12px rgba(0,0,0,.15)"
        }}>
          {actionToast.type === "success" ? "✅" : "❌"} {actionToast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Payroll Management</h2>
        <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: 14 }}>
          Review, approve and manage employee salary records
        </p>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))", gap: 14, marginBottom: 24 }}>
        {([
          { label: "Total Records",    value: String(stats.total),    color: "#3b82f6" },
          { label: "Pending Approval", value: String(stats.pending),  color: "#f59e0b" },
          { label: "Approved",         value: String(stats.approved), color: "#10b981" },
          {
            label: "Total Payout (LKR)",
            value: `Rs. ${stats.totalNet.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            color: "#6366f1",
            small: true
          },
        ] as { label: string; value: string; color: string; small?: boolean }[]).map((c) => (
          <div key={c.label} style={{
            background: "#fff", border: "1px solid #e5e7eb",
            borderRadius: 12, padding: "16px 18px",
            borderTop: `3px solid ${c.color}`
          }}>
            <p style={{ margin: 0, fontSize: 12, color: "#6b7280", fontWeight: 500 }}>{c.label}</p>
            <p style={{ margin: "6px 0 0", fontSize: c.small ? 15 : 24, fontWeight: 700, color: c.color }}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Search + Filters */}
      <div style={{
        background: "#fff", border: "1px solid #e5e7eb",
        borderRadius: 12, padding: "16px 20px", marginBottom: 20
      }}>
        {/* Search bar */}
        <div style={{ position: "relative", marginBottom: 14 }}>
          <span style={{
            position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
            fontSize: 16, color: "#9ca3af", pointerEvents: "none"
          }}>🔍</span>
          <input
            type="text"
            placeholder="Search by name, ID, department, month, year or amount…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%", boxSizing: "border-box",
              padding: "10px 36px 10px 38px",
              border: "1px solid #d1d5db", borderRadius: 8,
              fontSize: 14, outline: "none"
            }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{
                position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer",
                fontSize: 18, color: "#6b7280", lineHeight: 1
              }}>×</button>
          )}
        </div>

        {/* Dropdown filters */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} style={selStyle}>
            <option value="">All Months</option>
            {MONTHS.map((m, i) => <option key={m} value={String(i + 1)}>{m}</option>)}
          </select>

          <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} style={selStyle}>
            <option value="">All Years</option>
            {years.map((y) => <option key={y} value={String(y)}>{y}</option>)}
          </select>

          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={selStyle}>
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
          </select>

          {hasFilters && (
            <button onClick={clearFilters} style={{
              padding: "7px 14px", background: "#f3f4f6",
              border: "1px solid #d1d5db", borderRadius: 7,
              fontSize: 13, cursor: "pointer", color: "#374151"
            }}>Clear filters</button>
          )}

          <span style={{ marginLeft: "auto", fontSize: 13, color: "#6b7280" }}>
            Showing <strong>{filtered.length}</strong> of <strong>{salaries.length}</strong> records
          </span>
        </div>
      </div>

      {/* Table / States */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: "#6b7280" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
          Loading payroll records…
        </div>
      ) : error ? (
        <div style={{
          background: "#fee2e2", border: "1px solid #fca5a5",
          borderRadius: 10, padding: 20, color: "#991b1b", textAlign: "center"
        }}>
          <strong>Error:</strong> {error}
          <button onClick={load} style={{ marginLeft: 12, padding: "4px 14px", borderRadius: 6, border: "1px solid #fca5a5", background: "#fff", cursor: "pointer" }}>Retry</button>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: "#6b7280" }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>🔍</div>
          <p style={{ margin: 0 }}>{salaries.length === 0 ? "No salary records found." : "No records match your search."}</p>
          {hasFilters && (
            <button onClick={clearFilters} style={{
              marginTop: 12, padding: "8px 20px", background: "#3b82f6",
              color: "#fff", border: "none", borderRadius: 8, cursor: "pointer"
            }}>Clear filters</button>
          )}
        </div>
      ) : (
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                  {["#","Employee","Department","Month / Year","Basic Salary","Net Salary","Status","Actions"].map((h) => (
                    <th key={h} style={{
                      padding: "11px 14px",
                      textAlign: (h === "Actions" || h === "Status") ? "center" : "left",
                      fontWeight: 600, fontSize: 12, color: "#374151",
                      textTransform: "uppercase", letterSpacing: ".5px", whiteSpace: "nowrap"
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, idx) => {
                  const emp = s.employee ?? {};
                  return (
                    <tr
                      key={s.id}
                      onClick={() => setSelected(s)}
                      style={{ borderBottom: "1px solid #f3f4f6", cursor: "pointer" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#f9fafb")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "")}
                    >
                      <td style={{ padding: "12px 14px", color: "#9ca3af", fontSize: 12 }}>{idx + 1}</td>
                      <td style={{ padding: "12px 14px" }}>
                        <div style={{ fontWeight: 600 }}>{emp.name ?? "—"}</div>
                        <div style={{ fontSize: 12, color: "#6b7280" }}>
                          ID: {emp.employeeId ?? String(emp.id ?? "—")}
                        </div>
                      </td>
                      <td style={{ padding: "12px 14px" }}>{emp.department ?? "—"}</td>
                      <td style={{ padding: "12px 14px", whiteSpace: "nowrap" }}>
                        {MONTHS[(s.month ?? 1) - 1]} {s.year}
                      </td>
                      <td style={{ padding: "12px 14px", fontFamily: "monospace" }}>
                        Rs. {(s.basicSalary ?? 0).toLocaleString("en-LK", { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ padding: "12px 14px", fontFamily: "monospace", fontWeight: 700, color: "#059669" }}>
                        Rs. {(s.netSalary ?? 0).toLocaleString("en-LK", { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ padding: "12px 14px", textAlign: "center" }}>
                        <Badge status={s.status} />
                      </td>
                      <td style={{ padding: "12px 14px", textAlign: "center" }}
                        onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                          {s.status === "PENDING" && (
                            <button onClick={() => approve(s.id)} style={btnStyle("#10b981")} title="Approve">✓</button>
                          )}
                          <button onClick={() => downloadPdf(s.id)} style={btnStyle("#3b82f6")} title="Download PDF">⬇</button>
                          <button onClick={() => setSelected(s)} style={btnStyle("#8b5cf6")} title="View">👁</button>
                          <button onClick={() => deleteRec(s.id)} style={btnStyle("#ef4444")} title="Delete">🗑</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 1000, padding: 20
          }}
          onClick={() => setSelected(null)}
        >
          <div
            style={{
              background: "#fff", borderRadius: 16, padding: 32,
              maxWidth: 520, width: "100%", maxHeight: "90vh",
              overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,.3)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Salary Details</h3>
                <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: 13 }}>
                  {selected.employee?.name ?? "—"} — {MONTHS[(selected.month ?? 1) - 1]} {selected.year}
                </p>
              </div>
              <button onClick={() => setSelected(null)} style={{
                background: "none", border: "none", cursor: "pointer", fontSize: 22, color: "#6b7280"
              }}>×</button>
            </div>

            {/* Employee Info */}
            <div style={{ background: "#f9fafb", borderRadius: 10, padding: 16, marginBottom: 16 }}>
              <p style={detailLabel}>Employee</p>
              <p style={detailVal}>{selected.employee?.name ?? "—"}</p>
              <p style={detailLabel}>Department</p>
              <p style={detailVal}>{selected.employee?.department ?? "—"}</p>
              <p style={detailLabel}>Status</p>
              <div style={{ marginTop: 4 }}><Badge status={selected.status} /></div>
            </div>

            {/* Salary Breakdown */}
            <div style={{ borderRadius: 10, border: "1px solid #e5e7eb", overflow: "hidden", marginBottom: 16 }}>
              {([
                ["Basic Salary",     selected.basicSalary],
                ["Allowances",       selected.allowances],
                ["Overtime Pay",     selected.overtimePay],
                ["Gross Salary",     selected.grossSalary],
                ["EPF Deduction",    selected.epfDeduction],
                ["ETF Deduction",    selected.etfDeduction],
                ["Other Deductions", selected.otherDeductions],
              ] as [string, number][]).map(([label, val]) => (
                <div key={label} style={{
                  display: "flex", justifyContent: "space-between",
                  padding: "10px 16px", borderBottom: "1px solid #f3f4f6", fontSize: 14
                }}>
                  <span style={{ color: "#374151" }}>{label}</span>
                  <span style={{ fontFamily: "monospace" }}>
                    Rs. {(val ?? 0).toLocaleString("en-LK", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
              <div style={{
                display: "flex", justifyContent: "space-between",
                padding: "12px 16px", background: "#ecfdf5",
                fontSize: 15, fontWeight: 700
              }}>
                <span style={{ color: "#065f46" }}>Net Salary (Payable)</span>
                <span style={{ fontFamily: "monospace", color: "#059669" }}>
                  Rs. {(selected.netSalary ?? 0).toLocaleString("en-LK", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Attendance summary */}
            <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
              {([["Days Worked", selected.totalDaysWorked], ["Leaves Taken", selected.totalLeaves]] as [string, number][]).map(([l, v]) => (
                <div key={l} style={{ flex: 1, background: "#f9fafb", borderRadius: 8, padding: "10px 14px", textAlign: "center" }}>
                  <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>{l}</p>
                  <p style={{ margin: "4px 0 0", fontSize: 20, fontWeight: 700 }}>{v ?? "—"}</p>
                </div>
              ))}
            </div>

            {/* Modal Actions */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {selected.status === "PENDING" && (
                <button onClick={() => { approve(selected.id); setSelected(null); }}
                  style={{ flex: 1, padding: "10px 0", background: "#10b981", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>
                  ✓ Approve
                </button>
              )}
              <button onClick={() => downloadPdf(selected.id)}
                style={{ flex: 1, padding: "10px 0", background: "#3b82f6", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>
                ⬇ PDF
              </button>
              <button onClick={() => deleteRec(selected.id)}
                style={{ flex: 1, padding: "10px 0", background: "#ef4444", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>
                🗑 Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}