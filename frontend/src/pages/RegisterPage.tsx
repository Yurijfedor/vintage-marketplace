import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../features/auth/useAuth";

import "../styles/auth.css";

function RegisterPage() {
  const navigate = useNavigate();

  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"buyer" | "seller">("buyer");
  const [errorMessage, setErrorMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");

    const trimmedName = name.trim();
    const normalizedEmail = email.trim();

    if (!trimmedName || !normalizedEmail || !password) {
      setErrorMessage("Bitte füllen Sie alle Pflichtfelder aus.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Das Passwort muss mindestens 6 Zeichen lang sein.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Die Passwörter stimmen nicht überein.");
      return;
    }

    const success = register(trimmedName, normalizedEmail, password, role);

    if (!success) {
      setErrorMessage("Für diese E-Mail-Adresse existiert bereits ein Konto.");
      return;
    }

    navigate("/account", { replace: true });
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-card__header">
          <h1>Konto erstellen</h1>

          <p>
            Erstellen Sie Ihr persönliches Konto auf dem Vintage Marketplace.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Name
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Max Mustermann"
              autoComplete="name"
            />
          </label>

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
              placeholder="Mindestens 6 Zeichen"
              autoComplete="new-password"
            />
          </label>

          <label>
            Passwort bestätigen
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Passwort wiederholen"
              autoComplete="new-password"
            />
          </label>

          <fieldset className="auth-form__fieldset">
            <legend>Kontotyp</legend>

            <label className="auth-form__radio">
              <input
                type="radio"
                name="role"
                value="buyer"
                checked={role === "buyer"}
                onChange={() => setRole("buyer")}
              />
              Käufer
            </label>

            <label className="auth-form__radio">
              <input
                type="radio"
                name="role"
                value="seller"
                checked={role === "seller"}
                onChange={() => setRole("seller")}
              />
              Verkäufer
            </label>
          </fieldset>

          {errorMessage && <p className="auth-form__error">{errorMessage}</p>}

          <button type="submit" className="auth-form__button">
            Konto erstellen
          </button>
        </form>

        <div className="auth-card__footer">
          <span>Bereits registriert?</span>

          <Link to="/login">Anmelden</Link>
        </div>
      </div>
    </section>
  );
}

export default RegisterPage;
