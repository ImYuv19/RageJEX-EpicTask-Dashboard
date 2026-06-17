import { useState } from "react";
import { Save } from "lucide-react";
import { useAppData } from "../../context/AppDataContext.jsx";
import { Button } from "../common/Button.jsx";

export function MemberForm({ member, onSubmit, onCancel }) {
  const { members } = useAppData();
  const [values, setValues] = useState({
    name: member?.name || "",
    role: member?.role || "",
  });
  const [errors, setErrors] = useState({});

  const updateField = (field, value) => {
    setValues((currentValues) => ({ ...currentValues, [field]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [field]: "" }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!values.name.trim()) {
      nextErrors.name = "Member name is required.";
    } else {
      const nameConflict = members.some(
        (m) =>
          m.id !== member?.id &&
          m.name.toLowerCase() === values.name.trim().toLowerCase()
      );
      if (nameConflict) {
        nextErrors.name = "A team member with this name already exists.";
      }
    }

    if (!values.role.trim()) {
      nextErrors.role = "Role is required.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;
    onSubmit(values);
    onCancel();
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="form-label" htmlFor="member-name">
          Full Name
        </label>
        <input
          className="form-input"
          id="member-name"
          value={values.name}
          onChange={(event) => updateField("name", event.target.value)}
          placeholder="e.g. Liam Johnson"
        />
        {errors.name ? <p className="form-error">{errors.name}</p> : null}
      </div>

      <div className="space-y-2">
        <label className="form-label" htmlFor="member-role">
          Role
        </label>
        <input
          className="form-input"
          id="member-role"
          value={values.role}
          onChange={(event) => updateField("role", event.target.value)}
          placeholder="e.g. Backend Developer"
        />
        {errors.role ? <p className="form-error">{errors.role}</p> : null}
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" icon={Save}>
          {member ? "Save Changes" : "Create Member"}
        </Button>
      </div>
    </form>
  );
}
