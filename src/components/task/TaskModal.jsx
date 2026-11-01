import { useBoard } from "../../context/AppContext";
import Modal from "../ui/Modal";
import TaskForm from "./TaskForm";

// The create / edit dialog. Mount it once in App; the context decides when it shows.
export default function TaskModal() {
  const { modal, addTask, updateTask, closeModal } = useBoard();
  if (!modal.mode) return null;

  const isEdit = modal.mode === "edit";

  // The form hands back clean values; here they become a new task or an update.
  const handleSubmit = (values) => {
    if (isEdit) updateTask(modal.task.id, values);
    else addTask(values);
    closeModal();
  };

  return (
    <Modal title={isEdit ? "Edit task" : "New task"} onClose={closeModal}>
      <TaskForm
        initial={modal.task}
        defaultStatus={modal.status}
        submitLabel={isEdit ? "Save changes" : "Add task"}
        onSubmit={handleSubmit}
        onCancel={closeModal}
      />
    </Modal>
  );
}