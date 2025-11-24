"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

export default function PurchaseHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const purchased = searchParams.get("purchased");
    
    if (purchased === "true") {
      console.log('PurchaseHandler: Payment detected, processing...');
      
      // Show success toast
      toast({
        title: "Payment Successful! 🎉",
        description: "Your enrollment is confirmed. Welcome to the course!",
      });

      // Remove query params from URL first
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
      
      // Force a hard refresh to get updated server data
      // Use a longer delay to ensure payment is fully processed
      setTimeout(() => {
        console.log('PurchaseHandler: Refreshing page to show updated enrollment status...');
        // Use window.location.reload() for a full page refresh
        // This ensures we get fresh data from the server
        window.location.reload();
      }, 1500);
    }
  }, [searchParams, router, toast]);

  return null;
}

