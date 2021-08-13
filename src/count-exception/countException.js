function getCountException(countExceptionCurrent, lastStateWithInput) {
    let countException = 0;
    try {
        lastStateWithInputParsed = JSON.parse(lastStateWithInput);
        if (
            lastStateWithInputParsed.id ===
                lastStateWithInputParsed.previousId &&
            lastStateWithInputParsed.name ===
                lastStateWithInputParsed.previousName
        ) {
            countException = countExceptionCurrent;
            countException++;
        }
    } catch (exception) {
        throw exception;
    } finally {
        return countException;
    }
}
