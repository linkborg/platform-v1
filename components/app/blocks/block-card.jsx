import {
    Button,
    Divider,
    Fieldset,
    Text,
    Link,
    Badge,
    Dot,
    useTheme,
    useToasts,
    useClipboard,
    Tag
} from "@geist-ui/core";
import React, {useState} from "react";
import {ChevronDownCircle, ChevronUpCircle, Copy, Eye, Menu} from "@geist-ui/icons";
import NiceLink from "@/components/NiceLink";

const BlockCard = ({block, siteId, link}) => {
    const theme = useTheme();

    const { setToast } = useToasts()
    const { copy } = useClipboard()
    const copyHandler = (text) => {
        copy(text);
        setToast({ text: 'Link copied.' })
    }

    const [expanded, setExpanded] = useState(false);
    return (
        <Fieldset width={"100%"}>

            <Fieldset.Content px={0.5} py={0}>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", flexDirection: "row"}}>
                    <Text>
                        <Badge mr={0.5}>{block.type}</Badge>
                        {block?.title}
                    </Text>
                    <div style={{borderRadius: "9999px"}} onClick={(e) => {e.preventDefault(); setExpanded(!expanded)}}>
                        {expanded ? <ChevronUpCircle size={24} />: <ChevronDownCircle size={24} />}
                    </div>
                </div>
            </Fieldset.Content>

            {
                expanded && (
                    <>
                        <Divider my={0} />
                        <Fieldset.Content px={0.5} py={0.5}>
                            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", flexDirection: "row"}}>
                                <Tag type={"secondary"} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexDirection: "row"}}>
                                    <Eye size={12} />
                                    <Text ml={0.5} small>{block.visits}</Text>
                                </Tag>
                                <Button auto scale={0.6} iconRight={<Copy/>}
                                        style={{textTransform: "none"}}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            copyHandler("https://"+link)
                                        }}
                                >
                                    {link}
                                </Button>
                            </div>
                        </Fieldset.Content>
                    </>
                )
            }
            <Fieldset.Footer px={0.5}>
                <div  style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", flexDirection: "row"}}>
                    {block.hidden ?
                        <Badge type={"secondary"}><Dot />hidden</Badge>
                        :
                        <Badge type={"default"}><Dot type={"success"}/>visible</Badge>
                    }
                    <NiceLink href={`/site/${siteId}/blocks/${block.id}`}>Settings</NiceLink>
                </div>
            </Fieldset.Footer>
        </Fieldset>
    )
}

export default BlockCard;