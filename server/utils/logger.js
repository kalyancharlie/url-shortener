const isLogging = process.env.MODE === 'dev' ? true : false;

const log = (message) => {
    if (isLogging) {
        console.log(message);
    }
}

module.exports = log