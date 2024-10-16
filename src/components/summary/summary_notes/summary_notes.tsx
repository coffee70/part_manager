'use client'
import React from 'react';
import SummaryBase from '../summary_base';
import { useURLMetadata } from '@/hooks/url_metadata.hook';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateNotes } from '@/server/notes/update_notes';
import { collectionKeys } from '@/lib/query_keys';
import TextField from './notes';
import Notes from './notes';

type SummaryNotesProps = {
    initialValue?: string;
}

export default function SummaryNotes({ initialValue }: SummaryNotesProps) {

    return (
        <SummaryBase title="Notes">
            <Notes initialValue={initialValue} />
        </SummaryBase>
    )
}