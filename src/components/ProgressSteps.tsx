import { Check, Loader2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface Step {
  label: string;
  completed: boolean;
  active: boolean;
}

interface ProgressStepsProps {
  steps: Step[];
  progress: number;
}

export function ProgressSteps({ steps, progress }: ProgressStepsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Progreso</span>
        <span className="font-medium text-primary">{progress}%</span>
      </div>
      
      <Progress value={progress} className="h-2" />
      
      <div className="space-y-2 pt-2">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs",
                step.completed
                  ? "bg-success text-success-foreground"
                  : step.active
                  ? "bg-info text-info-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {step.completed ? (
                <Check className="h-3.5 w-3.5" />
              ) : step.active ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Clock className="h-3.5 w-3.5" />
              )}
            </div>
            <span
              className={cn(
                "text-sm",
                step.completed
                  ? "text-foreground"
                  : step.active
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              )}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
