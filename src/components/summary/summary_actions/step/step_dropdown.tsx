'use client'
import React from 'react';
import { StepType } from "@/types/collections";
import StepButton from "./step_button";
import {
    DropdownMenu,
    DropdownMenuGroup,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuSubContent,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubTrigger
} from '@/components/ui/dropdown-menu'
import StepItem from "./step_item";
import {
    RouteIcon,
    TrashIcon,
    ListIcon,
    LinkIcon,
    PauseIcon,
    SquareIcon,
    PlayIcon,
    PencilIcon
} from "lucide-react";

interface TargetStep {
    id: string;
    instanceId: string;
    number: string;
    type: StepType;
}

interface StepDropdownProps {
    currentStep: any;
    targetSteps?: TargetStep[] | null;
    isPaused: boolean;
    isCompleted: boolean;
    isStopped: boolean;
    isOnLastStep: boolean;
    onStepChange: (id: string) => void;
    onDeleteClick: () => void;
    onOpenRouteListView: () => void;
    onViewCurrentStep: () => void;
    onViewRoute: () => void;
    onPauseRoute: () => void;
    onStopRoute: () => void;
    onResumeRoute: () => void;
    onCompleteRoute: () => void;
}

/**
 * A dropdown menu component for the Step UI
 */
export default function StepDropdown({
    currentStep,
    targetSteps,
    isPaused,
    isCompleted,
    isStopped,
    isOnLastStep,
    onStepChange,
    onDeleteClick,
    onOpenRouteListView,
    onViewCurrentStep,
    onViewRoute,
    onPauseRoute,
    onStopRoute,
    onResumeRoute,
    onCompleteRoute
}: StepDropdownProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <StepButton step={currentStep} isPaused={isPaused} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
                <DropdownMenuGroup>
                    {isOnLastStep && (
                        <DropdownMenuItem
                            onSelect={onCompleteRoute}
                            disabled={isPaused}
                        >
                            <StepItem
                                step={{
                                    id: "done",
                                    name: "Done",
                                    type: "Done" as StepType
                                }}
                            />
                        </DropdownMenuItem>
                    )}
                    {targetSteps && targetSteps.length > 0 ? (
                        targetSteps.map((targetStep) => (
                            <DropdownMenuItem
                                key={targetStep.id}
                                onClick={() => onStepChange(targetStep.id)}
                                disabled={isPaused}
                            >
                                <StepItem
                                    step={{
                                        id: targetStep.id,
                                        name: targetStep.number,
                                        type: targetStep.type
                                    }}
                                />
                            </DropdownMenuItem>
                        ))
                    ) : (
                        !isOnLastStep && (
                            <DropdownMenuItem disabled>
                                There are no further steps
                            </DropdownMenuItem>
                        )
                    )}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    {!isCompleted && !isStopped && (
                        <DropdownMenuItem onSelect={onViewCurrentStep}>
                            <div className='flex items-center space-x-2'>
                                <LinkIcon className='h-4 w-4' />
                                <span>View Current Step</span>
                            </div>
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onSelect={onViewRoute}>
                        <div className='flex items-center space-x-2'>
                            <RouteIcon className='h-4 w-4' />
                            <span>View Route</span>
                        </div>
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            <div className='flex items-center space-x-2'>
                                <PencilIcon className='h-4 w-4' />
                                <span>Modify Route</span>
                            </div>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <DropdownMenuItem onSelect={onOpenRouteListView}>
                                    <div className='flex items-center space-x-2'>
                                        <ListIcon className='h-4 w-4' />
                                        <span>From List View</span>
                                    </div>
                                </DropdownMenuItem>
                                {/* <DropdownMenuItem>
                                    <div className='flex items-center space-x-2'>
                                        <HammerIcon className='h-4 w-4' />
                                        <span>From Builder View</span>
                                    </div>
                                </DropdownMenuItem> */}
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                    {!isStopped && (
                        <>
                            {!isCompleted && (isPaused ? (
                                <DropdownMenuItem onSelect={onResumeRoute}>
                                    <div className='flex items-center space-x-2'>
                                        <PlayIcon className='h-4 w-4' />
                                        <span>Resume Route</span>
                                    </div>
                                </DropdownMenuItem>
                            ) : (
                                <DropdownMenuItem onSelect={onPauseRoute}>
                                    <div className='flex items-center space-x-2'>
                                        <PauseIcon className='h-4 w-4' />
                                        <span>Pause Route</span>
                                    </div>
                                </DropdownMenuItem>
                            ))}
                            {!isCompleted && (
                                <DropdownMenuItem
                                    className='hover:bg-gradient-to-br hover:from-red-50 hover:to-red-100'
                                    onSelect={onStopRoute}>
                                    <div className='flex items-center space-x-2 text-destructive'>
                                        <SquareIcon className='h-4 w-4' />
                                        <span>Stop Route</span>
                                    </div>
                                </DropdownMenuItem>
                            )}
                        </>
                    )}
                    <DropdownMenuItem
                        className='hover:bg-gradient-to-br hover:from-red-50 hover:to-red-100'
                        onSelect={onDeleteClick}>
                        <div className='flex items-center space-x-2 text-destructive'>
                            <TrashIcon className='h-4 w-4' />
                            <span>Delete Route</span>
                        </div>
                    </DropdownMenuItem>

                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
} 