// Assert [REQUIREMENTS] variables.
const colors = require('colors');

test('whatsapp', run('whatsapp', 'pt-Br'));
test('whatsapp', run('whatsapp', 'en-Us'));
test('blipchat', run('blipchat', 'pt-Br'));
test('blipchat', run('blipchat', 'en-Us'));

function test(channel, result) {
    result = JSON.stringify(result);
    const hrOutput = '\n\n################################################\n\n';
    const channelOutput = `\n${'Channel'.yellow}: ${channel}`;
    const resultOutput = `\n${'Result'.blue}: ${result}`;

    console.log(hrOutput + channelOutput + resultOutput + hrOutput);
}

// Code of builder here

function run(userChannel, userLanguage = 'pt-Br') {
    return getWaContact(userChannel, userLanguage);
}

function getWaContact(userChannel, userLanguage = 'pt-Br') {
    const contactName = {
        'pt-Br': 'Nome do Contato',
        'en-Us': 'Contact'
    };

    const phoneNumber = '55123456789';
    const description = {
        'pt-Br': 'Maçã',
        'en-Us': 'Apple'
    };

    const props = {
        userChannel,
        contactName,
        phoneNumber,
        description,
        userLanguage
    };

    return createWaContact(props);
}

// Below are all scripts used to create WA contact
// It should be put in the router resources in order to be used by the above script

function createWaContact({
    userChannel,
    contactName,
    phoneNumber,
    description = null,
    userLanguage = 'pt-Br'
} = {}) {
    const props = _normalizePros({
        userChannel,
        contactName,
        phoneNumber,
        description,
        userLanguage
    });

    if (userChannel === 'whatsapp') {
        const waTemplateContact = _createWaTemplateContact(
            props.phoneNumber,
            props.contactName
        );
        return waTemplateContact;
    }

    const waContactWebLink = _createWaContactWebLink(
        props.phoneNumber,
        props.contactName,
        props.description,
        props.userLanguage
    );

    return waContactWebLink;
}

function _normalizePros({
    userChannel,
    contactName,
    phoneNumber,
    description = null,
    userLanguage = 'pt-Br'
} = {}) {
    if (description instanceof Object) {
        description = description[userLanguage];
    }

    if (contactName instanceof Object) {
        contactName = contactName[userLanguage];
    }

    return {
        userChannel,
        contactName,
        phoneNumber,
        description,
        userLanguage
    };
}

function _createWaContactWebLink(phoneNumber, name, description = null) {
    const contactWebLinkContent = {
        uri: `https://api.whatsapp.com/send?phone=${phoneNumber}`,
        target: 'blank',
        title: name,
        text: description
    };

    return {
        type: 'application/vnd.lime.web-link+json',
        content: contactWebLinkContent
    };
}

function _createWaTemplateContact(phoneNumber, name) {
    const CONTACT_TYPE = 'contacts';
    const PHONE_TYPE = 'WORK';

    const nameSplited = name.split(' ');

    const phone = (phoneNumber.startsWith('+') ? '' : '+') + phoneNumber;

    const waTemplateContact = {
        type: CONTACT_TYPE,
        contacts: [
            {
                name: {
                    first_name: nameSplited[0],
                    formatted_name: name,
                    last_name:
                        nameSplited.length > 1
                            ? nameSplited[nameSplited.length - 1]
                            : ''
                },
                phones: [
                    {
                        phone,
                        type: PHONE_TYPE,
                        wa_id: phoneNumber
                    }
                ]
            }
        ]
    };

    return {
        type: 'application/json',
        content: waTemplateContact
    };
}
