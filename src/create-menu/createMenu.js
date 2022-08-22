// Assert [REQUIREMENTS] variables.

// let channelBoldTags = { open: '<b>', close: '</b>' };
let channelBoldTags = { open: '*', close: '*' };
channelBoldTags = JSON.stringify(channelBoldTags);
let userChannel = 'whatsapp';

console.log('-------------');
console.log(JSON.stringify(run(userChannel, channelBoldTags)));
console.log('-------------');
const result = run(userChannel, channelBoldTags);
console.log(result);
console.log('-------------');

// Code of builder here

function run(userChannel, channelBoldTags) {
    // return getWhatsappListMenu(userChannel, channelBoldTags);
    // return getCompleteMenu(userChannel, channelBoldTags);
    return getSimpleMenu(userChannel, channelBoldTags);
}

function getSimpleMenu(userChannel, channelBoldTags) {
    channelBoldTags = JSON.parse(channelBoldTags);
    const menuFields = {
        text: `This is a main menu text`,
        options: [
            'Option 1',
            'Option 2',
            'Option 3',
            'Option 4',
            'Option 5',
            'Option 6',
            'Option 7',
            'Option 8'
        ],
        button: 'Send'
    };
    let props = {
        menuFields,
        userChannel,
        channelBoldTags
    };
    let config = {
        hasDefaultQuickReply: true,
        hasWppQuickReply: false,
        hasWppListMenu: true,
        isBlipImmediateMenu: false,
        orderOptions: 'desc'
    };
    let menu = createMenu(props, config);
    return menu;
}

function getWhatsappListMenu(userChannel, channelBoldTags) {
    channelBoldTags = JSON.parse(channelBoldTags);
    const menuFields = {
        text: `This is a main menu text`,
        options: {
            'Sessão 1': [
                'Option 1\nDescription 1',
                'Option 2\nDescription 2',
                'Option 3\nDescription 3',
                'Option 4\nDescription 4',
                'Option 5\nDescription 5'
            ],
            'Sessão 2': [
                'Option 6\nDescription 6',
                'Option 7\nDescription 7',
                'Option 8\nDescription 8'
            ]
        },
        header: 'This is a text to describe the menu (in the top) that will be generated to Whatsapp channel. Its should have in max 60 characters',
        footer: 'Footer menu text',
        button: 'Send'
    };
    let props = {
        menuFields,
        userChannel,
        channelBoldTags
    };
    let config = {
        hasDefaultQuickReply: false,
        hasWppQuickReply: false,
        hasWppListMenu: true,
        isBlipImmediateMenu: false,
        orderOptions: 'desc'
    };
    let menu = createMenu(props, config);
    return menu;
}

