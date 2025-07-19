import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useInstanceURL } from '@/hooks/url_metadata.hook';
import { 
    defaultModelConfiguration,
    defaultRouterConfiguration
} from '@/types/collections';
import { TableConfigurationState } from '../column_management_utils';
import { tableConfigurationKeys } from '@/lib/query_keys';
import { getTableConfiguration } from '@/server/configuration/get_table_configuration';
import { getFieldsByContextId } from '@/server/fields/get_fields_by_context_id';
import { getContexts } from '@/server/contexts/get_contexts';
import { upsertTableConfiguration } from '@/server/configuration/upsert_table_configuration';

export const useTableConfiguration = (open: boolean) => {
    const { context, id } = useInstanceURL();
    const queryClient = useQueryClient();

    // Form state to track the table configuration
    const [formState, setFormState] = React.useState<TableConfigurationState>(
        context === 'models' ? defaultModelConfiguration : defaultRouterConfiguration
    );

    // Fetch current table configuration
    const { data: currentConfig, isLoading: configLoading } = useQuery({
        queryKey: tableConfigurationKeys.configuration(context, id),
        queryFn: () => getTableConfiguration({ 
            context,
            contextId: id,
        }),
        enabled: open && !!id,
    });

    // Fetch available intrinsic fields
    const { data: intrinsicFields = [], isLoading: fieldsLoading } = useQuery({
        queryKey: tableConfigurationKeys.fieldsByContext(context, id),
        queryFn: () => getFieldsByContextId({ context, contextId: id }),
        enabled: open && !!id,
    });

    // Fetch available contexts for links column
    const { data: availableContexts = [], isLoading: contextsLoading } = useQuery({
        queryKey: tableConfigurationKeys.contexts(context),
        queryFn: () => getContexts({ context }),
        enabled: open,
    });

    // Update form state when config loads
    React.useEffect(() => {
        if (currentConfig) {
            setFormState(currentConfig);
        }
    }, [currentConfig, context]);

    // Save mutation
    const { mutate: saveConfiguration, isPending: savePending, error: saveError } = useMutation({
        mutationFn: upsertTableConfiguration,
        onSuccess: () => {
            queryClient.invalidateQueries({ 
                queryKey: tableConfigurationKeys.configuration(context, id) 
            });
        },
    });

    const handleSave = () => {
        saveConfiguration({
            context,
            contextId: id,
            tableConfiguration: formState,
        });
    };

    const updateFormState = (newConfig: TableConfigurationState) => {
        setFormState(newConfig);
    };

    const isLoading = configLoading || fieldsLoading || contextsLoading;

    return {
        formState,
        updateFormState,
        intrinsicFields,
        availableContexts,
        isLoading,
        handleSave,
        savePending,
        saveError,
        context
    };
}; 