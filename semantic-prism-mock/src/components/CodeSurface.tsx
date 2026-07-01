interface CodeSurfaceProps {
  heading: string;
  content: string;
  annotate?: "proposed" | "patch";
  variant?: "code" | "validation";
}

export function CodeSurface({ heading, content, annotate, variant = "code" }: CodeSurfaceProps) {
  return (
    <div className={`code-surface code-${variant} ${annotate ? `has-${annotate}` : ""}`}>
      <div className="code-heading">
        <span>{heading}</span>
        {annotate === "proposed" ? <strong>Proposed block</strong> : null}
        {annotate === "patch" ? <strong>Patch location</strong> : null}
      </div>
      <pre>{content}</pre>
    </div>
  );
}
