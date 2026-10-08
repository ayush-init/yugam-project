"use client";

import { FormEvent, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const validateForm = () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      return "Please fill in all fields.";
    }

    if (!/^[A-Za-z ]+$/.test(name.trim())) {
      return "Name can only contain letters and spaces.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return "Please enter a valid email address.";
    }

    if (!/^(?=.*[A-Za-z])(?=.*\d).+$/.test(password)) {
      return "Password must contain at least one letter and one number.";
    }

    return "";
  };

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      sessionStorage.setItem(
        "registrationData",
        JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
        })
      );

      router.push("/profile");
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "code" in error
      ) {
        const firebaseError = error as { code: string };

        if (firebaseError.code === "auth/email-already-in-use") {
          setError("An account with this email already exists.");
        } else if (firebaseError.code === "auth/invalid-email") {
          setError("Please enter a valid email address.");
        } else if (firebaseError.code === "auth/weak-password") {
          setError("Password is too weak.");
        } else {
          setError("Unable to create account. Please try again.");
        }
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4 py-8">

      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Create your account
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Enter your details to get started
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

          <form onSubmit={handleRegister} className="space-y-5">

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Name
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ayush Chaurasiya"
                autoComplete="name"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ayush@example.com"
                autoComplete="email"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
              />
            </div>

            {/* Password */}
            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least one letter and number"
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    /* Eye Off */
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 3l18 18" />
                      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                      <path d="M9.9 4.2A10.7 10.7 0 0 1 12 4c5 0 9 4 10 8-0.4 1.4-1.2 2.7-2.2 3.8" />
                      <path d="M6.6 6.6C4.8 7.8 3.4 9.7 2 12c1.1 4 5 8 10 8 1.2 0 2.4-.2 3.4-.6" />
                    </svg>
                  ) : (
                    /* Eye */
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>

              <p className="mt-2 text-xs text-slate-400">
                Must contain at least one letter and one number.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-slate-900 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>

          </form>

          <p className="mt-6 text-center text-xs text-slate-400">
            By creating an account, you agree to our terms.
          </p>

        </div>

      </div>

    </main>
  );
}