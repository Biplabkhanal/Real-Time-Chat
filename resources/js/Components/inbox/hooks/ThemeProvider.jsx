import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem("theme");
        return savedTheme || "system";
    });

    useEffect(() => {
        localStorage.setItem("theme", theme);

        document.documentElement.classList.remove("dark", "light");

        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else if (theme === "light") {
            document.documentElement.classList.add("light");
        } else if (theme === "system") {
            const isDarkMode = window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches;
            document.documentElement.classList.add(
                isDarkMode ? "dark" : "light"
            );

            const mediaQuery = window.matchMedia(
                "(prefers-color-scheme: dark)"
            );
            const handleChange = (e) => {
                document.documentElement.classList.remove("dark", "light");
                document.documentElement.classList.add(
                    e.matches ? "dark" : "light"
                );
            };

            mediaQuery.addEventListener("change", handleChange);
            return () => mediaQuery.removeEventListener("change", handleChange);
        }
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
