function run(contactIdentity) {
    return getUserChannel(contactIdentity);
}

function getUserChannel(contactIdentity) {
    const DEFAULT_CHANNEL = 'default';
    const CHANNEL_INDEX = 1;

    const CHANNEL_IDENTIFIERS = {
        'wa.gw.msging.net': 'whatsapp',
        '0mn.io': 'blipchat',
        'take.io': 'takeSMS',
        'messenger.gw.msging.net': 'facebook',
        'instagram.gw.msging.net': 'instagram',
        'abs.gw.msging.net': 'teams',
        'businessmessages.gw.msging.net': 'gbm',
        'skype.gw.msging.net': 'skype',
        'telegram.gw.msging.net': 'telegram',
        'workplace.gw.msging.net': 'workplace',
        'mailgun.gw.msging.net': 'email',
        'pagseguro.gw.msging.net': 'pagseguro'
    };

    let contactChannelId = contactIdentity.split('@')[CHANNEL_INDEX];

    return CHANNEL_IDENTIFIERS[contactChannelId] || DEFAULT_CHANNEL;
}

// Just for testing purposes
console.log(run('551140028922@wa.gw.msging.net'));
