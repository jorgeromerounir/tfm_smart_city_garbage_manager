package com.scgm.containers.util;

import lombok.experimental.UtilityClass;

import java.util.Random;
import com.scgm.containers.entity.ContainerEntity.WasteLevel;

@UtilityClass
public class WasteLevelUtil {

    private static final Random RANDOM = new Random();

    public static WasteLevel getRandomWasteLevel() {
        WasteLevel[] levels = WasteLevel.values();
        int randomIndex = RANDOM.nextInt(levels.length);
        return levels[randomIndex];
    }

    public static WasteLevel getWasteLevelFromDouble(Double value) {
        if (value == null) {
            return null; 
        }
        if (value <= 0.33) {
            return WasteLevel.LIGHT;
        } else if (value <= 0.66) {
            return WasteLevel.MEDIUM;
        } else {
            return WasteLevel.HEAVY;
        }
    }
}