interface CodeSurfaceProps {
  heading: string;
  content: string;
  annotate?: "proposed" | "patch";
  variant?: "code" | "validation";
  highlightRange?: { startLine: number; endLine: number };
}

export function CodeSurface({ heading, content, annotate, variant = "code", highlightRange }: CodeSurfaceProps) {
  const lines = content.split("\n");
  return (
    <div className={`code-surface code-${variant} ${annotate ? `has-${annotate}` : ""}`}>
      <div className="code-heading">
        <span>{heading}</span>
        {annotate === "proposed" ? <strong>Proposed block</strong> : null}
        {annotate === "patch" ? <strong>Patch location</strong> : null}
      </div>
      <pre>
        {lines.map((line, index) => {
          const lineNumber = index + 1;
          const highlighted = highlightRange && lineNumber >= highlightRange.startLine && lineNumber <= highlightRange.endLine;
          return (
            <span className={`source-line ${highlighted ? "is-highlighted" : ""}`} key={`${lineNumber}-${line}`}>
              {line}
              {index < lines.length - 1 ? "\n" : ""}
            </span>
          );
        })}
      </pre>
    </div>
  );
}
