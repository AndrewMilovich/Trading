import { useState, useEffect, useRef } from 'react';

const TradeDashboard = () => {
    const [tradeData, setTradeData] = useState(null);
    const [status, setStatus] = useState('Connecting to Backend...');
    const socketRef = useRef(null);
    const reconnectInterval = useRef(null);

    const connectWebSocket = () => {
        socketRef.current = new WebSocket(process.env.NEXT_PUBLIC_WS_SERVER_URL);

        socketRef.current.onopen = () => {
            setStatus('Connected to Backend...');
            if (reconnectInterval.current) {
                clearInterval(reconnectInterval.current);
                reconnectInterval.current = null;
            }
        };

        socketRef.current.onmessage = (event) => {
            console.log('Received:', event);
            const data = JSON.parse(event.data);
            if(data?.error){
                setStatus('Error: ' + data.error);
            }else{
                const data = JSON.parse(event.data);
                setTradeData(data);
                setStatus('Trade Completed');
            }
        };

        socketRef.current.onclose = () => {
            setStatus('Disconnected from Backend');
            attemptReconnection();
        };

        socketRef.current.onerror = (error) => {
            setStatus('WebSocket Error');
            console.error('WebSocket Error: ', error);
            socketRef.current.close();
        };
    };

    const attemptReconnection = () => {
        if (!reconnectInterval.current) {
            reconnectInterval.current = setInterval(() => {
                setStatus('Attempting to reconnect...');
                connectWebSocket();
            }, 5000); // Attempt to reconnect every 5 seconds
        }
    };

    useEffect(() => {
        connectWebSocket();

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
            if (reconnectInterval.current) {
                clearInterval(reconnectInterval.current);
            }
        };
    }, []);

    const handleTrade = () => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            setStatus('Pinging Lambda Function...');
            socketRef.current.send('trade');
        } else {
            console.error('Socket is not open');
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ color: '#333', textAlign: 'center' }}>Trade Dashboard</h1>
            <button 
                onClick={handleTrade} 
                style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    color: '#fff',
                    backgroundColor: '#007bff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    display: 'block',
                    margin: '20px auto'
                }}
            >
                Trade
            </button>
            <p style={{ textAlign: 'center', fontSize: '18px' }}>Status: {status}</p>
            {tradeData && (
                <div style={{ marginTop: '20px' }}>
                    <h2 style={{ color: '#444', marginBottom: '10px' }}>Trade Details</h2>
                    <pre style={{
                        backgroundColor: '#f8f9fa',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        overflowX: 'auto'
                    }}>
                        {JSON.stringify(tradeData, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default TradeDashboard;
