// Below are all scripts used in menu creation process
// It should be put in the router resources in order to be used by the above script

const CONSTANTS = {
    DEFAULT_STRATEGY: 'default'
};

let PROPS = {
    userChannel: null,
    channelTags: null,
    menuFields: null,
    userLanguage: 'ptBR',
    orderOptions: 'asc'
};

let CONFIG = {
    default: {
        listMenuHasDescription: true,
        strictMenuTypes: false
    }
};

function createMenu(propsParams = {}, configParams = {}) {
    PROPS = Object.assign(PROPS, propsParams);
    CONFIG = Object.assign(CONFIG, configParams);

    let menu;
    try {
        _normalizeProps();
        _normalizeConfig();

        const CHANNEL_BUILDING_STRATEGIES = {
            default: getDefaultMenu,
            blipchat: getBlipchatMenu,
            whatsapp: getWhatsappMenu,
            messenger: getMessengerMenu,
            gbm: getGBMMenu
        };

        if (CHANNEL_BUILDING_STRATEGIES[PROPS.userChannel]) {
            menu = CHANNEL_BUILDING_STRATEGIES[PROPS.userChannel]();
        } else {
            menu = CHANNEL_BUILDING_STRATEGIES.default();
        }
    } catch (e) {
        menu = getFallbackMenu(e.stack);
    } finally {
        return menu;
    }
}

// Requirements Functions

function _normalizeProps() {
    _normalizeMenuText();
    _normalizeMenuOptions();
    _normalizeMenuHeader();
    _normalizeMenuFooter();
    _normalizeMenuButton();
}

function _normalizeMenuText() {
    let { userChannel, menuFields, userLanguage } = PROPS;

    let menuText;
    if (
        menuFields.text[userChannel] &&
        menuFields.text[userChannel][userLanguage]
    ) {
        menuText = menuFields.text[userChannel][userLanguage];
    } else if (
        menuFields.text.default &&
        menuFields.text.default[userLanguage]
    ) {
        menuText = menuFields.text.default[userLanguage];
    } else if (menuFields.text[userChannel]) {
        menuText = menuFields.text[userChannel];
    } else if (menuFields.text.default) {
        menuText = menuFields.text.default;
    } else {
        menuText = menuFields.text;
    }

    PROPS.menuFields.text = menuText;
}

function _normalizeMenuHeader() {
    let { menuFields, userLanguage, userChannel } = PROPS;

    let headerText;
    if (menuFields.header) {
        if (typeof menuFields.header === 'string') {
            headerText = menuFields.header;
        } else if (
            menuFields.header[userLanguage] &&
            typeof menuFields.header[userLanguage] === 'string'
        ) {
            headerText = menuFields.header[userLanguage];
        } else if (
            menuFields.header[userLanguage] &&
            userChannel === 'whatsapp'
        ) {
            headerText = menuFields.header[userLanguage];
        } else if (userChannel === 'whatsapp') {
            headerText = menuFields.header;
        }
    }

    PROPS.menuFields.header = headerText;
}

function _normalizeMenuFooter() {
    let { menuFields, userLanguage } = PROPS;

    let footerText;
    if (menuFields.footer) {
        if (menuFields.footer[userLanguage]) {
            footerText = menuFields.footer[userLanguage];
        } else if (typeof menuFields.footer === 'string') {
            footerText = menuFields.footer;
        }
    }

    PROPS.menuFields.footer = footerText;
}

function _normalizeMenuButton() {
    const DEFAULT_BUTTON = 'Options';
    let { menuFields, userLanguage } = PROPS;

    let textButton;
    if (menuFields.button && menuFields.button[userLanguage]) {
        textButton = menuFields.button[userLanguage];
    } else if (typeof menuFields.button === 'string') {
        textButton = menuFields.button;
    } else {
        textButton = DEFAULT_BUTTON;
    }

    PROPS.menuFields.textButton = textButton;
}

function _normalizeMenuOptions() {
    let { menuFields, userLanguage } = PROPS;

    let menuOptions;
    if (menuFields.options[userLanguage]) {
        menuOptions = menuFields.options[userLanguage];
    } else {
        menuOptions = menuFields.options;
    }

    PROPS.menuFields.options = menuOptions;
}

