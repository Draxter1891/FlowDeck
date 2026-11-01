import Header from "./components/layout/Header";
import StatsStrip from "./components/stats/StatsStrip";
import Toolbar from "./components/toolbar/Toolbar";
import Board from "./components/board/Board";
import TaskModal from "./components/task/TaskModal";

// The page shell. All the state lives in AppContext, so this just lays things out.
export default function App() {
  return (
    <div className="min-h-dvh">
      <Header />
      <main className="mx-auto max-w-[1400px] space-y-3 px-4 py-4 md:space-y-5 md:px-8 md:py-6">
        <StatsStrip />
        <Toolbar />
        <Board />
      </main>

      {/* Mounted once; it renders only while the context says a dialog is open */}
      <TaskModal />
    </div>
  );
}