import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useInstanceURL } from '@/hooks/url_metadata.hook';
import { 
    defaultModelConfiguration,
    defaultRouterConfiguration
} from '@/types/collections';
import { TableConfigurationService } from '../services/table_configuration_service';
import { TableConfigurationState } from '../column_management_utils';
import { tableConfigurationKeys } from '@/lib/query_keys';

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
        queryFn: () => TableConfigurationService.getConfiguration({ 
            context: context, // Collection name
            contextId: id || '' // Document ID
        }),
        enabled: open && !!id,
    });

    // Fetch available intrinsic fields
    const { data: intrinsicFields = [], isLoading: fieldsLoading } = useQuery({
        queryKey: tableConfigurationKeys.fieldsByContext(context, id),
        queryFn: () => TableConfigurationService.getFieldsByContext(context, id),
        enabled: open && !!id,
    });

    // Fetch available contexts for links column
    const { data: availableContexts = [], isLoading: contextsLoading } = useQuery({
        queryKey: tableConfigurationKeys.contexts(context),
        queryFn: () => TableConfigurationService.getContexts(context),
        enabled: open,
    });

    // Update form state when config loads
    React.useEffect(() => {
        if (currentConfig) {
            setFormState(currentConfig);
        }
    }, [currentConfig]);

    // Save mutation
    const { mutate: saveConfiguration, isPending: savePending, error: saveError } = useMutation({
        mutationFn: TableConfigurationService.saveConfiguration,
        onSuccess: () => {
            queryClient.invalidateQueries({ 
                queryKey: tableConfigurationKeys.configuration(context, id) 
            });
        },
    });

    const handleSave = () => {
        
        saveConfiguration({
            context: context, // Collection name
            contextId: id, // Document ID
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