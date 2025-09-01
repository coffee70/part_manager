'use client'
import React from 'react';
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
import TargetActions from './target_actions';
import { TargetSteps } from './types';

interface StepDropdownProps {
    targetSteps?: TargetSteps;
    isPaused: boolean;
    isCompleted: boolean;
    isStopped: boolean;
    isIdle: boolean;
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
    onCompleteStep: () => void;
    onFailStep: () => void;
}

/**
 * A dropdown menu component for the Step UI
 */
export default function StepDropdown({
    targetSteps,
    isPaused,
    isCompleted,
    isStopped,
    isIdle,
    isOnLastStep,
    onStepChange,
    onDeleteClick,
    onOpenRouteListView,
    onViewCurrentStep,
    onViewRoute,
    onPauseRoute,
    onStopRoute,
    onResumeRoute,
    onCompleteRoute,
    onCompleteStep,
    onFailStep
}: StepDropdownProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <StepButton />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-48">
                <DropdownMenuGroup>
                    <TargetActions
                        targetSteps={targetSteps}
                        isOnLastStep={isOnLastStep}
                        isPaused={isPaused}
                        isIdle={isIdle}
                        isCompleted={isCompleted}
                        onStepChange={onStepChange}
                        onCompleteRoute={onCompleteRoute}
                        onPauseRoute={onPauseRoute}
                        onCompleteStep={onCompleteStep}
                        onFailStep={onFailStep}
                    />
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
                            {!isCompleted && !isIdle && (isPaused ? (
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