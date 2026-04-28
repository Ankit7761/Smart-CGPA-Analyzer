const SectionCard = ({ title, children, action, className = "" }) => (
  <div className={`glass rounded-2xl ${className}`}>
    {title && (
      <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <h2 className="text-sm font-semibold tracking-wide" style={{ color: "var(--text-secondary)" }}>{title}</h2>
        {action}
      </div>
    )}
    <div className="p-6">{children}</div>
  </div>
);

export default SectionCard;
