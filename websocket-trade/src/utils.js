class CustomError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

const handleError = (error, ws) => {
    console.error('Error:', error.message);
    ws.send(JSON.stringify({ error: error.message }));
};

module.exports = {
    CustomError,
    handleError
};
