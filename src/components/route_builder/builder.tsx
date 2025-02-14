import { BuilderProvider } from "./builder.context"
import Stage from "./stage"

export function RouteBuilder() {
    return (
        <BuilderProvider>
            <Stage />
        </BuilderProvider>
    )
}