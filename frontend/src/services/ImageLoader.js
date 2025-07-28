/**
 * Serviciu FOARTE SIMPLU pentru extragerea pozelor din Google Places
 * Salvează URL-uri finale care funcționează direct în browser
 */

// API Key Google (pune-l în .env)
const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'AIzaSyAFx94qZOmhNHRgEm17hh9C83bP_xXEwFI';

// Fallback images pentru când nu găsim nimic pe Google
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1501436513145-30f24e19fcc4?w=800&h=600&fit=crop&auto=format&q=80'
];

/**
 * 1. Caută plaja în Google Places
 */
async function searchGooglePlace(plajaName, statiune = '') {
  const query = `${plajaName} plaja ${statiune} Romania`;
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}`;
  
  try {
    console.log(`🔍 Caut: "${query}"`);
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const place = data.results[0];
      console.log(`✅ Găsit place_id: ${place.place_id}`);
      return place.place_id;
    }
    
    console.log(`❌ Nu s-a găsit nimic pentru: ${plajaName}`);
    return null;
    
  } catch (error) {
    console.error(`❌ Eroare la căutare: ${error.message}`);
    return null;
  }
}

/**
 * 2. Obține detalii și photos pentru un place_id
 */
async function getPlacePhotos(placeId) {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos,rating,user_ratings_total&key=${GOOGLE_API_KEY}`;
  
  try {
    console.log(`📸 Obțin photos pentru place_id: ${placeId}`);
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.result && data.result.photos && data.result.photos.length > 0) {
      console.log(`✅ Găsite ${data.result.photos.length} photos`);
      return {
        photos: data.result.photos,
        rating: data.result.rating,
        user_ratings_total: data.result.user_ratings_total
      };
    }
    
    console.log(`❌ Nu s-au găsit photos pentru place_id: ${placeId}`);
    return null;
    
  } catch (error) {
    console.error(`❌ Eroare la obținerea photos: ${error.message}`);
    return null;
  }
}

/**
 * 3. Construiește URL-ul final pentru o poză Google
 */
function buildPhotoUrl(photoReference, width = 800) {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${width}&photoreference=${photoReference}&key=${GOOGLE_API_KEY}`;
}

/**
 * 4. Testează dacă o imagine se încarcă (cu proxy pentru CORS)
 */
async function testImageWithProxy(imageUrl) {
  const proxies = [
    `https://api.allorigins.win/raw?url=${encodeURIComponent(imageUrl)}`,
    `https://corsproxy.io/?${encodeURIComponent(imageUrl)}`,
    imageUrl // Încearcă și direct
  ];
  
  for (const proxyUrl of proxies) {
    try {
      const response = await fetch(proxyUrl, { 
        method: 'HEAD',
        timeout: 3000 
      });
      
      if (response.ok) {
        console.log(`✅ Imaginea funcționează cu: ${proxyUrl.includes('allorigins') ? 'AllOrigins' : proxyUrl.includes('corsproxy') ? 'CorsProxy' : 'Direct'}`);
        return proxyUrl;
      }
    } catch (error) {
      console.log(`❌ Proxy failed: ${proxyUrl.substring(0, 50)}...`);
      continue;
    }
  }
  
  return null;
}

/**
 * 5. Procesează o plajă completă
 */
async function processPlajaPhotos(plaja) {
  console.log(`\n🏖️ Procesez: ${plaja.denumire}`);
  
  try {
    // Pas 1: Caută în Google Places
    const placeId = await searchGooglePlace(plaja.denumire, plaja.statiune?.denumire);
    if (!placeId) {
      return getFallbackImage(plaja);
    }
    
    // Pas 2: Obține photos
    const placeData = await getPlacePhotos(placeId);
    if (!placeData || !placeData.photos || placeData.photos.length === 0) {
      return getFallbackImage(plaja);
    }
    
    // Pas 3: Încearcă prima imagine
    const firstPhoto = placeData.photos[0];
    const googleUrl = buildPhotoUrl(firstPhoto.photo_reference);
    
    // Pas 4: Testează cu proxy
    const workingUrl = await testImageWithProxy(googleUrl);
    
    if (workingUrl) {
      console.log(`✅ SUCCESS: Imagine reală găsită pentru ${plaja.denumire}`);
      return {
        profileImage: workingUrl,
        isReal: true,
        source: 'google_places',
        place_id: placeId,
        photo_reference: firstPhoto.photo_reference,
        rating: placeData.rating,
        total_photos: placeData.photos.length,
        processedAt: new Date().toISOString()
      };
    } else {
      console.log(`❌ Imaginea Google nu funcționează pentru ${plaja.denumire}`);
      return getFallbackImage(plaja);
    }
    
  } catch (error) {
    console.error(`❌ Eroare la procesarea ${plaja.denumire}: ${error.message}`);
    return getFallbackImage(plaja);
  }
}

