import { useT } from "@/i18n";
import { useSession } from "@/store/sessionStore";

export function LockScreen() {
  const t = useT();
  const beginListening = useSession((s) => s.beginListening);
  const reset = useSession((s) => s.reset);

  return (
    <div className="screen center fade-in" style={{ maxWidth: 520, margin: "0 auto" }}>
      <div
        aria-hidden
        style={{
          width: 84,
          height: 84,
          borderRadius: "50%",
          display: "grid",
          placeItems: "center",
          background: "var(--calm)",
          border: "1px solid var(--line)",
          fontSize: 38,
          marginBottom: 24,
        }}
      >
        <svg width="36" height="36" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="0.8">
          <circle cx="60" cy="60" r="56"/>
          <circle cx="60" cy="60" r="38" opacity="0.2"/>
          <circle cx="60" cy="60" r="6" fill="currentColor"/>
        </svg>
      </div>
      <h2 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: 12 }}>{t("lockTitle")}</h2>
      <p className="muted" style={{ fontSize: "1.1rem", lineHeight: 1.9, marginBottom: 8 }}>
        {t("lockBody")}
      </p>
      <p className="faint" style={{ fontSize: "0.85rem", marginBottom: 28 }}>
        {t("webLockNote")}
      </p>
      <div className="row" style={{ gap: 12 }}>
        <button className="btn btn-primary" style={{ padding: "16px 28px" }} onClick={() => void beginListening()}>
          {t("enterFocus")}
        </button>
        <button className="btn btn-ghost" onClick={reset}>
          {t("cancel")}
        </button>
      </div>
    </div>
  );
}
