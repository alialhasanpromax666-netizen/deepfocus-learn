import { useRef, useState } from "react";
import { useT, useI18n } from "@/i18n";
import { LangToggle } from "@/components/LangToggle";
import { useSettings } from "@/store/settingsStore";
import { useSession } from "@/store/sessionStore";

const DURATIONS = [10, 25, 45, 60];

let idSeq = 0;
const nextId = () => `at-${Date.now().toString(36)}-${idSeq++}`;

/* ---------- inline SVG icons ---------- */
const IconStats = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18" /><path d="M7 16l4-8 4 4 4-6" />
  </svg>
);

const IconClock = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 15" />
  </svg>
);

const IconAccuracy = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
  </svg>
);

const IconSubject = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
  </svg>
);

const IconUpload = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const IconLink = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
  </svg>
);

const IconFile = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" />
  </svg>
);

const IconX = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const BrandMark = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="22" stroke="#C49450" strokeWidth="3" opacity="0.4" />
    <circle cx="24" cy="24" r="14" stroke="#C49450" strokeWidth="2.5" opacity="0.7" />
    <circle cx="24" cy="24" r="4" fill="#C49450" />
  </svg>
);

/* ---------- helpers ---------- */
function fmtDuration(ms: number): string {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  if (h > 0) return `${h}h ${m}m`;
  return `${m} min`;
}

function fmtAccuracy(acc: number): string {
  return `${Math.round(acc * 100)}%`;
}

