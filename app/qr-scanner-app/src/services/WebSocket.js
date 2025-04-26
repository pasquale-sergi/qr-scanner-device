import React, {useEffect, useState} from "react";
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {Client} from '@stomp/stompjs';
import SockJS from "sockjs-client";

export default function BarcodeListener(){
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const socketUrl = 'http:addressip:8080/ws-barcode';
        const socket = new SockJS(socketUrl);


        const client = new Client({
            webSocketFactory: () => socket,
            debug: (str) => {
                console.log('STOMP: ', str);
            },
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('Connected to websocket');

                client.subscribe('/topic/barcode', (message) => {
                    if (message.body) {
                      const product = JSON.parse(message.body);
                      console.log('Received product:', product);
          
                      setProducts((prev) => [product, ...prev]);
                    }
                  });
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
              },
    
        });

        client.activate();

        return ()=>{
            client.deactivate();
        };
    }, []);
    
    const renderItem = ({ item }) => (
        <View style={styles.productCard}>
          <Text style={styles.productName}>{item.name || item.productName || 'Unknown'}</Text>
          <Text style={styles.productBarcode}>Barcode: {item.barcode || item.id || 'N/A'}</Text>
        </View>
      );



    return (
        <View style={styles.container}>
          <Text style={styles.title}>Real-time Barcode Products</Text>
          <FlatList
            data={products}
            keyExtractor={(item, index) => item.id?.toString() || index.toString()}
            renderItem={renderItem}
            ListEmptyComponent={<Text>No products received yet.</Text>}
          />
        </View>
    );
}


const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
    productCard: {
      padding: 15,
      marginBottom: 10,
      backgroundColor: '#f0f0ff',
      borderRadius: 8,
    },
    productName: { fontSize: 18, fontWeight: '600' },
    productBarcode: { fontSize: 14, color: '#555' },
  });