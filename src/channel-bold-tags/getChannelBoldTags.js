function run(userChannel) {
    return getBoldTagsByChannel(userChannel);
}

function getBoldTagsByChannel(userChannel) {
    const BOLD_TAGS = {
        empty: {
            open: '',
            close: ''
        },
        default: {
            open: '*',
            close: '*'
        },
        html: {
            open: '<b>',
            close: '</b>'
        },
        markdown: {
            open: '**',
            close: '**'
        }
    };

    const CHANNELS = {
        default: BOLD_TAGS.empty,
        whatsapp: BOLD_TAGS.default,
        blipchat: BOLD_TAGS.html,
        facebook: BOLD_TAGS.default,
        teams: BOLD_TAGS.markdown,
        gbm: BOLD_TAGS.markdown,
        telegram: BOLD_TAGS.markdown,
        workplace: BOLD_TAGS.default
        // takeSMS:  BOLD_TAGS.empty,
        // instagram:  BOLD_TAGS.empty,
        // skype:  BOLD_TAGS.empty,
        // email:  BOLD_TAGS.empty,
        // pagseguro:  BOLD_TAGS.empty,
    };

    return CHANNELS[userChannel] || CHANNELS.default;
}

// Just for testing purposes
console.log(run('whatsapp'));
