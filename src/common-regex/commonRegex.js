const commonRegex = [
    {
        regex: /\b(n+((o)+)|^n+$)\b/,
        value: 'No'
    },
    {
        regex: /\b((y+(e+(s)+))|^s+$)\b/,
        value: 'Yes'
    },
    // Phone Validation | Valid Examples: +5531999999999, (31)999999999
    {
        regex: /\b(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)(?:((?:9\d|[2-9])\d{3})\-?(\d{4}))\b/,
        value: 'Phone number'
    },
    // Email Validation | Valid Examples: name.optional@domain.com
    {
        regex: /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/,
        value: 'Email'
    },
    // Name Validation | Valid Examples: joao soares, joão soares, joAO sOares.!!
    {
        regex: /^(([A-Za-z]+)?[A-Za-z]{2}(\s+([A-Za-z]+)?[A-Za-z]{2})+)$/,
        value: 'Name'
    }
];
