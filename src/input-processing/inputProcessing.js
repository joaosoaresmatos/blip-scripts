// Assert [REQUIREMENTS] variables.

let testInput = 'menu';
console.log(run(testInput, 'text/plain'));

// Code of builder here

function run(inputContent, inputType) {
    return getSelectedMenuOption(inputContent, inputType);
}

function getSelectedMenuOption(inputContent, inputType) {
    let inputContentOriginal = inputContent;
    let optionsRegex = [];
    optionsRegex.push(
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
            regex: /\b(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)(?:((?:9\d|[2-9])\d{3})-?(\d{4}))\b/,
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
    );
    let props = {
        input: inputContent,
        optionsRegex,
        inputType
    };
    let config = {
        isNumberMenu: true,
        isReversed: false,
        shouldRemoveSpecialCharacters: true,
        shouldRemoveWhiteSpaces: false
    };
    let selectedMenuOption = validateInputMenuOptions(props, config);
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
    return selectedMenuOption;
}

// Below are all scripts used to process inputs
// It should be put in the router resources in order to be used by the above script

function validateInputMenuOptions(
    props = {
        input,
        optionsRegex,
        inputType
    },
    config = {
        isNumberMenu: true,
        isReversed: false,
        shouldRemoveSpecialCharacters: true,
        shouldRemoveWhiteSpaces: true
    }
) {
    let { input, optionsRegex, inputType } = props;

    const UNEXPECTED_INPUT = 'Input inesperado';
    let inputInfo = {
        input,
        value: UNEXPECTED_INPUT,
        tracking: UNEXPECTED_INPUT,
        inputMatch: UNEXPECTED_INPUT,
        inputMatchClean: UNEXPECTED_INPUT
    };
    if (isInvalidType(inputType)) {
        return inputInfo;
    }
    try {
        input = config.shouldRemoveWhiteSpaces
            ? removeExcessWhiteSpace(input)
            : input;
        let inputCleaned = config.shouldRemoveSpecialCharacters
            ? removeSpecialCharacters(input, config)
            : input;

        for (let option in optionsRegex) {
            let matching = new RegExp(optionsRegex[option].regex, 'gi');
            let numberOption = parseInt(option) + 1;
            let matchArray = null;
            if (config.isReversed) {
                numberOption = optionsRegex.length - parseInt(option);
            }
            if (config.isNumberMenu) {
                let matchingNumber = new RegExp(
                    getNumberWrittenRegex(numberOption),
                    'gi'
                );
                matchArray = matchingNumber.exec(input);

                if (!matchArray) {
                    matchArray = matchingNumber.exec(inputCleaned);
                }
            }
            if (!matchArray) {
                matchArray = matching.exec(input);
            }
            if (!matchArray) {
                matchArray = matching.exec(inputCleaned);
            }
            if (matchArray) {
                inputInfo.value = optionsRegex[option].value;
                if (optionsRegex[option].tracking) {
                    inputInfo.tracking = optionsRegex[option].tracking;
                } else {
                    inputInfo.tracking = getCleanedInputToTracking(
                        optionsRegex[option].value,
                        config
                    );
                }
                inputInfo.inputMatch = matchArray.shift();
                inputInfo.inputMatchClean = removeSpecialCharacters(
                    inputInfo.inputMatch,
                    config
                );
                break;
            }
        }
    } catch (exception) {
        throw exception;
    } finally {
        return inputInfo;
    }
}

function isInvalidType(inputType) {
    const validType = 'text/plain';
    return inputType !== validType;
}

function capitalizeAll(text) {
    text = removeExcessWhiteSpace(text);
    const SPACE_STR = ' ';
    let loweredText = text.toLowerCase();
    let words = loweredText.split(SPACE_STR);
    for (let word in words) {
        let capitalizedWord = words[word];
        let firstLetter = capitalizedWord[0];
        capitalizedWord = firstLetter.toUpperCase() + capitalizedWord.slice(1);
        words[word] = capitalizedWord;
    }
    return words.join(SPACE_STR);
}

function capitalizeFirst(text) {
    text = removeExcessWhiteSpace(text);
    let loweredText = text.toLowerCase();
    let firstLetter = loweredText[0];
    let capitalizedText = firstLetter.toUpperCase() + loweredText.slice(1);
    return capitalizedText;
}

function removeWhiteSpace(input) {
    input = input.trim();
    const EMPTY_STR = '';
    const WHITE_SPACES = RegExp('(\\s+)', 'gi');
    return input.replace(WHITE_SPACES, EMPTY_STR);
}

function removeExcessWhiteSpace(input) {
    input = input.trim();
    const SPACE_STR = ' ';
    const WHITE_SPACES = RegExp('(\\s+)', 'gi');
    return input.replace(WHITE_SPACES, SPACE_STR);
}

