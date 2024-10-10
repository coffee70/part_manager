import { FieldType } from "@/types/collections";
import Input from "./fields/input";
import Textarea from "./fields/textarea";
import Select from "./fields/select";

export type Attribute = {
    name: string;
    type: FieldType;
    description: string;
    default?: string;
    multiple?: boolean;
    creative?: boolean;
    options?: string[];
}

type Props = {
    attributes: Attribute[];
    attributeState?: Record<string, any>;
    setAttributeState?: (value: Record<string, any>) => void;
}

export default function Attributes({ attributes, attributeState, setAttributeState }: Props) {
    return (
        <div className="flex flex-col space-y-1">
        {attributes?.map(attr => (
            <div key={attr.name}>
                {attr.type === 'select' ? (
                    <Select
                        label={attr.name}
                        description={attr.description}
                        multiple={attr.multiple}
                        creative={attr.creative}
                        options={attr.options || []}
                        value={attributeState?.[attr.name]}
                        onChange={value => setAttributeState?.({
                            ...attributeState,
                            [attr.name]: value,
                        })}
                    />
                ) : attr.type === 'paragraph' ? (
                    <Textarea
                        label={attr.name}
                        description={attr.description}
                        value={attributeState?.[attr.name]}
                        onChange={value => setAttributeState?.({
                            ...attributeState,
                            [attr.name]: value,
                        })}
                    />
                ) : (
                    <Input
                        label={attr.name}
                        description={attr.description}
                        type={attr.type}
                        value={attributeState?.[attr.name]}
                        onChange={value => setAttributeState?.({
                            ...attributeState,
                            [attr.name]: value,
                        })}
                    />
                )}
            </div>
        ))}
    </div>
    )
}