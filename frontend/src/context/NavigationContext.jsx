import React, { createContext, useContext, useState, useEffect } from 'react';

const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname || '/');
  const [params, setParams] = useState({});

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path, routeParams = {}) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    setParams(routeParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <NavigationContext.Provider value={{ currentPath, setCurrentPath, navigate, params, setParams }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNav = () => useContext(NavigationContext);

