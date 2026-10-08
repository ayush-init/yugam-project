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

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.replace("/");
                return;
            }

            const storedData = sessionStorage.getItem("registrationData");

            if (storedData) {
                setData(JSON.parse(storedData));
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
        if (
            !data?.name.trim() ||
            !data?.password ||
            !mobile.trim() ||
            !username.trim() ||
            !data?.email.trim()
        ) {
            return "No field can be empty.";
        }

        const nameRegex = /^[A-Za-z ]+$/;

        if (!nameRegex.test(data.name.trim())) {
            return "Name can only contain characters.";
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).+$/;

        if (!passwordRegex.test(data.password)) {
            return "Password must contain at least one alphabet and one number.";
        }

        const mobileRegex = /^\d{10}$/;

        if (!mobileRegex.test(mobile.trim())) {
            return "Mobile number must contain exactly 10 digits.";
        }

        const usernameRegex = /^[A-Za-z0-9]+[._-]?[A-Za-z0-9]+$/;

        if (!usernameRegex.test(username.trim())) {
            return "Username can contain letters, numbers and one special character.";
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(data.email.trim())) {
            return "Please enter a valid email address.";
        }

        return "";
    };

    const handleValidate = () => {
        setError("");
        setSuccess("");

        const validationError = validate();

        if (validationError) {
            setError(validationError);
            return;
        }

        setSuccess("All information is valid.");
    };

    const handleLogout = async () => {
        await signOut(auth);
        sessionStorage.removeItem("registrationData");
        router.replace("/");
    };

    if (!data) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
                Loading...
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-950 px-4 py-8">

            {/* Header */}
            <div className="mx-auto flex max-w-3xl items-center justify-between mb-8">
                <div>
                    <p className="text-sm text-slate-400">
                        Account
                    </p>

                    <h1 className="text-2xl font-bold text-white">
                        User Information
                    </h1>
                </div>

                <button
                    onClick={handleLogout}
                    className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                    Logout
                </button>
            </div>

            {/* Form */}
            <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 sm:p-8 shadow-2xl">

                <div className="grid gap-5 sm:grid-cols-2">

                    {/* Name */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Name
                        </label>

                        <input
                            type="text"
                            value={data.name}
                            readOnly
                            className="w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-slate-600"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Password
                        </label>

                        <input
                            type="password"
                            value={data.password}
                            readOnly
                            className="w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-slate-600"
                        />
                    </div>

                    {/* Mobile */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Mobile Number
                        </label>

                        <input
                            type="tel"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                            placeholder="10 digit mobile number"
                            maxLength={10}
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                        />
                    </div>

                    {/* Username */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Username
                        </label>

                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Choose a username"
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                        />
                    </div>

                    {/* Email */}
                    <div className="sm:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Email
                        </label>

                        <input
                            type="email"
                            value={data.email}
                            readOnly
                            className="w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-slate-600"
                        />
                    </div>

                </div>

                {/* Error */}
                {error && (
                    <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {/* Success */}
                {success && (
                    <div className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                        {success}
                    </div>
                )}

                {/* Validate */}
                <button
                    onClick={handleValidate}
                    className="mt-6 w-full rounded-xl bg-slate-900 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                    Validate Information
                </button>

            </div>
        </main>
    );
}