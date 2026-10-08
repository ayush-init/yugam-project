"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

type RegistrationData = {
    name: string;
    email: string;
    password: string;
};

export default function ProfilePage() {
    const router = useRouter();

    const [data, setData] = useState<RegistrationData | null>(null);
    const [mobile, setMobile] = useState("");
    const [username, setUsername] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loggingOut, setLoggingOut] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.replace("/");
                return;
            }

            const storedData = sessionStorage.getItem("registrationData");

            if (storedData) {
                try {
                    setData(JSON.parse(storedData));
                } catch {
                    setData({
                        name: "",
                        email: user.email || "",
                        password: "",
                    });
                }
            } else {
                setData({
                    name: "",
                    email: user.email || "",
                    password: "",
                });
            }
        });

        return () => unsubscribe();
    }, [router]);

    const validate = () => {
        setError("");
        setSuccess("");

        if (
            !data?.name.trim() ||
            !data?.password ||
            !mobile.trim() ||
            !username.trim() ||
            !data?.email.trim()
        ) {
            return "Please fill in all fields.";
        }

        // Name
        if (!/^[A-Za-z ]+$/.test(data.name.trim())) {
            return "Name can only contain letters and spaces.";
        }

        // Password
        if (!/^(?=.*[A-Za-z])(?=.*\d).+$/.test(data.password)) {
            return "Password must contain at least one letter and one number.";
        }

        // Mobile
        if (!/^\d{10}$/.test(mobile.trim())) {
            return "Mobile number must contain exactly 10 digits.";
        }

        // Username
        if (!/^[A-Za-z0-9]+[._-]?[A-Za-z0-9]+$/.test(username.trim())) {
            return "Username can contain letters, numbers and one special character.";
        }

        // Email
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
            return "Please enter a valid email address.";
        }

        return "";
    };

    const handleValidate = () => {
        const validationError = validate();

        if (validationError) {
            setError(validationError);
            return;
        }

        setSuccess("All information is valid and ready to submit.");
    };

    const handleLogout = async () => {
        try {
            setLoggingOut(true);

            await signOut(auth);
            sessionStorage.removeItem("registrationData");

            router.replace("/");
        } catch {
            setLoggingOut(false);
            setError("Unable to logout. Please try again.");
        }
    };

    if (!data) {
        return (
            <main className="min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-8">
                <div className="text-center">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-600 border-t-white" />
                    <p className="mt-4 text-sm text-slate-400">
                        Loading your account...
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-8">

            <div className="mx-auto w-full max-w-4xl">

                {/* ================= HEADER ================= */}

                <header className="mb-8 flex items-center justify-between gap-4">

                    <div className="flex items-center gap-4">

                        {/* Avatar */}
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-black text-lg font-bold text-white-900 shadow-lg">
                            {data.name.charAt(0).toUpperCase()}
                        </div>

                        <div>
                            <p className="text-sm text-slate-400">
                                Account
                            </p>

                            <h1 className="text-xl font-semibold tracking-tight text-black sm:text-2xl">
                                User Information
                            </h1>
                        </div>

                    </div>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <path d="m16 17 5-5-5-5" />
                            <path d="M21 12H9" />
                        </svg>

                        {loggingOut ? "Logging out..." : "Logout"}
                    </button>

                </header>

                {/* ================= CARD ================= */}

                <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">

                    {/* Card Header */}
                    <div className="border-b border-slate-200 bg-slate-50 px-6 py-6 sm:px-8">

                        <div className="flex items-start gap-4">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">

                                <svg
                                    width="19"
                                    height="19"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <circle cx="12" cy="8" r="4" />
                                    <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
                                </svg>

                            </div>

                            <div>
                                <h2 className="font-semibold text-slate-900">
                                    Complete your profile
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Review your registration details and provide the remaining information.
                                </p>
                            </div>

                        </div>

                    </div>

                    {/* Form */}
                    <div className="px-6 py-7 sm:px-8 sm:py-8">

                        <div className="grid gap-6 sm:grid-cols-2">

                            {/* NAME */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Name
                                </label>

                                <div className="relative">

                                    <input
                                        type="text"
                                        value={data.name}
                                        readOnly
                                        className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-600 outline-none"
                                    />

                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                                        Verified
                                    </span>

                                </div>
                            </div>

                            {/* EMAIL */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Email
                                </label>

                                <div className="relative">

                                    <input
                                        type="email"
                                        value={data.email}
                                        readOnly
                                        className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-600 outline-none"
                                    />

                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                                        Verified
                                    </span>

                                </div>
                            </div>

                            {/* PASSWORD */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Password
                                </label>

                                <div className="relative">

                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={data.password}
                                        readOnly
                                        className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 pr-12 text-sm text-slate-600 outline-none"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showPassword ? (
                                            <svg
                                                width="18"
                                                height="18"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
                                                <path d="M3 3l18 18" />
                                                <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                                                <path d="M9.9 4.2A10.7 10.7 0 0 1 12 4c5 0 9 4 10 8-0.4 1.4-1.2 2.7-2.2 3.8" />
                                                <path d="M6.6 6.6C4.8 7.8 3.4 9.7 2 12c1.1 4 5 8 10 8 1.2 0 2.4-.2 3.4-.6" />
                                            </svg>
                                        ) : (
                                            <svg
                                                width="18"
                                                height="18"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
                                                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        )}
                                    </button>

                                </div>
                            </div>

                            {/* MOBILE */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Mobile Number
                                </label>

                                <input
                                    type="tel"
                                    value={mobile}
                                    onChange={(e) =>
                                        setMobile(
                                            e.target.value.replace(/\D/g, "").slice(0, 10)
                                        )
                                    }
                                    placeholder="Enter 10 digit number"
                                    inputMode="numeric"
                                    maxLength={10}
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
                                />
                            </div>

                            {/* USERNAME */}
                            <div className="sm:col-span-2">

                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Username
                                </label>

                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="e.g. ayush_123"
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
                                />

                                <p className="mt-2 text-xs text-slate-400">
                                    Letters and numbers are allowed. You may use one special character: . _ -
                                </p>

                            </div>

                        </div>

                        {/* ================= MESSAGES ================= */}

                        {error && (
                            <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5">

                                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-600">
                                    !
                                </div>

                                <p className="text-sm text-red-700">
                                    {error}
                                </p>

                            </div>
                        )}

                        {success && (
                            <div className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3.5">

                                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                                    ✓
                                </div>

                                <p className="text-sm text-emerald-700">
                                    {success}
                                </p>

                            </div>
                        )}

                        {/* ================= BUTTON ================= */}

                        <button
                            onClick={handleValidate}
                            className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-[0.99]"
                        >
                            <svg
                                width="17"
                                height="17"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="m9 12 2 2 4-4" />
                                <path d="M21 12c0 5-4 9-9 9s-9-4-9-9 4-9 9-9 9 4 9 9Z" />
                            </svg>

                            Validate Information
                        </button>

                    </div>

                </section>

                {/* Footer */}
                <p className="mt-6 text-center text-xs text-slate-500">
                    Your account is securely managed with Firebase Authentication.
                </p>

            </div>

        </main>
    );
}