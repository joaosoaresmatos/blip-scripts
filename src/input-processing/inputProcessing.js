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
        shouldRemoveWhiteSpaces = false,
        shouldRemoveExcessOfWhiteSpaces = true,
        shouldAssertInputType = true,
        unexpectedInputTracking = 'Input inesperado'
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
        shouldRemoveWhiteSpaces,
        shouldRemoveExcessOfWhiteSpaces
    };

    const UNEXPECTED_INPUT = 'unexpected_input';
    let inputInfo = {
        input,
        value: UNEXPECTED_INPUT,
        matchInput: UNEXPECTED_INPUT,
        matchInputCleaned: UNEXPECTED_INPUT,
        chosenOptionIndex: UNEXPECTED_INPUT,
        chosenOptionNumber: UNEXPECTED_INPUT,
        tracking: unexpectedInputTracking,
        language: userLanguage,
        error: null
    };

    if (shouldAssertInputType && !isValidType(inputType)) {
        return inputInfo;
    }
    if (!isInputQualifiedForValidation(props.input)) {
        return inputInfo;
    }

    try {
        props = normalizeProps(props);
        let { options, userLanguage } = props;

        input = config.shouldRemoveExcessOfWhiteSpaces
            ? removeExcessOfWhiteSpace(input)
            : input;
        let inputCleaned = config.shouldRemoveSpecialCharacters
            ? removeSpecialCharacters(input, config)
            : input;

        for (let option in options) {
            let currentOption = options[option];
            let currentOptionIndex = parseInt(option);
            let currentOptionNumber = config.isReversed
                ? options.length - currentOptionIndex
                : currentOptionIndex + 1;
            let currentOptionRegex = new RegExp(currentOption.regex, 'gi');

            let match = null;

            if (config.isNumberMenu) {
                let currentOptionNumberRegex = new RegExp(
                    getNumberWrittenRegex(currentOptionNumber, userLanguage),
                    'gi'
                );
                match = currentOptionNumberRegex.exec(input);

                if (!match) {
                    match = currentOptionNumberRegex.exec(inputCleaned);
                }
            }
            if (!match) {
                match = currentOptionRegex.exec(input);
            }
            if (!match) {
                match = currentOptionRegex.exec(inputCleaned);
            }
            if (match) {
                inputInfo = buildInputInfoWithMatch(
                    inputInfo,
                    match,
                    currentOption,
                    currentOptionIndex,
                    currentOptionNumber
                );
                break;
            }
        }
    } catch (exception) {
        inputInfo.error = exception.message;
    } finally {
        return inputInfo;
    }
}

function buildInputInfoWithMatch(
    inputInfo,
    match,
    matchOption,
    matchOptionIndex,
    matchOptionNumber
) {
    let { value, tracking, regex, ...additional } = matchOption;

    inputInfo.value = value;
    inputInfo.chosenOptionIndex = matchOptionIndex;
    inputInfo.chosenOptionNumber = matchOptionNumber;

    inputInfo.tracking = tracking || getCleanedValueToTracking(value);

    inputInfo.matchInput = match.shift();
    inputInfo.matchInputCleaned = removeSpecialCharacters(inputInfo.matchInput);

    return Object.assign(inputInfo, { ...additional });
}

function isInputQualifiedForValidation(inputContent) {
    const REGEX_ONLY_WHITE_SPACE = RegExp('^\\s*$', 'gi');
    if (
        !inputContent ||
        inputContent === '' ||
        REGEX_ONLY_WHITE_SPACE.exec(inputContent)
    ) {
        return false;
    }
    return true;
}

function isValidType(inputType) {
    const validType = 'text/plain';
    return inputType === validType;
}

function normalizeProps(props) {
    props.options = normalizeOptions(props);
    return props;
}

function normalizeOptions(props) {
    let { options, userLanguage } = props;

    return options.map((option) => {
        let obj = {
            ...option
        };
        if (option.regex[userLanguage]) {
            obj.regex = option.regex[userLanguage];
        } else {
            obj.regex = option.regex;
        }
        return obj;
    });
}

function capitalizeAll(text) {
    return text.replace(/(^|\s)\S/g, (l) => l.toUpperCase());
}

function capitalizeFirstLetter(text) {
    return text.replace(/^\w/g, (l) => l.toUpperCase());
}

