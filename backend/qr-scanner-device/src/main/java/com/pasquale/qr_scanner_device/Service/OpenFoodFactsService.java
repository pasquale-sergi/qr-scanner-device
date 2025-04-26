package com.pasquale.qr_scanner_device.Service;

import com.pasquale.qr_scanner_device.Entity.Product;
import com.pasquale.qr_scanner_device.Utils.OpenFoodFacts.OpenFoodFactsResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class OpenFoodFactsService {

    private final RestTemplate restTemplate = new RestTemplate();

    public Product getProductByBarcode(String barcode) {
        String url = UriComponentsBuilder
                .fromHttpUrl("https://world.openfoodfacts.net/api/v2/" + barcode)
                .toUriString();

        OpenFoodFactsResponse response = restTemplate.getForObject(url, OpenFoodFactsResponse.class);

        assert response != null;
        if (response.getProduct() != null) {
            Product product = new Product();
            product.setBarcode(barcode);
            product.setName(product.getName());
            product.setDescription(product.getDescription());
            product.setQuantity(product.getQuantity());
            product.setBrand(product.getBrand());

            return product;
        }

        return null;
    }
}
