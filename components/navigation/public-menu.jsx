import React from 'react';
import NextLink from 'next/link';
import { Avatar, Button, useTheme, Popover, Image, Text, User } from '@geist-ui/core';
import UserSettings from '@/components/navigation/user-settings';
import { usePrefers } from '@/lib/use-prefers';
import { Sun, Moon } from '@geist-ui/icons'
import { useSession } from "next-auth/react";

const PublicMenu = () => {
  const theme = useTheme();
  const prefers = usePrefers();

  return (
    <>
      <nav className="menu-nav">
        <div>
          <Button 
            aria-label="Toggle Dark mode"
            iconRight={theme.type === 'dark' ? <Sun size={16} /> : <Moon size={16} />} 
            onClick={() => prefers.switchTheme(theme.type === 'dark' ? 'light' : 'dark')}
            auto scale={2/3} px={0.6} style={{borderRadius: "9999px", marginLeft: "0.5rem"}}
          />
        </div>
      </nav>
      <style jsx>{`
        .menu-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: ${theme.layout.pageWidthWithMargin};
          max-width: 100%;
          margin: 0 auto;
          padding: 0 ${theme.layout.pageMargin};
          background-color: ${theme.palette.background};
          font-size: 16px;
          height: 54px;
          box-sizing: border-box;
          box-shadow: ${ "inset 0 -1px " + theme.palette.border }
        }
        .menu-nav > div {
          display: flex;
          align-items: center;
        }
      `}</style>
    </>
  );
};

export default PublicMenu;
