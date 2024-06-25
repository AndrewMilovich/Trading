const axios = require('axios');

const getMasterTradeDetails = async () => {
    try {
        const response = await axios.get(process.env.MASTER_TRADE_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching master trade details:', error.message);
        throw new Error('Failed to fetch master trade details');
    }
};

const getConnectionID = async () => {
    try {
        const response = await axios.get('https://mt4.mtapi.io/Connect', {
            params: {
                user: process.env.MT4_USER,
                password: process.env.MT4_PASSWORD,
                host: process.env.MT4_HOST,
                port: process.env.MT4_PORT
            },
            headers: { 'accept': 'text/plain' }
        });
        return response.data; // Adjust if needed based on actual response format
    } catch (error) {
        console.error('Error fetching connection ID:', error.message);
        throw new Error('Failed to fetch connection ID');
    }
};

const replicateTrade = async (tradeDetails, connectionID) => {
    try {
        const response = await axios.get('https://mt4.mtapi.io/OrderSend', {
            params: {
                id: connectionID,
                symbol: tradeDetails.symbol,
                operation: tradeDetails.operation,
                volume: tradeDetails.volume,
                takeprofit: tradeDetails.takeprofit,
                comment: tradeDetails.comment
            },
            headers: { 'accept': 'text/json' }
        });
        return response.data;
    } catch (error) {
        console.error('Error replicating trade:', error.message);
        throw new Error('Failed to replicate trade');
    }
};

module.exports = {
    getMasterTradeDetails,
    getConnectionID,
    replicateTrade
};
