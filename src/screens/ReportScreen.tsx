import { useMemo } from "react";
import { useT } from "@/i18n";
import { useSession } from "@/store/sessionStore";
import { useSettings } from "@/store/settingsStore";
import { buildReport } from "@/cards";
import { WeaknessMap } from "@/components/WeaknessMap";
import { Flashcard } from "@/components/Flashcard";
import { LangToggle } from "@/components/LangToggle";

function Stat({ value, label, color }: { value: string | number; label: string; color?: string }) {
  return (
    <div className="card" style={{ textAlign: "center", flex: 1, minWidth: 120 }}>
      <div style={{ fontSize: "1.8rem", fontWeight: 800, color: color ?? "var(--text)" }}>
        {value}
      </div>
      <div className="faint" style={{ fontSize: "0.8rem", marginTop: 4 }}>
        {label}
      </div>
    </div>
  );
}

export function ReportScreen() {
  const t = useT();
  const { chunks, diff, hesitationMarks, focusBreaks, reset } = useSession();
  const referenceText = useSettings((s) => s.referenceText);

  const report = useMemo(
    () => buildReport({ referenceText, chunks, diff, hesitationMarks }),
    [referenceText, chunks, diff, hesitationMarks],
  );

  const exportJson = () => {
    const blob = new Blob(
      [JSON.stringify({ ...report, focusBreaks }, null, 2)],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "deepfocus-session.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="screen scroll" style={{ maxWidth: 820, margin: "0 auto", width: "100%" }}>
      <header className="row" style={{ justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ fontSize: "1.6rem", fontWeight: 800 }}>{t("reportTitle")}</h2>
        <LangToggle />
      </header>

      {/* stats */}
      <div className="row" style={{ flexWrap: "wrap", marginBottom: 24 }}>
        {diff && (
          <Stat value={`${Math.round(report.accuracy * 100)}%`} label={t("accuracy")} color="var(--focus)" />
        )}
        <Stat value={report.wordsSpoken} label={t("wordsSpoken")} />
        <Stat value={report.weakPoints.length} label={t("weakPoints")} color="var(--warn)" />
        <Stat value={focusBreaks.length} label={t("focusBreaks")} color="var(--error)" />
      </div>

      {/* weakness map */}
      <section style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 8 }}>{t("weaknessMap")}</h3>
        <div className="card">
          <WeaknessMap segments={report.segments} emptyLabel={t("noWeakPoints")} />
          <div className="row" style={{ gap: 16, marginTop: 12, fontSize: "0.8rem" }}>
            <span style={{ color: "var(--error)" }}>■ {t("mistakes")} {report.counts.mistakes}</span>
            <span style={{ color: "var(--text-faint)" }}>■ {t("omissions")} {report.counts.omissions}</span>
            <span style={{ color: "var(--warn)" }}>■ {t("hesitations")} {report.counts.hesitations}</span>
          </div>
        </div>
      </section>

      {/* flashcards */}
      {report.flashcards.length > 0 && (
        <section style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 8 }}>
            {t("flashcards")} · {t("flip")}
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 12,
            }}
          >
            {report.flashcards.map((c) => (
              <Flashcard key={c.id} card={c} questionLabel={t("question")} answerLabel={t("answer")} />
            ))}
          </div>
        </section>
      )}

      {/* summary */}
      <section style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 8 }}>{t("summary")}</h3>
        <div className="card" style={{ lineHeight: 2, fontSize: "1.1rem" }}>
          {report.fullText || <span className="faint">—</span>}
        </div>
      </section>

      {/* actions */}
      <div className="row" style={{ gap: 12, paddingBottom: 24 }}>
        <button className="btn btn-primary" onClick={reset}>
          {t("newSession")}
        </button>
        <button className="btn btn-ghost" onClick={exportJson}>
          {t("exportJson")}
        </button>
      </div>
    </div>
  );
}
