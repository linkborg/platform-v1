import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { CssBaseline, GeistProvider, useTheme } from '@geist-ui/core'
import React, { useEffect, useState, useCallback } from 'react'

import "@/styles/globals.css";

import { PrefersContext, themes, ThemeType } from '@/lib/use-prefers';

import type { AppProps } from "next/app";
import Layout from "@/components/layout";
import {
  HighContrastDarkTheme,
  HighContrastLightTheme,
} from "@/lib/themes";

export default function App({
                              Component,
                              pageProps: { session, ...pageProps },
                            }: AppProps<{ session: Session }>) {

  const [themeType, setThemeType] = useState<ThemeType>('dark');

  useEffect(() => {
    document.documentElement.removeAttribute('style');
    document.body.removeAttribute('style');

    const theme = window.localStorage.getItem('theme') as ThemeType;
    if (themes.includes(theme)) setThemeType(theme);
  }, []);

  const switchTheme = useCallback((theme: ThemeType) => {
    setThemeType(theme);
    if (typeof window !== 'undefined' && window.localStorage) window.localStorage.setItem('theme', theme);
  }, []);

  return (
      <SessionProvider session={session}>
        <GeistProvider themes={[
          HighContrastLightTheme, HighContrastDarkTheme,
        ]} themeType={themeType}>
          <CssBaseline />
          <PrefersContext.Provider value={{ themeType, switchTheme }}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </PrefersContext.Provider>
        </GeistProvider>
      </SessionProvider>
  );
}
