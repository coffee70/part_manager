'use client'

export function darken(colorName: string, percent: number = 0.1): string {
    // Function to convert a color name to hex
    function colorNameToHex(color: string) {
        let ctx = document.createElement("canvas").getContext("2d");
        if (!ctx) return "";    // If the canvas context is not available, return an empty string
        ctx.fillStyle = color;
        return ctx.fillStyle;
    }

    // Function to darken a hex color by a certain percentage
    function darkenHex(hex: string, percent: number) {
        // Convert hex to RGB
        let r = parseInt(hex.slice(1, 3), 16);
        let g = parseInt(hex.slice(3, 5), 16);
        let b = parseInt(hex.slice(5, 7), 16);

        // Darken each component by the given percent
        r = Math.floor(r * (1 - percent));
        g = Math.floor(g * (1 - percent));
        b = Math.floor(b * (1 - percent));

        // Convert back to hex and pad if necessary
        let newHex = "#" +
            r.toString(16).padStart(2, "0") +
            g.toString(16).padStart(2, "0") +
            b.toString(16).padStart(2, "0");

        return newHex;
    }

    // Get hex value of the color name
    let hexColor = colorNameToHex(colorName);

    // Return the darkened hex color (10% darker)
    return darkenHex(hexColor, percent);
}