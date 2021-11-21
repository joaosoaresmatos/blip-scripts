function getLastBotWithInput(lastBotWithInputNew, lastBotWithInputOld) {
    let lastBotWithInput = {
        name: lastBotWithInputNew,
        previousName: null
    };

    try {
        lastBotWithInputOldParsed = JSON.parse(lastBotWithInputOld);
        lastBotWithInput.previousName = lastBotWithInputOldParsed.name;
    } finally {
        return lastBotWithInput;
    }
}
