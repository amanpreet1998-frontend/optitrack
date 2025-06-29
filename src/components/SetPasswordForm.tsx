"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

// Zod schema for password form
const passwordSchema = z
  .object({
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function SetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [success, setSuccess] = useState("");
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data: PasswordFormData) => {
    try {
      const res = await fetch("http://localhost:5000/api/set-password", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password: data.password }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to set password");
      }

      setSuccess("Password set successfully! Redirecting...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setServerError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md p-6 shadow-lg rounded-2xl">
        <CardHeader className="text-center">
          <h2 className="text-2xl font-bold">Set Your Password</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="New Password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <Input
                type="password"
                placeholder="Confirm Password"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full">
              Set Password
            </Button>

            {serverError && <p className="text-red-600 text-sm text-center">{serverError}</p>}
            {success && <p className="text-green-600 text-sm text-center">{success}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
