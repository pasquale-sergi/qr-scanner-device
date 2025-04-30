package com.pasquale.qr_scanner_device.Controller;

import com.pasquale.qr_scanner_device.MongoDB.ProductDocument;
import com.pasquale.qr_scanner_device.Service.BarcodeProcessingService;
import com.pasquale.qr_scanner_device.Service.UserDetailsImpl;
import com.pasquale.qr_scanner_device.Utils.Requests.BarcodeScanRequest;
import com.pasquale.qr_scanner_device.Utils.Exceptions.ProductNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class BarcodeController {

    @Autowired
    private BarcodeProcessingService barcodeProcessingService;

    @PostMapping("/barcode/scan")
    public ResponseEntity<?> receiveBarcode(@RequestBody BarcodeScanRequest request){
        try {
            Long userId = getCurrentUserId();
            ProductDocument productDocument = barcodeProcessingService.processBarcode(request.getBarcode(), userId);
            return ResponseEntity.ok(productDocument);
        }catch (ProductNotFoundException e){
            System.err.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }catch (RuntimeException e){
            System.err.println("Error processing Barcode: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to process Barcode: " + e.getMessage());
        }
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return userDetails.getId();
    }
}
