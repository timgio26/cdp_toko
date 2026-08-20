import React, { useState } from "react";
import {
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiLock,
  FiUser,
} from "react-icons/fi";
import { useSignIn, useSignUp } from "../utils/customerQuery";

type AuthMode = "login" | "signup";

interface LoginFormState {
  username: string;
  password: string;
}

interface SignupFormState extends LoginFormState {
  name: string;
}

export function Authentication() {
  const [mode, setMode] = useState<AuthMode>("login");

  const [loginForm, setLoginForm] = useState<LoginFormState>({
    username: "",
    password: "",
  });

  const [signupForm, setSignupForm] = useState<SignupFormState>({
    name: "",
    username: "",
    password: "",
  });

  const [showPwd, setShowPwd] = useState(false);

  const { mutate: signUp, isPending: loadingSignUp } = useSignUp();
  const { mutate: signIn, isPending: loadingSignIn } = useSignIn();

  const loading = loadingSignUp || loadingSignIn;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    if (mode === "login") {
      setLoginForm((current) => ({
        ...current,
        [name]: value,
      }));
    } else {
      setSignupForm((current) => ({
        ...current,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "login") {
      signIn(loginForm);
    } else {
      signUp(signupForm, {
        onSuccess: () => {
          setMode("login");
          setShowPwd(false);
        },
      });
    }
  };

  const switchMode = (nextMode: AuthMode) => {
    if (loading) return;

    setMode(nextMode);
    setShowPwd(false);
  };

  return (
    <div className="flex justify-center px-4 py-8 sm:px-6 sm:py-10">
      <div className="w-full max-w-md">

        {/* Heading */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {mode === "login"
              ? "Welcome back"
              : "Create your account"}
          </h1>

          <p className="mt-1.5 text-sm leading-5 text-slate-500">
            {mode === "login"
              ? "Sign in to continue to your workspace."
              : "Create an account to start managing your business."}
          </p>
        </div>

        {/* Form container */}
        <div className="rounded-2xl border border-slate-200 bg-white">

          {/* Mode switch */}
          <div className="border-b border-slate-200 p-2">
            <div className="grid grid-cols-2 rounded-lg bg-slate-100 p-1">

              <button
                type="button"
                onClick={() => switchMode("login")}
                className={`rounded-md py-2 text-sm font-semibold transition ${
                  mode === "login"
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Login
              </button>

              <button
                type="button"
                onClick={() => switchMode("signup")}
                className={`rounded-md py-2 text-sm font-semibold transition ${
                  mode === "signup"
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Sign Up
              </button>

            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5 p-5 sm:p-6"
          >

            {mode === "signup" && (
              <InputField
                label="Name"
                name="name"
                value={signupForm.name}
                onChange={handleChange}
                placeholder="Your name"
                icon={<FiUser size={17} />}
                autoComplete="name"
              />
            )}

            <InputField
              label="Username"
              name="username"
              value={
                mode === "login"
                  ? loginForm.username
                  : signupForm.username
              }
              onChange={handleChange}
              placeholder="Enter your username"
              icon={<FiUser size={17} />}
              autoComplete="username"
            />

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Password
              </label>

              <div className="relative">

                <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <FiLock size={17} />
                </div>

                <input
                  type={showPwd ? "text" : "password"}
                  name="password"
                  id="password"
                  value={
                    mode === "login"
                      ? loginForm.password
                      : signupForm.password
                  }
                  onChange={handleChange}
                  required
                  autoComplete={
                    mode === "login"
                      ? "current-password"
                      : "new-password"
                  }
                  placeholder="Enter your password"
                  className="
                    h-10.5 w-full rounded-lg
                    border border-slate-200
                    bg-white
                    pl-10 pr-11
                    text-sm text-slate-800
                    outline-none
                    placeholder:text-slate-400
                    transition
                    hover:border-slate-300
                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-50
                  "
                />

                <button
                  type="button"
                  onClick={() => setShowPwd((current) => !current)}
                  className="
                    absolute right-0 top-0
                    flex h-10.5 w-10
                    items-center justify-center
                    text-slate-400
                    transition
                    hover:text-blue-600
                  "
                  aria-label={
                    showPwd
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPwd ? (
                    <FiEyeOff size={17} />
                  ) : (
                    <FiEye size={17} />
                  )}
                </button>

              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="
                group
                flex h-10.5 w-full
                items-center justify-center gap-2
                rounded-lg
                bg-blue-600
                text-sm font-semibold text-white
                transition
                hover:bg-blue-700
                focus:outline-none
                focus:ring-4
                focus:ring-blue-100
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                ? "Sign In"
                : "Create Account"}

              {!loading && (
                <FiArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              )}
            </button>

          </form>

          {/* Bottom switch */}
          <div className="border-t border-slate-100 px-5 py-4 text-center sm:px-6">
            <p className="text-sm text-slate-500">

              {mode === "login"
                ? "Don't have an account?"
                : "Already have an account?"}

              {" "}

              <button
                type="button"
                disabled={loading}
                onClick={() =>
                  switchMode(
                    mode === "login"
                      ? "signup"
                      : "login"
                  )
                }
                className="
                  font-semibold
                  text-blue-600
                  transition
                  hover:text-blue-700
                  disabled:opacity-50
                "
              >
                {mode === "login"
                  ? "Create one"
                  : "Sign in"}
              </button>

            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

/* =============================================================
   INPUT
============================================================= */

function InputField({
  label,
  name,
  value,
  onChange,
  placeholder,
  icon,
  autoComplete,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  icon: React.ReactNode;
  autoComplete?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-sm font-medium text-slate-700"
      >
        {label}
      </label>

      <div className="relative">

        <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </div>

        <input
          type="text"
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          required
          autoComplete={autoComplete}
          placeholder={placeholder}
          className="
            h-10.5 w-full rounded-lg
            border border-slate-200
            bg-white
            pl-10 pr-4
            text-sm text-slate-800
            outline-none
            placeholder:text-slate-400
            transition
            hover:border-slate-300
            focus:border-blue-500
            focus:ring-4
            focus:ring-blue-50
          "
        />

      </div>
    </div>
  );
}