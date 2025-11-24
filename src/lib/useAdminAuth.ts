"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export interface AdminAuthState {
  isAdmin: boolean | null;
  isLoading: boolean;
  user: {
    uid: string;
    email?: string;
    name?: string;
  } | null;
  organization: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export function useAdminAuth() {
  const router = useRouter();
  const [authState, setAuthState] = useState<AdminAuthState>({
    isAdmin: null,
    isLoading: true,
    user: null,
    organization: null,
  });

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await fetch("/api/admin/me");
        if (response.ok) {
          const data = await response.json();
          if (data.authenticated && data.isAdmin) {
            setAuthState({
              isAdmin: true,
              isLoading: false,
              user: data.user || null,
              organization: data.organization || null,
            });
          } else {
            setAuthState({
              isAdmin: false,
              isLoading: false,
              user: null,
              organization: null,
            });
            router.push("/admin/login");
          }
        } else {
          setAuthState({
            isAdmin: false,
            isLoading: false,
            user: null,
            organization: null,
          });
          router.push("/admin/login");
        }
      } catch (error) {
        console.error("Admin auth check failed:", error);
        setAuthState({
          isAdmin: false,
          isLoading: false,
          user: null,
          organization: null,
        });
        router.push("/admin/login");
      }
    };
    checkAdmin();
  }, [router]);

  return authState;
}

