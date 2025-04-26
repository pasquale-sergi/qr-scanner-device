package com.pasquale.qr_scanner_device.MongoDB;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.Optional;

public interface ProductDocumentRepository extends MongoRepository<ProductDocument, String> {

    @Query(value="{'code': ?0}", fields = "{'code': 1, 'product_name': 1, 'brands': 1, 'quantity': 1, 'packaging': 1, 'image_front_url': 1 }")
    Optional<ProductDocument> findByBarcodeProjected(String barcode);
}
