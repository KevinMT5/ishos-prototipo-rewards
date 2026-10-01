import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

function initialTheme() {
    const saved = localStorage.getItem('ishos-theme')
    if (saved === 'light' || saved === 'dark') return saved
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(initialTheme)

    useEffect(() => {
        document.documentElement.dataset.theme = theme
        document.documentElement.style.colorScheme = theme
        localStorage.setItem('ishos-theme', theme)
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#121716' : '#FBF9FC')
    }, [theme])

    return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
    return useContext(ThemeContext)
}