function getCompleteMenu(userChannel, channelBoldTags) {
    channelBoldTags = JSON.parse(channelBoldTags);
    const menuFields = {
        text: {
            default: {
                'en-US': `This is a text to describe the menu that will be generated to Default channel, the user will ${channelBoldTags.open}choose one of the options bellow${channelBoldTags.close}`,
                'pt-BR': `This is a text to describe the menu that will be generated to Default channel, the user will ${channelBoldTags.open}choose one of the options bellow${channelBoldTags.close}`
            },
            whatsapp: {
                'en-US': `This is a text to describe the menu that will be generated to WhatsApp channel, the user will ${channelBoldTags.open}choose one of the options bellow${channelBoldTags.close}`,
                'pt-BR': `This is a text to describe the menu that will be generated to WhatsApp channel, the user will ${channelBoldTags.open}choose one of the options bellow${channelBoldTags.close}`
            },
            facebook: {
                'en-US': `This is a text to describe the menu that will be generated to Facebook channel, the user will ${channelBoldTags.open}choose one of the options bellow${channelBoldTags.close}`,
                'pt-BR': `This is a text to describe the menu that will be generated to Facebook channel, the user will ${channelBoldTags.open}choose one of the options bellow${channelBoldTags.close}`
            },
            telegram: {
                'en-US': `This is a text to describe the menu that will be generated to Telegram channel, the user will ${channelBoldTags.open}choose one of the options bellow${channelBoldTags.close}`,
                'pt-BR': `This is a text to describe the menu that will be generated to Telegram channel, the user will ${channelBoldTags.open}choose one of the options bellow${channelBoldTags.close}`
            }
        },
        /* options: {
            // For break a line between options, add a '\n' in beginning of option text. Its works only in text menu.
            'en-US': ['Option 1', 'Option 2', 'Option 3'],
            'pt-BR': ['Opção 1', 'Opção 2', 'Opção 3']
        }, */
        options: {
            // This option structure allows you to create a menu separated by sessions (For Whatsapp-list and text menus, only). For Whatsapp list menu, it's has a maximum of 10 options (regardless of the number of sessions)
            'en-US': {
                'Sessão 1': ['Option 1', 'Option 2'],
                'Sessão 2': ['Option 3']
            },
            'pt-BR': {
                'Sessão 1': [
                    'Opção 1',
                    'Opção 2',
                    'Opção 3',
                    'Opção 4',
                    'Opção 5'
                ],
                'Sessão 2': ['Opção 6', 'Opção 7', 'Opção 8']
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
        channelBoldTags,
        userLanguage: 'pt-BR'
    };
    let config = {
        hasDefaultQuickReply: true,
        hasWppQuickReply: false,
        hasWppListMenu: true,
        isBlipImmediateMenu: false,
        orderOptions: 'desc'
    };
    let menu = createMenu(props, config);
    return menu;
}

// Below are all scripts used in menu creation process
// It should be put in the router resources in order to be used by the above script

function createMenu(
    {
        userChannel = null,
        channelBoldTags = null,
        menuFields = null,
        userLanguage = null
    } = {},
    {
        hasDefaultQuickReply = true,
        hasWppQuickReply = true,
        hasWppListMenu = false,
        isBlipImmediateMenu = true,
        orderOptions = 'asc'
    } = {}
) {
    let props = {
        userChannel,
        channelBoldTags,
        menuFields,
        userLanguage
    };
    let config = {
        hasDefaultQuickReply,
        hasWppQuickReply,
        hasWppListMenu,
        isBlipImmediateMenu,
        orderOptions
    };
    let menu = {};
    try {
        props = normalizeProps(props);
        let { userChannel } = props;
        if (
            config.hasDefaultQuickReply &&
            (userChannel === 'blipchat' || userChannel === 'facebook')
        ) {
            menu.content = getQuickReply(props, config);
            menu.type = 'application/vnd.lime.select+json';
        } else if (
            userChannel === 'whatsapp' &&
            config.hasWppQuickReply &&
            validateOptionsToWhatsappMenu(props, 'QuickReply')
        ) {
            menu.content = getWppQuickReply(props, config);
            menu.type = 'application/json';
        } else if (
            userChannel === 'whatsapp' &&
            config.hasWppListMenu &&
            validateOptionsToWhatsappMenu(props, 'List')
        ) {
            menu.content = getWppListMenu(props, config);
            menu.type = 'application/json';
        } else {
            menu.content = getTextMenu(props, config);
            if (userChannel === 'facebook' || userChannel === 'gbm') {
                menu.type = 'application/json';
            } else {
                menu.type = 'application/vnd.lime.select+json';
            }
        }
    } catch (exception) {
        menu.type = 'application/vnd.lime.select+json';
        menu.content = {
            text: `Something went wrong while generating menu. Please, visit https://github.com/joaosoaresmatos/blip-scripts/blob/main/README.md to read more about it.\n\nDescription:\n\n${exception}`
        };
        throw exception;
    } finally {
        return menu;
    }
}

function getQuickReply(props, config) {
    let { menuFields } = props;
    let menuText = menuFields.text;
    let menuOptions = menuFields.options;
    let quickReplyOptions = [];
    if (menuOptions && typeof menuOptions === 'object') {
        menuOptions = convertSectionOptionsToArray(menuOptions);
    }
    if (menuOptions) {
        for (let i = 0; i < menuOptions.length; i++) {
            quickReplyOptions.push({
                text: menuOptions[i],
                type: 'text/plain',
                value: menuOptions[i]
            });
        }
    }
    let quickReplyContent = {
        text: menuText,
        options: quickReplyOptions
    };
    if (config.isBlipImmediateMenu) {
        quickReplyContent.scope = 'immediate';
    }
    return quickReplyContent;
}

function convertSectionOptionsToArray(menuOptions) {
    if (Array.isArray(menuOptions)) {
        return menuOptions;
    }
    const sections = Object.keys(menuOptions);
    let options = [];
    for (let i = 0; i < sections.length; i++) {
        options = options.concat(menuOptions[sections[i]]);
    }
    return options;
}

function getWppQuickReply(props, config) {
    const action = {
        buttons: buildQuickReplyOptions(props.menuFields.options)
    };
    return getInteractiveMenu(props.menuFields, 'button', action);
}

function getWppListMenu(props) {
    const action = {
        button: props.menuFields.button,
        sections: buildSections(props.menuFields.options)
    };
    return getInteractiveMenu(props.menuFields, 'list', action);
}

function getTextMenu(props, config) {
    let { menuFields } = props;
    let menuHeader = menuFields.header ? `${menuFields.header}\n\n` : '';
    let menuFooter = menuFields.footer ? `\n\n${menuFields.footer}` : '';
    let menuText = `${menuHeader}${menuFields.text}\n`;
    menuText += buildMenuTextOptions(props, config);
    menuText += menuFooter;
    let textMenu = { text: menuText };
    return textMenu;
}

function buildMenuTextOptions(props, config) {
    let { menuFields } = props;
    let menuOptions = menuFields.options;
    if (menuOptions && Array.isArray(menuOptions)) {
        return buildMenuTextOptionsWhenIsArray(props, config);
    }
    if (menuOptions && typeof menuOptions === 'object') {
        return buildMenuTextOptionsWhenIsObject(props, config);
    }
}

function buildMenuTextOptionsWhenIsArray(props, config) {
    let { channelBoldTags, menuFields } = props;
    let menuOptions = menuFields.options;
    let menuText = '';
    if (props.enableOptions !== false) {
        let totalItens = parseInt(menuOptions.length);
        if (config.orderOptions === 'desc') {
            start = totalItens - 1;
            for (let i = start, j = 0; i >= 0; i--, j++) {
                if (menuOptions[j][0] === '\n') {
                    menuOptions[j] = menuOptions[j].replace('\n', '');
                    menuText += `\n\n${channelBoldTags.open}${i + 1}${
                        channelBoldTags.close
                    }. ${menuOptions[j]}`;
                } else {
                    menuText += `\n${channelBoldTags.open}${i + 1}${
                        channelBoldTags.close
                    }. ${menuOptions[j]}`;
                }
            }
        } else {
            for (let i = 0; i < totalItens; i++) {
                let option = i + 1;
                if (props.isSurvey) {
                    option = totalItens - i;
                }
                if (menuOptions[i][0] === '\n') {
                    menuOptions[i] = menuOptions[i].replace('\n', '');
                    menuText += `\n\n${channelBoldTags.open}${option}${channelBoldTags.close}. ${menuOptions[i]}`;
                } else {
                    menuText += `\n${channelBoldTags.open}${option}${channelBoldTags.close}. ${menuOptions[i]}`;
                }
            }
        }
    }
    return menuText;
}

function buildMenuTextOptionsWhenIsObject(props, config) {
    let { channelBoldTags, menuFields } = props;
    let menuOptions = menuFields.options;
    let menuText = '';
    try {
        const sections = Object.keys(menuOptions);
        let totalItens = getNumberOfOptions(menuOptions);
        if (config.orderOptions === 'desc') {
            start = totalItens - 1;
            let i = start;
            for (let k = 0; k < sections.length; k++) {
                menuText += sections[k] ? `\n${sections[k]}\n` : '\n';
                for (let j = 0; j < menuOptions[sections[k]].length; i--, j++) {
                    if (menuOptions[sections[k]][j][0] === '\n') {
                        menuOptions[sections[k]][j] = menuOptions[sections[k]][
                            j
                        ].replace('\n', '');
                        menuText += `\n\n${channelBoldTags.open}${i + 1}${
                            channelBoldTags.close
                        }. ${menuOptions[sections[k]][j]}`;
                    } else {
                        menuText += `\n${channelBoldTags.open}${i + 1}${
                            channelBoldTags.close
                        }. ${menuOptions[sections[k]][j]}`;
                    }
                }
                menuText += k < sections.length - 1 ? '\n' : '';
            }
        } else {
            let i = 1;
            for (let k = 0; k < sections.length; k++) {
                menuText += sections[k] ? `\n${sections[k]}\n` : '\n';
                for (let j = 0; j < menuOptions[sections[k]].length; j++, i++) {
                    let option = i;
                    if (menuFields.isSurvey) {
                        option = totalItens - i;
                    }
                    if (menuOptions[sections[k]][j][0] === '\n') {
                        menuOptions[sections[k]][j] = menuOptions[sections[k]][
                            j
                        ].replace('\n', '');
                        menuText += `\n\n${channelBoldTags.open}${option}${
                            channelBoldTags.close
                        }. ${menuOptions[sections[k]][j]}`;
                    } else {
                        menuText += `\n${channelBoldTags.open}${option}${
                            channelBoldTags.close
                        }. ${menuOptions[sections[k]][j]}`;
                    }
                }
                menuText += k < sections.length - 1 ? '\n' : '';
            }
        }
    } catch (error) {
        return '';
    } finally {
        return menuText;
    }
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

function buildQuickReplyOptions(menuOptions) {
    let optionsArray = [];

    if (menuOptions && typeof menuOptions === 'object') {
        try {
            const options = Object.keys(menuOptions);
            for (let i = 0; i < options.length; i++) {
                optionsArray = optionsArray.concat(menuOptions[options[i]]);
            }
        } catch (error) {
            return [];
        }
    }

    menuOptions = optionsArray;

    let quickReplyOptions = [];

    if (menuOptions && Array.isArray(menuOptions)) {
        for (let i = 0; i < menuOptions.length; i++) {
            quickReplyOptions.push({
                type: 'reply',
                reply: {
                    id: menuOptions[i],
                    title: menuOptions[i]
                }
            });
        }
    }

    return quickReplyOptions;
}

function buildHeader(menuFields) {
    if (menuFields.header && typeof menuFields.header === 'object') {
        return { header: { ...menuFields.header } };
    }
    return !menuFields.header
        ? {}
        : { header: { type: 'text', text: menuFields.header } };
}

function buildFooter(menuFields) {
    return !menuFields.footer ? {} : { footer: { text: menuFields.footer } };
}

function validateOptionsToWhatsappMenu(props, menuType) {
    const MAX_TEXT_LENGTH_OF_WHATSAPP_MENU = 1024;
    const MAX_FOOTER_LENGTH_OF_WHATSAPP_MENU = 60;
    if (props.menuFields.text.length > MAX_TEXT_LENGTH_OF_WHATSAPP_MENU) {
        throw new Error(
            `The text field is too long. The maximum number of characters allowed is ${MAX_TEXT_LENGTH_OF_WHATSAPP_MENU}`
        );
    }
    if (
        props.menuFields.footer &&
        props.menuFields.footer.length > MAX_FOOTER_LENGTH_OF_WHATSAPP_MENU
    ) {
        throw new Error(
            `The footer field is too long. The maximum number of characters allowed is ${MAX_FOOTER_LENGTH_OF_WHATSAPP_MENU}`
        );
    }
    if (menuType === 'List') {
        validateWhatsappListMenu(props);
    } else {
        validateWhatsappQuickReplyMenu(props);
    }
    return true;
}

function validateWhatsappListMenu(props) {
    // Data obtained from this link https://developers.facebook.com/docs/whatsapp/on-premises/reference/messages
    const MAX_OPTIONS_ON_WHATSAPP_LIST_MENU = 10;
    const TITLE_OPTION_LENGTH_OF_WHATSAPP_LIST_MENU = 24;
    const DESCRIPTION_OPTION_LENGTH_OF_WHATSAPP_LIST_MENU = 72;
    const BUTTON_TEXT_LENGTH_OF_WHATSAPP_LIST_MENU = 20;
    if (
        getNumberOfOptions(props.menuFields.options) >
        MAX_OPTIONS_ON_WHATSAPP_LIST_MENU
    ) {
        throw new Error(
            `The list type menu allows a maximum of ${MAX_OPTIONS_ON_WHATSAPP_LIST_MENU} options.`
        );
    }
    let options = convertSectionOptionsToArray(props.menuFields.options);
    const optionsTitle = options.map((option) => option.split('\n')[0]);
    const optionsDescription = options.map((option) => option.split('\n')[1]);
    const hasTitleError = optionsTitle.find(
        (option) => option.length > TITLE_OPTION_LENGTH_OF_WHATSAPP_LIST_MENU
    );
    if (hasTitleError) {
        throw new Error(
            `Options text cannot be longer than ${TITLE_OPTION_LENGTH_OF_WHATSAPP_LIST_MENU} characters`
        );
    }
    const hasDescriptionError = optionsDescription.find((option) =>
        option
            ? option.length > DESCRIPTION_OPTION_LENGTH_OF_WHATSAPP_LIST_MENU
            : false
    );
    if (hasDescriptionError) {
        throw new Error(
            `The description text of a menu option cannot be longer than ${DESCRIPTION_OPTION_LENGTH_OF_WHATSAPP_LIST_MENU} characters`
        );
    }
    if (
        props.menuFields.button.length >
        BUTTON_TEXT_LENGTH_OF_WHATSAPP_LIST_MENU
    ) {
        throw new Error(
            `The button field cannot be longer than ${BUTTON_TEXT_LENGTH_OF_WHATSAPP_LIST_MENU} characters`
        );
    }
}

function validateWhatsappQuickReplyMenu(props) {
    // Data obtained from this link https://developers.facebook.com/docs/whatsapp/on-premises/reference/messages
    const MAX_OPTIONS_ON_WHATSAPP_QUICKREPLY_MENU = 3;
    const TITLE_OPTION_LENGTH_OF_WHATSAPP_QUICKREPLY_MENU = 20;
    if (
        getNumberOfOptions(props.menuFields.options) >
        MAX_OPTIONS_ON_WHATSAPP_QUICKREPLY_MENU
    ) {
        throw new Error(
            `The button type menu allows a maximum of ${MAX_OPTIONS_ON_WHATSAPP_QUICKREPLY_MENU} options`
        );
    }
    let options = convertSectionOptionsToArray(props.menuFields.options);
    const hasError = options.find(
        (option) =>
            option.length > TITLE_OPTION_LENGTH_OF_WHATSAPP_QUICKREPLY_MENU
    );
    if (hasError) {
        throw new Error(
            `Options text cannot be longer than ${TITLE_OPTION_LENGTH_OF_WHATSAPP_QUICKREPLY_MENU} characters`
        );
    }
}

function getNumberOfOptions(menuOptions) {
    let optionsCount = 0;
    try {
        if (Array.isArray(menuOptions)) {
            optionsCount = menuOptions.length;
        } else if (typeof menuOptions === 'object') {
            const options = Object.keys(menuOptions);
            for (let i = 0; i < options.length; i++) {
                optionsCount += menuOptions[options[i]].length;
            }
        }
    } finally {
        return optionsCount;
    }
}

function buildSections(menuOptions) {
    if (Array.isArray(menuOptions)) {
        return [
            {
                rows: buildListOptions(menuOptions)
            }
        ];
    }

    return Object.keys(menuOptions).map((key, id) => ({
        title: key,
        rows: buildListOptions(menuOptions[key], id)
    }));
}

function buildListOptions(sectionOptions, sectionId = 1) {
    return sectionOptions.map((option, idx) => ({
        id: `id:${sectionId}.${idx}`,
        ...buildListRowTitle(option)
    }));
}

function buildListRowTitle(options) {
    const splitOption = options.split('\n');
    const description =
        splitOption.length > 1 ? { description: splitOption[1] } : '';
    return {
        title: splitOption[0],
        ...description
    };
}

function normalizeProps(props) {
    let menuText = normalizeMenuText(props);
    let menuOptions = normalizeMenuField(props, 'options');
    let menuHeader = normalizeMenuHeader(props);
    let menuFooter = normalizeMenuField(props, 'footer');
    let menuButton = normalizeMenuField(props, 'button');

    props.menuFields.text = menuText;
    props.menuFields.options = menuOptions || [];
    props.menuFields.header = menuHeader;
    props.menuFields.footer = menuFooter;
    props.menuFields.button = menuButton || 'Menu';

    return props;
}

function normalizeMenuText(props) {
    let { userChannel, menuFields, userLanguage } = props;
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
    return menuText;
}

function normalizeMenuHeader(props) {
    let { menuFields, userLanguage, userChannel } = props;
    let headerText;
    if (menuFields.header && typeof menuFields.header === 'string') {
        headerText = menuFields.header;
    } else if (
        menuFields.header &&
        menuFields.header[userLanguage] &&
        typeof menuFields.header[userLanguage] === 'string'
    ) {
        headerText = menuFields.header[userLanguage];
    } else if (
        menuFields.header &&
        menuFields.header[userLanguage] &&
        userChannel === 'whatsapp'
    ) {
        headerText = menuFields.header[userLanguage];
    } else if (menuFields.header && userChannel === 'whatsapp') {
        headerText = menuFields.header;
    } else {
        return;
    }
    return headerText;
}

function normalizeMenuField(props, field) {
    let { menuFields, userLanguage } = props;
    let normilezedField;
    if (menuFields[field] && menuFields[field][userLanguage]) {
        normilezedField = menuFields[field][userLanguage];
    } else if (menuFields[field]) {
        normilezedField = menuFields[field];
    } else {
        normilezedField = undefined;
    }
    return normilezedField;
}

module.exports = {
    getCompleteMenu,
    getSimpleMenu,
    getWhatsappListMenu,
    createMenu,
    getQuickReply,
    getWppQuickReply,
    getTextMenu,
    normalizeProps
};
