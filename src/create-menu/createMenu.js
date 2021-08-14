// Assert [REQUIREMENTS] variables.

// let channelBoldTags = { open: '<b>', close: '</b>' };
let channelBoldTags = { open: '*', close: '*' };
channelBoldTags = JSON.stringify(channelBoldTags);
let userChannel = 'whatsapp';
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
    const MENU_FIELDS = {
        text: {
            default: `This is a text to describe the menu, the user will ${channelBoldTags.open}choose one option bellow${channelBoldTags.close} (channel: default)`,
            whatsapp: `This is a text to describe the menu, the user will ${channelBoldTags.open}choose one option bellow${channelBoldTags.close} (channel: whatsapp)`
        },
        options: ['Option 1', 'Option 2', 'Option 3']
    };
    let config = {
        hasDefaultQuickReply: false,
        hasWppQuickReply: true,
        isBlipImmediateMenu: false
    };
    let menu = createMenu(userChannel, channelBoldTags, MENU_FIELDS, config);
    return menu;
}

// Below are all scripts used in menu creation process
// It should be put in the router resources in order to be used by the above script

function createMenu(
    userChannel,
    channelBoldTags,
    menuFields,
    config = {
        hasDefaultQuickReply: true,
        hasWppQuickReply: true,
        isBlipImmediateMenu: true
    }
) {
    let menu = {};
    menu.type = 'application/vnd.lime.select+json';
    try {
        if (
            config.hasDefaultQuickReply &&
            (userChannel === 'blipchat' || userChannel === 'facebook')
        ) {
            menu.content = getQuickReply(menuFields, config);
        } else if (
            userChannel === 'whatsapp' &&
            menuFields.options.length < 4 &&
            config.hasWppQuickReply
        ) {
            menu.content = getQuickWppReply(menuFields);
            menu.type = 'application/json';
        } else {
            menu.content = getTextMenu(
                menuFields,
                userChannel,
                channelBoldTags
            );
        }
    } catch (exception) {
        throw exception;
    } finally {
        return menu;
    }
}

function getQuickWppReply(menuFields) {
    let menuOptions = [];
    if (menuFields.options) {
        for (let i = 0; i < menuFields.options.length; i++) {
            menuOptions.push({
                type: 'reply',
                reply: {
                    id: menuFields.options[i],
                    title: menuFields.options[i]
                }
            });
        }
    }

    let quickReplyContent = {
        type: 'interactive',
        interactive: {
            type: 'button',
            body: {
                text: menuFields.text.whatsapp || menuFields.text.default
            },
            action: {
                buttons: menuOptions
            }
        }
    };
    return quickReplyContent;
}

function getTextMenu(menuFields, userChannel, channelBoldTags) {
    var options = menuFields.options;
    let menuText = menuFields.text.default + '\n';

    if (userChannel == 'whatsapp' && menuFields.text.whatsapp) {
        menuText = menuFields.text.whatsapp + '\n';
    }
    if (menuFields.enableOptions != false) {
        let totalItens = parseInt(options.length);
        if (menuFields.orderOptions == 'desc') {
            start = totalItens - 1;
            for (let i = start, j = 0; i >= 0; i--, j++) {
                menuText +=
                    `\n${channelBoldTags.open}` +
                    (i + 1) +
                    `${channelBoldTags.close}. ` +
                    options[j];
            }
        } else {
            for (let i = 0; i < totalItens; i++) {
                let option = i + 1;
                if (menuFields.isSurvey) {
                    option = totalItens - i;
                }
                menuText +=
                    `\n${channelBoldTags.open}` +
                    option +
                    `${channelBoldTags.close}. ` +
                    options[i];
            }
        }
    }
    let textMenu = { text: menuText };
    return textMenu;
}

function getQuickReply(menuFields, config) {
    let menuOptions = [];
    if (menuFields.options) {
        for (let i = 0; i < menuFields.options.length; i++) {
            let value;
            if (menuFields.values) {
                value = menuFields.values[i];
            } else {
                value = menuFields.options[i];
            }
            menuOptions.push({
                text: menuFields.options[i],
                type: 'text/plain',
                value: value
            });
        }
    }
    let quickReplyContent = {
        text: menuFields.text.default,
        options: menuOptions
    };
    if (config.isBlipImmediateMenu) {
        quickReplyContent.scope = 'immediate';
    }
    return quickReplyContent;
}
