import useSWR, { mutate } from "swr";
import React, { useState } from "react";
import { fetcher } from "@/lib/fetcher";
import { HttpMethod } from "@/types";

import type { Site } from "@prisma/client";
import {Button, ButtonGroup, Card, Divider, Input, Link, Snippet, Spacer, Tabs, Text} from "@geist-ui/core";

type DomainData = Pick<
    Site,
    | "customDomain"
    | "description"
    | "id"
    | "image"
    | "name"
    | "subdomain"
>;

interface DomainCardProps<T = DomainData> {
    data: T;
}

export default function DomainCard({ data }: DomainCardProps) {
    const { data: valid, isValidating } = useSWR<Site>(
        `/api/domain/check?domain=${data.customDomain}`,
        fetcher,
        { revalidateOnMount: true, refreshInterval: 5000 }
    );
    const [recordType, setRecordType] = useState("CNAME");
    const [removing, setRemoving] = useState(false);
    const subdomain = // if domain is a subdomain
        data.customDomain && data.customDomain.split(".").length > 2
            ? data.customDomain.split(".")[0]
            : "";

    return (
        <Card width={"100%"}>
            <Card.Content>
                <div className="card__action">
                    <Text h4>Custom Domain</Text>
                    <Button
                        auto
                        htmlType={"submit"}
                        scale={0.6}
                        loading={isValidating}
                        onClick={() => {
                            mutate(`/api/domain/check?domain=${data.customDomain}`);
                        }}
                        disabled={isValidating}
                    >Re-check</Button>
                </div>
                <Spacer />
                <Link
                    href={`https://${data.customDomain}`}
                    rel="noreferrer"
                    target="_blank"
                    color
                    underline
                    icon
                >
                    {data.customDomain}
                </Link>
                <Spacer />
                {!valid && (
                    <>
                        <Divider />
                        <Text p>
                            Set the following record on your DNS provider to continue:
                        </Text>
                        <Tabs initialValue={ subdomain ? "1" : "2"}>
                            { subdomain && (<Tabs.Item label="CNAME" value="1">
                                <Text small={true}>Type</Text>
                                <Snippet symbol={""} text="CNAME" style={{width: "100%", maxWidth: "300px"}} />
                                <Spacer />
                                <Text small={true}>Name</Text>
                                <Snippet symbol={""} text={subdomain} style={{width: "100%", maxWidth: "300px"}} />
                                <Spacer />
                                <Text small={true}>Value</Text>
                                <Snippet symbol={""} text={`${data.subdomain}.linkb.org`} style={{width: "100%", maxWidth: "300px"}} />
                            </Tabs.Item>)}
                            <Tabs.Item label="A record" value="2">
                                <Text small={true}>Type</Text>
                                <Snippet symbol={""} text="A" style={{width: "100%", maxWidth: "300px"}} />
                                <Spacer />
                                <Text small={true}>Name</Text>
                                <Snippet symbol={""} text={ subdomain ? subdomain : "@"} style={{width: "100%", maxWidth: "300px"}} />
                                <Spacer />
                                <Text small={true}>Value</Text>
                                <Snippet symbol={""} text="76.76.21.21" style={{width: "100%", maxWidth: "300px"}} />
                            </Tabs.Item>
                        </Tabs>
                    </>
                )}
            </Card.Content>
            <Spacer />
            <Card.Footer>
                <div className="card__action">
                    <Text span>
                        {valid ? "Valid" : "Invalid"} Configuration
                    </Text>
                    <Button
                        auto
                        htmlType={"submit"}
                        type="error"
                        onClick={async () => {
                            setRemoving(true);
                            await fetch(
                                `/api/domain?domain=${data.customDomain}&siteId=${data.id}`,
                                {
                                    method: HttpMethod.DELETE,
                                }
                            ).then((res) => {
                                setRemoving(false);
                                if (res.ok) {
                                    mutate(`/api/site?siteId=${data.id}`);
                                } else {
                                    alert("Error removing domain");
                                }
                            });
                        }}
                        disabled={removing}
                        loading={removing}
                    >Remove</Button>
                </div>
            </Card.Footer>

            <style jsx>{`
              .card__action{
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
              }
            `}</style>
        </Card>
    );
}