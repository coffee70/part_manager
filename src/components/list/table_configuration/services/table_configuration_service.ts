import { getTableConfiguration } from '@/server/configuration/get_table_configuration';
import { getFieldsByContext } from '@/server/fields/get_fields_by_context';
import { getContexts } from '@/server/contexts/get_contexts';
import { upsertTableConfiguration } from '@/server/configuration/upsert_table_configuration';
import { TableConfigurationState } from '../column_management_utils';
import { Context } from '@/types/collections';

export interface TableConfigurationParams {
    context: Context; // Collection name
    contextId: string; // Document ID
}

export interface SaveConfigurationParams extends TableConfigurationParams {
    tableConfiguration: TableConfigurationState;
}

/**
 * Service for handling table configuration data operations
 * Follows Dependency Inversion Principle by providing abstraction over data access
 */
export class TableConfigurationService {
    /**
     * Fetch current table configuration
     */
    static async getConfiguration(params: TableConfigurationParams) {
        return getTableConfiguration(params);
    }

    /**
     * Fetch fields available for the given context
     */
    static async getFieldsByContext(contextType: Context, contextId: string) {
        return getFieldsByContext({ context: contextType, contextId });
    }

    /**
     * Fetch available contexts for links columns
     */
    static async getContexts(contextType: Context) {
        return getContexts({ context: contextType });
    }

    /**
     * Save table configuration
     */
    static async saveConfiguration(params: SaveConfigurationParams) {
        return upsertTableConfiguration({
            context: params.context,
            contextId: params.contextId,
            tableConfiguration: params.tableConfiguration
        });
    }
}