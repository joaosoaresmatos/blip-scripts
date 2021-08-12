const commonRegex = [
    {
        regex: /\b((n+((a)+o+))|^n+$)\b/,
        value: 'Não'
    },
    {
        regex: /\b((s+(i+(m|n)+))|^s+$)\b/,
        value: 'Sim'
    },
    {
        regex: /^(((falar\scom)|ir\spara)?\s?aten(dentes?|dimentos?)\s?(real|humanos?)?)$/,
        value: 'Atendimento'
    },
    {
        regex: /\b((tentar)|(denovo|novamente))\b/,
        value: 'Tentar novamente'
    },
    {
        regex: /\b(menu)\b/,
        value: 'Menu'
    },
    {
        regex: /\b(estao?|corret(a|o)s?)\b/,
        value: 'Estão corretas!'
    },
    {
        regex: /\b(reclamac(ao|oes))\b/,
        value: 'Reclamação'
    },
    // Phone Validation | Valid Examples: +5531999999999, (31)999999999
    {
        regex: /\b(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)(?:((?:9\d|[2-9])\d{3})\-?(\d{4}))\b/,
        value: 'Phone number'
    },
    // Email Validation | Valid Examples: name.optional@domain.com
    {
        regex: /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/,
        value: 'Email valido'
    },
    // Name Validation | Valid Examples: joao soares, joão soares, joAO sOares.!!
    {
        regex: /^(([A-Za-z]+)?[A-Za-z]{2}(\s+([A-Za-z]+)?[A-Za-z]{2})+)$/,
        value: 'Nome valido'
    }
];
