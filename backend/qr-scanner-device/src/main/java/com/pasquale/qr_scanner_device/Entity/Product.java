package com.pasquale.qr_scanner_device.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long barcode;
    private String name;
    private int quantity;

    private String brand;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id", nullable = false)
    @JsonIgnore
    private ApplicationUser user;

    public Product() {
    }

    public Product(Long barcode, String name, int quantity, String brand, ApplicationUser user) {
        this.barcode = barcode;
        this.name = name;
        this.quantity = quantity;


        this.brand = brand;
        this.user = user;
    }
}
