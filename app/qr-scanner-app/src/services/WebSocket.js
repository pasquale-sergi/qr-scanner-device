import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export default function BarcodeListener() {
    const [products, setProducts] = useState([]);
    const [connectionStatus, setConnectionStatus] = useState('Connecting...'); // Track status

    useEffect(() => {
        console.log('>>> useEffect: Setting up WebSocket connection...');
        const socketUrl = 'http://192.168.1.117:8080/ws-barcode'; // Double-check IP and PORT
        let socket = null;
        let client = null;

        try {
            // --- Use native WebSocket first if possible, fallback to SockJS ---
            // Note: SockJS might be needed if backend/network requires it
            // For simplicity, let's stick with SockJS as configured on backend
            console.log(`>>> Creating SockJS connection to: ${socketUrl}`);
            socket = new SockJS(socketUrl);

            client = new Client({
                webSocketFactory: () => socket,
                debug: (str) => {
                    console.log('STOMP DEBUG: ' + str); // Detailed STOMP frames
                },
                reconnectDelay: 5000,
                heartbeatIncoming: 4000, // Optional: Keep connection alive checks
                heartbeatOutgoing: 4000, // Optional: Keep connection alive checks

                beforeConnect: () => {
                    console.log('>>> STOMP: Attempting to connect...');
                    setConnectionStatus('Connecting...');
                },

                onConnect: (frame) => {
                    console.log('>>> STOMP: Connected! Frame:', frame);
                    setConnectionStatus('Connected & Subscribed');

                    // Subscribe to the topic
                    client.subscribe('/topic/barcode', (message) => {
                        console.log('<<< Raw WebSocket message received:', message);
                        if (message.body) {
                            console.log('<<< Message body:', message.body);
                            try {
                                const product = JSON.parse(message.body);
                                console.log('<<< Parsed product:', product);
                                // Add new product to the list (prepend)
                                setProducts((prev) => [product, ...prev]);
                            } catch (e) {
                                console.error("!!! Failed to parse WebSocket message:", e);
                            }
                        } else {
                            console.log("<<< Received message with empty body");
                        }
                    },
                    { id: 'barcode-subscription' }); // Give subscription an ID
                    console.log('>>> STOMP: Subscribed to /topic/barcode');
                },

                onDisconnect: () => {
                    console.log('XXX STOMP: Disconnected');
                    setConnectionStatus('Disconnected');
                },

                onStompError: (frame) => {
                    console.error('!!! STOMP Error - Headers:', frame.headers, 'Body:', frame.body);
                    setConnectionStatus(`STOMP Error: ${frame.headers['message']}`);
                },

                onWebSocketError: (error) => {
                    console.error('!!! WebSocket Error:', error);
                    // Note: SockJS might wrap the original error
                    setConnectionStatus(`WebSocket Error: ${error?.message || 'Unknown'}`);
                },

                 onWebSocketClose: (event) => {
                    console.log('XXX WebSocket Closed:', event);
                    setConnectionStatus('WebSocket Closed');
                 }
            });

            console.log('>>> Activating STOMP client...');
            client.activate();

        } catch (error) {
            console.error("!!! Error setting up WebSocket/STOMP:", error);
            setConnectionStatus(`Setup Error: ${error.message}`);
        }

        // Cleanup on unmount
        return () => {
            console.log('>>> useEffect cleanup: Deactivating STOMP client...');
            if (client && client.active) {
                client.deactivate();
                console.log('>>> STOMP client deactivated.');
            } else {
                 console.log('>>> STOMP client already inactive.');
            }
            // SockJS doesn't always need explicit closing here, STOMP deactivate handles it.
        };
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.productCard}>
            <Text style={styles.productName}>{item.name || item.product_name || 'Unknown'}</Text>
            <Text style={styles.productBarcode}>Barcode: {item.barcode || item.code || 'N/A'}</Text>
            <Text style={styles.productBrand}>Brand: {item.brand || item.brands || 'N/A'}</Text>
        </View>
    );


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Real-time Barcode Products</Text>
            <FlatList
              data={products}
              keyExtractor={(item, index) => item.id?.toString() || item.code?.toString() || index.toString()}
              renderItem={renderItem}
              ListEmptyComponent={<Text style={styles.emptyText}>No products received yet.</Text>}
              style={styles.list}
              extraData={products}
            />

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 5 },
    status: { fontSize: 14, color: '#666', marginBottom: 15, fontStyle: 'italic' },
    list: { flex: 1 },
    productCard: {
        padding: 15,
        marginBottom: 10,
        backgroundColor: '#f0f0ff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0ff'
    },
    productName: { fontSize: 18, fontWeight: '600' },
    productBarcode: { fontSize: 14, color: '#555', marginTop: 4 },
    productBrand: { fontSize: 14, color: '#555', marginTop: 4 },
});
