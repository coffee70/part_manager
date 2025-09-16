import StepItem from "./step_item";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { TargetSteps } from "./types";
import { CheckIcon, PlayIcon, XIcon } from "lucide-react";
import { StepState } from "@/types/collections";
import { stepDropdownItemBackgroundVariants } from "@/components/ui/step";

type Props = {
    targetSteps?: TargetSteps;
    isOnLastStep: boolean;
    isPaused: boolean;
    isIdle: boolean;
    isCompleted: boolean;
    isStopped: boolean;
    onStepChange: (id: string) => void;
    onCompleteRoute: () => void;
    onStartRoute: () => void;
    onPauseRoute: () => void;
    onCompleteStep: () => void;
    onFailStep: () => void;
}

export default function TargetActions({
    targetSteps,
    isOnLastStep,
    isPaused,
    isIdle,
    isCompleted,
    isStopped,
    onStepChange,
    onCompleteRoute,
    onStartRoute,
    onCompleteStep,
    onFailStep
}: Props) {
    const nextStep = targetSteps?.next ?? null;
    const lastStep = targetSteps?.last ?? null;
    const previousStep = targetSteps?.previous ?? null;

    if (!isIdle && !isCompleted && !isStopped) return (
        <>
            <DropdownMenuItem
                onSelect={onCompleteStep}
                disabled={isPaused}
                className="group hover:bg-green-600 active:bg-green-700 focus:bg-green-600 transition-colors duration-150"
            >
                <div className="flex items-center justify-center space-x-6">
                    <div className="bg-green-100 p-1.5 rounded-full group-hover:bg-primary/20 transition-colors duration-150">
                        <CheckIcon size={18} className="text-green-600 group-hover:text-primary-foreground transition-colors duration-150" />
                    </div>
                    <span className="text-sm font-semibold text-text group-hover:text-primary-foreground transition-colors duration-150">Complete Step</span>
                </div>
            </DropdownMenuItem>
            <DropdownMenuItem
                onSelect={onFailStep}
                disabled={isPaused}
                className="group hover:bg-red-600 active:bg-red-700 focus:bg-red-600 transition-colors duration-150"
            >
                <div className="flex items-center justify-center space-x-6">
                    <div className="bg-red-100 p-1.5 rounded-full group-hover:bg-primary/20 transition-colors duration-150">
                        <XIcon size={18} className="text-red-600 group-hover:text-primary-foreground transition-colors duration-150" />
                    </div>
                    <span className="text-sm font-semibold text-text group-hover:text-primary-foreground transition-colors duration-150">Fail Step</span>
                </div>
            </DropdownMenuItem>
        </>
    )

    if (isStopped) return (
        <DropdownMenuItem
            onSelect={onStartRoute}
            disabled={isPaused}
            className="group hover:bg-green-600 active:bg-green-700 focus:bg-green-600 transition-colors duration-150"
        >
            <div className="flex items-center justify-center space-x-6">
                <div className="bg-green-100 p-1.5 rounded-full group-hover:bg-primary/20 transition-colors duration-150">
                    <PlayIcon size={18} className="text-green-600 group-hover:text-primary-foreground transition-colors duration-150" />
                </div>
                <span className="text-sm font-semibold text-text group-hover:text-primary-foreground transition-colors duration-150">Start Route</span>
            </div>
        </DropdownMenuItem>
    )

    return (
        <>
            {isOnLastStep && (
                <DropdownMenuItem
                    onSelect={onCompleteRoute}
                    disabled={isPaused}
                    className={`group transition-colors duration-150 ${stepDropdownItemBackgroundVariants({ variant: StepState.Completed })}`}
                >
                    <StepItem
                        step={{
                            id: "done",
                            name: "Done",
                            type: StepState.Completed
                        }}
                        pausedStyle={false}
                        idleStyle={false}
                        action="done"
                    />
                </DropdownMenuItem>
            )}
            {nextStep && (
                <DropdownMenuItem
                    key={nextStep.id}
                    onClick={() => onStepChange(nextStep.id)}
                    disabled={isPaused}
                    className={`group transition-colors duration-150 ${stepDropdownItemBackgroundVariants({ variant: nextStep.type })}`}
                >
                    <StepItem
                        step={{
                            id: nextStep.id,
                            name: nextStep.number,
                            type: nextStep.type
                        }}
                        pausedStyle={false}
                        idleStyle={false}
                        action="next"
                    />
                </DropdownMenuItem>
            )}
            {lastStep && (
                <DropdownMenuItem
                    key={lastStep.id}
                    onClick={() => onStepChange(lastStep.id)}
                    disabled={isPaused}
                    className={`group transition-colors duration-150 ${stepDropdownItemBackgroundVariants({ variant: lastStep.type })}`}
                >
                    <StepItem
                        step={{
                            id: lastStep.id,
                            name: lastStep.number,
                            type: lastStep.type
                        }}
                        pausedStyle={false}
                        idleStyle={false}
                        action="redo"
                    />
                </DropdownMenuItem>
            )}
            {previousStep && (
                <DropdownMenuItem
                    key={previousStep.id}
                    onClick={() => onStepChange(previousStep.id)}
                    disabled={isPaused}
                    className={`group transition-colors duration-150 ${stepDropdownItemBackgroundVariants({ variant: previousStep.type })}`}
                >
                    <StepItem
                        step={{
                            id: previousStep.id,
                            name: previousStep.number,
                            type: previousStep.type
                        }}
                        pausedStyle={false}
                        idleStyle={false}
                        action="back"
                    />
                </DropdownMenuItem>
            )}
        </>
    )
}