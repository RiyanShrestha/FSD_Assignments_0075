import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('shopnest_user');
    const storedToken = localStorage.getItem('shopnest_token');
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (e) {
        localStorage.removeItem('shopnest_user');
        localStorage.removeItem('shopnest_token');
      }
    }
    setAuthLoading(false);
  }, []);

  const login = async (name, email, password) => {
    const res = await loginUser({ name, email, password });
    if (res.success && res.token) {
      localStorage.setItem('shopnest_token', res.token);
      localStorage.setItem('shopnest_user', JSON.stringify(res.user));
      setUser(res.user);
      setToken(res.token);
      return res;
    }
    throw new Error(res.message || 'Login failed');
  };

  const logout = () => {
    localStorage.removeItem('shopnest_user');
    localStorage.removeItem('shopnest_token');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      logout, 
      isLoggedIn: !!user,
      authLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
