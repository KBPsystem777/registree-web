import React, {useContext, useEffect, useRef, useState} from "react";

// @ts-ignore
const ThemeContext = React.createContext();
// @ts-ignore
const ThemeUpdateContext = React.createContext();

export function useTheme() {
    return useContext(ThemeContext);
}
export function useThemeUpdate() {
    return useContext(ThemeUpdateContext);
}

// @ts-ignore
export function ThemeProvider({children}) {
    const [darkTheme, setDarkTheme] = useState(true);

    function toggleTheme(val:any) {
        console.log(val)
        setDarkTheme(prev => !prev);
    }

    return (
        <ThemeContext.Provider value={darkTheme}>
            <ThemeUpdateContext.Provider value={toggleTheme}>
                {children}
            </ThemeUpdateContext.Provider>
        </ThemeContext.Provider>
    )
}