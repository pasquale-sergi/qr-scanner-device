package com.pasquale.qr_scanner_device.Config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pasquale.qr_scanner_device.MongoDB.ProductDocument;
import com.pasquale.qr_scanner_device.Service.BarcodeProcessingService;
import com.pasquale.qr_scanner_device.Utils.Exceptions.ProductNotFoundException;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.Map;

@Component
public class BarcodeWebSocketHandler extends TextWebSocketHandler {
    private static final Logger logger = (Logger) LoggerFactory.getLogger(BarcodeWebSocketHandler.class);
    private final ObjectMapper objectMapper = new ObjectMapper();

    // Inject the processing service
    @Autowired
    private BarcodeProcessingService barcodeProcessingService;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        // Retrieve userId stored by the HandshakeInterceptor
        Long userId = (Long) session.getAttributes().get("userId");

        String userIdStr = (userId != null) ? String.valueOf(userId) : "UNKNOWN/Auth Failed";

        logger.info("Raw WebSocket connection established from {} for user ID: {}",
                session.getRemoteAddress(), // Argument 1
                userIdStr);
        if (userId == null) {
            logger.warn("Closing session {} due to missing user ID.", session.getId());
            session.close(CloseStatus.POLICY_VIOLATION.withReason("Authentication required"));
        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        logger.info("Received raw WebSocket message: {}", payload);

        // --- Get User ID from Session Attributes ---
        Long userId = (Long) session.getAttributes().get("userId");
        if (userId == null) {
            logger.warn("Ignoring message from session {} without authenticated user ID.", session.getId());
            // Optionally close if it shouldn't happen after connectionEstablished check
            // session.close(CloseStatus.POLICY_VIOLATION.withReason("User ID missing"));
            return;
        }
        // -----------------------------------------

        try {
            // Assuming the payload is JSON like {"barcode": "..."}
            Map<String, String> data = objectMapper.readValue(payload, Map.class);
            String barcode = data.get("barcode");

            if (barcode != null) {
                logger.info("Processing Barcode: {} for User ID: {}", barcode, userId);

                // --- Call the refactored service ---
                try {
                    ProductDocument productDocument = barcodeProcessingService.processBarcode(barcode, userId);
                    logger.info("Successfully processed barcode {} for user {} via WebSocket", barcode, userId);
                    // Optional: Send success acknowledgement back via WebSocket
                    session.sendMessage(new TextMessage("{\"status\":\"Processed\", \"barcode\":\"" + barcode + "\"}"));
                } catch (ProductNotFoundException e) {
                    logger.warn("Product not found via WebSocket for barcode {}: {}", barcode, e.getMessage());
                    session.sendMessage(new TextMessage("{\"error\":\"Product not found\", \"barcode\":\"" + barcode + "\"}"));
                } catch (RuntimeException e) {
                    logger.error("Error processing barcode {} for user {} via service: {}", barcode, userId, e.getMessage(), e);
                    session.sendMessage(new TextMessage("{\"error\":\"Processing failed\", \"barcode\":\"" + barcode + "\"}"));
                }
                // ------------------------------------

            } else {
                logger.warn("Received message without 'barcode' field: {}", payload);
                session.sendMessage(new TextMessage("{\"error\":\"Missing barcode field\"}"));
            }
        } catch (IOException e) {
            logger.error("Failed to parse incoming JSON: {}", payload, e);
            session.sendMessage(new TextMessage("{\"error\":\"Invalid JSON format\"}"));
        }
    }

    // ... handleTransportError, afterConnectionClosed ...
}