function _normalizeConfig() {
    CONFIG = Object.assign(
        CONFIG[CONSTANTS.DEFAULT_STRATEGY],
        CONFIG[PROPS.userChannel]
    );
}

// GENERIC FUNCTIONS

function runMenuValidations(menuValidations) {
    for (const { validator, arg } of menuValidations) {
        if (!validator(arg)) {
            return false;
        }
    }
    return true;
}

function buildMenu(buildHandlers, menuType, menuValidations) {
    let strategyName = CONFIG.type || CONSTANTS.DEFAULT_STRATEGY;

    if (
        strategyName !== CONSTANTS.DEFAULT_STRATEGY &&
        !runMenuValidations(menuValidations[strategyName])
    ) {
        if (CONFIG.strictMenuTypes) {
            throw new Error(
                `Some validation of the menu type you choose went wrong, so it couldn't be generated, read the documentation about "${strategyName}" menu type, or just turn off "strictMenuTypes" config so a default text menu can be generated.`
            );
        }
        strategyName = CONSTANTS.DEFAULT_STRATEGY;
    }

    return {
        content: buildHandlers[strategyName](),
        type: menuType[strategyName]
    };
}

// SPECIFIC CHANNEL'S MENU BUILDING FUNCTIONS

function getFallbackMenu(exceptionMsg) {
    let { userChannel } = PROPS;

    const CHANNEL_MENU_TYPE = {
        default: 'application/vnd.lime.select+json',
        whatsapp: 'application/vnd.lime.select+json',
        messenger: 'application/json'
    };

    let menu = {
        content: {
            text: `Something went wrong while generating menu. Please, visit https://github.com/joaosoaresmatos/blip-scripts/blob/main/README.md to read more about it.\n\nDescription:\n\n${exceptionMsg}`
        },
        type: CHANNEL_MENU_TYPE[userChannel] || CHANNEL_MENU_TYPE.default
    };
    return menu;
}

function getDefaultMenu() {
    const BUILD_HANDLERS = {
        default: getTextMenu
    };

    const MENU_TYPE = {
        default: 'application/vnd.lime.select+json'
    };

    const MENU_VALIDATIONS = {
        default: []
    };

    return buildMenu(BUILD_HANDLERS, MENU_TYPE, MENU_VALIDATIONS);
}

function getBlipchatMenu() {
    const BUILD_HANDLERS = {
        quick_reply: getQuickReplyMenu,
        button_menu: getQuickReplyMenu,
        default: getTextMenu
    };

    const MENU_TYPE = {
        quick_reply: 'application/vnd.lime.select+json',
        button_menu: 'application/vnd.lime.select+json',
        default: 'application/vnd.lime.select+json'
    };

    const MENU_VALIDATIONS = {
        quick_reply: [],
        button_menu: [],
        default: []
    };

    return buildMenu(BUILD_HANDLERS, MENU_TYPE, MENU_VALIDATIONS);
}

function getWhatsappMenu() {
    const BUILD_HANDLERS = {
        quick_reply: getWppQuickReplyMenu,
        list_menu: getWppListMenu,
        default: getTextMenu
    };

    const MENU_TYPE = {
        quick_reply: 'application/json',
        list_menu: 'application/json',
        default: 'application/vnd.lime.select+json'
    };

    const MENU_VALIDATIONS = {
        quick_reply: [
            { validator: validateNumberOfOptions, arg: { max: 3 } },
            { validator: validateOptionsLength, arg: { max: 20 } }
        ],
        list_menu: [
            { validator: validateNumberOfOptions, arg: { max: 11 } },
            {
                validator: validateListMenuOptionsLength,
                arg: {
                    title: { min: 1, max: 20 },
                    description: { min: 0, max: 60 }
                }
            }
        ],
        default: []
    };

    return buildMenu(BUILD_HANDLERS, MENU_TYPE, MENU_VALIDATIONS);
}

function getMessengerMenu() {
    const BUILD_HANDLERS = {
        quick_reply: getQuickReplyMenu,
        default: getTextMenu
    };

    const MENU_TYPE = {
        quick_reply: 'application/vnd.lime.select+json',
        default: 'application/json'
    };

    const MENU_VALIDATIONS = {
        quick_reply: [{ validator: validateNumberOfOptions, arg: { max: 5 } }],
        default: []
    };

    return buildMenu(BUILD_HANDLERS, MENU_TYPE, MENU_VALIDATIONS);
}

