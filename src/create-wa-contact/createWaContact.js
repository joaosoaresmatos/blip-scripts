// Assert [REQUIREMENTS] variables.

console.log(run('whatsapp', 'ptBr'));
console.log(run('blipchat', 'ptBr'));
console.log(run('blipchat', 'enUs'));

// Code of builder here

function run(userChannel, userLanguage = 'ptBr') {
    return getWaContact(userChannel, userLanguage);
}

function getWaContact(userChannel, userLanguage = 'ptBr') {
    const contactName = 'Contact Name';
    const phoneNumber = '55123456789';
    const description = {
        ptBr: 'Maçã',
        enUs: 'Apple'
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
    userLanguage = 'ptBr'
    } = {}) {
    let contactWebLink = {};

    if (userChannel === "whatsapp") {
        contactWebLink.type = "application/json";
        contactWebLink.content = _createWaTemplateContact(phoneNumber, contactName);
        return contactWebLink;
    }

    contactWebLink.type = "application/vnd.lime.web-link+json";
    contactWebLink.content = _createWaContactWebLink(
        phoneNumber,
        contactName,
        description,
        userLanguage
    );

    return contactWebLink;
}

function _createWaContactWebLink(phoneNumber, name, description = null, userLanguage = 'ptBr') {
    if (description instanceof Object) {
        description = description[userLanguage];
    }

    const contactWebLinkContent = {
        uri: `https://api.whatsapp.com/send?phone=${phoneNumber}`,
        target: "blank",
        title: name,
        text: description,
    };

    return contactWebLinkContent;
}

function _createWaTemplateContact(phoneNumber, name) {
    const CONTACT_TYPE = "contacts";
    const PHONE_TYPE = "WORK";

    const nameSplited = name.split(" ");

    return {
        type: CONTACT_TYPE,
        contacts: [{
            name: {
                first_name: nameSplited[0],
                formatted_name: name,
                last_name: nameSplited[nameSplited.length - 1] || "",
            },
            phones: [{
                phone: `+${phoneNumber}`,
                type: PHONE_TYPE,
                wa_id: phoneNumber,
            }, ],
        }, ],
    };
}
