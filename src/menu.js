//Simule [REQUIREMENTS] variables.
//let channelBoldTags = { open: '<b>', close: '</b>' };
let channelBoldTags = { open: '*', close: '*' };
channelBoldTags = JSON.stringify(channelBoldTags);
console.log(JSON.stringify(run('blipchat', channelBoldTags)));

//Code of builder here
function run(userChannel, channelBoldTags) {
    return getMenu(userChannel, channelBoldTags);
}

function getMenu(userChannel, channelBoldTags) {
    channelBoldTags = JSON.parse(channelBoldTags);
    const MENU_FIELDS = {
        text: `This is a text to describe the menu, the user will ${channelBoldTags.open}choose one option bellow${channelBoldTags.close}`,
        options: ['Option 1', 'Option 2', 'Option 3']
    };
    let menu = createMenuContent(userChannel, channelBoldTags, MENU_FIELDS);
    return menu;
}

function createMenuContent(userChannel, channelBoldTags, menuFields) {
    let menu = {};
    menu.type = 'application/vnd.lime.select+json';
    try {
        if (userChannel === 'blipchat' || userChannel === 'facebook') {
            menu.content = getQuickReply(menuFields, channelBoldTags);
        } else if (
            userChannel === 'whatsapp' &&
            menuFields.options.length < 4
        ) {
            menu.content = getQuickWppReply(menuFields, channelBoldTags);
            menu.type = 'application/json';
        } else {
            menu.content = getTextMenu(menuFields, channelBoldTags);
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
                text: menuFields.text
            },
            action: {
                buttons: menuOptions
            }
        }
    };
    return quickReplyContent;
}

function getTextMenu(menuFields, channelBoldTags) {
    var options = menuFields.options;
    let menuText = menuFields.text + '\n';
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

function getQuickReply(menuFields) {
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
        scope: 'immediate',
        text: menuFields.text,
        options: menuOptions
    };
    return quickReplyContent;
}