function getGBMMenu() {
    const BUILD_HANDLERS = {
        quick_reply: getQuickReplyMenu,
        default: getTextMenu
    };

    const MENU_TYPE = {
        quick_reply: 'application/vnd.lime.select+json',
        default: 'application/json'
    };

    const MENU_VALIDATIONS = {
        quick_reply: [],
        default: []
    };

    return buildMenu(BUILD_HANDLERS, MENU_TYPE, MENU_VALIDATIONS);
}

// NON GENERIC MENU BUILDING FUNCTIONS

function getOptionsMenu() {
    let { menuFields } = PROPS;
    let quickReplyOptions = [];
    if (menuFields.options) {
        quickReplyOptions = buildQuickReplyOptions(menuFields.options);
    }
    let menuContent = {
        text: menuFields.text,
        options: quickReplyOptions
    };
    return menuContent;
}

function getQuickReplyMenu() {
    let menuContent = getOptionsMenu();
    menuContent.scope = 'immediate';
    return menuContent;
}

function getWppQuickReplyMenu() {
    const action = {
        buttons: buildWppQuickReplyOptions(PROPS.menuFields.options)
    };

    return getInteractiveMenu(PROPS.menuFields, 'button', action);
}

function getWppListMenu() {
    const action = {
        button: PROPS.menuFields.textButton,
        sections: buildSections()
    };

    return getInteractiveMenu(PROPS.menuFields, 'list', action);
}

function getTextMenu() {
    let { menuFields, channelTags } = PROPS;
    let menuHeader = menuFields.header ? `${menuFields.header}\n\n` : '';
    let menuFooter = menuFields.footer ? `\n\n${menuFields.footer}` : '';

    let menuText = `${menuHeader}${menuFields.text}\n`;
    menuText += buildMenuTextOptions(menuFields, channelTags);
    menuText += menuFooter;

    let textMenu = { text: menuText };
    return textMenu;
}

function buildMenuTextOptions(menuFields, channelTags) {
    if (menuFields.options) {
        if (Array.isArray(menuFields.options)) {
            return buildMenuTextOptionsWhenIsArray(menuFields, channelTags);
        }
        if (typeof menuFields.options === 'object') {
            return buildMenuTextOptionsWhenIsObject(menuFields, channelTags);
        }
    }
}

function buildMenuTextOptionsWhenIsArray(menuFields, channelTags) {
    let menuText = '';

    let totalItens = parseInt(menuFields.options.length);
    let currentItemNumber = PROPS.orderOptions === 'desc' ? totalItens : 1;
    let itemIterator = PROPS.orderOptions === 'desc' ? -1 : +1;
    menuFields.options.forEach((option) => {
        if (option[0] === '\n') {
            option = option.replace('\n', '');
            menuText += `\n`;
        }
        menuText += `\n${channelTags.bold.open}${currentItemNumber}${channelTags.bold.close}. ${option}`;
        currentItemNumber += itemIterator;
    });

    return menuText;
}

function buildMenuTextOptionsWhenIsObject(menuFields, channelTags) {
    let menuText = '';

    const sections = Object.keys(menuFields.options);
    let totalItens = getNumberOfOptions(menuFields.options);
    let currentItemNumber = PROPS.orderOptions === 'desc' ? totalItens : 1;
    let itemIterator = PROPS.orderOptions === 'desc' ? -1 : +1;

    sections.forEach((section, section_idx) => {
        menuText += section ? `\n${section}\n` : '\n';
        menuFields.options[section].forEach((option) => {
            if (option[0] === '\n') {
                option = option.replace('\n', '');
                menuText += `\n`;
            }
            menuText += `\n${channelTags.bold.open}${currentItemNumber}${channelTags.bold.close}. ${option.title}`;
            menuText +=
                CONFIG.listMenuHasDescription && option.description
                    ? `\n${channelTags.italic.open}${option.description}${channelTags.italic.close}`
                    : '';
            currentItemNumber += itemIterator;
        });
        menuText += section_idx < sections.length - 1 ? '\n' : '';
    });

    return menuText;
}

