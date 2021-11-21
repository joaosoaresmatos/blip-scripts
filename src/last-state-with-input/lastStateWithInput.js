function getLastStateWithInput(stateName, stateId, lastStateWithInputCurrent) {
    let nowDate = new Date().toLocaleDateString('pt-BR');
    let lastStateWithInput = {
        name: stateName,
        id: stateId,
        date: nowDate,
        previousName: null,
        previousId: null,
        previousDate: null
    };

    try {
        lastStateWithInputCurrentParsed = JSON.parse(lastStateWithInputCurrent);
        lastStateWithInput.previousName = lastStateWithInputCurrentParsed.name;
        lastStateWithInput.previousId = lastStateWithInputCurrentParsed.id;
        lastStateWithInput.previousDate = lastStateWithInputCurrentParsed.date;
    } finally {
        return lastStateWithInput;
    }
}
