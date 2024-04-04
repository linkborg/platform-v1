import type { Link, Site, Block } from "@prisma/client";
import type { PropsWithChildren } from "react";

export type WithChildren<T = {}> = T & PropsWithChildren<{}>;

export type WithClassName<T = {}> = T & {
  className?: string;
};

export interface WithSiteLink extends Link {
  site: Site | null;
}

export interface WithSiteBlock extends Block {
  site: Site | null;
}

