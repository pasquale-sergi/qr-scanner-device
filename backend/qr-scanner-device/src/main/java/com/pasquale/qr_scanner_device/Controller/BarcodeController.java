package com.pasquale.qr_scanner_device.Controller;

import com.pasquale.qr_scanner_device.Entity.Product;
import com.pasquale.qr_scanner_device.MongoDB.ProductDocument;
import com.pasquale.qr_scanner_device.Repository.ProductRepository;
import com.pasquale.qr_scanner_device.Service.OpenFoodFactsService;
import com.pasquale.qr_scanner_device.Service.ProductService;
import com.pasquale.qr_scanner_device.Service.UserDetailsImpl;
import com.pasquale.qr_scanner_device.Utils.BarcodeScanRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api")
public class BarcodeController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private OpenFoodFactsService openFoodFactsService;

    @Autowired
    private ProductService productService;

    @PostMapping("/barcode/scan")
    public ResponseEntity<?> receiveBarcode(@RequestBody BarcodeScanRequest request){
        Optional<ProductDocument> productInfo = openFoodFactsService.findByBarcode(request.getBarcode());

        if(productInfo.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found");
        }

        ProductDocument productDocument = productInfo.get();
        System.out.println("Found product in database: " + productDocument.getName());
        messagingTemplate.convertAndSend("/topic/barcode", productDocument);

        try {
            Long userId = getCurrentUserId();

            Product savedInventoryItem = productService.saveScannedProduct(productDocument.getBarcode(), productDocument, userId);

            return ResponseEntity.status(HttpStatus.OK).body(productDocument);
        }catch (RuntimeException e){
            System.err.println("Error saving product " + e.getMessage());
            return ResponseEntity.ok(productDocument);
        }
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return userDetails.getId();
    }
}
