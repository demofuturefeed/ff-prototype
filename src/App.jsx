import { useEffect, useState } from "react";

export default function App() {
  const [categories, setCategories] = useState([]);

  // ----------------------------
  // LOAD DATA
  // ----------------------------
  useEffect(() => {
    (async () => {
      const res = await fetch("http://localhost:8080/api/requirements");
      const data = await res.json();

      const normalized = data.categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        requirements: cat.requirements.map(req => ({
          ...req,
          evidenceText: (req.evidence || []).map(e => e.name).join("\n"),
          saved: req.evidence?.length > 0
        }))
      }));

      setCategories(normalized);
    })();
  }, []);

  // ----------------------------
  // UPDATE INPUT
  // ----------------------------
  const updateRequirement = (catId, reqId, value) => {
    setCategories(prev =>
      prev.map(cat => {
        if (cat.id !== catId) return cat;

        return {
          ...cat,
          requirements: cat.requirements.map(req => {
            if (req.id !== reqId) return req;
            if (req.saved) return req;

            return {
              ...req,
              evidenceText: value
            };
          })
        };
      })
    );
  };

  // ----------------------------
  // SAVE (LOCK TASK)
  // ----------------------------
  const saveRequirement = async (catId, reqId) => {
    const cat = categories.find(c => c.id === catId);

    const res = await fetch(
      `http://localhost:8080/api/categories/${catId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requirements: cat.requirements
        })
      }
    );

    if (!res.ok) return;

    setCategories(prev =>
      prev.map(cat => {
        if (cat.id !== catId) return cat;

        return {
          ...cat,
          requirements: cat.requirements.map(r =>
            r.id === reqId ? { ...r, saved: true } : r
          )
        };
      })
    );
  };

  // ----------------------------
  // PROGRESS
  // ----------------------------
  const allReqs = categories.flatMap(c => c.requirements);
  const completed = allReqs.filter(r => r.saved).length;
  const total = allReqs.length;

  const progress = total ? Math.round((completed / total) * 100) : 0;
  const allComplete = completed === total;

  // ----------------------------
  // SUBMIT
  // ----------------------------
  const handleSubmit = () => {
    if (!allComplete) return;
    alert("🏆 All tasks completed successfully.");
    window.location.reload();
  };

  return (
    <>
      {/* HEADER */}
      <div className="nav">
        <div className="nav-top">
          <h2>Prototype</h2>

          <div className="nav-metrics">
            <div className="metric">
              <b>{progress}</b>% Ready
            </div>
            <div className="metric">
              <b>{completed}</b> Complete
            </div>
          </div>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* BODY */}
      <div className="container" style={{ display: "flex", gap: 24 }}>
        <div className="sidebar">
          <b>Domains</b>
          {categories.map(c => (
            <div key={c.id}>{c.name}</div>
          ))}
        </div>

        <div style={{ flex: 1 }}>
          {categories.map(cat => (
            <div className="card" key={cat.id}>
              <h3>{cat.name}</h3>

              {cat.requirements.map(req => (
                <div
                  key={req.id}
                  style={{
                    marginTop: 12,
                    opacity: req.saved ? 0.5 : 1
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <b>{req.title}</b>
                    <span>
                      {req.saved ? "🔒 LOCKED" : "✍️ INCOMPLETE"}
                    </span>
                  </div>

                  <textarea
                    value={req.evidenceText || ""}
                    disabled={req.saved}
                    className={!req.saved ? "incomplete" : ""}
                    onChange={(e) =>
                      updateRequirement(cat.id, req.id, e.target.value)
                    }
                  />

                  <div className="row">
                    {req.saved ? (
                      <div className="checkmark">✓ Completed</div>
                    ) : (
                      <button
                        disabled={!req.evidenceText}
                        onClick={() => saveRequirement(cat.id, req.id)}
                      >
                        SAVE
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}

          <div className="row">
            <button disabled={!allComplete} onClick={handleSubmit}>
              SUBMIT
            </button>
          </div>
        </div>
      </div>
    </>
  );
}