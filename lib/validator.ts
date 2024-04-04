import {sanitizeLink} from "@/lib/sanitize-link";

export const Validator = (type = "text", value = "", required = false, minLength = 0, maxLength = 999) => {
    let validation = false;
    let message = "";

    // If the field is required but there's no value
    if (required && !value) {
        message = `${type} is required.`;
        return { validation, message };
    }

    // If the field is not required and there's no value, consider it as valid
    if (!required && !value) {
        validation = true;
        return { validation, message };
    }

    // Check length
    if (value.length < minLength) {
        message = `${type} is too short. It should be at least ${minLength} characters.`;
        return { validation, message };
    }
    if (value.length > maxLength) {
        message = `${type} is too long. It should be no more than ${maxLength} characters.`;
        return { validation, message };
    }

    // Validation rules for different types
    switch (type) {
        case "email":
            const emailRegexp = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i;
            if (!emailRegexp.test(value) || /\s/.test(value)) {
                message = "Please enter a valid email.";
                return { validation, message };
            }
            break;

        case "password":
            const passwordRegexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!passwordRegexp.test(value)) {
                message = "Password should contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
                return { validation, message };
            }
            break;

        case "phone":
            const phoneRegexp = /^(\+\d{1,3}[- ]?)?\d{10}$/;
            if (!phoneRegexp.test(value)) {
                message = "Please enter a valid phone number.";
                return { validation, message };
            }
            break;

        case "subdomain":
            const subdomainRegexp = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,62}$/i;
            if (!subdomainRegexp.test(value)) {
                message = "Please enter a valid subdomain.";
                return { validation, message };
            }
            break;

        case "slug":
            const slugRegexp = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,62}$/i;
            if (!slugRegexp.test(value)) {
                message = "Please enter a valid slug.";
                return { validation, message };
            }
            break;

        case "domain":
            const domainRegexp = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;
            if (!domainRegexp.test(value)) {
                message = "Please enter a valid domain.";
                return { validation, message };
            }
            break;

        case "link":
            let test_value = sanitizeLink(value);
            const linkRegexp = /^(http|https):\/\/[^ "]+$/;
            if (!linkRegexp.test(test_value) || /\s/.test(test_value)) {
                message = "Please enter a valid link.";
                return { validation, message };
            }
            break;

        case "text":
        default:
            validation = true;
            break;
    }

    validation = true;
    return { validation, message };
}
