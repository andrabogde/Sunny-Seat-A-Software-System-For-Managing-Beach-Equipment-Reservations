package com.example.fullstacktemplate.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class PlaceDetailsService {

    @Value("${google.api.key}")
    private String googleApiKey;

    @Value("${weather.api.key}")
    private String weatherApiKey;

    private final RestTemplate restTemplate;

    public PlaceDetailsService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public Map<String, Object> getPlaceDetails(String placeName) {
        log.info("🔍 SEARCHING FOR: " + placeName);
        
        try {
            // Strategii multiple de căutare (mai precise)
            String[] searchStrategies = {
                placeName, // Query original complet
                placeName + " " + extractCityFromAddress(placeName), // Cu orașul corect
                placeName.split(" ")[0] + " beach " + extractCityFromAddress(placeName), // Primul cuvânt + oraș
                placeName + " Romania", // Cu țara
                placeName.replace("Plaja", "").trim() + " beach", // Fără "Plaja" + beach
                placeName.split(" ")[0] // Doar primul cuvânt (ultimă opțiune)
            };
            
            Map<?, ?> placeData = null;
            String foundPlaceId = null;
            String foundName = "";
            
            // Încearcă fiecare strategie până găsește rezultate
            for (int strategyIndex = 0; strategyIndex < searchStrategies.length; strategyIndex++) {
                String searchQuery = searchStrategies[strategyIndex];
                log.info("🎯 STRATEGY " + (strategyIndex + 1) + ": " + searchQuery);
                
                try {
                    String placeSearchUrl = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json";
                    String searchRequestUrl = placeSearchUrl + "?input=" + searchQuery.replace(" ", "%20") 
                        + "&inputtype=textquery&fields=place_id,name,formatted_address,types&key=" + googleApiKey;
                    
                    log.info("🌐 REQUEST: " + searchRequestUrl);
                    
                    Map<?, ?> placeSearchResponse = restTemplate.getForObject(searchRequestUrl, Map.class);
                    List<?> candidates = (List<?>) placeSearchResponse.get("candidates");
                    
                    if (candidates != null && !candidates.isEmpty()) {
                        // Găsește cel mai bun candidat (preferă beach/tourist_attraction)
                        Map<?, ?> bestCandidate = findBestCandidate(candidates, placeName);
                        
                        if (bestCandidate != null) {
                            foundPlaceId = (String) bestCandidate.get("place_id");
                            foundName = (String) bestCandidate.get("name");
                            
                            log.info("✅ FOUND with strategy " + (strategyIndex + 1) + ": " + foundName + " (ID: " + foundPlaceId + ")");
                            
                            // Obține detalii complete
                            placeData = getDetailedPlaceData(foundPlaceId);
                            
                            if (placeData != null) {
                                // Verifică dacă are poze
                                List<?> photos = (List<?>) placeData.get("photos");
                                if (photos != null && !photos.isEmpty()) {
                                    log.info("📸 SUCCESS! Found place with " + photos.size() + " photos");
                                    break; // Stop searching, găsit cu poze
                                } else {
                                    log.info("📸 Found place but no photos, trying next strategy...");
                                    // Continuă să caute cu următoarea strategie
                                }
                            }
                        }
                    } else {
                        log.info("❌ Strategy " + (strategyIndex + 1) + " failed - no candidates");
                    }
                } catch (Exception e) {
                    log.warn("⚠️ Strategy " + (strategyIndex + 1) + " failed: " + e.getMessage());
                }
            }
            
            // Dacă nu găsește nimic, încearcă căutare generică
            if (placeData == null) {
                log.info("🔄 TRYING GENERIC BEACH SEARCH...");
                placeData = searchGenericBeach(placeName);
            }
            
            if (placeData == null) {
                log.error("❌ COMPLETELY FAILED TO FIND: " + placeName);
                return createFallbackData(placeName);
            }

            // Procesează fotografiile cu strategii multiple
            List<String> photos = processPhotosWithFallback(placeData, placeName);

            // Extrage coordonatele pentru meteo
            Map<?, ?> geometry = (Map<?, ?>) placeData.get("geometry");
            Double lat = null, lng = null;
            
            if (geometry != null) {
                Map<?, ?> location = (Map<?, ?>) geometry.get("location");
                if (location != null) {
                    lat = (Double) location.get("lat");
                    lng = (Double) location.get("lng");
                    log.info("📍 COORDINATES: " + lat + ", " + lng);
                }
            }

            // Obține meteo
            Map<String, Object> weather = getWeatherData(lat, lng);

            // Structurează rezultatul final cu fallback values
            Map<String, Object> result = new HashMap<>();
            result.put("name", placeData.get("name"));
            result.put("address", placeData.get("formatted_address"));
            
            // Rating cu fallback din reviews
            Object rating = placeData.get("rating");
            if (rating == null) {
                // Calculează rating din reviews dacă nu există
                List<?> reviews = (List<?>) placeData.get("reviews");
                if (reviews != null && !reviews.isEmpty()) {
                    double avgRating = reviews.stream()
                        .mapToDouble(review -> {
                            Object reviewRating = ((Map<?, ?>) review).get("rating");
                            return reviewRating != null ? ((Number) reviewRating).doubleValue() : 0.0;
                        })
                        .average()
                        .orElse(0.0);
                    rating = Math.round(avgRating * 10.0) / 10.0; // Round to 1 decimal
                    log.info("📊 CALCULATED RATING from reviews: " + rating);
                }
            }
            result.put("rating", rating != null ? rating : 0.0);
            
            // Phone number cu fallback
            String phoneNumber = (String) placeData.get("formatted_phone_number");
            if (phoneNumber == null || phoneNumber.isEmpty()) {
                phoneNumber = extractPhoneFromReviews((List<?>) placeData.get("reviews"));
            }
            result.put("phone_number", phoneNumber != null ? phoneNumber : "Nespecificat");
            
            result.put("reviews", placeData.get("reviews"));
            result.put("photos", photos);
            result.put("website", placeData.get("website"));
            result.put("weather", weather);

            Map<?, ?> openingHours = (Map<?, ?>) placeData.get("opening_hours");
            result.put("opening_hours", openingHours != null ? openingHours.get("weekday_text") : null);

            log.info("✅ FINAL RESULT: " + result.keySet());
            log.info("📸 FINAL PHOTOS COUNT: " + photos.size());
            log.info("⭐ FINAL RATING: " + result.get("rating"));
            log.info("📞 FINAL PHONE: " + result.get("phone_number"));
            
            return result;
            
        } catch (Exception e) {
            log.error("❌ EXCEPTION in getPlaceDetails for: " + placeName, e);
            return createFallbackData(placeName);
        }
    }
    
    private Map<?, ?> findBestCandidate(List<?> candidates, String originalName) {
        log.info("🎯 EVALUATING " + candidates.size() + " CANDIDATES");
        
        for (Object candidate : candidates) {
            Map<?, ?> candidateMap = (Map<?, ?>) candidate;
            List<?> types = (List<?>) candidateMap.get("types");
            String name = (String) candidateMap.get("name");
            
            log.info("🏖️ CANDIDATE: " + name + " | TYPES: " + types);
            
            // Preferă locațiile care sunt beach, tourist_attraction, sau establishment
            if (types != null) {
                for (Object type : types) {
                    String typeStr = (String) type;
                    if (typeStr.contains("beach") || 
                        typeStr.contains("tourist_attraction") || 
                        typeStr.contains("lodging") ||
                        typeStr.contains("establishment")) {
                        log.info("✅ PREFERRED TYPE FOUND: " + typeStr);
                        return candidateMap;
                    }
                }
            }
        }
        
        // Dacă nu găsește tipuri preferate, returnează primul
        log.info("🔄 Using first candidate as fallback");
        return (Map<?, ?>) candidates.get(0);
    }
    
    private Map<?, ?> getDetailedPlaceData(String placeId) {
        try {
            String placeDetailsUrl = "https://maps.googleapis.com/maps/api/place/details/json";
            String detailsRequestUrl = placeDetailsUrl + "?place_id=" + placeId 
                + "&fields=name,rating,reviews,formatted_address,photos,geometry,formatted_phone_number,opening_hours,website,types"
                + "&key=" + googleApiKey;
            
            log.info("🌐 DETAILS REQUEST: " + detailsRequestUrl);

            Map<?, ?> placeDetailsResponse = restTemplate.getForObject(detailsRequestUrl, Map.class);
            Map<?, ?> result = (Map<?, ?>) placeDetailsResponse.get("result");
            
            if (result != null) {
                log.info("✅ DETAILS LOADED for: " + result.get("name"));
            }
            
            return result;
        } catch (Exception e) {
            log.error("❌ Failed to get place details: " + e.getMessage());
            return null;
        }
    }
    
    private Map<?, ?> searchGenericBeach(String originalName) {
        try {
            log.info("🏖️ GENERIC BEACH SEARCH");
            
            // Încearcă căutări generice pentru plaje
            String[] genericQueries = {
                "beach Romania",
                "plajă România", 
                "Black Sea beach",
                "Marea Neagră plajă"
            };
            
            for (String query : genericQueries) {
                log.info("🔍 GENERIC QUERY: " + query);
                
                String searchUrl = "https://maps.googleapis.com/maps/api/place/textsearch/json" +
                    "?query=" + query.replace(" ", "%20") + 
                    "&type=tourist_attraction" +
                    "&key=" + googleApiKey;
                
                Map<?, ?> response = restTemplate.getForObject(searchUrl, Map.class);
                List<?> results = (List<?>) response.get("results");
                
                if (results != null && !results.isEmpty()) {
                    // Ia primul rezultat care are poze
                    for (Object result : results) {
                        Map<?, ?> place = (Map<?, ?>) result;
                        List<?> photos = (List<?>) place.get("photos");
                        
                        if (photos != null && !photos.isEmpty()) {
                            log.info("🎯 FOUND GENERIC BEACH WITH PHOTOS: " + place.get("name"));
                            return place;
                        }
                    }
                }
            }
        } catch (Exception e) {
            log.warn("⚠️ Generic search failed: " + e.getMessage());
        }
        
        return null;
    }
    
    private List<String> processPhotosWithFallback(Map<?, ?> placeData, String placeName) {
        List<String> photos = new ArrayList<>();
        List<?> photoList = (List<?>) placeData.get("photos");
        
        if (photoList != null && !photoList.isEmpty()) {
            log.info("📸 PROCESSING " + photoList.size() + " PHOTOS");
            
            for (int i = 0; i < Math.min(photoList.size(), 5); i++) {
                Object photo = photoList.get(i);
                Map<?, ?> photoMap = (Map<?, ?>) photo;
                String photoReference = (String) photoMap.get("photo_reference");
                
                if (photoReference != null) {
                    String photoUrl = String.format(
                        "https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photoreference=%s&key=%s",
                        photoReference, googleApiKey
                    );
                    photos.add(photoUrl);
                    log.info("📸 PHOTO " + (i+1) + ": " + photoUrl);
                }
            }
        } else {
            log.warn("📸 NO PHOTOS FOUND, trying fallback images...");
            photos.addAll(getFallbackImages(placeName));
            
            // Forțează adăugarea de imagini dacă nu găsește nimic
            if (photos.isEmpty()) {
                log.warn("🖼️ FORCE ADDING FALLBACK IMAGES");
                photos.addAll(List.of(
                    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop&crop=center&auto=format",
                    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop&crop=center&auto=format"
                ));
            }
        }
        
        return photos;
    }
    
    private List<String> getFallbackImages(String placeName) {
        log.info("🖼️ GENERATING FALLBACK IMAGES for: " + placeName);
        
        // Imagini specifice pentru plaje românești
        List<String> romanianBeachImages = List.of(
            "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop&crop=center&auto=format", // Generic beach
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop&crop=center&auto=format", // Beach chairs
            "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop&crop=center&auto=format", // Beach umbrella
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&crop=center&auto=format", // Beach resort
            "https://images.unsplash.com/photo-1520637836862-4d197d17c90a?w=600&h=400&fit=crop&crop=center&auto=format"  // Seaside
        );
        
        // Dacă numele conține "Mamaia", "Constanta", etc., folosește prima imagine
        if (placeName.toLowerCase().contains("mamaia") || 
            placeName.toLowerCase().contains("constanta") || 
            placeName.toLowerCase().contains("neptun")) {
            log.info("🏖️ Using Romanian beach-specific image");
            return List.of(romanianBeachImages.get(0), romanianBeachImages.get(1));
        }
        
        // Pentru alte plaje, folosește imagini generice
        log.info("🌊 Using generic beach images");
        return List.of(romanianBeachImages.get(2), romanianBeachImages.get(3));
    }
    
    private Map<String, Object> getWeatherData(Double lat, Double lng) {
        Map<String, Object> weather = new HashMap<>();
        
        if (lat != null && lng != null) {
            try {
                String weatherUrl = "https://api.openweathermap.org/data/2.5/weather" +
                    "?lat=" + lat + "&lon=" + lng + "&appid=" + weatherApiKey + "&units=metric";
                
                log.info("🌤️ WEATHER REQUEST: " + weatherUrl);
                Map<?, ?> weatherResponse = restTemplate.getForObject(weatherUrl, Map.class);
                
                if (weatherResponse != null) {
                    Map<?, ?> main = (Map<?, ?>) weatherResponse.get("main");
                    Map<?, ?> wind = (Map<?, ?>) weatherResponse.get("wind");
                    List<?> weatherList = (List<?>) weatherResponse.get("weather");
                    
                    if (main != null) {
                        weather.put("temperature", main.get("temp"));
                        weather.put("humidity", main.get("humidity"));
                    }
                    if (wind != null) {
                        weather.put("wind_speed", wind.get("speed"));
                    }
                    if (weatherList != null && !weatherList.isEmpty()) {
                        Map<?, ?> weatherInfo = (Map<?, ?>) weatherList.get(0);
                        weather.put("description", weatherInfo.get("description"));
                    }
                    log.info("🌤️ WEATHER LOADED: " + weather.get("temperature") + "°C");
                }
            } catch (Exception e) {
                log.warn("⚠️ WEATHER FAILED: " + e.getMessage());
            }
        }
        
        return weather;
    }
    
    private String extractCityFromAddress(String placeName) {
        // Extrage orașul din nume pentru căutări mai precise
        if (placeName.toLowerCase().contains("constanta") || placeName.toLowerCase().contains("constanța")) {
            return "Constanta";
        }
        if (placeName.toLowerCase().contains("mamaia")) {
            return "Mamaia";
        }
        if (placeName.toLowerCase().contains("eforie")) {
            return "Eforie";
        }
        if (placeName.toLowerCase().contains("neptun")) {
            return "Neptun";
        }
        if (placeName.toLowerCase().contains("olimp")) {
            return "Olimp";
        }
        return "Romania"; // Fallback
    }
    
    private String extractPhoneFromReviews(List<?> reviews) {
        if (reviews == null) return null;
        
        // Caută numere de telefon în text-ul review-urilor
        String phonePattern = "\\+?[0-9\\s\\-\\.\\(\\)]{10,}";
        
        for (Object review : reviews) {
            String text = (String) ((Map<?, ?>) review).get("text");
            if (text != null) {
                java.util.regex.Pattern pattern = java.util.regex.Pattern.compile(phonePattern);
                java.util.regex.Matcher matcher = pattern.matcher(text);
                if (matcher.find()) {
                    String phone = matcher.group().trim();
                    log.info("📞 EXTRACTED PHONE from reviews: " + phone);
                    return phone;
                }
            }
        }
        
        return null;
    }
    
    private Map<String, Object> createFallbackData(String placeName) {
        log.info("🔄 CREATING FALLBACK DATA for: " + placeName);
        
        Map<String, Object> fallback = new HashMap<>();
        fallback.put("name", placeName);
        fallback.put("address", "Adresă necunoscută");
        fallback.put("phone_number", "Nespecificat");
        fallback.put("rating", 0.0);
        fallback.put("reviews", new ArrayList<>());
        fallback.put("photos", new ArrayList<>());
        fallback.put("website", null);
        fallback.put("weather", new HashMap<>());
        fallback.put("opening_hours", null);
        
        return fallback;
    }
}