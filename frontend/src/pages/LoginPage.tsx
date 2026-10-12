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
      setErrorMessage("Введіть електронну пошту та пароль.");
      return;
    }

    const success = login(normalizedEmail, password);

    if (!success) {
      setErrorMessage("Неправильна електронна пошта або пароль.");
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
          <h1>Вхід</h1>

          <p>Увійдіть до свого облікового запису у «Вінтажній крамничці».</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Електронна пошта
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@example.com"
              autoComplete="email"
            />
          </label>

          <label>
            Пароль
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Введіть пароль"
              autoComplete="current-password"
            />
          </label>

          {errorMessage && <p className="auth-form__error">{errorMessage}</p>}

          <button type="submit" className="auth-form__button">
            Увійти
          </button>
        </form>

        <div className="auth-card__footer">
          <span>Ще не маєте облікового запису?</span>

          <Link to="/register">Зареєструватися</Link>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;
