"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

// Generate CSRF token
function generateCSRFToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);
  const [csrfToken, setCsrfToken] = useState("");
  const router = useRouter();

  // Check for existing lockout on component mount and generate CSRF token
  useEffect(() => {
    const savedLockout = localStorage.getItem('loginLockout');
    if (savedLockout) {
      const lockoutEnd = parseInt(savedLockout);
      if (Date.now() < lockoutEnd) {
        setLockoutTime(lockoutEnd);
      } else {
        localStorage.removeItem('loginLockout');
      }
    }
    
    // Generate CSRF token
    setCsrfToken(generateCSRFToken());
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if account is locked out
    if (lockoutTime && Date.now() < lockoutTime) {
      const remainingTime = Math.ceil((lockoutTime - Date.now()) / 1000);
      setError(`Account temporarily locked. Please try again in ${remainingTime} seconds.`);
      return;
    }
    
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        setAttempts(prev => prev + 1);
        
        // Implement progressive lockout
        if (attempts >= 4) {
          const lockoutDuration = Math.min(300 * Math.pow(2, attempts - 4), 3600); // Max 1 hour
          const lockoutEnd = Date.now() + (lockoutDuration * 1000);
          setLockoutTime(lockoutEnd);
          localStorage.setItem('loginLockout', lockoutEnd.toString());
          setError(`Too many failed attempts. Account locked for ${Math.ceil(lockoutDuration / 60)} minutes.`);
        } else {
          throw error;
        }
      } else {
        // Reset attempts on successful login
        setAttempts(0);
        localStorage.removeItem('loginLockout');
        setLockoutTime(null);
        // Update this route to redirect to an authenticated route. The user already has an active session.
        router.push("/protected");
      }
    } catch (error: unknown) {
      if (!lockoutTime) {
        setError(error instanceof Error ? error.message : "An error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              {/* Hidden CSRF token */}
              <input type="hidden" name="csrf_token" value={csrfToken} />
              
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!!lockoutTime}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/auth/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={!!lockoutTime}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              {attempts > 0 && attempts < 5 && (
                <p className="text-sm text-orange-500">
                  Failed attempts: {attempts}/5
                </p>
              )}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || !!lockoutTime}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/sign-up"
                className="underline underline-offset-4"
              >
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
