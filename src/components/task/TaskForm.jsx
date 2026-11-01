import { useState } from "react";
import { PRIORITIES, STATUSES } from "../../constants/board";
import Button from "../ui/Button";
import Select from "../ui/Select";

const STATUS_OPTIONS = STATUSES.map((s) => ({ value: s.id, label: s.label }));

// Starting values: a saved task when editing, a blank one when creating.
const initialValues = (task, status) => ({
  title: task?.title ?? "",
  description: task?.description ?? "",
  priority: task?.priority ?? "medium",
  dueDate: task?.dueDate ?? "",
  status: task?.status ?? status,
});

// Only the title is required: a task can exist before it has a date or notes.
const validate = (values) => {
  const errors = {};
  if (!values.title.trim()) errors.title = "Give the task a title.";
  return errors;
};

// Label above a control, with an error message below it when something is wrong.
function Field({ label, error, children }) {
  return (
    <div>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">{label}</span>
        {children}
      </label>
      {error && (
        <p role="alert" className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

// Used for both creating and editing. It only collects and checks values;
// whether they become a new task or an update is the modal's decision.
export default function TaskForm({ initial, defaultStatus, submitLabel, onSubmit, onCancel }) {
  const [values, setValues] = useState(() => initialValues(initial, defaultStatus));
  const [errors, setErrors] = useState({});

  // Returns a change handler for one field. Typing in the title clears its error.
  const set = (key) => (e) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    if (key === "title") setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate(values);
    if (Object.keys(found).length) return setErrors(found);
    onSubmit({
      ...values,
      title: values.title.trim(),
      description: values.description.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <Field label="Title" error={errors.title}>
        <input
          data-autofocus
          value={values.title}
          onChange={set("title")}
          maxLength={80}
          placeholder="What needs doing?"
          aria-invalid={Boolean(errors.title)}
          className="field w-full px-3.5 py-2 text-sm"
        />
      </Field>

      <Field label="Description">
        <textarea
          value={values.description}
          onChange={set("description")}
          maxLength={300}
          rows={3}
          placeholder="Add any detail that helps"
          className="field w-full resize-none px-3.5 py-2 text-sm"
        />
      </Field>

      {/* Radios styled as chips: the selected one wears its priority colors */}
      <fieldset>
        <legend className="mb-1.5 text-sm font-medium">Priority</legend>
        <div className="grid grid-cols-3 gap-2">
          {PRIORITIES.map((p) => {
            const selected = values.priority === p.id;
            return (
              <label
                key={p.id}
                className={`cursor-pointer rounded-sm border px-3 py-2 text-center text-sm transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent ${
                  selected ? p.badge : "border-line-subtle bg-track text-muted hover:border-line"
                }`}
              >
                <input
                  type="radio"
                  name="priority"
                  value={p.id}
                  checked={selected}
                  onChange={set("priority")}
                  className="sr-only"
                />
                {p.label}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Due date">
          <input
            type="date"
            value={values.dueDate}
            onChange={set("dueDate")}
            className="field w-full px-3.5 py-2 text-sm [color-scheme:dark]"
          />
        </Field>
        <Select
          label="Status"
          showLabel
          value={values.status}
          onChange={(status) => setValues((v) => ({ ...v, status }))}
          options={STATUS_OPTIONS}
        />
      </div>

      <div className="flex justify-end gap-2 border-t border-line-subtle pt-4">
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="primary">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}