// Assert [REQUIREMENTS] variables.

console.log('\n__________________WA_____________________\n');
console.log(JSON.stringify(run('whatsapp', 'pt-Br')));
console.log('\n');
console.log(JSON.stringify(run('whatsapp', 'en-Us')));
console.log('\n__________________BC_____________________\n');
console.log(JSON.stringify(run('blipchat', 'pt-Br')));
console.log('\n');
console.log(JSON.stringify(run('blipchat', 'en-Us')));
console.log('\n_______________________________________\n');

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
    let contactWebLink = {};

    if (description instanceof Object) {
        description = description[userLanguage];
    }

    if (contactName instanceof Object) {
        contactName = contactName[userLanguage];
    }

    if (userChannel === 'whatsapp') {
        contactWebLink.type = 'application/json';
        contactWebLink.content = _createWaTemplateContact(phoneNumber, contactName);
        return contactWebLink;
    }

    contactWebLink.type = 'application/vnd.lime.web-link+json';
    contactWebLink.content = _createWaContactWebLink(
        phoneNumber,
        contactName,
        description,
        userLanguage
    );

    return contactWebLink;
}

function _createWaContactWebLink(phoneNumber, name, description = null, userLanguage = 'ptBr') {
    const contactWebLinkContent = {
        uri: `https://api.whatsapp.com/send?phone=${phoneNumber}`,
        target: 'blank',
        title: name,
        text: description,
    };

    return contactWebLinkContent;
}

function _createWaTemplateContact(phoneNumber, name) {
    const CONTACT_TYPE = 'contacts';
    const PHONE_TYPE = 'WORK';

    const nameSplited = name.split(' ');

    return {
        type: CONTACT_TYPE,
        contacts: [{
            name: {
                first_name: nameSplited[0],
                formatted_name: name,
                last_name: nameSplited.length > 1 ? nameSplited[nameSplited.length - 1] : '',
            },
            phones: [{
                phone: (phoneNumber.startsWith('+') ? '' : '+') + `${phoneNumber}`,
                type: PHONE_TYPE,
                wa_id: phoneNumber,
            }, ],
        }, ],
    };
}
