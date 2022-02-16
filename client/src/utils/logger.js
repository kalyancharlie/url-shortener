const isLogging = false

const log = (message, forceRun) => {
    if (isLogging || forceRun) {
        console.log(message);
    }
}

export default log