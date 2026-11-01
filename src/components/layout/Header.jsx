import { Plus } from "lucide-react";
import { useBoard } from "../../context/AppContext";
import Button from "../ui/Button";

// Brand on the left, the one primary action on the right.
export default function Header() {
  const { openCreate } = useBoard();

  return (
    <header className="border-b border-line-subtle bg-container">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-3 md:px-8">
        <div className="flex items-center gap-3">
          {/* Decorative: the brand name sits right beside it */}
          <img src="/logo.png" alt="" className="size-9 rounded-full" />
          <h1 className="text-xl leading-[26px] font-semibold tracking-tight">FlowDeck</h1>
        </div>

        {/* Arrow function on purpose: passing openCreate directly would hand it the click event as the column */}
        <Button variant="primary" icon={Plus} aria-label="New task" onClick={() => openCreate()}>
          <span className="hidden sm:inline">New task</span>
        </Button>
      </div>
    </header>
  );
}