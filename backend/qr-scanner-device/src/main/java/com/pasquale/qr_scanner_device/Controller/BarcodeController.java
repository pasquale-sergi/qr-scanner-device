package com.pasquale.qr_scanner_device.Controller;

import com.pasquale.qr_scanner_device.Entity.Product;
import com.pasquale.qr_scanner_device.Repository.ProductRepository;
import com.pasquale.qr_scanner_device.Service.OpenFoodFactsService;
import com.pasquale.qr_scanner_device.Utils.BarcodeScanRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class BarcodeController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private OpenFoodFactsService openFoodFactsService;

    @Autowired
    private ProductRepository productRepository;

    @PostMapping("/barcode/scan")
    public ResponseEntity<?> receiveBarcode(@RequestBody BarcodeScanRequest request){
        Product product = openFoodFactsService.getProductByBarcode(request.getBarcode());
        if(product == null){
            System.out.println("Something wrong with product fetch");
            return ResponseEntity.notFound().build();
        }
        System.out.println("Sending product via WebSocket: " + product);


        messagingTemplate.convertAndSend("/topic/barcode", product);

        return ResponseEntity.ok(product);
    }
}
