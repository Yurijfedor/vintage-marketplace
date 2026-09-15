import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../features/auth/useAuth";

import "../styles/auth.css";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");

    const normalizedEmail = email.trim();

    if (!normalizedEmail || !password) {
      setErrorMessage("Bitte geben Sie E-Mail und Passwort ein.");
      return;
    }

    const success = login(normalizedEmail, password);

    if (!success) {
      setErrorMessage("E-Mail oder Passwort ist falsch.");
      return;
    }

    const from = location.state?.from;

    navigate(typeof from === "string" ? from : "/account", {
      replace: true,
    });
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-card__header">
          <h1>Anmelden</h1>

          <p>Melden Sie sich bei Ihrem Vintage Marketplace Konto an.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            E-Mail
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="ihre@email.de"
              autoComplete="email"
            />
          </label>

          <label>
            Passwort
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Passwort"
              autoComplete="current-password"
            />
          </label>

          {errorMessage && <p className="auth-form__error">{errorMessage}</p>}

          <button type="submit" className="auth-form__button">
            Anmelden
          </button>
        </form>

        <div className="auth-card__footer">
          <span>Noch kein Konto?</span>

          <Link to="/register">Konto erstellen</Link>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;
