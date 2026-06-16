import { useSession } from "@/store/sessionStore";
import { useSettings } from "@/store/settingsStore";
import { LandingScreen } from "@/screens/LandingScreen";
import { IdleScreen } from "@/screens/IdleScreen";
import { LockScreen } from "@/screens/LockScreen";
import { ListenScreen } from "@/screens/ListenScreen";
import { ReportScreen } from "@/screens/ReportScreen";

export default function App() {
  const phase = useSession((s) => s.phase);
  const entered = useSettings((s) => s.enteredApp);
  const setEntered = useSettings((s) => s.setEnteredApp);

  if (!entered) {
    return <LandingScreen onEnter={() => setEntered(true)} />;
  }

  return (
    <div className="app-shell">
      {phase === "idle" && <IdleScreen />}
      {phase === "locked" && <LockScreen />}
      {(phase === "listening" || phase === "paused") && <ListenScreen />}
      {phase === "report" && <ReportScreen />}
    </div>
  );
}
