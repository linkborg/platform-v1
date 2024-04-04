import React from 'react';
import {Popover, Text, Button, useTheme, Select} from '@geist-ui/core';
import { signOut } from 'next-auth/react';
import {ThemeType, usePrefers} from '@/lib/use-prefers';
import { Sun, Moon, User } from '@geist-ui/icons'
import Link from 'next/link';
import NiceLink from "@/components/NiceLink";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";


const UserSettings: React.FC = () => {
  
  const theme = useTheme();
  const prefers = usePrefers();

  const router = useRouter();

  const host = typeof window !== 'undefined' ? window.location.host : '';

  const [homePage, setHomePage] = useState(false);

  useEffect(() => {
    if (host) {
      if (
          (host === "linkb.org") ||
          (host === "localhost:3000")
      ){
        setHomePage(true);
      }
      else {
        setHomePage(false);
      }
    }
  }, [host, router])

  return (
  <>
      { homePage ?
          <Link href={"https://app.linkb.org/settings"} style={{width: "100%"}}>
            <Popover.Item>
              Settings
            </Popover.Item>
          </Link>
          :
          <Link href={"/settings"} style={{width: "100%"}}>
            <Popover.Item>
              Settings
            </Popover.Item>
          </Link>
      }
    <Popover.Item line />
    <Popover.Item
      disableAutoClose={true}
    >
      Theme: {theme.type}
    </Popover.Item>
    <Popover.Item
        disableAutoClose={true}
    >
      <Select value={theme.type} onChange={(e) => prefers.switchTheme(e as ThemeType)}>
        <Select.Option value="light">Light</Select.Option>
        <Select.Option value="dark">Dark</Select.Option>
        <Select.Option value="high-contrast-light">High Contrast Light</Select.Option>
        <Select.Option value="high-contrast-dark">High Contrast Dark</Select.Option>
      </Select>
    </Popover.Item>
    <Popover.Item line />
    <Popover.Item onClick={(e) => {signOut()}}>
      Logout
    </Popover.Item>
  </>
)};

export default UserSettings;
