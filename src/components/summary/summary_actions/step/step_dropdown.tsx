'use client'
import React from 'react';
import { StepType } from "@/types/collections";
import StepButton from "./step_button";
import { DropdownMenu, DropdownMenuGroup, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuSubContent, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubTrigger } from '@/components/ui/dropdown-menu'
import StepItem from "./step_item";
import { RouteIcon, TrashIcon, ListIcon, HammerIcon, LinkIcon, PauseIcon, SquareIcon, PlayIcon } from "lucide-react";

interface TargetStep {
    id: string;
    instanceId: string;
    number: string;
}

interface StepDropdownProps {
    currentStep: any;
    targetSteps?: TargetStep[] | null;
    isPaused: boolean;
    onStepChange: (id: string) => void;
    onDeleteClick: () => void;
    onOpenRouteListView: () => void;
    onViewCurrentStep: () => void;
    onPauseRoute: () => void;
    onStopRoute: () => void;
    onResumeRoute: () => void;
}

/**
 * A dropdown menu component for the Step UI
 */
export default function StepDropdown({
    currentStep,
    targetSteps,
    isPaused,
    onStepChange,
    onDeleteClick,
    onOpenRouteListView,
    onViewCurrentStep,
    onPauseRoute,
    onStopRoute,
    onResumeRoute
}: StepDropdownProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <StepButton step={currentStep} isPaused={isPaused} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
                <DropdownMenuGroup>
                    {targetSteps && targetSteps.length > 0 ? (
                        targetSteps.map((targetStep) => (
                            <DropdownMenuItem
                                key={targetStep.id}
                                onClick={() => onStepChange(targetStep.instanceId)}
                                disabled={isPaused}
                            >
                                <StepItem
                                    step={{
                                        id: targetStep.instanceId,
                                        name: targetStep.number,
                                        type: "To-do" as StepType
                                    }}
                                />
                            </DropdownMenuItem>
                        ))
                    ) : (
                        <DropdownMenuItem disabled>
                            There are no further steps
                        </DropdownMenuItem>
                    )}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem onSelect={(e) => {
                        e.preventDefault();
                        onViewCurrentStep();
                    }}>
                        <div className='flex items-center space-x-2'>
                            <LinkIcon className='h-4 w-4' />
                            <span>View Current Step</span>
                        </div>
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            <div className='flex items-center space-x-2'>
                                <RouteIcon className='h-4 w-4' />
                                <span>Modify Route</span>
                            </div>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <DropdownMenuItem onSelect={(e) => {
                                    e.preventDefault();
                                    onOpenRouteListView();
                                }}>
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
                    {isPaused ? (
                        <DropdownMenuItem onSelect={(e) => {
                            e.preventDefault();
                            onResumeRoute();
                        }}>
                            <div className='flex items-center space-x-2'>
                                <PlayIcon className='h-4 w-4' />
                                <span>Resume Route</span>
                            </div>
                        </DropdownMenuItem>
                    ) : (
                        <DropdownMenuItem onSelect={(e) => {
                            e.preventDefault();
                            onPauseRoute();
                        }}>
                            <div className='flex items-center space-x-2'>
                                <PauseIcon className='h-4 w-4' />
                                <span>Pause Route</span>
                            </div>
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                        className='hover:bg-gradient-to-br hover:from-red-50 hover:to-red-100'
                        onSelect={(e) => {
                            e.preventDefault();
                            onStopRoute();
                        }}>
                        <div className='flex items-center space-x-2 text-destructive'>
                            <SquareIcon className='h-4 w-4' />
                            <span>Stop Route</span>
                        </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        className='hover:bg-gradient-to-br hover:from-red-50 hover:to-red-100'
                        onSelect={(e) => {
                            e.preventDefault();
                            onDeleteClick();
                        }}>
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