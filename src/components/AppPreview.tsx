import { useLanding } from "@/i18n/landing";
import { useI18n } from "@/i18n";

export function AppPreview() {
  const lang = useI18n((s) => s.lang);
  const c = useLanding();

  return (
    <div className="device" aria-hidden>
      <div className="device-screen">
        <div className="device-top">
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="14" height="14" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="1"><circle cx="60" cy="60" r="56"/><circle cx="60" cy="60" r="4" fill="currentColor"/></svg>
            {lang === "ar" ? "حصن التركيز" : "DeepFocus"}
          </span>
          <span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="6" fill="currentColor" opacity="0.3"/>
              <circle cx="12" cy="12" r="2" fill="currentColor"/>
            </svg>
          </span>
        </div>
        <div className="device-time">{c.preview.time}</div>
        <div className="device-acc">{c.preview.acc}</div>

        <div className="device-tr">
          {lang === "ar" ? (
            <>
              <span className="w-ok">المتقدرة</span>{" "}
              <span className="w-ok">هي</span>{" "}
              <span className="w-bad">مصنع</span>{" "}
              <span className="w-ok">الطاقة</span>{" "}
              <span className="w-skip">في</span>{" "}
              <span className="w-ok">الخلية</span>
            </>
          ) : (
            <>
              <span className="w-ok">The</span>{" "}
              <span className="w-ok">mitochondria</span>{" "}
              <span className="w-ok">is</span>{" "}
              <span className="w-skip">the</span>{" "}
              <span className="w-bad">powerplant</span>{" "}
              <span className="w-ok">of</span>{" "}
              <span className="w-ok">the</span>{" "}
              <span className="w-ok">cell</span>
            </>
          )}
        </div>

        <div className="device-mic">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="2" width="6" height="12" rx="3"/>
            <path d="M5 10a7 7 0 0 0 14 0"/>
            <line x1="12" y1="19" x2="12" y2="22"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
