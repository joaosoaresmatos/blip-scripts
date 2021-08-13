function getLastStateWithInput(stateName, stateId, lastStateWithInputCurrent) {
    let lastStateWithInput = {
        name: stateName,
        id: stateId,
        previousName: null,
        previousId: null
    };

    try {
        lastStateWithInputCurrentParsed = JSON.parse(lastStateWithInputCurrent);
        lastStateWithInput.previousName = lastStateWithInputCurrentParsed.name;
        lastStateWithInput.previousId = lastStateWithInputCurrentParsed.id;
    } catch (exception) {
        throw exception;
    } finally {
        return lastStateWithInput;
    }
}
