"use client";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useGlobal } from "@/context/global";

const Header = () => {
    const router = useRouter();
    const [pathname, setPathname] = useState<string>("");
    const { global, setGlobal } = useGlobal();
    const [loggedIn, setLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        setPathname(pathname);
    }, [pathname]);

    const handleLogin = () => {
        router.push("/auth/login");
    }

    const handleSignup = () => {
        router.push("/auth/register");
    }

    const handleRecipes = () => {
        router.push("./../");
    }

    const handleLogout = () => {
        setGlobal({
            loggedIn: false,
            user: null,
        });
    }


    useEffect(() => {
        console.log(global);
        setLoggedIn(global.loggedIn);
    }, [global.loggedIn]);

    return (
        <div className="flex justify-between items-center h-[60px] w-full absolute top-0 left-0 z-50 border-b px-5">
            <div className="flex flex-row gap-5 items-center">
                <h1 className="text-2xl font-bold">Kitchen Assistant</h1>
                <Button variant="ghost" onClick={handleRecipes} disabled={pathname === "/"}>
                    Recipes
                </Button>
            </div>
            {loggedIn ? (
                <Button variant="ghost" onClick={handleLogout}>Logout</Button>
            ) : (
                <div className="flex items-center gap-2">
                    <Button variant="ghost" disabled={pathname === "/auth/login"} onClick={handleLogin}>Login</Button>
                    <Button variant="default" disabled={pathname === "/auth/register"} onClick={handleSignup}>Register</Button>
                </div>
            )}
        </div>
    );
};

export default Header;  
