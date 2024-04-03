type Props = {
    children: React.ReactNode;
}

export default function FilterToolbar({ children }: Props) {
    return (
        <div className="flex items-center space-x-2">
            {/** Example
             * <Component1 />
             * <Component2 />
             * <Component3 />
             */}
            {children}
        </div>
    )
}