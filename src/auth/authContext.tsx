import { createContext, useCallback, useContext, useMemo, useState, ReactNode } from 'react';
import axios from 'axios';

const MY_AUTH_APP = 'MY_AUTH_APP';

// Definimos la interfaz para el valor del contexto
interface AuthContextValue {
  loggedUser: any;
  login: (email: string) => Promise<void>;
  logout: () => void;
  filtersActive: boolean;
  setFiltersActive: () => void;
  setFiltrosHandler: (filtros: {
    keywords: string | null;
    categoria: string;
    pais: string | null;
    autor: string | null;
  }) => void;
  filtros: {
    keywords: string | null;
    categoria: string;
    pais: string | null;
    autor: string | null;
  };
}

// Proporcionamos un valor por defecto al contexto que coincida con la interfaz
export const AuthContext = createContext<AuthContextValue>({
  loggedUser: {},
  login: (email: string) => Promise.resolve(),
  logout: () => {},
  filtersActive: false,
  setFiltersActive: () => {},
  filtros: {
    keywords: null,
    categoria: "recientes",
    pais: null,
    autor: null
  },
  setFiltrosHandler: (filtros) => {} // Esto se sobreescribirá con el valor real en el proveedor
});

export default function AuthContextProvider({ children }: { children: ReactNode }) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [loggedUser, setLoggedUser] = useState({});
  const [filtersActive, setFiltersActive] = useState<boolean>(false);
  const [filtros, setFiltros] = useState<{
    keywords: string | null;
    categoria: string;
    pais: string | null;
    autor: string | null;
  }>({
    keywords: null,
    categoria: "recientes", 
    pais: null, 
    autor: null
  });

  const login = useCallback(async function(email: string) {
    try {
      const response = await axios.get(apiUrl+`usuarios?email=${email}`);
      console.log(response.data);
      setLoggedUser(response.data);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  }, [apiUrl]);

  const logout = useCallback(function() {
    window.localStorage.removeItem(MY_AUTH_APP);
    setLoggedUser({});
  }, []);

  const setFiltrosHandler = useCallback((newFiltros: {

    keywords: string | null;
    categoria: string;
    pais: string | null;
    autor: string | null;
  }) => {
    setFiltros(newFiltros);
  }, []);

  // Función para alternar el estado de los filtros
  const setFiltersActiveHandler = useCallback(() => {
    setFiltersActive(prevState => !prevState);
  }, []);

  const value = useMemo(() => ({
    login,
    logout,
    loggedUser,
    filtersActive,
    setFiltersActive: setFiltersActiveHandler,
    filtros,
    setFiltrosHandler
  }), [loggedUser, login, logout, filtersActive, filtros, setFiltrosHandler ]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}