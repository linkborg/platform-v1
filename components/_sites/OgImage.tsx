interface SiteOgProps {
    name?: string;
    bio?: string;
    site?: string;
    socials?: object;
    image?: string;
    cover?: string;
    logo?: string;
}

export const SiteOgImage = ({
                                name = "",
                                bio = "",
                                site = "",
                                socials = [],
                                image = "",
                                cover="https://linkborgcdn.xpri.dev/cover/cc806756-06f6-424d-ab9c-8d484682f247.jpeg",
                                logo = "https://linkborgcdn.xpri.dev/linkborg/favicon.png"
                            }: SiteOgProps) => {

    let backgroundImage = cover;
    if (backgroundImage === "/placeholder.png"){
        backgroundImage = "https://linkborgcdn.xpri.dev/cover/cc806756-06f6-424d-ab9c-8d484682f247.jpeg";
    }

    return (
        <div
            style={{
                width: '1200px',
                height: '630px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: "#ffffff"
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    height: '630px',
                    alignItems: 'flex-start',
                    flex: '0 0 auto',
                    justifyContent: 'flex-start',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        height: '200px',
                        alignItems: 'center',
                        flex: '0 0 auto',
                        backgroundImage:
                            `url(${backgroundImage})`,
                        backgroundSize: '100%',
                        justifyContent: 'center',
                    }}
                >
                    <img
                        src={image ? image : logo}
                        alt="image"
                        loading="eager"
                        style={{
                            width: '200px',
                            objectFit: 'cover',
                            borderWidth: '0px',
                            borderColor: 'black',
                            borderRadius: '9999px',
                            height: '200px',
                            marginTop: '200px',
                        }}
                    />
                </div>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        height: '430px',
                        alignItems: 'center',
                        flex: '0 0 auto',
                        justifyContent: 'center',
                        position: 'relative',
                        padding: "0 48px",
                        textAlign: "center"
                    }}
                >
                  <span
                      style={{
                          fontSize: '50px',
                      }}
                  >
                    {name}
                  </span>
                    <span
                        style={{
                            fontSize: '25px',
                            marginTop: '16px',
                        }}
                    >
                    {bio}
                  </span>
                    <div
                        style={{
                            display: 'flex',
                            width: '1200px',
                            height: '80px',
                            alignItems: 'center',
                            flex: '0 0 auto',
                            // borderWidth: '2px',
                            // borderStyle: 'double',
                            // borderColor: '#ffffff',
                            borderTop: "2px solid white",
                            left: '0px',
                            bottom: '0px',
                            position: 'absolute',
                            justifyContent: 'center',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                width: '50%',
                                height: '70px',
                                alignItems: 'center',
                                flex: '0 0 auto',
                                justifyContent: 'flex-end',
                            }}
                        >
                              <span
                                  style={{
                                      fontSize: '32px',
                                      textAlign: 'right',
                                      marginRight: '41px',
                                  }}
                              >
                                {site}
                              </span>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                width: '50%',
                                height: '70px',
                                alignItems: 'center',
                                flex: '0 0 auto',
                                justifyContent: 'flex-start',
                            }}
                        >
                            <img
                                src={logo}
                                alt="image"
                                style={{
                                    width: '50px',
                                    objectFit: 'cover',
                                    height: '50px',
                                    marginLeft: '-25px',
                                }}
                            />
                            <span
                                style={{
                                    fontSize: '32px',
                                    marginLeft: '16px',
                                }}
                            >
                            linkb.org
                          </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}