function getInteractiveMenu(menuFields, type, action) {
    return {
        recipient_type: 'individual',
        type: 'interactive',
        interactive: {
            type,
            ...buildHeader(menuFields),
            body: {
                text: menuFields.text
            },
            ...buildFooter(menuFields),
            action
        }
    };
}

function normalizeMenuOptionsToArray(menuOptions) {
    if (Array.isArray(menuOptions)) {
        return menuOptions;
    }

    let optionsArray = [];

    if (menuOptions && typeof menuOptions === 'object') {
        try {
            Object.entries(menuOptions).forEach(([, value] = options) => {
                optionsArray = optionsArray.concat(value);
            });
        } catch (e) {
            return [];
        }
    }

    return optionsArray;
}

function buildQuickReplyOptions(menuOptions) {
    menuOptions = normalizeMenuOptionsToArray(menuOptions);

    let quickReplyOptions = [];

    menuOptions.forEach((option) => {
        quickReplyOptions.push({
            text: option,
            type: 'text/plain',
            value: option
        });
    });

    return quickReplyOptions;
}

function buildWppQuickReplyOptions(menuOptions) {
    menuOptions = normalizeMenuOptionsToArray(menuOptions);

    let quickReplyOptions = [];

    menuOptions.forEach((option) => {
        quickReplyOptions.push({
            type: 'reply',
            reply: {
                id: option,
                title: option
            }
        });
    });

    return quickReplyOptions;
}

function buildHeader(menuFields) {
    if (menuFields.header && typeof menuFields.header === 'object') {
        return { header: { ...menuFields.header } };
    }
    return menuFields.header
        ? { header: { type: 'text', text: menuFields.header } }
        : {};
}

function buildFooter(menuFields) {
    return menuFields.footer ? { footer: { text: menuFields.footer } } : {};
}
function validateNumberOfOptions(arg) {
    try {
        const { min = 1, max } = arg;
        const optionsCount = getNumberOfOptions(PROPS.menuFields.options);
        return optionsCount >= min && optionsCount < max + 1;
    } catch (e) {
        return false;
    }
}

function validateOptionsLength(arg) {
    try {
        const { min = 1, max } = arg;

        let menuOptions;
        if (Array.isArray(PROPS.menuFields.options)) {
            menuOptions = PROPS.menuFields.options;
        }

        for (option of menuOptions) {
            let isOptionLengthValid =
                option.length > min && option.length < max + 1;

            if (!isOptionLengthValid) {
                return false;
            }
        }

        return true;
    } catch (e) {
        return false;
    }
}

///
function validateListMenuOptionsLength(arg) {
    try {
        const { title, description } = arg;

        let menuOptions;
        if (typeof PROPS.menuFields.options === 'object') {
            menuOptions = Object.values(PROPS.menuFields.options).reduce(
                (p, value) => {
                    p.push(...value);
                    return p;
                },
                []
            );
        }

        for (option of menuOptions) {
            let isTitleLengthValid =
                option.title.length >= title.min &&
                option.title.length < title.max + 1;

            let isDescriptionLengthValid =
                option.description.length >= description.min &&
                option.description.length < description.max + 1;

            if (!isTitleLengthValid || !isDescriptionLengthValid) {
                return false;
            }
        }

        return true;
    } catch (e) {
        return false;
    }
}

function getNumberOfOptions(menuOptions) {
    let optionsCount = 0;
    try {
        if (Array.isArray(menuOptions)) {
            optionsCount = menuOptions.length;
        } else if (typeof menuOptions === 'object') {
            optionsCount = Object.entries(menuOptions).reduce(
                (p, [, value]) => {
                    p += value.length;
                    return p;
                },
                0
            );
        }
    } finally {
        return optionsCount;
    }
}

function buildSections() {
    let menuOptions = PROPS.menuFields.options;

    if (Array.isArray(menuOptions)) {
        return [
            {
                rows: buildListOptions(menuOptions)
            }
        ];
    }

    return Object.keys(menuOptions).map((key, idx) => ({
        title: key,
        rows: buildListOptions(menuOptions[key], idx)
    }));
}

