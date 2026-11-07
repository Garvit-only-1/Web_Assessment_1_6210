
import { useState } from "react";
import { uploadImage } from "../services/scpService";

function SCPform({ scp, onSave, onCancel }) {
  const [form, setForm] = useState({
    item: scp?.item || "",
    name: scp?.name || "",
    class: scp?.class || "Safe",
    description: scp?.description || "",
    containment: scp?.containment || "",
    image_url: scp?.image_url || ""
  });

  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function change(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function submit(e) {
    e.preventDefault();

    setSaving(true);
    setError("");

    try {
      let imageUrl = form.image_url;

      if (file) {
        imageUrl = await uploadImage(file);
      }

      await onSave({
        ...form,
        image_url: imageUrl || null
      });
    } catch (err) {
      setError(err.message);
    }

    setSaving(false);
  }

  return (
    <form className="scp-form" onSubmit={submit}>
      <h2>{scp ? "Edit SCP" : "Add New SCP"}</h2>

      <label>Item Number</label>
      <input
        name="item"
        value={form.item}
        onChange={change}
        placeholder="SCP-023"
        required
      />

      <label>Name</label>
      <input
        name="name"
        value={form.name}
        onChange={change}
        required
      />

      <label>Object Class</label>
      <select
        name="class"
        value={form.class}
        onChange={change}
      >
        <option value="Safe">Safe</option>
        <option value="Euclid">Euclid</option>
        <option value="Keter">Keter</option>
        <option value="Thaumiel">Thaumiel</option>
      </select>

      <label>Description</label>
      <textarea
        name="description"
        value={form.description}
        onChange={change}
        required
      />

      <label>Containment Procedures</label>
      <textarea
        name="containment"
        value={form.containment}
        onChange={change}
        required
      />

      <label>Image URL or Local Path</label>
      <input
        name="image_url"
        value={form.image_url}
        onChange={change}
        placeholder="/Images/example.jpg"
      />

      <label>Or Upload Image</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />

      {error && <p className="error">{error}</p>}

      <div className="form-buttons">
        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save SCP"}
        </button>

        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default SCPform;
