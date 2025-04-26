package com.pasquale.qr_scanner_device.MongoDB;

import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "products")
@Setter
@Getter
public class ProductDocument {
    @Id
    private String id;
    @Field("code")
    private String barcode;

    @Field("product_name")
    private String name;

    @Field("brands")
    private String brand;

    @Field("quantity")
    private String quantityString;



}
