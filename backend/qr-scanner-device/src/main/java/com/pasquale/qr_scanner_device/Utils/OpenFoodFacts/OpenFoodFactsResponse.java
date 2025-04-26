package com.pasquale.qr_scanner_device.Utils.OpenFoodFacts;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class OpenFoodFactsResponse {
    private String status_verbose;
    private OFFProduct product;


}
