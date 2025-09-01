"use client";
import { CircleCheckIcon, CircleXIcon, PlayIcon, RotateCwIcon } from "lucide-react";
import { StepState } from "@/types/collections";
import { ActionButton } from "@/components/routes/components/action_button";

type InProgressControllerProps = {
    className?: string;
    onFailStep: () => void;
    onCompleteStep: () => void;
    disabled?: boolean;
}

function InProgressController({ className, onFailStep, onCompleteStep, disabled = false }: InProgressControllerProps) {
    return (
        <div className={`inline-flex items-center gap-2 ${className ?? ""}`}>
            <ActionButton
                icon={CircleXIcon}
                label="Fail step"
                onClick={onFailStep}
                state={StepState.Failed}
                disabled={disabled}
            />
            <ActionButton
                icon={CircleCheckIcon}
                label="Complete step"
                onClick={onCompleteStep}
                state={StepState.Completed}
                disabled={disabled}
            />
        </div>
    );
}

type NotStartedControllerProps = {
    onStartRoute: () => void;
    state: StepState;
    disabled?: boolean;
}

function NotStartedController({ onStartRoute, state, disabled = false }: NotStartedControllerProps) {
    return (
        <ActionButton
            icon={CircleCheckIcon}
            label="Start Route"
            onClick={onStartRoute}
            state={state}
            disabled={disabled}
        />
    );
}

type CompleteRouteControllerProps = {
    onCompleteRoute: () => void;
    state: StepState;
    disabled?: boolean;
}

function CompleteRouteController({ onCompleteRoute, state, disabled = false }: CompleteRouteControllerProps) {
    return (
        <ActionButton
            icon={CircleCheckIcon}
            label="Complete Route"
            onClick={onCompleteRoute}
            state={state}
            disabled={disabled}
        />
    );
}

type NextStepControllerProps = {
    onStartStep: () => void;
    state: StepState;
    disabled?: boolean;
}

function NextStepController({ onStartStep, state, disabled = false }: NextStepControllerProps) {
    return (
        <ActionButton
            icon={PlayIcon}
            label="Start Next Step"
            onClick={onStartStep}
            state={state}
            disabled={disabled}
        />
    );
}

type PreviousStepControllerProps = {
    onPreviousStep: () => void;
    state: StepState;
    disabled?: boolean;
}

function PreviousStepController({ onPreviousStep, state, disabled = false }: PreviousStepControllerProps) {
    return (
        <ActionButton
            icon={PlayIcon}
            label="Start Previous Step"
            onClick={onPreviousStep}
            state={state}
            disabled={disabled}
        />
    );
}

type RedoStepControllerProps = {
    onRedoStep: () => void;
    state: StepState;
    disabled?: boolean;
}

function RedoStepController({ onRedoStep, state, disabled = false }: RedoStepControllerProps) {
    return (
        <ActionButton
            icon={RotateCwIcon}
            label="Redo Step"
            onClick={onRedoStep}
            state={state}
            disabled={disabled}
        />
    );
}

export {
    InProgressController,
    NotStartedController,
    CompleteRouteController,
    NextStepController,
    PreviousStepController,
    RedoStepController
};