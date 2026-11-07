
import { useEffect, useState } from "react";

import {
  getSCPs,
  addSCP,
  updateSCP,
  deleteSCP
} from "../services/scpService";

import SCPCard from "./SCPCard";
import SCPform from "./SCPform";

function SCPDatabase({ user, isAdmin, onLogout }) {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadRecords() {
    setLoading(true);
    setError("");

    try {
      const data = await getSCPs();
      setRecords(data);
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadRecords();
  }, []);

  async function saveRecord(scp) {
    if (!isAdmin) return;

    if (editing) {
      await updateSCP(editing.id, scp);
    } else {
      await addSCP(scp);
    }

    setEditing(null);
    setShowForm(false);
    await loadRecords();
  }

  async function removeRecord(scp) {
    if (!isAdmin) return;

    const confirmed = window.confirm(
      `Delete ${scp.item}?`
    );

    if (!confirmed) return;

    try {
      await deleteSCP(scp.id);
      await loadRecords();
    } catch (err) {
      alert(err.message);
    }
  }

  function editRecord(scp) {
    if (!isAdmin) return;

    setEditing(scp);
    setShowForm(true);
  }

  const filtered = records.filter((scp) => {
    const text = [
      scp.item,
      scp.name,
      scp.class,
      scp.description
    ].join(" ").toLowerCase();

    return text.includes(search.toLowerCase());
  });

  return (
    <div className="app-container">
      <header className="header">
        <div>
          <h1>SCP Foundation</h1>
          <p>Secure SCP Records Database</p>
        </div>

        <div className="user-info">
          <span>{user.email}</span>

          <span className="role">
            {isAdmin ? "Administrator" : "Researcher"}
          </span>

          <button onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      <main>
        <div className="toolbar">
          <input
            type="text"
            placeholder="Search SCP records..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {isAdmin && (
            <button
              onClick={() => {
                setEditing(null);
                setShowForm(true);
              }}
            >
              + Add SCP
            </button>
          )}
        </div>

        <p className="record-count">
          Showing {filtered.length} of {records.length} SCP records
        </p>

        {error && <p className="error">{error}</p>}

        {loading ? (
          <p>Loading SCP records...</p>
        ) : (
          <>
            {isAdmin && showForm && (
              <SCPform
                key={editing?.id || "new"}
                scp={editing}
                onSave={saveRecord}
                onCancel={() => {
                  setShowForm(false);
                  setEditing(null);
                }}
              />
            )}

            <div className="scp-grid">
              {filtered.map((scp) => (
                <SCPCard
                  key={scp.id}
                  scp={scp}
                  isAdmin={isAdmin}
                  onEdit={editRecord}
                  onDelete={removeRecord}
                />
              ))}
            </div>

            {filtered.length === 0 && (
              <p>No SCP records found.</p>
            )}
          </>
        )}
      </main>

      <footer>
        SCP Foundation Research Catalogue
      </footer>
    </div>
  );
}

export default SCPDatabase;
