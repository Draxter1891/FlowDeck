import { Plus } from "lucide-react";
import { useBoard } from "../../context/AppContext";
import Button from "../ui/Button";

export default function Header() {
  const { openCreate } = useBoard();

  return (
    <header className="border-b border-line-subtle bg-container">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-3 md:px-8">
        <div className="flex items-center gap-3">
         
          <img src="/logo.png" alt="" className="size-9 rounded-full" />
          <h1 className="text-xl leading-[26px] font-semibold tracking-tight">FlowDeck</h1>
        </div>

       
        <Button variant="primary" icon={Plus} aria-label="New task" onClick={() => openCreate()}>
          <span className="hidden sm:inline">New task</span>
        </Button>
      </div>
    </header>
  );
}