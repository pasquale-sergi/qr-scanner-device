package com.pasquale.qr_scanner_device.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String barcode;
    private String name;
    private int quantity;
    private double price;
    private String brand;
    private String description;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id", nullable = false)
    @JsonIgnore
    private ApplicationUser user;

    public Product() {
    }

    public Product(String barcode, String name, int quantity, double price, String description, String brand, ApplicationUser user) {
        this.barcode = barcode;
        this.name = name;
        this.quantity = quantity;
        this.price = price;
        this.description = description;
        this.brand = brand;
        this.user = user;
    }
}
