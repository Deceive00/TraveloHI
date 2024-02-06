import React, { createContext, useState, useEffect, useContext } from 'react';

interface IThemeContextProps {
  theme: string;
  toggleTheme: () => void;
}

const ThemeContext = createContext<IThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const storedTheme = localStorage.getItem('theme');
  const initialTheme = storedTheme || 'light';

  const [theme, setTheme] = useState(initialTheme);

  useEffect(() => {
    console.log(theme);
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));

  };
  
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
