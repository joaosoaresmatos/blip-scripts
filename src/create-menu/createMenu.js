// Assert [REQUIREMENTS] variables.

// let channelBoldTags = { open: '<b>', close: '</b>' };
let channelBoldTags = { open: '*', close: '*' };
channelBoldTags = JSON.stringify(channelBoldTags);
let userChannel = 'instagram';
console.log('-------------');
console.log(JSON.stringify(run(userChannel, channelBoldTags)));
console.log('-------------');
console.log(run(userChannel, channelBoldTags));
console.log('-------------');

// Code of builder here

function run(userChannel, channelBoldTags) {
    return getMenu(userChannel, channelBoldTags);
}

function getMenu(userChannel, channelBoldTags) {
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
            telegram: `This is a text to describe the menu that will be generated to Telegram channel, the user will ${channelBoldTags.open}choose one of the options bellow${channelBoldTags.close}`
        },
        options: {
            'en-US': ['Option 1', 'Option 2', 'Option 3'],
            'pt-BR': ['Opção 1', 'Opção 2', 'Opção 3']
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
        hasWppQuickReply: true,
        isBlipImmediateMenu: true,
        orderOptions: 'desc'
    };
    let menu = createMenu(props, config);
    return menu;
}

// Below are all scripts used in menu creation process
// It should be put in the router resources in order to be used by the above script

function createMenu(
    props = {
        userChannel,
        channelBoldTags,
        menuFields,
        userLanguage
    },
    config = {
        hasDefaultQuickReply: true,
        hasWppQuickReply: true,
        isBlipImmediateMenu: true,
        orderOptions: 'asc'
    }
) {
    props = normalizeProps(props);
    let { userChannel, menuFields } = props;
    let menu = {};
    try {
        if (
            config.hasDefaultQuickReply &&
            (userChannel === 'blipchat' || userChannel === 'facebook')
        ) {
            menu.content = getQuickReply(props, config);
            menu.type = 'application/vnd.lime.select+json';
        } else if (
            userChannel === 'whatsapp' &&
            menuFields.options.length < 4 &&
            config.hasWppQuickReply
        ) {
            menu.content = getWppQuickReply(props, config);
            menu.type = 'application/json';
        } else {
            menu.content = getTextMenu(props, config);
            menu.type = 'application/vnd.lime.select+json';
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

function getWppQuickReply(props, config) {
    let { menuFields } = props;
    let menuText = menuFields.text;
    let menuOptions = menuFields.options;
    let quickReplyOptions = [];
    if (menuOptions) {
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
    let quickReplyContent = {
        type: 'interactive',
        interactive: {
            type: 'button',
            body: {
                text: menuText
            },
            action: {
                buttons: quickReplyOptions
            }
        }
    };
    return quickReplyContent;
}

function getTextMenu(props, config) {
    let { channelBoldTags, menuFields } = props;
    let menuText = menuFields.text;
    let menuOptions = menuFields.options;
    if (menuFields.enableOptions !== false) {
        let totalItens = parseInt(menuOptions.length);
        if (config.orderOptions === 'desc') {
            start = totalItens - 1;
            for (let i = start, j = 0; i >= 0; i--, j++) {
                menuText += `\n${channelBoldTags.open}(i + 1)${channelBoldTags.close}. ${menuOptions[j]}`;
            }
        } else {
            for (let i = 0; i < totalItens; i++) {
                let option = i + 1;
                if (menuFields.isSurvey) {
                    option = totalItens - i;
                }
                menuText += `\n${channelBoldTags.open}${option}${channelBoldTags.close}. ${menuOptions[i]}`;
            }
        }
    }
    let textMenu = { text: menuText };
    return textMenu;
}

function normalizeProps(props) {
    let { userChannel, menuFields, userLanguage } = props;
    let menuText =
        menuFields.text?.[userChannel]?.[userLanguage] ||
        menuFields.text?.default?.[userLanguage] ||
        menuFields.text?.[userChannel] ||
        menuFields.text?.default ||
        menuFields.text;
    let menuOptions = menuFields.options?.[userLanguage] || menuFields.options;

    props.menuFields.text = menuText;
    props.menuFields.options = menuOptions;
    return props;
}
