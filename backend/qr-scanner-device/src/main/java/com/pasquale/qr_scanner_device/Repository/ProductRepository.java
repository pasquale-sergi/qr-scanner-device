package com.pasquale.qr_scanner_device.Repository;

import com.pasquale.qr_scanner_device.Entity.ApplicationUser;
import com.pasquale.qr_scanner_device.Entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Integer> {
    Optional<Product> findByBarcode(String barcode);
    List<Product> findByUser(ApplicationUser user);
    Boolean existsByBarcodeAndUser(String barcode, ApplicationUser user);
}
