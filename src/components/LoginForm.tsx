"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        credentials: "include", // stores token in cookies
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Login failed");
      }

      const data = await res.json();

      // Role-based redirect
      if (data.role === "admin") router.push("/admin/dashboard");
      else if (data.role === "hr") router.push("/hr/dashboard");
      else router.push("/employee/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md p-6 shadow-lg rounded-2xl">
        <CardHeader className="text-center">
          <h2 className="text-2xl font-bold">Login to OptiTrack</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="text-sm"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="text-sm"
            />
            <Button type="submit" className="w-full">
              Sign In
            </Button>
            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}
            <p className="text-xs text-center text-gray-500">
              Have an invite? Check your email for the password setup link.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
