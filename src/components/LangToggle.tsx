import { useI18n } from "@/i18n";

export function LangToggle() {
  const lang = useI18n((s) => s.lang);
  const toggle = useI18n((s) => s.toggle);
  return (
    <button
      onClick={toggle}
      className="btn btn-ghost"
      style={{ padding: "6px 12px", fontSize: "0.85rem" }}
      aria-label="toggle language"
    >
      {lang === "ar" ? "English" : "العربية"}
    </button>
  );
}
