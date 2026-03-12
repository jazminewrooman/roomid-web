type Step = {
  label: string;
  state: "done" | "active" | "todo";
};

type StepStatusProps = {
  steps: Step[];
};

export function StepStatus({ steps }: StepStatusProps) {
  return (
    <ol className="step-status-list">
      {steps.map((step) => (
        <li key={step.label} className={`step-status-item step-status-${step.state}`}>
          <span className="step-dot" aria-hidden />
          <span>{step.label}</span>
        </li>
      ))}
    </ol>
  );
}
