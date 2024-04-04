export const blockTypes = {
    "card": {
        name: "Card",
        description: "A plain card to display some text with an optional action button",
        fields: [
            {
                name: "Title",
                id: "title",
                description: "Card title",
                maxLength: 100,
                minLength: 1,
                type: "text",
                placeholder: "My Cool Card"
            },
            {
                name: "Content",
                id: "content",
                description: "Card content",
                maxLength: 999,
                minLength: 0,
                type: "text",
                placeholder: "This card contains info about..."
            },
            {
                name: "Action",
                id: "action",
                description: "An action button for the card",
                maxLength: 255,
                minLength: 1,
                type: "link",
                placeholder: "Action"
            }
        ]
    },
    "link": {
        name: "Link",
        description: "A link",
        fields: [
            {
                name: "Link Name",
                id: "title",
                description: "This property sets the name by which your link will be displayed on the list of links on your profile page. Feel free to use emojis here!",
                maxLength: 100,
                minLength: 1,
                type: "text",
                placeholder: "My Cool Link"
            },
            {
                name: "Long URL",
                id: "longurl",
                description: "This is the link to which the above slug will redirect to.",
                maxLength: 999,
                minLength: 0,
                type: "link",
                placeholder: "example.com"
            },
            {
                name: "Mark Social Link",
                id: "social",
                description: "You can pin links to the top of your profile page - just below your bio in form of social icons.",
                maxLength: 999,
                minLength: 0,
                type: "boolean",
                prompt: "Mark as social link?",
                placeholder: "false"
            }
        ]
    },
    "tweet": {
        name: "Twitter Card",
        description: "A twitter card to embed any tweet",
        fields: [
            {
                name: "Title",
                id: "title",
                description: "Card title",
                maxLength: 100,
                minLength: 1,
                type: "text",
                placeholder: "My Cool Card"
            },
            {
                name: "Tweet URL",
                id: "tweet_url",
                description: "An action button for the card",
                maxLength: 255,
                minLength: 1,
                type: "link",
                placeholder: "tweet_url"
            }
        ]
    },
    "youtube-video": {
        name: "YouTube Card",
        description: "A youtube card to embed any video",
        fields: [
            {
                name: "Title",
                id: "title",
                description: "Card title",
                maxLength: 100,
                minLength: 1,
                type: "text",
                placeholder: "My Cool Card"
            },
            {
                name: "YouTube Share URL",
                id: "video_url",
                description: "An action button for the card",
                maxLength: 255,
                minLength: 1,
                type: "link",
                placeholder: "video_url"
            }
        ]
    },
    "github-gist": {
        name: "Github Gist Card",
        description: "A github gist card to embed any code",
        fields: [
            {
                name: "Title",
                id: "title",
                description: "Card title",
                maxLength: 100,
                minLength: 1,
                type: "text",
                placeholder: "My Cool Card"
            },
            {
                name: "Github Gist URL",
                id: "gist_url",
                description: "An action button for the card",
                maxLength: 255,
                minLength: 1,
                type: "link",
                placeholder: "gist_url"
            }
        ]
    },
    "image": {
        name: "Image Card",
        description: "A card to display images",
        fields: [
            {
                name: "Title",
                id: "title",
                description: "Card title",
                maxLength: 100,
                minLength: 1,
                type: "text",
                placeholder: "My Cool Card"
            },
            {
                name: "Image URL",
                id: "image_url",
                description: "URL of the image to embed",
                maxLength: 255,
                minLength: 1,
                type: "link",
                placeholder: "image_url"
            },
            {
                name: "Full Width Image",
                id: "full_width",
                description: "You can mark this image to be displayed as a full width image instead of a regular card size image.",
                maxLength: 999,
                minLength: 0,
                type: "boolean",
                prompt: "Occupy full width?",
                placeholder: "false"
            }
        ]
    },
    "threads-post": {
        name: "Threads Post Card",
        description: "A card to embed any threads post",
        fields: [
            {
                name: "Title",
                id: "title",
                description: "Card title",
                maxLength: 100,
                minLength: 1,
                type: "text",
                placeholder: "My Cool Card"
            },
            {
                name: "Threads Post URL",
                id: "threads_url",
                description: "An action button for the card",
                maxLength: 255,
                minLength: 1,
                type: "link",
                placeholder: "Threads Post URL"
            }
        ]
    }
}