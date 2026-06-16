import type { Lang } from "@/types";
import { useI18n } from "./index";

interface IconCard {
  title: string;
  body: string;
}
interface Step {
  title: string;
  body: string;
}

export interface LandingCopy {
  nav: { features: string; how: string; start: string };
  hero: {
    badge: string;
    titleA: string;
    titleB: string;
    titleC: string;
    sub: string;
    ctaPrimary: string;
    ctaSecondary: string;
    note: string;
  };
  preview: { time: string; acc: string; listening: string };
  problem: { eyebrow: string; title: string; sub: string; cards: IconCard[] };
  how: { eyebrow: string; title: string; sub: string; steps: Step[] };
  features: { eyebrow: string; title: string; sub: string; items: IconCard[] };
  value: { a: string; b: string; c: string; d: string; res: string };
  final: { title: string; sub: string; cta: string };
  footer: { tagline: string; note: string };
}

/** All landing-page copy, Arabic-first with an English mirror. */
const LANDING: Record<Lang, LandingCopy> = {
  ar: {
    nav: { features: "المميزات", how: "كيف يعمل", start: "ابدأ الآن" },
    hero: {
      badge: "وضع التركيز العميق",
      titleA: "ادرس بصوتك،",
      titleB: "ودع معلّمك الذكي",
      titleC: "يكشف نقاط ضعفك",
      sub: "حصن التركيز يقفل المشتتات، يستمع إلى تسميعك، يصحّحه لحظيًا أمام النص الأصلي، ويحوّل أخطاءك إلى بطاقات مراجعة وخريطة ضعف.",
      ctaPrimary: "ابدأ جلسة المذاكرة",
      ctaSecondary: "شاهد كيف يعمل",
      note: "مجانًا · بدون تسجيل · يعمل على Chrome و Edge",
    },
    preview: { time: "١٨:٤٢", acc: "٪٨٦ دقة", listening: "يستمع…" },
    problem: {
      eyebrow: "لماذا حصن التركيز؟",
      title: "ثلاث مشكلات تقتل مذاكرتك… نحلّها كلها",
      sub: "ليست المشكلة في قلة الوقت، بل في طريقة المذاكرة نفسها.",
      cards: [
        {
          title: "شرود الذهن",
          body: "تقرأ صفحة كاملة ثم تكتشف أن عقلك كان في وادٍ آخر. حين تعلم أن المعلّم يستمع ويحلّل كل كلمة، يُجبَر ذهنك على التركيز — فأنت الآن في امتحان شفهي حقيقي.",
        },
        {
          title: "وهم الإتقان",
          body: "أكبر خدعة في الدراسة: تقرأ وتقول «فهمت»، ثم تعجز عن الشرح. حصن التركيز يكشف هذا الوهم فورًا في اللحظة التي تحاول فيها أن تسمّع بصوتك.",
        },
        {
          title: "ضياع وقت المراجعة",
          body: "بدل كتابة الملخصات وتظليل الكتب لساعات: ذاكر بصوتك مرة واحدة، والبرنامج يكتب الملخص ويحدّد ضعفك ويصنع بطاقاتك.",
        },
      ],
    },
    how: {
      eyebrow: "كيف يعمل",
      title: "ثلاث خطوات، وأنت داخل الحصن",
      sub: "من ضغطة البدء إلى التقرير الكامل.",
      steps: [
        {
          title: "ابدأ وادخل وضع التركيز",
          body: "بضغطة زر يُقفَل كل شيء عداي: لا إشعارات، لا تطبيقات، لا مشتتات. شاشة هادئة، مؤقّت، وزر «تحدّث» كبير.",
        },
        {
          title: "تحدّث، وأنا أستمع وأحلّل",
          body: "أحوّل صوتك إلى نص فورًا، أقارن ما تقوله بالنص الأصلي، أميّز الأخطاء بالألوان، وأرصد لحظات ترددك وتوقفك تلقائيًا.",
        },
        {
          title: "استلم تقريرك الفوري",
          body: "ملخص كامل لما قلته، بطاقات مراجعة تلقائية لما أخطأت أو ترددت فيه، وخريطة تُظهر لك مكان ضعفك بالضبط.",
        },
      ],
    },
    features: {
      eyebrow: "المميزات",
      title: "معلّم كامل في جيبك",
      sub: "كل ما تحتاجه لتحويل التسميع إلى مذاكرة فعّالة.",
      items: [
        { title: "تحويل الصوت إلى نص", body: "تفريغ فوري لكل كلمة تقولها أثناء التسميع." },
        { title: "المقارنة الذكية", body: "مقارنة لحظية بالنص الأصلي مع تمييز الأخطاء والنسيان بالألوان." },
        { title: "رصد التردد", body: "يلتقط لحظات الحَيرة والتوقف الطويل ويعتبرها نقاط ضعف." },
        { title: "بطاقات تلقائية", body: "يحوّل أخطاءك إلى بطاقات سؤال وجواب جاهزة للمراجعة." },
        { title: "خريطة نقاط الضعف", body: "مخطط بسيط يريك أين تتركّز أخطاؤك في الدرس." },
        { title: "قفل التركيز", body: "ملء الشاشة ومنع المشتتات، مع رصد كل خروج عن التركيز." },
      ],
    },
    value: {
      a: "المذاكرة",
      b: "التسميع",
      c: "كتابة الملخص",
      d: "تحديد الضعف",
      res: "في خطوة واحدة",
    },
    final: {
      title: "جاهز لتدخل الحصن؟",
      sub: "ابدأ أول جلسة تركيز الآن — وستكتشف ما لم تكن تتقنه فعلًا.",
      cta: "ابدأ جلسة المذاكرة",
    },
    footer: { tagline: "حصن التركيز · معلّمك الخاص", note: "يعمل بأفضل صورة على Chrome و Edge." },
  },

  en: {
    nav: { features: "Features", how: "How it works", start: "Get started" },
    hero: {
      badge: "Deep Focus Mode",
      titleA: "Study aloud,",
      titleB: "let your smart tutor",
      titleC: "expose your weak spots",
      sub: "DeepFocus locks out distractions, listens to your recitation, corrects it live against the source text, and turns mistakes into review flashcards and a weakness map.",
      ctaPrimary: "Start a study session",
      ctaSecondary: "See how it works",
      note: "Free · No sign-up · Works on Chrome & Edge",
    },
    preview: { time: "18:42", acc: "86% accuracy", listening: "listening…" },
    problem: {
      eyebrow: "Why DeepFocus?",
      title: "Three things that kill your studying — all solved",
      sub: "The problem isn't time. It's the way you study.",
      cards: [
        {
          title: "Mind wandering",
          body: "You read a whole page, then realize your mind was elsewhere. When you know the tutor is listening and analyzing every word, focus becomes mandatory — you're in a real oral exam.",
        },
        {
          title: "The illusion of mastery",
          body: "Study's biggest trick: you read and think 'I get it', then can't explain it. DeepFocus exposes that illusion the instant you try to recite it aloud.",
        },
        {
          title: "Wasted review time",
          body: "Instead of writing summaries and highlighting books for hours: study aloud once, and the app writes the summary, finds your weak spots, and makes your cards.",
        },
      ],
    },
    how: {
      eyebrow: "How it works",
      title: "Three steps and you're inside the fortress",
      sub: "From one tap to a full report.",
      steps: [
        {
          title: "Start & enter Focus Mode",
          body: "One tap locks everything but me: no notifications, no apps, no distractions. A calm screen, a timer, and one big 'Speak' button.",
        },
        {
          title: "Speak — I listen & analyze",
          body: "I transcribe every word live, compare it to the source text, color your mistakes, and automatically flag your hesitations and long pauses.",
        },
        {
          title: "Get your instant report",
          body: "A full summary of what you said, auto-generated flashcards for what you missed, and a map showing exactly where your weaknesses are.",
        },
      ],
    },
    features: {
      eyebrow: "Features",
      title: "A complete tutor in your pocket",
      sub: "Everything you need to turn recitation into real studying.",
      items: [
        { title: "Voice-to-text", body: "Instant transcription of every word you recite." },
        { title: "Smart comparison", body: "Live comparison to the source, color-coding mistakes and omissions." },
        { title: "Hesitation detection", body: "Catches moments of doubt and long pauses as weak points." },
        { title: "Auto flashcards", body: "Turns your mistakes into ready Q&A cards for review." },
        { title: "Weakness map", body: "A simple chart showing where your errors cluster in the lesson." },
        { title: "Focus lock", body: "Fullscreen, distraction-free, with every focus break detected." },
      ],
    },
    value: {
      a: "Studying",
      b: "recitation",
      c: "writing the summary",
      d: "finding weak spots",
      res: "in one step",
    },
    final: {
      title: "Ready to enter the fortress?",
      sub: "Start your first focus session now — and discover what you hadn't truly mastered.",
      cta: "Start a study session",
    },
    footer: { tagline: "DeepFocus Learn · Your private tutor", note: "Works best on Chrome & Edge." },
  },
};

export function useLanding(): LandingCopy {
  const lang = useI18n((s) => s.lang);
  return LANDING[lang];
}
