import NextLink, { LinkProps } from 'next/link';
import React, {ReactNode} from 'react';
import { Link, LinkProps as GeistLinkProps } from "@geist-ui/core";

interface NiceLinkProps extends LinkProps {
    children: ReactNode;
    icon?: GeistLinkProps["icon"];
    target?: GeistLinkProps["target"];
}

const NiceLink: React.FC<NiceLinkProps> = ({ children, ...props }) => {
    return (
        <NextLink {...props} legacyBehavior={true} passHref={true}>
            <Link href={props.href.toString()} onClick={props.onClick ? props.onClick : () => {}} target={props.target} icon={props.icon} color block>
                {children}
            </Link>
        </NextLink>
    )
}

export default NiceLink;
