'use client'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Values } from '@/types/collections';
import { useInstanceURL } from '@/hooks/url_metadata.hook';
import { getSections } from '@/server/sections/get_sections';
import { sectionKeys } from '@/lib/query_keys';
import { useQuery } from '@tanstack/react-query';
import Select from '@/components/ui/fields/select';
import { Textarea } from '@/components/ui/fields/textarea';
import { Input } from '@/components/ui/fields/input';

type Props = {
    fieldState: Values;
    setFieldState: (fieldState: Values) => void;
}

export default function Fields({ fieldState, setFieldState }: Props) {
    
    const { modelId } = useInstanceURL();

    const { data: sections } = useQuery({
        queryKey: sectionKeys.all(modelId),
        queryFn: () => getSections({ modelId }),
    })

    if (!sections
        || sections.length === 0
        || sections.filter(section => section.fields.length > 0).length === 0) return null;

    return (
        <Tabs defaultValue={sections[0]._id}>
            <TabsList>
                {sections.map(section => (
                    <TabsTrigger
                        key={section._id}
                        value={section._id}>
                        {section.name}
                    </TabsTrigger>
                ))}
            </TabsList>
            {sections.map(section => (
                <TabsContent key={section._id} value={section._id}>
                    <div className="flex flex-col space-y-1">
                        {section.fields.map(field => (
                            <div key={field._id}>
                                {field.type === 'select' ? (
                                    <Select
                                        id={`dialog-field-${field.name}`}
                                        label={field.name}
                                        description={field.description}
                                        multiple={field.multiple}
                                        creative={field.creative}
                                        options={field.options || []}
                                        value={fieldState[field._id] || (field.multiple ? [] : '')}
                                        onChange={value => setFieldState({
                                            ...fieldState,
                                            [field._id]: value,
                                        })}
                                    />
                                ) : field.type === 'paragraph' ? (
                                    <Textarea
                                        id={`dialog-field-${field.name}`}
                                        label={field.name}
                                        description={field.description}
                                        value={fieldState[field._id] || ''}
                                        onChange={e => setFieldState({
                                            ...fieldState,
                                            [field._id]: e.target.value,
                                        })}
                                    />
                                ) : (
                                    <Input
                                        id={`dialog-field-${field.name}`}
                                        label={field.name}
                                        description={field.description}
                                        type={field.type}
                                        value={fieldState[field._id] || ''}
                                        onChange={e => setFieldState({
                                            ...fieldState,
                                            [field._id]: e.target.value,
                                        })}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </TabsContent>
            ))}
        </Tabs>
    )
}