function removeSpecialCharacters(input, config) {
    const EMPTY_STR = '';
    const SPECIAL_CHAR = RegExp('[^\\w\\s]*', 'gi');
    input = replaceSpecialLetters(input);
    input = input.replace(SPECIAL_CHAR, EMPTY_STR);
    input = config.shouldRemoveWhiteSpaces
        ? removeExcessWhiteSpace(input)
        : input;
    return input;
}

function replaceSpecialLetters(input) {
    const specialCharToCommonChar = {
        á: 'a',
        à: 'a',
        â: 'a',
        ä: 'a',
        ã: 'a',
        é: 'e',
        è: 'e',
        ê: 'e',
        ë: 'e',
        í: 'i',
        ì: 'i',
        î: 'i',
        ï: 'i',
        ó: 'o',
        ò: 'o',
        ô: 'o',
        õ: 'o',
        ö: 'o',
        ù: 'u',
        ú: 'u',
        û: 'u',
        ü: 'u',
        ñ: 'n',
        ç: 'c'
    };
    for (const key in specialCharToCommonChar) {
        let keyRegex = new RegExp(`${key}`, 'gi');
        input = input.replace(keyRegex, specialCharToCommonChar[key]);
    }
    return input;
}

function getNumberWrittenRegex(number) {
    const numbersWrittenRegex = {
        1: /^(((((opcao)|(numero))\s)?(um|1(\.0)?))|(primeir(a|o)(\sopcao)?))$/,
        2: /^(((((opcao)|(numero))\s)?(dois|2(\.0)?))|(segund(a|o)(\sopcao)?))$/,
        3: /^(((((opcao)|(numero))\s)?(tres|3(\.0)?))|(terceir(a|o)(\sopcao)?))$/,
        4: /^(((((opcao)|(numero))\s)?(quatro|4(\.0)?))|(quart(a|o)(\sopcao)?))$/,
        5: /^(((((opcao)|(numero))\s)?(cinco|5(\.0)?))|(quint(a|o)(\sopcao)?))$/,
        6: /^(((((opcao)|(numero))\s)?(seis|6(\.0)?))|(sext(a|o)(\sopcao)?))$/,
        7: /^(((((opcao)|(numero))\s)?(sete|7(\.0)?))|(setim(a|o)(\sopcao)?))$/,
        8: /^(((((opcao)|(numero))\s)?(oito|8(\.0)?))|(oitav(a|o)(\sopcao)?))$/,
        9: /^(((((opcao)|(numero))\s)?(nove|9(\.0)?))|(non(a|o)(\sopcao)?))$/,
        10: /^(((((opcao)|(numero))\s)?(dez|10(\.0)?))|(decima(a|o)(\sopcao)?))$/,
        11: /^(((((opcao)|(numero))\s)?(onze|11(\.0)?))|(decim(a|o)\s(primeir(a|o))(\sopcao)?))$/,
        12: /^(((((opcao)|(numero))\s)?(doze|12(\.0)?))|(decim(a|o)\s(segund(a|o))(\sopcao)?))$/,
        13: /^(((((opcao)|(numero))\s)?(treze|13(\.0)?))|(decim(a|o)\s(terceir(a|o))(\sopcao)?))$/,
        14: /^(((((opcao)|(numero))\s)?(quartorze|14(\.0)?))|(decim(a|o)\s(quart(a|o))(\sopcao)?))$/,
        15: /^(((((opcao)|(numero))\s)?(quinze|15(\.0)?))|(decim(a|o)\s(quint(a|o))(\sopcao)?))$/
    };
    return numbersWrittenRegex[`${number}`];
}

function getCleanedInputToNlp(input) {
    let cleanedInputToNlp = replaceSpecialLetters(input);
    cleanedInputToNlp = removeLinks(cleanedInputToNlp);
    cleanedInputToNlp = removeExcessWhiteSpace(cleanedInputToNlp);
    return cleanedInputToNlp;
}

// The convention of Trackings is only first letter uppercase without special characters

function getCleanedInputToTracking(input, config) {
    let cleanedInputToTracking = removeSpecialCharacters(input, config);
    cleanedInputToTracking = capitalizeFirst(cleanedInputToTracking);
    return cleanedInputToTracking;
}

function removeLinks(input) {
    const EMPTY_STR = '';
    const LINK_STR = RegExp(
        /\b(((https?:\/\/)[^\s.]+|(www))\.[\w][^\s]+)\b/,
        'gi'
    );
    input = replaceSpecialLetters(input);
    input = input.replace(LINK_STR, EMPTY_STR);
    return input;
}
