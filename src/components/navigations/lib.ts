export type Context = 'models' | 'routers' | 'users'

// Helper function to get the appropriate color based on context
export function getContextColor(context: Context): { bg: string, hover: string, text: string, border: string, ring: string } {
    switch (context) {
        case 'models':
            return {
                bg: 'bg-rose-500',
                hover: 'hover:bg-rose-400',
                text: 'text-rose-500',
                border: 'border-rose-500',
                ring: 'ring-rose-500'
            };
        case 'routers':
            return {
                bg: 'bg-violet-500',
                hover: 'hover:bg-violet-400',
                text: 'text-violet-500',
                border: 'border-violet-500',
                ring: 'ring-violet-500',
            };
        case 'users':
            return {
                bg: 'bg-green-500',
                hover: 'hover:bg-green-400',
                text: 'text-green-500',
                border: 'border-green-500',
                ring: 'ring-green-500',
            };
        default:
            return {
                bg: 'bg-rose-500',
                hover: 'hover:bg-rose-400',
                text: 'text-rose-500',
                border: 'border-rose-500',
                ring: 'ring-rose-500',
            };
    }
}