import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {Button, ButtonGroup, Card, Dot, Modal, Popover, Spacer, Tabs, Text, Textarea, useTheme} from '@geist-ui/core';
import NextLink from "next/link";
import Image from "next/image";
import Link from "next/link";
import {ChevronDown, PenTool} from "@geist-ui/icons";
import useBetterMediaQuery from "@/lib/use-better-media-query";
import IndeterminateProgressBar from "@/components/indeterminate-progress";

const SiteSubmenu = ( { loading = false } ) => {
  const theme = useTheme();
  const router = useRouter();
  const { id, blockId } = router.query;
  const [sticky, setSticky] = useState(false);
  const [path, setPath] = useState(router.asPath);
  const isAboveSM = useBetterMediaQuery('(min-width: 650px)');

  useEffect(() => {
    const scrollHandler = () => setSticky(document.documentElement.scrollTop > 54);
    document.addEventListener('scroll', scrollHandler);
    return () => document.removeEventListener('scroll', scrollHandler);
  }, [setSticky]);

  useEffect(() => {
    let _path = router.asPath;
    let _pathname = router.pathname;
    if (_path.endsWith("/settings/appearance")){
      _path = _path.replace("/settings/appearance", "/settings")
    }
    if (_path.endsWith("/settings/domains")){
      _path = _path.replace("/settings/domains", "/settings")
    }
    if (_path.endsWith(`/blocks/${blockId}/appearance`)){
      _path = _path.replace(`/blocks/${blockId}/appearance`, `/blocks/${blockId}`)
    }
    setPath(_path);
  }, [router]);

  return (
    <>
    { id && <nav className="submenu__wrapper">
        <div className={`submenu ${sticky ? 'submenu_sticky' : ''}`}>
          <div className="submenu__inner">
            { sticky &&
                <NextLink href={"/"} style={{display: "flex", alignItems: "center"}}>
                  <Image src="/favicon.ico" height={32} width={32} alt={"LinkBorg Logo"} />
                </NextLink>
            }
            <Tabs value={path} onChange={(route) => router.push(route)}>
              <Tabs.Item label="Dashboard" value={`/site/${id}`} />
              {/* <Tabs.Item label="Links" value="/links" /> */}
              {/* <Tabs.Item label="Integrations" value="/integrations" /> */}
              {/* <Tabs.Item label="Activity" value="/activity" /> */}
              {/*<Tabs.Item label="Links" value={`/site/${id}/links`} />*/}
              <Tabs.Item label="Blocks" value={`/site/${id}/blocks`} />
              <Tabs.Item label="Analytics" value={`/site/${id}/analytics`} />
              {/* <Tabs.Item label="Usage" value="/usage" /> */}
              <Tabs.Item label="Settings" value={`/site/${id}/settings`} />
            </Tabs>
          </div>
        </div>
      </nav>
    }
      { loading && <IndeterminateProgressBar />}
      { path.endsWith("/settings") &&
      <div className="page_menu_wrapper">
        <div className="page_menu_content">
          <div style={{display: "flex", justifyContent: "space-between", flexDirection: "row", width: "100%", alignItems: "center"}}>
            <Text h2>Settings</Text>
            { isAboveSM ? (
                <ButtonGroup>
                  <Link href={`/site/${id}/settings/`}>
                    <Button>{ router.asPath.endsWith("/settings") && <Dot type={"success"} /> }General</Button>
                  </Link>
                  <Link href={`/site/${id}/settings/appearance`}>
                    <Button>{ router.asPath.endsWith("/settings/appearance") && <Dot type={"success"} /> }Appearance</Button>
                  </Link>
                  <Link href={`/site/${id}/settings/domains`}>
                    <Button>{ router.asPath.endsWith("/settings/domains") && <Dot type={"success"} /> }Domains</Button>
                  </Link>
                </ButtonGroup>
            ) : (
                <Popover content={
                  <div style={{minWidth: "150px"}}>
                    <Link href={`/site/${id}/settings/`}>
                      <Popover.Item>{ router.asPath.endsWith("/settings") && <Dot type={"success"} /> }General</Popover.Item>
                    </Link>
                    <Popover.Item line />
                    <Link href={`/site/${id}/settings/appearance`}>
                      <Popover.Item>{ router.asPath.endsWith("/settings/appearance") && <Dot type={"success"} /> }Appearance</Popover.Item>
                    </Link>
                    <Popover.Item line />
                    <Link href={`/site/${id}/settings/domains`}>
                      <Popover.Item>{ router.asPath.endsWith("/settings/domains") && <Dot type={"success"} /> }Domains</Popover.Item>
                    </Link>
                  </div>
                }>
                  <ButtonGroup>
                    <Button auto>
                      { router.asPath.endsWith("/settings") && "General" }
                      { router.asPath.endsWith("/settings/appearance") && "Appearance" }
                      { router.asPath.endsWith("/settings/domains") && "Domains" }
                    </Button>
                    <Button auto px={0.6} iconRight={<ChevronDown />} />
                  </ButtonGroup>
                </Popover>
            )}
          </div>
        </div>
      </div>
      }
      { path.endsWith(`/blocks/${blockId}`) &&
          <div className="page_menu_wrapper">
            <div className="page_menu_content">
              <div style={{display: "flex", justifyContent: "space-between", flexDirection: "row", width: "100%", alignItems: "center"}}>
                <Text h2>Block</Text>
                { isAboveSM ? (
                    <ButtonGroup>
                      <Link href={`/site/${id}/blocks/${blockId}`}>
                        <Button>{ router.asPath.endsWith(`/blocks/${blockId}`) && <Dot type={"success"} /> }General</Button>
                      </Link>
                      <Link href={`/site/${id}/blocks/${blockId}`}>
                      {/*<Link href={`/site/${id}/blocks/${blockId}/appearance`}>*/}
                        <Button>{ router.asPath.endsWith(`/blocks/${blockId}/appearance`) && <Dot type={"success"} /> }Appearance</Button>
                      </Link>
                    </ButtonGroup>
                ) : (
                    <Popover  content={
                      <div style={{minWidth: "150px"}}>
                        <Link href={`/site/${id}/blocks/${blockId}`}>
                          <Popover.Item>{ router.asPath.endsWith(`/blocks/${blockId}`) && <Dot type={"success"} /> }General</Popover.Item>
                        </Link>
                        <Popover.Item line />
                        <Link href={`/site/${id}/blocks/${blockId}`}>
                        {/*<Link href={`/site/${id}/blocks/${blockId}/appearance`}>*/}
                          <Popover.Item>{ router.asPath.endsWith(`/blocks/${blockId}/appearance`) && <Dot type={"success"} /> }Appearance</Popover.Item>
                        </Link>
                        <Popover.Item line />
                      </div>
                    }>
                      <ButtonGroup>
                        <Button auto>
                          { router.asPath.endsWith(`/site/${id}/blocks/${blockId}`) && "General" }
                          { router.asPath.endsWith(`/site/${id}/blocks/${blockId}/appearance`) && "Appearance" }
                        </Button>
                        <Button auto px={0.6} iconRight={<ChevronDown />} />
                      </ButtonGroup>
                    </Popover>
                )}
              </div>
            </div>
          </div>
      }
      <style jsx>{`
          .page_menu_wrapper {
            background-color: ${theme.palette.accents_1};
          }
          .page_menu_content {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            width: ${theme.layout.pageWidthWithMargin};
            max-width: 100%;
            margin: 0 auto;
            padding: calc(${theme.layout.gap} * 2) ${theme.layout.pageMargin} calc(${theme.layout.gap} * 4);
            padding-bottom: 0;
            box-sizing: border-box;
          }
          .page_menu_content :global(.view-all) {
            font-size: 0.875rem;
            font-weight: 700;
            margin: calc(1.5 * ${theme.layout.gap}) 0;
            text-align: center;
          }
          @media (max-width: ${theme.breakpoints.sm.max}) {
            .page_menu_content {
              flex-direction: column;
              justify-content: flex-start;
              align-items: stretch;
            }
          }
          .card_menu_action{
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
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
          -ms-overflow-style: none;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
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
          padding: 0.5rem;
          padding-top: 0;
          padding-bottom: 0;
          
          color: ${theme.palette.accents_5};
          font-size: 0.875rem;
          margin-right: 1rem;
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

export default SiteSubmenu;
