# createWaContact

Build an WhatsApp contact according userChannel.

<br>

**WhatsApp**

![waContact on WhatsApp example](../../imgs/wa-contact-wa.png)


**Other Channels**

![waContact on BlipChat example](../../imgs/wa-contact-blipchat.png)

# How to Use

1. Add script, indicated below comment 'Resource', in the bot or router resource

![adding script in the resource](../../imgs/adding-script-resource.png)


2. import script into builder
Example

```js
{{resource.createWaContact}}
```

3. Call function createWaContact with props

```js
{{resource.createWaContact}}


function run(userChannel, userLanguage = 'pt-Br') {
    return getWaContact(userChannel, userLanguage);
}

function getWaContact(userChannel, userLanguage = 'pt-Br') {
    const contactName = 'Contact Name';
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
```

<br><br>

# Props
|accepted|
|---|
|userChannel|
|contactName|
|phoneNumber|
|description|
|userLanguage|