/* ---------- component ---------- */
export function IdleScreen() {
  const t = useT();
  const { lang } = useI18n();
  const {
    referenceText, setReferenceText,
    emergencyContacts, setEmergencyContacts,
    durationMin, setDurationMin,
    subject, setSubject,
    difficulty, setDifficulty,
    sessionType, setSessionType,
    attachments, addAttachment, removeAttachment,
    sessionHistory,
    setEnteredApp,
  } = useSettings();
  const goLock = useSession((s) => s.goLock);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [urlInput, setUrlInput] = useState("");
  const [dragOver, setDragOver] = useState(false);

  /* stats from history */
  const totalSessions = sessionHistory.length;
  const totalTimeMs = sessionHistory.reduce((acc, s) => acc + s.durationMs, 0);
  const avgAccuracy = totalSessions > 0
    ? sessionHistory.reduce((acc, s) => acc + s.accuracy, 0) / totalSessions
    : 0;

  /* file upload — fills reference text automatically */
  const handleFile = (file: File) => {
    if (!file.name.endsWith(".txt")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result as string;
      addAttachment({
        id: nextId(),
        name: file.name,
        content,
        type: "text",
        addedAt: Date.now(),
      });
      setReferenceText(content);
    };
    reader.readAsText(file);
  };

  const handleUrlAdd = () => {
    const u = urlInput.trim();
    if (!u) return;
    addAttachment({
      id: nextId(),
      name: u,
      content: u,
      type: "url",
      addedAt: Date.now(),
    });
    setUrlInput("");
  };

  const handleUrlKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleUrlAdd();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  return (
    <div className="screen scroll">
      <div style={{ maxWidth: 800, margin: "0 auto", width: "100%" }}>
        <header style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 28, paddingBottom: 20,
          borderBottom: "1px solid var(--line)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <BrandMark size={32} />
            <div>
              <h1 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
                {t("appName")}
              </h1>
              <p className="muted" style={{ fontSize: "0.85rem", marginTop: 2 }}>
                {t("tagline")}
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button
              onClick={() => setEnteredApp(false)}
              className="btn btn-ghost"
              style={{ padding: "6px 8px" }}
              title={lang === "ar" ? "الرئيسية" : "Home"}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points={lang === "ar" ? "9 18 15 12 9 6" : "15 18 9 12 15 6"} />
              </svg>
            </button>
            <LangToggle />
          </div>
        </header>

        {totalSessions > 0 && (
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12,
            marginBottom: 28,
          }}>
            {[
              { icon: <IconStats />, value: totalSessions.toString(), label: t("statsSessions") },
              { icon: <IconClock />, value: fmtDuration(totalTimeMs), label: t("statsHours") },
              { icon: <IconAccuracy />, value: fmtAccuracy(avgAccuracy), label: t("statsAccuracy") },
            ].map((s, i) => (
              <div key={i} className="card" style={{
                display: "flex", alignItems: "center", gap: 12, padding: "14px 16px",
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: "var(--focus-soft)", color: "var(--focus)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  {s.icon}
                </div>
                <div>
                  <div style={{ fontSize: "1.15rem", fontWeight: 700, lineHeight: 1.2 }}>{s.value}</div>
                  <div className="muted" style={{ fontSize: "0.78rem" }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: "grid", gap: 24 }}>
          <div className="col" style={{ gap: 8 }}>
            <label style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
              <IconSubject /> {t("subjectLabel")}
            </label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={t("subjectPlaceholder")}
              className="card input-like"
              style={{ padding: "14px 16px", fontSize: "1rem", color: "var(--text)" }}
              dir={lang === "ar" ? "rtl" : "ltr"}
            />
          </div>

          <div className="col" style={{ gap: 10 }}>
            <span style={{ fontWeight: 600 }}>{t("difficultyLabel")}</span>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {(["easy", "medium", "hard"] as const).map((val) => (
                <button
                  key={val}
                  className={`btn ${difficulty === val ? "btn-primary" : ""}`}
                  onClick={() => setDifficulty(val)}
                  style={{ flex: 1, minWidth: 80 }}
                >
                  {val === "easy" ? t("difficultyEasy") : val === "medium" ? t("difficultyMedium") : t("difficultyHard")}
                </button>
              ))}
            </div>
          </div>

          <div className="col" style={{ gap: 8 }}>
            <span style={{ fontWeight: 600 }}>{t("attachmentsLabel")}</span>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${dragOver ? "var(--focus)" : "var(--line-2)"}`,
                borderRadius: "var(--radius)", padding: "28px 20px",
                textAlign: "center", cursor: "pointer",
                background: dragOver ? "var(--focus-glow)" : "transparent",
                transition: "border-color 0.2s, background 0.2s",
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt"
                onChange={handleFileInputChange}
                style={{ display: "none" }}
              />
              <div style={{ color: "var(--text-dim)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <IconUpload />
                <span style={{ fontSize: "0.9rem" }}>{t("uploadPrompt")}</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={handleUrlKey}
                placeholder={t("attachmentUrlPlaceholder")}
                className="card input-like"
                style={{
                  flex: 1, padding: "12px 14px", fontSize: "0.9rem", color: "var(--text)",
                  direction: "ltr",
                }}
              />
              <button className="btn btn-primary" onClick={handleUrlAdd} style={{ padding: "12px 18px", whiteSpace: "nowrap" }}>
                <IconLink /> {t("attachmentAdd")}
              </button>
            </div>
            {attachments.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
                {attachments.map((a) => (
                  <div key={a.id} className="card" style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 14px", fontSize: "0.87rem",
                  }}>
                    <IconFile />
                    <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {a.name}
                    </span>
                    <button
                      onClick={() => removeAttachment(a.id)}
                      style={{ color: "var(--text-faint)", padding: 2 }}
                      title="Remove"
                    >
                      <IconX />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {attachments.length === 0 && (
              <span className="faint" style={{ fontSize: "0.85rem" }}>{t("attachmentEmpty")}</span>
            )}
          </div>

          <div className="col" style={{ gap: 8 }}>
            <span style={{ fontWeight: 600 }}>{t("sessionTypeLabel")}</span>
            <div style={{ display: "flex", gap: 8 }}>
              {(["free", "compare"] as const).map((type) => (
                <button
                  key={type}
                  className={`btn ${sessionType === type ? "btn-primary" : ""}`}
                  onClick={() => setSessionType(type)}
                  style={{ flex: 1 }}
                >
                  {type === "free" ? t("sessionTypeFree") : t("sessionTypeCompare")}
                </button>
              ))}
            </div>
          </div>

          {sessionType === "compare" && (
            <div className="col" style={{ gap: 8 }}>
              <label style={{ fontWeight: 600 }}>{t("referenceLabel")}</label>
              <textarea
                value={referenceText}
                onChange={(e) => setReferenceText(e.target.value)}
                placeholder={t("referencePlaceholder")}
                rows={6}
                className="card input-like"
                style={{
                  resize: "vertical", color: "var(--text)", fontFamily: "inherit",
                  fontSize: "1rem", lineHeight: 1.9, padding: 16,
                }}
                dir={lang === "ar" ? "rtl" : "ltr"}
              />
              {!referenceText.trim() && (
                <span className="faint" style={{ fontSize: "0.85rem" }}>{t("noReferenceNote")}</span>
              )}
            </div>
          )}

          <div className="col" style={{ gap: 8 }}>
            <span style={{ fontWeight: 600 }}>{t("durationLabel")}</span>
            <div className="row" style={{ flexWrap: "wrap" }}>
              {DURATIONS.map((d) => (
                <button
                  key={d}
                  className={`btn ${durationMin === d ? "btn-primary" : ""}`}
                  onClick={() => setDurationMin(d)}
                  style={{ flex: 1, minWidth: 60 }}
                >
                  {d} {t("minutes")}
                </button>
              ))}
              <button
                className={`btn ${durationMin === 0 ? "btn-primary" : ""}`}
                onClick={() => setDurationMin(0)}
                style={{ flex: 1, minWidth: 60 }}
              >
                {t("durationOpen")}
              </button>
            </div>
          </div>

          <div className="col" style={{ gap: 8 }}>
            <label style={{ fontWeight: 600 }}>{t("emergencyLabel")}</label>
            <input
              value={emergencyContacts}
              onChange={(e) => setEmergencyContacts(e.target.value)}
              placeholder={t("emergencyPlaceholder")}
              className="card input-like"
              style={{ padding: "14px 16px", fontSize: "1rem", color: "var(--text)" }}
              dir={lang === "ar" ? "rtl" : "ltr"}
            />
          </div>

          <button
            className="btn btn-primary"
            onClick={goLock}
            style={{
              padding: "18px", fontSize: "1.1rem", fontWeight: 700, marginTop: 8,
              boxShadow: "0 0 32px rgba(196,148,80,0.15)",
            }}
          >
            {t("startSession")}
          </button>
        </div>
      </div>
    </div>
  );
}
