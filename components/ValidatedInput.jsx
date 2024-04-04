import React, { useState, useEffect } from 'react';
import { Input, Text } from '@geist-ui/core';
import { Validator } from '@/lib/validator';
import { useDebounce } from 'use-debounce';


function ValidatedInput(
    {
        type = "text",
        required = false,
        minLength = 0,
        maxLength = 999,
        value = "",
        debounceTime = 300,
        onValidation,
        ...props
    }) {
    const [error, setError] = useState("");
    const [debouncedValue] = useDebounce(value, debounceTime);
    const [touched, setTouched] = useState(false);

    useEffect(() => {
        if(touched) {
            // Perform validation
            const result = Validator(type, debouncedValue, required, minLength, maxLength);
            if (!result.validation) {
                setError(result.message);
                onValidation && onValidation(false);
            } else {
                setError("");
                onValidation && onValidation(true);
            }
        }
    }, [type, debouncedValue, required, minLength, maxLength, touched, onValidation]);

    const handleBlur = () => {
        setTouched(true);
    }

    return (
        <>
            <Input value={value} onInput={handleBlur} {...props}>
                {props.children}
            </Input>
            {error && <Text type="error" small>{error}</Text>}
        </>
    );
}

export default ValidatedInput;
