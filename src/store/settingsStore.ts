import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Difficulty, AttachedFile, SessionHistoryEntry } from "@/types";

interface SettingsState {
  enteredApp: boolean;
  referenceText: string;
  emergencyContacts: string;
  durationMin: number;
  hesitationMs: number;
  subject: string;
  difficulty: Difficulty;
  sessionType: "free" | "compare";
  attachments: AttachedFile[];
  sessionHistory: SessionHistoryEntry[];

  setEnteredApp: (v: boolean) => void;
  setReferenceText: (v: string) => void;
  setEmergencyContacts: (v: string) => void;
  setDurationMin: (v: number) => void;
  setHesitationMs: (v: number) => void;
  setSubject: (v: string) => void;
  setDifficulty: (v: Difficulty) => void;
  setSessionType: (v: "free" | "compare") => void;
  addAttachment: (v: AttachedFile) => void;
  removeAttachment: (id: string) => void;
  pushSession: (v: SessionHistoryEntry) => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      enteredApp: false,
      referenceText: "",
      emergencyContacts: "",
      durationMin: 25,
      hesitationMs: 3500,
      subject: "",
      difficulty: "medium",
      sessionType: "free",
      attachments: [],
      sessionHistory: [],
      setEnteredApp: (enteredApp) => set({ enteredApp }),
      setReferenceText: (referenceText) => set({ referenceText }),
      setEmergencyContacts: (emergencyContacts) => set({ emergencyContacts }),
      setDurationMin: (durationMin) => set({ durationMin }),
      setHesitationMs: (hesitationMs) => set({ hesitationMs }),
      setSubject: (subject) => set({ subject }),
      setDifficulty: (difficulty) => set({ difficulty }),
      setSessionType: (sessionType) => set({ sessionType }),
      addAttachment: (attachment) =>
        set((s) => ({ attachments: [...s.attachments, attachment] })),
      removeAttachment: (id) =>
        set((s) => ({ attachments: s.attachments.filter((a) => a.id !== id) })),
      pushSession: (entry) =>
        set((s) => ({ sessionHistory: [entry, ...s.sessionHistory].slice(0, 50) })),
    }),
    { name: "deepfocus-settings" },
  ),
);
