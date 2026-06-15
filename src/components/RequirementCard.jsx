export default function RequirementCard({ req, catId, onChange, onSave }) {
  return (
    <div
      style={{
        marginTop: 12,
        opacity: req.saved ? 0.5 : 1
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <b>{req.title}</b>
        <span>{req.saved ? "🔒 LOCKED" : "✍️ INCOMPLETE"}</span>
      </div>

      <textarea
        value={req.evidenceText || ""}
        disabled={req.saved}
        onChange={(e) => onChange(catId, req.id, e.target.value)}
      />

      <div className="row">
        {req.saved ? (
          <div className="checkmark">✓ Completed</div>
        ) : (
          <button
            disabled={!req.evidenceText}
            onClick={() => onSave(catId, req.id)}
          >
            SAVE
          </button>
        )}
      </div>
    </div>
  );
}