function buildListOptions(options, section_id = 1) {
    return options.map((option, idx) => ({
        id: `id:${section_id}.${idx}`,
        title: option.title,
        description: option.description || ''
    }));
}

// TEST CODE
// DO NOT PUT THE FOLLOWING CODE IN ROUTER RESOURCES

function run(userChannel, channelTags) {
    return getMenu(userChannel, channelTags);
}

function getMenu(userChannel, channelTags) {
    channelTags = JSON.parse(channelTags);
    const menuFields = {
        text: {
            default: {
                'en-US': `This is a text to describe the menu that will be generated to Default channel, the user will ${channelTags.bold.open}choose one of the options bellow${channelTags.bold.close}`,
                'pt-BR': `This is a text to describe the menu that will be generated to Default channel, the user will ${channelTags.bold.open}choose one of the options bellow${channelTags.bold.close}`
            },
            whatsapp: {
                'en-US': `This is a text to describe the menu that will be generated to WhatsApp channel, the user will ${channelTags.bold.open}choose one of the options bellow${channelTags.bold.close}`,
                'pt-BR': `This is a text to describe the menu that will be generated to WhatsApp channel, the user will ${channelTags.bold.open}choose one of the options bellow${channelTags.bold.close}`
            }
        },
        // options: {
        //     // For break a line between options, add a '\n' in beginning of option text. Its works only in text menu.
        //     'en-US': ['Option 1', 'Option 2', 'Option 3'],
        //     'pt-BR': ['Opção 1', 'Opção 2']
        // },
        options: {
            // This option structure allows you to create a menu separated by sessions (For Whatsapp-list and text menus, only). For Whatsapp list menu, it's has a maximum of 10 options (regardless of the number of sessions)
            'en-US': {
                'Sessão 1': ['Option 1', 'Option 2'],
                'Sessão 2': ['Option 3']
            },
            'pt-BR': {
                'Sessão 1': [
                    { title: 'Option 1', description: 'description 1' },
                    { title: 'Option 2', description: 'description 2' },
                    { title: 'Option 3', description: 'description 3' },
                    { title: 'Option 4', description: 'description 4' },
                    { title: 'Option 5', description: '' }
                ],
                'Sessão 2': [
                    { title: 'Option 1', description: '' },
                    { title: 'Option 2', description: 'description 2' },
                    { title: 'Option 3', description: '' }
                ]
            }
        },
        header: {
            // Optional. It works in Whatsapp-list and textMenu only
            'en-US':
                'This is a text to describe the menu (in the top) that will be generated to Whatsapp channel. Its should have in max 60 characters',
            'pt-BR':
                'This is a text to describe the menu (in the top) that will be generated to Whatsapp channel. Its should have in max 60 characters'
        },
        footer: {
            // Optional. It works in Whatsapp-list and textMenu only
            'en-US':
                'This is a text to describe the menu (in the bottom) that will be generated to Whatsapp channel. Its should have in max 60 characters',
            'pt-BR':
                'This is a text to describe the menu (in the bottom) that will be generated to Whatsapp channel. Its should have in max 60 characters'
        },
        button: {
            // Required if list type Whatsapp menu
            'en-US':
                'This is a text of menu button in Whatsapp channel. Its should have in max 20 characters',
            'pt-BR':
                'This is a text of menu button in Whatsapp channel. Its should have in max 20 characters'
        }
    };
    let props = {
        menuFields,
        userChannel,
        channelTags,
        userLanguage: 'pt-BR'
    };
    let config = {
        whatsapp: {
            type: 'list_menu'
        }
    };

    let menu = createMenu(props, config);
    return menu;
}

// Assert [REQUIREMENTS] variables.

let channelTags = JSON.stringify({
    bold: { open: '*', close: '*' },
    italic: { open: '_', close: '_' },
    strikethrough: { open: '~', close: '~' }
});
let userChannel = 'whatsapp';

console.log('-------------');
console.log(run(userChannel, channelTags));
console.log('-------------');

// IMPORTS USED BY NODE, DO NOT COPY THIS

module.exports = {
    getMenu,
    createMenu,
    getQuickReplyMenu,
    getWppQuickReplyMenu,
    getTextMenu,
    _normalizeProps
};
