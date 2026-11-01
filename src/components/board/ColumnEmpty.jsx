import { Inbox, Plus, SearchX } from "lucide-react";
import { useBoard } from "../../context/AppContext";
import Button from "../ui/Button";
import EmptyState from "../ui/EmptyState";

// What an empty column says. Shared by desktop and mobile, and it tells
// "nothing here yet" apart from "your filters are hiding everything".
export default function ColumnEmpty({ status }) {
  const { hasActiveFilters, openCreate } = useBoard();

  if (hasActiveFilters) {
    return (
      <EmptyState
        icon={SearchX}
        title="No matching tasks"
        description="Nothing in this column fits the current search or filters."
      />
    );
  }

  return (
    <EmptyState
      icon={Inbox}
      title="Nothing here yet"
      description="Add a task here, or move one in from another column."
      action={
        <Button icon={Plus} onClick={() => openCreate(status.id)}>
          Add task
        </Button>
      }
    />
  );
}