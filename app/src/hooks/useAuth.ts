"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import {
  loginAuthLoginPostMutation,
  registerAuthRegisterPostMutation,
} from "../api/generated/@tanstack/react-query.gen";

export function useRegister() {
  return useMutation({
    ...registerAuthRegisterPostMutation(),
  });
}

export function useLogin() {
  return useMutation({
    ...loginAuthLoginPostMutation(),
    onSuccess: (data) => {
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
    },
  });
}

// --- ADD THIS HOOK FOR ROUTE PROTECTION ---
export function useAuthCheck() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const publicPaths = ["/login", "/register"];
    const isPublicPath = publicPaths.includes(pathname);

    if (!token && !isPublicPath) {
      // Not logged in -> redirect to login
      setIsAuthenticated(false);
      router.replace("/login");
    } else if (token && isPublicPath) {
      // Logged in & visiting login/register -> redirect to dashboard
      setIsAuthenticated(true);
      router.replace("/");
    } else {
      setIsAuthenticated(!!token);
    }

    setIsLoading(false);
  }, [pathname, router]);

  return { isAuthenticated, isLoading };
}
export function useLogout() {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    router.replace("/login");
  };

  return { logout };
}