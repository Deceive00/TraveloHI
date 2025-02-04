import React, { createContext, useState, useEffect, useContext } from 'react';

interface ICurrencyContextProps {
  currency: string;
  setCurrency: (currency: string) => void;
  getCurrency: () => string;
  convertPrice: (price: number) => number;
}

const CurrencyContext = createContext<ICurrencyContextProps | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const storedCurrency = localStorage.getItem('currency');
  const initialCurrency = storedCurrency || 'USD';

  const [currency, setCurrency] = useState(initialCurrency);
  const getCurrency = () => {
    if(currency === 'USD'){
      return '$';
    }
    else{
      return 'IDR'
    }
  }
  const convertPrice = (price: number) => {
    if(currency === 'USD'){
      return price;
    }
    else{
      return price * 15650
    }
  }

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, getCurrency, convertPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);

  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }

  return context;
};
