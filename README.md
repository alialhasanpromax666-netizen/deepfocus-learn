# حصن التركيز · DeepFocus Learn

An oral-study tutor that locks you into deep focus, transcribes your recitation in
real time, highlights mistakes against a reference text, flags hesitations, and turns
your weak points into review flashcards + a weakness map.

> **Why it works:** when you know the tutor is listening and comparing every word, your
> mind is forced to focus — you're in an oral exam. It also kills the *illusion of
> mastery*: reading a page and thinking "I get it" is exposed the moment you have to say
> it aloud.

This repository is an **MVP web-app scaffold** — a clean, typed foundation with the
hard parts (STT abstraction, diff engine, session orchestration) already built, ready
to extend into a production app or wrap in a native shell.

Bilingual: **Arabic (RTL, default)** with an **English (LTR)** toggle.

## Run

```bash
npm install
npm run dev          # http://localhost:5173
npm run typecheck    # tsc, no emit
npm run build        # production build
```

Use **Chrome or Edge** — speech recognition uses the Web Speech API. Grant microphone
access when prompted.

## User journey

0. **Landing page** — a professional, RTL-first marketing page (hero + in-product
   preview, the problems it solves, how it works, features, value pitch, final CTA).
   Any "Start" button enters the app. It's `src/screens/LandingScreen.tsx`, gated by an
   `entered` flag in `App.tsx` — to launch straight into the tool, default that to `true`.
1. **Idle / setup** — paste the lesson text (optional), pick a session length, list
   emergency contacts → *Start Study Session*.
2. **Lock** — *Deep Focus Mode*. On the web this is best-effort (see below); a native
   build enforces real app/notification locking.
3. **Listen** — tap *Speak* and recite. Live transcript appears; against a reference,
   correct words turn green, mistakes get a red wavy underline, skipped words are struck
   through. Long silences are flagged as hesitations. Focus breaks raise a warning.
4. **Report** — accuracy, full summary, auto-generated flashcards (cloze questions from
   your weak spots), and a per-sentence weakness map. Export as JSON.

## Architecture

```
src/
  audio/      STT abstraction + Web Speech impl, mic meter, hesitation detector
  compare/    Arabic-aware tokenizer/normalizer + edit-distance diff engine
  focus/      best-effort web focus lock (fullscreen, wake lock, break detection)
  store/      Zustand: session orchestration + persisted settings
  cards/      report builder: weak points -> flashcards + weakness map
  screens/    Idle · Lock · Listen · Report
  components/ Timer, MicButton, TranscriptView, WeaknessMap, Flashcard, LangToggle
  i18n/       Arabic/English dictionaries + dir switching
```

### Key design decisions

- **STT is an interface, not a dependency.** `audio/types.ts` defines `SpeechProvider`;
  `WebSpeechProvider` implements it. Swap in Whisper/Google/Deepgram by writing one class
  and changing the factory in `audio/index.ts` — nothing else changes.
- **Comparison normalizes Arabic before matching.** Recitation drops tashkeel and varies
  alef/hamza/taa-marbuta forms. `compare/tokenize.ts` folds these away for *matching* while
  keeping the original surface form for *display*. The diff is a token-level
  Needleman–Wunsch alignment yielding `match / substitution / omission / insertion` ops —
  these drive both the live highlighting and the weak-point list.
- **Focus lock is honest about the web's limits.** A browser tab can't block other apps or
  notifications — only a native shell can. `focus/focusMode.ts` does what the web *can*
  (fullscreen + wake lock + detecting tab-hide/blur/fullscreen-exit as "focus breaks") and
  exposes a `FocusController` interface that a Capacitor/Tauri/Electron module can reimplement
  with real OS-level locking.
- **Hesitation = a long gap between recognized speech.** `audio/hesitation.ts` is
  time-source-injectable so it stays deterministic and testable.

### Native / mobile path

The phone + desktop "full lock" experience is a native concern. Wrap this web app with
**Capacitor** (iOS/Android) or **Tauri/Electron** (desktop) and implement `FocusController`
against platform APIs (Android Screen Pinning / iOS Guided Access / Focus filters, OS
notification suppression, allow-listed emergency contacts). The web layer already speaks to
that seam.

## What's intentionally left as next steps

- Persisting past sessions / spaced-repetition scheduling for the flashcards.
- A cloud STT provider for better Arabic accuracy and offline-recorded audio.
- Server-side LLM summarization of the transcript (the current summary is the raw text).
- Real OS-level lock via a native shell.
```
