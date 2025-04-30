package com.pasquale.qr_scanner_device.Service;

import com.pasquale.qr_scanner_device.Entity.Product;
import com.pasquale.qr_scanner_device.MongoDB.ProductDocument;
import com.pasquale.qr_scanner_device.Utils.Exceptions.ProductNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class BarcodeProcessingService {

    @Autowired
    private OpenFoodFactsService openFoodFactsService;

    @Autowired
    private ProductService productService;



    public ProductDocument processBarcode(String barcode, Long userId) {
        Optional <ProductDocument> productInfo = openFoodFactsService.findByBarcode(barcode);

        if (productInfo.isEmpty()){
            throw new ProductNotFoundException("Product not found for barcode: " + barcode );

        }

        ProductDocument productDocument = productInfo.get();
        System.out.println("Found product document: " + productDocument.getName());



        try {
            Product savedInventoryItem = productService.saveScannedProduct(productDocument.getBarcode(), productDocument, userId);
            System.out.println("Saved product association for user: " + userId );
            return productDocument;
        }catch (RuntimeException e){
            System.err.println("Error saving product association for user: " + userId );
            throw e;
        }
    }

}
