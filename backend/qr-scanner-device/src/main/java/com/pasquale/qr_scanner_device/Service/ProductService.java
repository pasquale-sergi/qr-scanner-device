package com.pasquale.qr_scanner_device.Service;

import com.pasquale.qr_scanner_device.Entity.ApplicationUser;
import com.pasquale.qr_scanner_device.Entity.Product;
import com.pasquale.qr_scanner_device.MongoDB.ProductDocument;
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

    public Optional<Product> findByBarcode(Long barcode) {
        return productRepository.findByBarcode(barcode);
    }

    public List<Product> getUserProducts(ApplicationUser user) {
        ApplicationUser applicationUser = userRepository.findById(user.getId()).orElseThrow(()-> new RuntimeException("User Not Found"));

        return productRepository.findByUser(applicationUser);
    }

    //save scanned product for user
    @Transactional
    public Product saveScannedProduct(String barcode, ProductDocument genericInfo, Long userId) {
        ApplicationUser user = userRepository.findById(userId).orElseThrow(()-> new RuntimeException("User Not Found"));


        Optional<Product> existingProduct = productRepository.findByUser(user).stream().filter(p -> p.getBarcode().equals(barcode)).findFirst();

        if (existingProduct.isPresent()) {
            Product product = existingProduct.get();
            product.setQuantity(product.getQuantity() + 1);
            System.out.println("Incrementing quantity for product " + product.getBarcode());
            return productRepository.save(product);
        }else {
            if(genericInfo == null) {
                throw new RuntimeException("Generic Info Not Found");

            }

            Product newProduct = new Product();
            newProduct.setBarcode(Long.parseLong(barcode));
            newProduct.setName(genericInfo.getName());
            newProduct.setQuantity(1);
            newProduct.setUser(user);
            newProduct.setBrand(genericInfo.getBrand());
            System.out.println("Saving new product " + newProduct.getBarcode());
            return productRepository.save(newProduct);
        }
    }

    //delete a product
    public Product deleteProduct(Long barcode, Long userId) {
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
