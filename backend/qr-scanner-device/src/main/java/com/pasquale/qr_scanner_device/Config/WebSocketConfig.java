package com.pasquale.qr_scanner_device.Config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocket
public class WebSocketConfig  implements WebSocketConfigurer {

    @Autowired
    private BarcodeWebSocketHandler barcodeWebSocketHandler;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(barcodeWebSocketHandler, "/ws-barcode") // Path must match client
                .setAllowedOriginPatterns( // Or setAllowedOrigins - must match previous config
                        "http://192.168.1.117:*",
                        "http://localhost:*"
                );
    }

}
