import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {Button, Popover, Tabs, useTheme} from '@geist-ui/core';
import Image from "next/image";
import NextLink from "next/link";
import {useSession} from "next-auth/react";
import UserSettings from "@/components/navigation/user-settings";
import NiceLink from "@/components/NiceLink";
import IndeterminateProgressBar from "@/components/indeterminate-progress";

const AppSubmenu: React.FC = ( { loading = false } : {loading?: boolean}) => {
  const theme = useTheme();
  const router = useRouter();
  const [sticky, setSticky] = useState(false);
  const [homePage, setHomePage] = useState(false);

  const session = useSession();
  const host = typeof window !== 'undefined' ? window.location.host : '';

  useEffect(() => {
    if (host) {
      if (
          (host === "linkb.org") ||
          (host === "app.linkb.org") ||
          (host === "app.localhost:3000") ||
          (host === "localhost:3000")
      ){
        setHomePage(false);

        if((host === "linkb.org") || (host === "localhost:3000")){
          setHomePage(true);
        }
      }
    }
  }, [host, router])

  useEffect(() => {
    const scrollHandler = () => setSticky(document.documentElement.scrollTop > 54);
    document.addEventListener('scroll', scrollHandler);
    return () => document.removeEventListener('scroll', scrollHandler);
  }, [setSticky]);

  return (
    <>
      <nav className="submenu__wrapper">
        <div className={`submenu ${sticky ? 'submenu_sticky' : ''}`}>

          <div className="submenu__inner">
            { sticky &&
                <NextLink href={"/"} style={{display: "flex", alignItems: "center"}}>
                  <Image src="/favicon.ico" height={32} width={32} alt={"LinkBorg Logo"} />
                </NextLink>
            }
            <Tabs value={router.asPath} onChange={(route) => router.push(route)}>
              <Tabs.Item label="Overview" value="/">

              </Tabs.Item>
              <Tabs.Item label="Overview" value="/" />
              {/* <Tabs.Item label="Links" value="/links" /> */}
              {/* <Tabs.Item label="Integrations" value="/integrations" /> */}
              {/* <Tabs.Item label="Activity" value="/activity" /> */}
              {/*<Tabs.Item label="Links" value="/links" />*/}
              {/* <Tabs.Item label="Usage" value="/usage" /> */}
              <Tabs.Item label="Settings" value="/settings" />
            </Tabs>
          </div>
        </div>
      </nav>
      { loading && <IndeterminateProgressBar />}
      <style jsx>{`
        .submenu__wrapper {
          height: 48px;
          position: relative;
          overflow: hidden;
          box-shadow: inset 0 -1px ${theme.palette.border};
        }
        .submenu_sticky {
          transition: box-shadow 0.2s ease;
        }
        .submenu_sticky {
          position: fixed;
          z-index: 1100;
          top: 0;
          right: 0;
          left: 0;
          background: ${theme.palette.background};
          box-shadow: ${theme.type === 'dark'
            ? `inset 0 -1px ${theme.palette.border}`
            : 'rgba(0, 0, 0, 0.1) 0 0 15px 0'};
        }
        .submenu__inner {
          display: flex;
          width: ${theme.layout.pageWidthWithMargin};
          max-width: 100%;
          margin: 0 auto;
          padding: 0 ${theme.layout.pageMargin};
          height: 48px;
          box-sizing: border-box;
          overflow-y: hidden;
          overflow-x: auto;
          overflow: -moz-scrollbars-none;
          -ms-overflow-style: none;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          box-sizing: border-box;
        }
        .submenu__inner::-webkit-scrollbar {
          display: none;
        }
        .submenu__inner :global(.content) {
          display: none;
        }
        .submenu__inner :global(.tabs),
        .submenu__inner :global(header) {
          height: 100%;
          border: none;
        }
        .submenu__inner :global(.tab) {
          height: calc(100% - 2px);
          padding-top: 0;
          padding-bottom: 0;
          color: ${theme.palette.accents_5};
          font-size: 0.875rem;
        }
        .submenu__inner :global(.tab):hover {
          color: ${theme.palette.foreground};
        }
        .submenu__inner :global(.active) {
          color: ${theme.palette.foreground};
        }
      `}</style>
    </>
  );
};

export default AppSubmenu;
