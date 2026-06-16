import { useT } from "@/i18n";
import { useSession } from "@/store/sessionStore";
import { useSettings } from "@/store/settingsStore";
import { Timer } from "@/components/Timer";
import { MicButton } from "@/components/MicButton";
import { TranscriptView } from "@/components/TranscriptView";

export function ListenScreen() {
  const t = useT();
  const {
    phase,
    elapsedMs,
    durationMs,
    diff,
    chunks,
    interim,
    micLevel,
    error,
    warning,
    pause,
    resume,
    end,
  } = useSession();
  const hasReference = useSettings((s) => s.referenceText.trim().length > 0);

  const listening = phase === "listening";
  const freeText = chunks.map((c) => c.text).join(" ");
  const accuracyPct = diff ? Math.round(diff.accuracy * 100) : null;

  return (
    <div className="screen" style={{ maxWidth: 820, margin: "0 auto", width: "100%" }}>
      {/* status bar */}
      <div className="row" style={{ justifyContent: "space-between", marginBottom: 12 }}>
        <Timer elapsedMs={elapsedMs} durationMs={durationMs} />
        <div style={{ textAlign: "end" }}>
          {hasReference && accuracyPct !== null ? (
            <>
              <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--focus)" }}>
                {accuracyPct}%
              </div>
              <div className="faint" style={{ fontSize: "0.8rem" }}>
                {t("accuracy")}
              </div>
            </>
          ) : (
            <span className="muted">{listening ? t("listening") : t("paused")}</span>
          )}
        </div>
      </div>

      {/* banners */}
      {warning === "focus-break" && (
        <div
          className="fade-in"
          style={{
            background: "var(--warn-soft)",
            color: "var(--warn)",
            padding: "10px 14px",
            borderRadius: "var(--radius-sm)",
            marginBottom: 10,
            fontWeight: 600,
          }}
        >
          ⚠ {t("focusBreakWarn")}
        </div>
      )}
      {error && (
        <div
          style={{
            background: "var(--error-soft)",
            color: "var(--error)",
            padding: "10px 14px",
            borderRadius: "var(--radius-sm)",
            marginBottom: 10,
          }}
        >
          {error === "mic-denied" ? t("micDenied") : t("sttUnsupported")}
        </div>
      )}

      {/* transcript */}
      <div className="card grow" style={{ marginBottom: 18, display: "flex" }}>
        <TranscriptView
          diff={diff}
          freeText={freeText}
          interim={interim}
          expectedLabel={t("expected")}
          youSaidLabel={t("you_said")}
        />
      </div>

      {/* controls */}
      <div className="row" style={{ justifyContent: "center", gap: 28 }}>
        <button className="btn btn-ghost" onClick={listening ? pause : () => void resume()}>
          {listening ? t("pause") : t("resume")}
        </button>
        <MicButton
          listening={listening}
          level={micLevel}
          label={listening ? t("listening") : t("speak")}
          onClick={listening ? pause : () => void resume()}
        />
        <button className="btn btn-danger" onClick={end}>
          {t("endSession")}
        </button>
      </div>
    </div>
  );
}
