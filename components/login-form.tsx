"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { validateInput } from "@/components/validateInput";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { useGlobal } from "@/context/global";
export function LoginForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [errors, setErrors] = useState({
        emailSigns: false,
        emailFormat: false,
        passwordLength: false,
        passwordUppercase: false,
        passwordLowercase: false,
        passwordNumber: false,
        passwordSpecial: false,
    });
    const router = useRouter();
    const [invalidPassword, setInvalidPassword] = useState<boolean>(false);
    const [invalidAccount, setInvalidAccount] = useState<boolean>(false);
    const { global, setGlobal } = useGlobal();

    const handleLogin = async () => {
        try {
            setIsLoading(true);
            if (validateInput(email, password).error) {
                console.log(email, password);
                const response = await fetch("/api/users", {
                    method: "POST",
                    body: JSON.stringify({ email, password, mode: "LOGIN" }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const data = await response.json();
                console.log(data);
                if (response.ok) {
                    setGlobal({
                        loggedIn: true,
                        user: data,
                    });
                    router.push("/");
                } else {
                    setError(true);
                }
            } else {
                setIsLoading(false);
                setErrors(validateInput(email, password).errors);
            }
        } catch (error) {
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const hasErrors = Object.values(errors).some((error) => error === true);
        if (hasErrors) {
            setError(true);
        }
    }, [errors]);

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <AlertDialog open={error}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {error ? "Validation Errors" : "Verify email"}
                        </AlertDialogTitle>
                    </AlertDialogHeader>
                    {error ? (
                        <div className="flex flex-col gap-2">
                            <ul className="list-disc pl-5 space-y-1">
                                {errors.emailSigns && (
                                    <li>
                                        <p>Email contains invalid special characters</p>
                                    </li>
                                )}
                                {errors.emailFormat && (
                                    <li>
                                        <p>Please enter a valid email address</p>
                                    </li>
                                )}
                                {errors.passwordLength && (
                                    <li>
                                        <p>Password must be at least 8 characters long</p>
                                    </li>
                                )}
                                {errors.passwordUppercase && (
                                    <li>
                                        <p>Password must contain at least one uppercase letter</p>
                                    </li>
                                )}
                                {errors.passwordLowercase && (
                                    <li>
                                        <p>Password must contain at least one lowercase letter</p>
                                    </li>
                                )}
                                {errors.passwordNumber && (
                                    <li>
                                        <p>Password must contain at least one number</p>
                                    </li>
                                )}
                                {errors.passwordSpecial && (
                                    <li>
                                        <p>Password must contain at least one special character</p>
                                    </li>
                                )}
                            </ul>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            <p>Please check your email for a verification link</p>
                        </div>
                    )}
                    <AlertDialogFooter className="flex items-center">
                        {error && (
                            <AlertDialogCancel
                                onClick={() => {
                                    setError(false);
                                }}
                            >
                                Got it
                            </AlertDialogCancel>
                        )}
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <a
                                        href="#"
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                />
                            </div>
                            <Button type="button" className="w-full" onClick={handleLogin}>
                                Login
                            </Button>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <a href="./register" className="underline underline-offset-4">
                                Sign up
                            </a>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default LoginForm;
