import TopMenu from '@/components/navigation/top-menu';
import {Display, Link, useTheme} from "@geist-ui/core";
import React, {useEffect, useState} from "react";
import {HttpMethod} from "@/types";
import {usePrefers} from "@/lib/use-prefers";
import {useSession} from "next-auth/react";
import {LinkborgFooter} from "@/components/linkborg-footer";
import {useRouter} from "next/router";

export default function Layout( { children }) {
    const theme = useTheme();
    const { data: session } = useSession();
    const prefers = usePrefers();

    const router = useRouter();

    const [userData, setUserData] = useState("");

    useEffect(() => {
        if (session){
            setUserData({
                ...session.user,
            });
            prefers.switchTheme(session.user?.theme)
        }
    }, [session]);

    useEffect(() => {
        if(userData.theme !== theme.type && userData.theme !== undefined){
            const saveSettings = async () => {
                const response = await fetch("/api/save-settings", {
                    method: HttpMethod.POST,
                    body: JSON.stringify({
                        ...userData,
                        theme: theme.type
                    }),
                });
            }
            saveSettings();
        }
    }, [theme.type])

    if (router.pathname === "/home/backgrounds") {
        return (
            <>
                {children}
            </>
        )
    }
    else {
        return (
            <>
                <TopMenu />
                {children}
                <LinkborgFooter />
            </>
        );
    }
}