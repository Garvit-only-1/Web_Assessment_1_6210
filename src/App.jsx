
import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { supabase } from "./services/supabase";
import { checkAdmin } from "./services/scpService";

import Login from "./login";
import SCPDatabase from "./Components/SCPDatabase";

import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadSession() {
      const { data, error } = await supabase.auth.getUser();

      if (!active) return;

      if (error || !data.user) {
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      setUser(data.user);

      try {
        const admin = await checkAdmin(data.user.id);
        if (active) setIsAdmin(admin);
      } catch (error) {
        console.error(error);
        if (active) setIsAdmin(false);
      }

      if (active) setLoading(false);
    }

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      () => {
        if (active) {
          setLoading(true);
          loadSession();
        }
      }
    );

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
  }

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          user
            ? <Navigate to="/" replace />
            : <Login />
        }
      />

      <Route
        path="/"
        element={
          user ? (
            <SCPDatabase
              user={user}
              isAdmin={isAdmin}
              onLogout={logout}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}

export default App;
