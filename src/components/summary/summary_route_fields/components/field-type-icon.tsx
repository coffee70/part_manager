import { CalendarIcon, CaseSensitiveIcon, Clock3Icon, HashIcon, MousePointerClickIcon, TextIcon } from "lucide-react";
import { type FieldType } from "@/types/collections";

export function FieldTypeIcon({ type }: { type: FieldType }) {
    switch (type) {
        case 'text':
            return <CaseSensitiveIcon size={18} />
        case 'number':
            return <HashIcon size={18} />
        case 'date':
            return <CalendarIcon size={18} />
        case 'time':
            return <Clock3Icon size={18} />
        case 'select':
            return <MousePointerClickIcon size={18} />
        case 'paragraph':
            return <TextIcon size={18} />
        default:
            return null;
    }
} 