package com.pasquale.qr_scanner_device.Service;

import com.pasquale.qr_scanner_device.Entity.ApplicationUser;
import com.pasquale.qr_scanner_device.Entity.Product;
import com.pasquale.qr_scanner_device.Repository.ProductRepository;
import com.pasquale.qr_scanner_device.Repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public Optional<Product> findByBarcode(String barcode) {
        return productRepository.findByBarcode(barcode);
    }

    public List<Product> getUserProducts(ApplicationUser user) {
        ApplicationUser applicationUser = userRepository.findById(user.getId()).orElseThrow(()-> new RuntimeException("User Not Found"));

        return productRepository.findByUser(applicationUser);
    }

    //save scanned product for user
    @Transactional
    public Product saveScannedProduct(String barcode, Long userId) {
        ApplicationUser user = userRepository.findById(userId).orElseThrow(()-> new RuntimeException("User Not Found"));
        Optional<Product> product = productRepository.findByBarcode(barcode);

        if (product.isPresent()) {
            if (productRepository.existsByBarcodeAndUser(product.get().getBarcode(), user)){
                Product userProduct = product.get();
                userProduct.setQuantity(userProduct.getQuantity() + 1);
                return productRepository.save(userProduct);
            }else {
                Product newProduct = new Product();
                newProduct.setBarcode(barcode);
                newProduct.setName(product.get().getName());
                newProduct.setQuantity(product.get().getQuantity());
                newProduct.setUser(user);
                newProduct.setPrice(product.get().getPrice());
                newProduct.setDescription(product.get().getDescription());
                return productRepository.save(newProduct);
            }
        }
        return null;
    }

    //delete a product
    public Product deleteProduct(String barcode, Long userId) {
        ApplicationUser user = userRepository.findById(userId).orElseThrow(()-> new RuntimeException("User Not Found"));
        Optional<Product> product = productRepository.findByBarcode(barcode);
        if (product.isPresent()) {
            if (productRepository.existsByBarcodeAndUser(product.get().getBarcode(), user)) {
                productRepository.delete(product.get());
                return product.get();
            }
        }
        return null;

    }

    //make the api call

}
