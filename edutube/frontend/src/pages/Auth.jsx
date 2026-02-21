import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import EduTubeLogo from "../components/EduTubeLogo";
import { loginUser, registerUser } from "../Api";
import { RippleButton } from "@/components/ui/ripple-button";
import { ShineBorder } from "@/components/ui/shine-border";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  // Open signup form when coming from landing (e.g. /auth?tab=signup)
  useEffect(() => {
    if (searchParams.get("tab") === "signup") setIsLogin(false);
  }, [searchParams]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const userData = { email, password };
    const result = await loginUser(userData);
    if (result) {
      navigate("/");
      console.log(result);
    } else {
      alert("please signup or enter correct details");
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const userData = { username, email, password };
    const result = await registerUser(userData);
    console.log(result);
    if (result) {
      setIsLogin(!isLogin);
    } else {
      alert("something went wrong!");
    }
    console.log(result);
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-start pt-16 md:pt-24 auth-page-gradient px-6 py-8 md:py-12">
      <div className="mb-6 flex justify-center">
        <EduTubeLogo asLink={true} size="lg" />
      </div>
      <div className="relative w-full max-w-md rounded-xl [--shine-border-width:3px]">
        <ShineBorder
          borderWidth={3}
          duration={10}
          shineColor={["#6366f1", "#8b5cf6", "#a855f7"]}
          className="rounded-xl"
        />
        <Card className="relative w-full border-0 bg-card text-card-foreground shadow-xl rounded-xl m-[3px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">
            {isLogin ? "Sign in to your account" : "Create an account"}
          </CardTitle>
          <CardDescription>
            {isLogin
              ? "Enter your email and password to sign in."
              : "Enter your details below to create your account."}
          </CardDescription>
        </CardHeader>
        <form
          onSubmit={(e) =>
            isLogin ? handleLoginSubmit(e) : handleRegisterSubmit(e)
          }
        >
          <CardContent className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Your email</Label>
              <Input
                id="email"
                type="email"
                placeholder="abc@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <RippleButton type="submit" className="w-full">
              {isLogin ? "Sign in" : "Create an account"}
            </RippleButton>
            <p className="text-sm text-muted-foreground text-center">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              {isLogin ? (
                <a
                  href={`${window.location.origin}/land`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Sign up here
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="font-medium text-primary underline-offset-4 hover:underline cursor-pointer"
                >
                  Login here
                </button>
              )}
            </p>
          </CardFooter>
        </form>
      </Card>
      </div>
    </section>
  );
};

export default Auth;
