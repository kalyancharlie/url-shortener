const isLogging = process.env.LOG_MODE === 'true' ? true : false;

const log = (message, forceRun) => {
    if (isLogging || forceRun) {
        console.log(message);
    }
}

module.exports = log