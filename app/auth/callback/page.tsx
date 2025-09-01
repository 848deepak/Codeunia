"use client"

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

function OAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/";

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const supabase = createClient();
      
      try {
        // First, try to get the current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          toast.error("Authentication failed. Please try signing in again.");
          router.replace(`/auth/signin?returnUrl=${encodeURIComponent(returnUrl)}`);
          return;
        }

        if (session?.user) {
          // User is authenticated, redirect to return URL
          toast.success("Signed in successfully!");
          router.replace(returnUrl);
          return;
        }

        // If no session, check if we're in an OAuth callback
        const hash = window.location.hash;
        const urlParams = new URLSearchParams(window.location.search);
        
        if (hash || urlParams.has('code') || urlParams.has('error')) {
          // This is an OAuth callback, wait a moment for the session to be established
          setTimeout(async () => {
            const { data: { session: retrySession }, error: retryError } = await supabase.auth.getSession();
            
            if (retryError) {
              toast.error("Authentication failed. Please try signing in again.");
              router.replace(`/auth/signin?returnUrl=${encodeURIComponent(returnUrl)}`);
              return;
            }

            if (retrySession?.user) {
              toast.success("Signed in successfully!");
              router.replace(returnUrl);
            } else {
              // Try one more time after a longer delay
              setTimeout(async () => {
                const { data: { session: finalSession } } = await supabase.auth.getSession();
                if (finalSession?.user) {
                  toast.success("Signed in successfully!");
                  router.replace(returnUrl);
                } else {
                  toast.error("Authentication failed. Please try signing in again.");
                  router.replace(`/auth/signin?returnUrl=${encodeURIComponent(returnUrl)}`);
                }
              }, 2000);
            }
          }, 1000);
        } else {
          // No OAuth parameters and no session, redirect to signin
          toast.error("No authentication session found. Please sign in again.");
          router.replace(`/auth/signin?returnUrl=${encodeURIComponent(returnUrl)}`);
        }
      } catch {
        toast.error("Authentication failed. Please try signing in again.");
        router.replace(`/auth/signin?returnUrl=${encodeURIComponent(returnUrl)}`);
      }
    };

    handleOAuthCallback();
  }, [router, returnUrl]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-muted/50">
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping"></div>
      </div>
      <span className="ml-4 text-lg text-muted-foreground">Signing you in...</span>
    </div>
  );
}

export default function OAuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-muted/50">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping"></div>
        </div>
        <span className="ml-4 text-lg text-muted-foreground">Loading...</span>
      </div>
    }>
      <OAuthCallbackContent />
    </Suspense>
  );
} 