/**
 * 6. Returnează imagine fallback
 */
function getFallbackImage(plaja) {
  const randomIndex = Math.floor(Math.random() * FALLBACK_IMAGES.length);
  
  return {
    profileImage: FALLBACK_IMAGES[randomIndex],
    isReal: false,
    source: 'fallback',
    fallbackIndex: randomIndex,
    processedAt: new Date().toISOString()
  };
}

/**
 * 7. Procesează lista completă de plaje
 */
async function processAllPlaje(plaje) {
  console.log(`🚀 Încep procesarea pentru ${plaje.length} plaje...\n`);
  
  const updatedPlaje = [];
  
  for (let i = 0; i < plaje.length; i++) {
    const plaja = plaje[i];
    console.log(`📊 Progres: ${i + 1}/${plaje.length}`);
    
    // Procesează plaja
    const photoData = await processPlajaPhotos(plaja);
    
    // Actualizează plaja cu datele noi
    const updatedPlaja = {
      ...plaja,
      ...photoData
    };
    
    updatedPlaje.push(updatedPlaja);
    
    // Pauză pentru a nu supraîncărca API-ul Google
    if (i < plaje.length - 1) {
      console.log('⏳ Pauză 1 secundă...');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  // Afișează statistici finale
  const realImages = updatedPlaje.filter(p => p.isReal).length;
  const fallbackImages = updatedPlaje.filter(p => !p.isReal).length;
  
  console.log(`\n📈 REZULTATE FINALE:`);
  console.log(`✅ Imagini reale Google: ${realImages}/${plaje.length} (${((realImages/plaje.length)*100).toFixed(1)}%)`);
  console.log(`⚠️ Imagini fallback: ${fallbackImages}/${plaje.length} (${((fallbackImages/plaje.length)*100).toFixed(1)}%)`);
  
  return updatedPlaje;
}

/**
 * 8. Salvează rezultatele în JSON
 */
async function saveToJson(plaje, filename = 'plaje-updated.json') {
  try {
    const jsonData = JSON.stringify(plaje, null, 2);
    
    // În browser, descarcă fișierul
    if (typeof window !== 'undefined') {
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      console.log(`💾 Fișier descărcat: ${filename}`);
    }
    // În Node.js, salvează pe disk
    else {
      const fs = require('fs').promises;
      await fs.writeFile(filename, jsonData);
      console.log(`💾 Fișier salvat: ${filename}`);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Eroare la salvare:', error);
    return false;
  }
}

/**
 * 9. Funcție principală - rulează tot procesul
 */
async function runPhotoExtraction(plaje) {
  console.log('🎯 ÎNCEPE EXTRAGEREA POZELOR DIN GOOGLE PLACES\n');
  
  const startTime = Date.now();
  
  try {
    // Procesează toate plajele
    const updatedPlaje = await processAllPlaje(plaje);
    
    // Salvează rezultatele
    const saved = await saveToJson(updatedPlaje);
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\n🎉 FINALIZAT în ${duration} secunde!`);
    
    if (saved) {
      console.log('📁 Rezultatele au fost salvate în JSON');
    }
    
    return updatedPlaje;
    
  } catch (error) {
    console.error('❌ EROARE GENERALĂ:', error);
    return plaje;
  }
}

// Export pentru utilizare
if (typeof module !== 'undefined') {
  module.exports = {
    runPhotoExtraction,
    processAllPlaje,
    processPlajaPhotos,
    saveToJson
  };
}

// Pentru browser - expune funcțiile global
if (typeof window !== 'undefined') {
  window.PhotoExtractor = {
    runPhotoExtraction,
    processAllPlaje,
    processPlajaPhotos,
    saveToJson
  };
}

/**
 * EXEMPLU DE UTILIZARE:
 * 
 * // În browser sau Node.js
 * const plaje = [
 *   {
 *     id: 1,
 *     denumire: "Plaja Mamaia",
 *     statiune: { denumire: "Mamaia" }
 *   },
 *   // ... alte plaje
 * ];
 * 
 * // Rulează extragerea
 * const updatedPlaje = await runPhotoExtraction(plaje);
 * 
 * // Rezultatul va conține:
 * // {
 * //   id: 1,
 * //   denumire: "Plaja Mamaia",
 * //   profileImage: "https://...",  // URL-ul final
 * //   isReal: true,
 * //   source: "google_places",
 * //   rating: 4.5
 * // }
 */