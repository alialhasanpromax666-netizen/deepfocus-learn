import type { Lang } from "@/types";

/** Every UI string keyed by id, with an Arabic and English value. */
export const STRINGS = {
  appName: { ar: "حصن التركيز", en: "DeepFocus Learn" },
  tagline: {
    ar: "معلمك الخاص — ادرس بصوتك، ودعه يكشف نقاط ضعفك",
    en: "Your private tutor — study aloud, let it expose your weak spots",
  },

  // Idle / setup
  startSession: { ar: "ابدأ جلسة المذاكرة", en: "Start Study Session" },
  referenceLabel: { ar: "نص الدرس الأصلي (اختياري)", en: "Original lesson text (optional)" },
  referencePlaceholder: {
    ar: "الصق هنا نص الدرس أو الآيات لتتم مقارنتها بما تقوله…",
    en: "Paste the lesson or verses here so it can compare what you say…",
  },
  emergencyLabel: { ar: "قائمة الطوارئ المسموح بها", en: "Allowed emergency contacts" },
  emergencyPlaceholder: { ar: "أرقام تفصل بينها فاصلة", en: "Comma-separated numbers" },
  durationLabel: { ar: "مدة الجلسة", en: "Session length" },
  minutes: { ar: "دقيقة", en: "min" },
  noReferenceNote: {
    ar: "بدون نص أصلي سيقوم المعلم بالتفريغ ورصد التردد فقط، دون مقارنة.",
    en: "Without a reference, the tutor only transcribes and detects hesitation — no comparison.",
  },

  // Lock
  lockTitle: { ar: "وضع التركيز العميق", en: "Deep Focus Mode" },
  lockBody: {
    ar: "سيُقفل كل شيء عداي. لا إشعارات، لا تطبيقات. أنت الآن في امتحان شفهي.",
    en: "Everything but me gets locked. No notifications, no apps. You are now in an oral exam.",
  },
  enterFocus: { ar: "ادخل وضع التركيز", en: "Enter Focus" },
  cancel: { ar: "إلغاء", en: "Cancel" },
  webLockNote: {
    ar: "على المتصفح يُفعَّل القفل بأفضل جهد (ملء الشاشة + رصد الخروج). القفل الكامل يحتاج تطبيقًا أصليًا.",
    en: "On the web this is best-effort (fullscreen + break detection). True app-lock needs a native build.",
  },

  // Listen
  speak: { ar: "تحدّث", en: "Speak" },
  listening: { ar: "يستمع…", en: "Listening…" },
  paused: { ar: "متوقف مؤقتًا", en: "Paused" },
  pause: { ar: "إيقاف مؤقت", en: "Pause" },
  resume: { ar: "متابعة", en: "Resume" },
  endSession: { ar: "إنهاء الجلسة", en: "End session" },
  micDenied: {
    ar: "تعذّر الوصول إلى الميكروفون. امنح الإذن من إعدادات المتصفح.",
    en: "Microphone unavailable. Grant permission in your browser settings.",
  },
  sttUnsupported: {
    ar: "متصفحك لا يدعم التعرّف على الكلام. جرّب Chrome أو Edge.",
    en: "Your browser doesn't support speech recognition. Try Chrome or Edge.",
  },
  focusBreakWarn: { ar: "انتبه! خرجت عن التركيز", en: "Heads up — you left focus" },
  onTrack: { ar: "على المسار", en: "On track" },

  // Report
  reportTitle: { ar: "تقرير الجلسة", en: "Session Report" },
  summary: { ar: "الملخص الكامل", en: "Full Summary" },
  flashcards: { ar: "البطاقات التعليمية", en: "Flashcards" },
  weaknessMap: { ar: "خريطة نقاط الضعف", en: "Weakness Map" },
  accuracy: { ar: "الدقة", en: "Accuracy" },
  wordsSpoken: { ar: "كلمات منطوقة", en: "Words spoken" },
  weakPoints: { ar: "نقاط ضعف", en: "Weak points" },
  focusBreaks: { ar: "مرات فقدان التركيز", en: "Focus breaks" },
  noWeakPoints: { ar: "لا نقاط ضعف — إتقان ممتاز!", en: "No weak points — excellent mastery!" },
  mistakes: { ar: "أخطاء", en: "Mistakes" },
  omissions: { ar: "نسيان", en: "Omissions" },
  hesitations: { ar: "تردّد", en: "Hesitations" },
  flip: { ar: "اقلب", en: "Flip" },
  question: { ar: "سؤال", en: "Question" },
  answer: { ar: "إجابة", en: "Answer" },
  newSession: { ar: "جلسة جديدة", en: "New session" },
  exportJson: { ar: "تصدير JSON", en: "Export JSON" },

  // Idle — new
  subjectLabel: { ar: "المادة / الموضوع", en: "Subject / Topic" },
  subjectPlaceholder: { ar: "مثلاً: الفقه، النحو، التفسير…", en: "e.g. Fiqh, Grammar, Tafsir…" },
  difficultyLabel: { ar: "مستوى الصعوبة", en: "Difficulty Level" },
  difficultyEasy: { ar: "سهل", en: "Easy" },
  difficultyMedium: { ar: "متوسط", en: "Medium" },
  difficultyHard: { ar: "صعب", en: "Hard" },
  attachmentsLabel: { ar: "الملفات المرفقة", en: "Attached Files" },
  attachmentUpload: { ar: "ارفع ملف نصي (.txt)", en: "Upload text file (.txt)" },
  attachmentUrl: { ar: "رابط ملف خارجي", en: "External file link" },
  attachmentUrlPlaceholder: { ar: "https://…", en: "https://…" },
  attachmentAdd: { ar: "إضافة", en: "Add" },
  attachmentEmpty: { ar: "لا مرفقات بعد", en: "No attachments yet" },
  sessionTypeLabel: { ar: "نوع الجلسة", en: "Session Type" },
  sessionTypeFree: { ar: "قراءة حرة", en: "Free Reading" },
  sessionTypeCompare: { ar: "مقارنة بنص", en: "Compare with Text" },
  durationOpen: { ar: "مفتوح", en: "Open" },
  statsSessions: { ar: "جلسات منجزة", en: "Sessions Done" },
  statsHours: { ar: "إجمالي الوقت", en: "Total Time" },
  statsAccuracy: { ar: "متوسط الدقة", en: "Avg Accuracy" },
  statsEmpty: { ar: "لا توجد جلسات سابقة", en: "No previous sessions" },
  uploadPrompt: { ar: "أسقط ملفًا هنا أو انقر للاختيار", en: "Drop a file here or click to choose" },

  // generic
  you_said: { ar: "قلتَ", en: "You said" },
  expected: { ar: "الصحيح", en: "Expected" },
} as const;

export type StringKey = keyof typeof STRINGS;

export function t(key: StringKey, lang: Lang): string {
  return STRINGS[key][lang];
}
