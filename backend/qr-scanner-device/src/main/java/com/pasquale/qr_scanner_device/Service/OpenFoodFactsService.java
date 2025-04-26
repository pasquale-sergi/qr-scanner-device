package com.pasquale.qr_scanner_device.Service;

import com.pasquale.qr_scanner_device.Entity.Product;
import com.pasquale.qr_scanner_device.MongoDB.ProductDocument;
import com.pasquale.qr_scanner_device.MongoDB.ProductDocumentRepository;
import com.pasquale.qr_scanner_device.Utils.OpenFoodFacts.OpenFoodFactsResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Optional;

@Service
public class OpenFoodFactsService {


    @Autowired
    private ProductDocumentRepository productDocumentRepository;


    public Optional<ProductDocument> findByBarcode(String barcode) {
        return productDocumentRepository.findByBarcodeProjected(barcode);
    }

}
