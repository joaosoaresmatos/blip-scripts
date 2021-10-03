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
    },
    // Car plate Validation | Valid Examples: CMG-3164, CMG 3164, qrm7e33, RIO2A18
    {
        regex: /\b^([a-z]{3}(-?|\s?)[0-9]{4}|[a-z]{3}[0-9][a-z][0-9]{2})$\b/,
        value: 'Car plate'
    }
]

 // //begin name logic
 if (selectedMenuOption.value === 'Nome valido') {
    selectedMenuOption.inputMatch = capitalizeAll(inputContentOriginal);
    selectedMenuOption.inputMatchClean = capitalizeAll(
        selectedMenuOption.inputMatchClean
    );
}
// end name logic
// //begin phone logic
if (selectedMenuOption.value === 'Telefone') {
    selectedMenuOption.inputMatch = removeWhiteSpace(
        selectedMenuOption.inputMatch
    );
    selectedMenuOption.inputMatchClean = removeWhiteSpace(
        selectedMenuOption.inputMatchClean
    );
}
// end phone logic
;
