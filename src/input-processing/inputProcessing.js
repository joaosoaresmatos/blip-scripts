// Assert [REQUIREMENTS] variables.

let testInput = 'apple';
console.log(run(testInput, 'text/plain', 'en-US'));

// Code of builder here

function run(inputContent, inputType, userLanguage) {
    return getSelectedMenuOption(inputContent, inputType, userLanguage);
}

function getSelectedMenuOption(inputContent, inputType, userLanguage) {
    let options = [
        {
            regex: {
                'en-US': /^(apple)$/,
                'pt-BR': /^(maça)$/
            },
            value: 'apple'
        },
        {
            regex: {
                'en-US': /^(pineapple)$/,
                'pt-BR': /^(abacaxi)$/
            },
            value: 'pineapple'
        },
        {
            regex: {
                'en-US': /^(strawberry)$/,
                'pt-BR': /^(morango)$/
            },
            value: 'strawberry'
        }
    ];
    let props = {
        input: inputContent,
        inputType,
        options,
        userLanguage
    };
    let config = {
        isNumberMenu: true,
        isReversed: false,
        shouldRemoveSpecialCharacters: true,
        shouldRemoveWhiteSpaces: false
    };
    let selectedMenuOption = validateInputOptions(props, config);

    return selectedMenuOption;
}

// Below are all scripts used to process inputs
// It should be put in the router resources in order to be used by the above script

function validateInputOptions(
    {
        input = null,
        inputType = null,
        options = null,
        userLanguage = 'pt-BR'
    } = {},
    {
        isNumberMenu = false,
        isReversed = false,
        shouldRemoveSpecialCharacters = true,
        shouldRemoveWhiteSpaces = true
    } = {}
) {
    let props = {
        input,
        inputType,
        options,
        userLanguage
    };
    let config = {
        isNumberMenu,
        isReversed,
        shouldRemoveSpecialCharacters,
        shouldRemoveWhiteSpaces
    };

    const UNEXPECTED_INPUT = 'Input inesperado';
    let inputInfo = {
        input,
        value: UNEXPECTED_INPUT,
        tracking: UNEXPECTED_INPUT,
        inputMatch: UNEXPECTED_INPUT,
        inputMatchClean: UNEXPECTED_INPUT,
        chosenOptionNumber: UNEXPECTED_INPUT
    };
    if (isInvalidType(inputType)) {
        return inputInfo;
    }

    try {
        props = normalizeProps(props);
        let { options, userLanguage } = props;

        input = config.shouldRemoveWhiteSpaces
            ? removeExcessWhiteSpace(input)
            : input;
        let inputCleaned = config.shouldRemoveSpecialCharacters
            ? removeSpecialCharacters(input, config)
            : input;

        for (let option in options) {
            let matching = new RegExp(options[option].regex, 'gi');
            let numberOption = parseInt(option) + 1;
            let matchArray = null;
            if (config.isReversed) {
                numberOption = options.length - parseInt(option);
            }
            if (config.isNumberMenu) {
                let matchingNumber = new RegExp(
                    getNumberWrittenRegex(numberOption, userLanguage),
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
                inputInfo.value = options[option].value;
                inputInfo.chosenOptionNumber = parseInt(option) + 1;
                if (options[option].tracking) {
                    inputInfo.tracking = options[option].tracking;
                } else {
                    inputInfo.tracking = getCleanedInputToTracking(
                        options[option].value,
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

function normalizeProps(props) {
    let options = normalizeOptions(props);
    props.options = options;
    return props;
}

function normalizeOptions(props) {
    let { options, userLanguage } = props;

    return options.map((option) => {
        let obj = {};
        if (option.regex[userLanguage]) {
            obj.regex = option.regex[userLanguage];
        } else {
            obj.regex = option.regex;
        }
        obj.value = option.value;
        return obj;
    });
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

function getNumberWrittenRegex(number, userLanguage) {
    const numbersWrittenRegex = {
        1: {
            'en-US':
                /^(((((option)|(number))\s)?(one|1(\.0)?))|(first(\soption)?))$/,
            'pt-BR':
                /^(((((opcao)|(numero))\s)?(um|1(\.0)?))|(primeir(a|o)(\sopcao)?))$/
        },
        2: {
            'en-US':
                /^(((((option)|(number))\s)?(two|2(\.0)?))|(second(\soption)?))$/,
            'pt-BR':
                /^(((((opcao)|(numero))\s)?(dois|2(\.0)?))|(segund(a|o)(\sopcao)?))$/
        },
        3: {
            'en-US':
                /^(((((option)|(number))\s)?(three|3(\.0)?))|(third(\soption)?))$/,
            'pt-BR':
                /^(((((opcao)|(numero))\s)?(tres|3(\.0)?))|(terceir(a|o)(\sopcao)?))$/
        },
        4: {
            'en-US':
                /^(((((option)|(number))\s)?(four|4(\.0)?))|(fourth(\soption)?))$/,
            'pt-BR':
                /^(((((opcao)|(numero))\s)?(quatro|4(\.0)?))|(quart(a|o)(\sopcao)?))$/
        },
        5: {
            'en-US':
                /^(((((option)|(number))\s)?(five|5(\.0)?))|(fifth(\soption)?))$/,
            'pt-BR':
                /^(((((opcao)|(numero))\s)?(cinco|5(\.0)?))|(quint(a|o)(\sopcao)?))$/
        },
        6: {
            'en-US':
                /^(((((option)|(number))\s)?(six|6(\.0)?))|(sixth(\soption)?))$/,
            'pt-BR':
                /^(((((opcao)|(numero))\s)?(seis|6(\.0)?))|(sext(a|o)(\sopcao)?))$/
        },
        7: {
            'en-US':
                /^(((((option)|(number))\s)?(seven|7(\.0)?))|(seventh(\soption)?))$/,
            'pt-BR':
                /^(((((opcao)|(numero))\s)?(sete|7(\.0)?))|(setim(a|o)(\sopcao)?))$/
        },
        8: {
            'en-US':
                /^(((((option)|(number))\s)?(eight|8(\.0)?))|(eighth(\soption)?))$/,
            'pt-BR':
                /^(((((opcao)|(numero))\s)?(oito|8(\.0)?))|(oitav(a|o)(\sopcao)?))$/
        },
        9: {
            'en-US':
                /^(((((option)|(number))\s)?(nine|9(\.0)?))|(nineth(\soption)?))$/,
            'pt-BR':
                /^(((((opcao)|(numero))\s)?(nove|9(\.0)?))|(non(a|o)(\sopcao)?))$/
        },
        10: {
            'en-US':
                /^(((((option)|(number))\s)?(ten|10(\.0)?))|(tenth(\soption)?))$/,
            'pt-BR':
                /^(((((opcao)|(numero))\s)?(dez|10(\.0)?))|(decim(a|o)(\sopcao)?))$/
        }
    };

    return numbersWrittenRegex[`${number}`][userLanguage];
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
