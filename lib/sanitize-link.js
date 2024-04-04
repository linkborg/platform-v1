export const sanitizeLink = (link) => {
    // If the link already starts with 'http://' or 'https://', return it as is
    if (/^https?:\/\//i.test(link)) {
        return link;
    }

    // Otherwise, prepend 'https://' to the link before returning it
    return 'https://' + link;
}