function removeWhiteSpace(input) {
    input = input.trim();
    const EMPTY_STR = '';
    const WHITE_SPACES = RegExp('(\\s+)', 'gi');

    return input.replace(WHITE_SPACES, EMPTY_STR);
}

function removeExcessOfWhiteSpace(input) {
    input = input.trim();
    const SPACE_STR = ' ';
    const WHITE_SPACES = RegExp('(\\s{2,})', 'gi');

    return input.replace(WHITE_SPACES, SPACE_STR);
}

function removeSpecialCharacters(input) {
    input = replaceSpecialLetters(input);
    const EMPTY_STR = '';
    const SPECIAL_CHAR = RegExp('[^\\w\\s]*', 'gi');

    return input.replace(SPECIAL_CHAR, EMPTY_STR);
}

function replaceSpecialLetters(input) {
    return input.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
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

function getCleanedInput(input) {
    let cleanedInput = replaceSpecialLetters(input);
    cleanedInput = removeLinks(cleanedInput);
    cleanedInput = removeExcessOfWhiteSpace(cleanedInput);

    return cleanedInput;
}

// The convention of Trackings is only first letter uppercase without special characters

function getCleanedValueToTracking(value) {
    let cleanedValue = value.trim();
    cleanedValue = removeSpecialCharacters(value);
    cleanedValue = capitalizeFirstLetter(cleanedValue);

    return cleanedValue;
}

function removeLinks(input) {
    const EMPTY_STR = '';
    const LINK_REGEX = RegExp(
        /\b(((https?:\/\/)[^\s.]+|(www))\.[\w][^\s]+)\b/,
        'gi'
    );
    input = replaceSpecialLetters(input);
    input = input.replace(LINK_REGEX, EMPTY_STR);
    return input;
}

// TEST CODE
// DO NOT PUT THE FOLLOWING CODE IN ROUTER RESOURCES

function run(inputContent, inputType, userLanguage) {
    return getSelectedMenuOption(inputContent, inputType, userLanguage);
}

function getSelectedMenuOption(inputContent, inputType) {
    let options = [
        {
            regex: /(0?9)|(set(embro)?)|(september)/,
            value: '9',
            tracking: 'setembro'
        },
        {
            regex: /(10)|(out(ubro)?)|(october)/,
            value: '10',
            tracking: 'outubro'
        },
        {
            regex: /(11)|(nov(embro)?)|(november)/,
            value: '11',
            tracking: 'novembro'
        },
        {
            regex: /(12)|(dez(embro)?)|(december)/,
            value: '12',
            tracking: 'dezembro'
        }
    ];

    let props = {
        input: inputContent,
        options,
        inputType
    };
    // let config = {
    //     //isNumberMenu: false,
    //     // shouldRemoveSpecialCharacters: false
    // };

    let monthSelected = validateInputOptions(props);
    return monthSelected;
}
// function getSelectedMenuOption(inputContent, inputType, userLanguage) {
//     let options = [
//         {
//             regex: {
//                 'en-US': /^(apple)$/,
//                 'pt-BR': /^(maça)$/
//             },
//             value: 'apple'
//         },
//         {
//             regex: {
//                 'en-US': /^(pineapple)$/,
//                 'pt-BR': /^(abacaxi)$/
//             },
//             value: 'pineapple'
//         },
//         {
//             regex: {
//                 'en-US': /^(strawberry)$/,
//                 'pt-BR': /^(morango)$/
//             },
//             value: 'strawberry',
//             myProp: 'test'
//         }
//     ];
//     let props = {
//         input: inputContent,
//         inputType,
//         options,
//         userLanguage
//     };
//     let config = {
//         isNumberMenu: true,
//         isReversed: false,
//         shouldRemoveSpecialCharacters: true,
//         shouldRemoveWhiteSpaces: false
//     };
//     let selectedMenuOption = validateInputOptions(props, config);

//     return selectedMenuOption;
// }

// Assert [REQUIREMENTS] variables.

let testInput = '9';
console.log(run(testInput, 'text/plain', 'en-US'));

// IMPORTS USED BY NODE, DO NOT COPY THIS

module.exports = {
    validateInputOptions,
    isValidType,
    normalizeProps,
    normalizeOptions,
    capitalizeAll,
    capitalizeFirstLetter,
    removeWhiteSpace,
    removeExcessOfWhiteSpace,
    removeSpecialCharacters,
    replaceSpecialLetters,
    getNumberWrittenRegex,
    getCleanedInput,
    getCleanedValueToTracking,
    removeLinks
};
