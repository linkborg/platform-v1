import type { Block, Site, User, Link } from "@prisma/client";

export interface _SiteData extends Site {
  user: User | null | any;
  font: "font-cal" | "font-lora" | "font-work";
  links: Array<Link>;
  blocks: Array<Block>;
}

export interface _SiteSlugData extends Block {
  site: _SiteSite | null;
}

interface _SiteSite extends Site {
  user: User | null;
}
