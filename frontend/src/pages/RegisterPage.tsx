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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");

    const trimmedName = name.trim();
    const normalizedEmail = email.trim();

    if (!trimmedName || !normalizedEmail || !password) {
      setErrorMessage("Будь ласка, заповніть усі обов'язкові поля.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Пароль має містити щонайменше 6 символів.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Паролі не збігаються.");
      return;
    }

    const success = await register(
      trimmedName,
      normalizedEmail,
      password,
      role,
    );

    if (!success) {
      setErrorMessage("Обліковий запис із цією електронною адресою вже існує.");
      return;
    }

    navigate("/account", { replace: true });
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-card__header">
          <h1>Створити обліковий запис</h1>

          <p>Створіть особистий обліковий запис у «Вінтажній крамничці».</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Ім'я
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ваше ім'я"
              autoComplete="name"
            />
          </label>

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
              placeholder="Щонайменше 6 символів"
              autoComplete="new-password"
            />
          </label>

          <label>
            Повторіть пароль
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Введіть пароль ще раз"
              autoComplete="new-password"
            />
          </label>

          <fieldset className="auth-form__fieldset">
            <legend>Тип облікового запису</legend>

            <label className="auth-form__radio">
              <input
                type="radio"
                name="role"
                value="buyer"
                checked={role === "buyer"}
                onChange={() => setRole("buyer")}
              />
              Покупець
            </label>

            <label className="auth-form__radio">
              <input
                type="radio"
                name="role"
                value="seller"
                checked={role === "seller"}
                onChange={() => setRole("seller")}
              />
              Продавець
            </label>
          </fieldset>

          {errorMessage && <p className="auth-form__error">{errorMessage}</p>}

          <button type="submit" className="auth-form__button">
            Зареєструватися
          </button>
        </form>

        <div className="auth-card__footer">
          <span>Вже маєте обліковий запис?</span>

          <Link to="/login">Увійти</Link>
        </div>
      </div>
    </section>
  );
}

export default RegisterPage;
