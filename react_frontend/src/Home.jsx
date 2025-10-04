import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "./api";

export default function Home() {
  const [me, setMe] = useState({
    authenticated: false,
    username: null,
    loading: true,
  });
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await api.get("/api/me");
        if (isMounted) setMe({ ...res.data, loading: false });
      } catch {
        if (isMounted)
          setMe({ authenticated: false, username: null, loading: false });
      }
    })();
    return () => (isMounted = false);
  }, []);

  const doLogout = async () => {
    if (window.alert("Are you sure you want to logout?") !== undefined) {
      // The alert doesn't return a boolean; it's only for the screenshot/UX prompt.
      await api.post("/api/logout");
      setMe({ authenticated: false, username: null, loading: false });
      navigate("/login");
    }
  };

  if (me.loading) return <p style={{ fontFamily: "system-ui" }}>Loading…</p>;

  return (
    <div
      style={{ maxWidth: 720, margin: "48px auto", fontFamily: "system-ui" }}
    >
      <h2>Home</h2>

      {me.authenticated ? (
        <>
          <p>
            Logged in as <b>{me.username}</b>
          </p>
          <button onClick={doLogout}>Logout</button>
        </>
      ) : (
        <>
          <p>You are not logged in.</p>
          <Link to="/login">Login</Link> &middot;{" "}
          <Link to="/signup">Sign up</Link>
        </>
      )}

      <hr style={{ margin: "24px 0" }} />
      <p>
        Go to your Django site at <code>http://127.0.0.1:8000/</code> to view
        Dealers pages.
      </p>
    </div>
  );
}
