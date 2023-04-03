import { useState, useEffect } from "react";

const LIGHT = "light-mode"

const getLightMode = () => {
    if (typeof window !== "undefined") {
        if (!localStorage.getItem(LIGHT)) {
            return true;
        }

        return JSON.parse(localStorage.getItem(LIGHT) as string);
    }
}

export const useTheme = () => {
    const [lightMode, useLightMode] = useState(getLightMode);

    useEffect(() => {
        const value = getLightMode();
        if (value != lightMode) {
            localStorage.setItem(LIGHT, lightMode ? "true" : "false");
        }
    }, [lightMode]);

    return [lightMode, useLightMode];
}