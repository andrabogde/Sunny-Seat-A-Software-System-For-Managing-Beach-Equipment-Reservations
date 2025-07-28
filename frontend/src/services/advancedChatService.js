import Fuse from 'fuse.js';

/**
 * ChatService Avansat - cu Fuse.js pentru căutare fuzzy și răspunsuri personalizate
 */

// Răspunsuri predefinite pentru diferite intenții
const RASPUNSURI_PREDEFINITE = [
  {
    question: "salut",
    reply: "Bună! Sunt asistentul virtual SunnySeat. Cu ce te pot ajuta astăzi?",
    category: "greeting"
  },

  {
    question: "bună ziua",
    reply: "Bună ziua! Sunt aici să te ajut cu rezervarea șezlongurilor pe litoral.",
    category: "greeting"
  },
  {
    question: "hello",
    reply: "Hello! I'm SunnySeat virtual assistant. How can I help you today?",
    category: "greeting"
  },
  {
    question: "cum pot rezerva un șezlong",
    reply: "Pentru a rezerva un șezlong, poți accesa pagina cu plajele disponibile și să alegi locația dorită. Apoi selectezi data și șezlongurile pe care le dorești.",
    category: "booking"
  },
  {
    question: "vreau să rezerv un șezlong",
    reply: "Perfect! Te voi redirecționa către pagina cu plajele disponibile unde poți face rezervarea.",
    category: "booking",
    action: "redirect",
    url: "/plaje"
  },
  {
    question: "ce plaje aveți disponibile",
    reply: "Avem șezlonguri disponibile pe următoarele plaje: Mamaia, Eforie Nord, Costinești, Neptun și Jupiter. Fiecare oferă facilități diferite.",
    category: "beaches"
  },
  {
    question: "plaje litoral",
    reply: "Pe litoralul românesc acoperim principalele stațiuni: Mamaia, Eforie Nord, Costinești, Neptun și Jupiter. Îți pot arăta toate opțiunile disponibile.",
    category: "beaches",
    action: "redirect", 
    url: "/plaje"
  },
  {
    question: "cât costă un șezlong",
    reply: "Prețurile pentru șezlonguri încep de la 30 RON/zi și variază în funcție de locație și sezon. Avem și pachete cu reduceri pentru mai multe zile.",
    category: "prices"
  },
  {
    question: "prețuri șezlonguri",
    reply: "Prețurile variază între 30-80 RON/zi în funcție de plajă și facilitățile oferite. Verifică ofertele speciale pentru reduceri suplimentare!",
    category: "prices"
  },
  {
    question: "oferte speciale",
    reply: "Avem oferte last-minute cu reduceri de până la 50%! Acestea se actualizează la fiecare oră cu plaje noi.",
    category: "offers",
    action: "redirect",
    url: "/oferte"
  },
  {
    question: "reduceri promoții",
    reply: "Momentan avem oferte speciale care se schimbă la fiecare oră. Îți arăt ofertele curente disponibile!",
    category: "offers",
    action: "redirect",
    url: "/oferte"
  },
  {
    question: "cum pot anula o rezervare",
    reply: "Anulările cu cel puțin 24h înainte sunt gratuite. Acceseaza Rezervarile Mele pentru a anula o rezervare.",
    category: "cancel",
    action: "redirect",
    url: "/rezervari"
  },
  {
    question: "anulare rezervare",
    reply: "Anularea se poate face cu până la 24 de ore înainte fără costuri suplimentare. Intra in Rezervarile Mele pentru a anula o rezervare.",
    category: "cancel",
    action: "redirect",
    url: "/rezervari"
  },
  {
    question: "modificare rezervare",
    reply: "Modificarea se poate face cu până la 24 de ore inainte fără costuri suplimentare. Intra in Rezervarile Mele pentru a modifica o rezervare.",
    category: "cancel",
    action: "redirect",
    url: "/rezervari"
  },
  {
    question: "ce facilități aveți",
    reply: "Facilitățile variază pe fiecare plajă, dar includ: restaurant, bar, duș, WiFi, salvare, parcare, animație. Fiecare plajă are specificațiile ei.",
    category: "facilities"
  },
  {
    question: "restaurant bar plajă",
    reply: "Majoritatea plajelor noastre au restaurant și bar. Poți vedea facilitățile specifice pentru fiecare plajă în pagina de detalii.",
    category: "facilities"
  },
  {
    question: "cum funcționează platforma",
    reply: "Platforma SunnySeat îți permite să rezervi șezlonguri pe litoralul românesc. Alegi plaja, data, selectezi locurile și plătești online. Simplu și rapid!",
    category: "help"
  },
  {
    question: "ajutor help",
    reply: "Îți pot oferi ajutor cu: rezervarea șezlongurilor, informații despre plaje, verificarea disponibilității, prețuri și anulări. Cu ce te ajut?",
    category: "help"
  },
  {
    question: "mulțumesc",
    reply: "Cu plăcere! Dacă mai ai întrebări, sunt aici să te ajut. Distracție plăcută pe plajă!",
    category: "thanks"
  },
  {
    question: "mersi thank you",
    reply: "Cu drag! Sper că vei avea o experiență minunată pe litoral!",
    category: "thanks"
  },
  {
    question: "program orar plaje",
    reply: "Plajele sunt deschise în general între orele 8:00-20:00, dar programul poate varia. Verifică detaliile specifice pentru fiecare plajă.",
    category: "schedule"
  },
  {
    question: "contact telefon",
    reply: "Pentru suport suplimentar, ne poți contacta la numărul de telefon afișat în secțiunea 'Despre Noi' sau prin chat-ul nostru.",
    category: "contact"
  }
];

// Configurarea Fuse.js pentru căutare fuzzy
const fuseOptions = {
  keys: ['question'],
  threshold: 0.4, // Cât de strictă să fie căutarea (0 = exact, 1 = foarte permisiv)
  distance: 100,
  minMatchCharLength: 3,
  includeScore: true,
  findAllMatches: true,
  ignoreLocation: true         

};

class AdvancedChatService {
  constructor() {
    this.fuse = new Fuse(RASPUNSURI_PREDEFINITE, fuseOptions);
    this.conversationHistory = [];
  }

  /**
   * Personalizează răspunsurile în funcție de utilizator și context
   * @param {Object} user - Datele utilizatorului 
   * @param {Array} responses - Răspunsurile de personalizat
   * @returns {Array} - Răspunsurile personalizate
   */
  personalizeResponses(user = null, responses = RASPUNSURI_PREDEFINITE) {
    const personalizedResponses = [...responses];
    
    if (user) {
      // Extrage numele real al utilizatorului
      const userName = user.prenume || user.firstName || user.name || '';
      const fullName = userName && user.nume ? `${userName} ${user.nume}` : userName;
      
      // Personalizează mesajele de salut
      personalizedResponses.forEach(response => {
        if (response.category === 'greeting' && userName) {
          response.reply = response.reply.replace(
            'astăzi?', 
            `astăzi, ${userName}?`
          );
        }
        
        if (response.category === 'thanks' && userName) {
          response.reply = response.reply.replace(
            'Cu plăcere!', 
            `Cu plăcere, ${userName}!`
          );
        }
      });

      // Adaugă răspunsuri specifice pentru utilizatori autentificați
      if (user.isAuthenticated) {
        personalizedResponses.push({
          question: "rezervările mele",
          reply: `${userName ? userName + ', ' : ''}îți pot arăta rezervările tale. Te redirectionez către pagina cu rezervările tale.`,
          category: "user_bookings",
          action: "redirect",
          url: "/rezervari"
        });

        personalizedResponses.push({
          question: "contul meu profil",
          reply: `${userName ? userName + ', ' : ''}te duc la pagina cu profilul tău unde poți vedea și modifica datele personale.`,
          category: "user_profile", 
          action: "redirect",
          url: "/profil"
        });
      }
    }

    return personalizedResponses;
  }

  /**
   * Procesează un mesaj și returnează răspunsul potrivit
   * @param {string} message - Mesajul utilizatorului
   * @param {Object} user - Datele utilizatorului (opțional)
   * @returns {Object} - Răspunsul cu mesaj și acțiuni
   */
  processMessage(message, user = null) {
    // Personalizează răspunsurile pentru utilizatorul curent
    const personalizedResponses = this.personalizeResponses(user);
    
    // Actualizează Fuse cu răspunsurile personalizate
    this.fuse = new Fuse(personalizedResponses, fuseOptions);
    
    // Caută cel mai potrivit răspuns
    const results = this.fuse.search(message.toLowerCase().trim());
    
    // Salvează în istoricul conversației
    this.conversationHistory.push({
      type: 'user',
      message: message,
      timestamp: new Date()
    });

    let response;
    
    if (results.length > 0 && results[0].score < 0.6) {
      // Am găsit un răspuns potrivit
      const bestMatch = results[0].item;
      response = {
        message: bestMatch.reply,
        action: bestMatch.action || null,
        url: bestMatch.url || null,
        category: bestMatch.category,
        confidence: (1 - results[0].score) * 100 // Convertește scorul în procent de încredere
      };
    } else {
      // Nu am găsit un răspuns potrivit
      const userName = user && (user.prenume || user.firstName || user.name) ? 
        (user.prenume || user.firstName || user.name) : '';
      
      response = {
        message: `Îmi pare rău, nu am înțeles exact întrebarea ta${userName ? ', ' + userName : ''}. Poți încerca să reformulezi sau să alegi una din opțiunile populare: rezervare, plaje disponibile, prețuri.`,
        action: "show_options",
        category: "unknown",
        confidence: 0
      };
    }

    // Adaugă butoane cu opțiuni rapide
    response.buttons = this.generateQuickOptions(response.category, user);
    
    // Salvează răspunsul în istoric
    this.conversationHistory.push({
      type: 'bot',
      message: response.message,
      category: response.category,
      timestamp: new Date()
    });

    return response;
  }

  /**
   * Generează opțiuni rapide bazate pe categoria răspunsului
   * @param {string} category - Categoria răspunsului
   * @param {Object} user - Datele utilizatorului
   * @returns {Array} - Lista de butoane
   */
  generateQuickOptions(category, user = null) {
    const baseOptions = [
      { text: "🏖️ Vezi plajele", action: "redirect", url: "/plaje" },
      { text: "💰 Oferte speciale", action: "redirect", url: "/oferte" },
      { text: "❓ Ajutor", action: "show_help" }
    ];

    if (user && user.isAuthenticated) {
      baseOptions.push(
        { text: "📋 Rezervările mele", action: "redirect", url: "/rezervari" }
      );
    }

    switch(category) {
      case 'greeting':
        return [
          { text: "🏖️ Vreau să rezerv", action: "redirect", url: "/plaje" },
          { text: "💰 Vezi ofertele", action: "redirect", url: "/oferte" },
          { text: "📍 Plaje disponibile", action: "redirect", url: "/plaje" }
        ];
      
      case 'booking':
        return [
          { text: "🏖️ Mergi la plaje", action: "redirect", url: "/plaje" },
          { text: "💰 Vezi ofertele", action: "redirect", url: "/oferte" }
        ];
      
      case 'unknown':
        return baseOptions;
      
      default:
        return [
          { text: "🔙 Înapoi la meniu", action: "show_main_menu" }
        ];
    }
  }

  /**
   * Returnează mesajul de întâmpinare personalizat
   * @param {Object} user - Datele utilizatorului
   * @returns {Object} - Mesajul de salut cu butoane
   */
  getGreeting(user = null) {
    // Extrage numele real al utilizatorului
    const userName = user && (user.prenume || user.firstName || user.name) ? 
      (user.prenume || user.firstName || user.name) : '';
    
    const greeting = {
      message: `Bună${userName ? ', ' + userName : ''}! Sunt asistentul virtual SunnySeat. 🏖️\nCu ce te pot ajuta astăzi?`,
      category: 'greeting',
      buttons: this.generateQuickOptions('greeting', user)
    };

    // Salvează în istoric
    this.conversationHistory.push({
      type: 'bot',
      message: greeting.message,
      category: 'greeting',
      timestamp: new Date()
    });

    return greeting;
  }

  /**
   * Returnează istoricul conversației
   * @returns {Array} - Istoricul mesajelor
   */
  getConversationHistory() {
    return this.conversationHistory;
  }

  
  clearHistory() {
    this.conversationHistory = [];
  }

  /**
   * Adaugă răspunsuri noi în baza de cunoștințe
   * @param {Array} newResponses - Răspunsuri noi
   */
  addResponses(newResponses) {
    RASPUNSURI_PREDEFINITE.push(...newResponses);
    this.fuse = new Fuse(RASPUNSURI_PREDEFINITE, fuseOptions);
  }

  /**
   * Obține sugestii de întrebări bazate pe istoricul conversației
   * @returns {Array} - Sugestii de întrebări
   */
  getSuggestions() {
    const commonQuestions = [
      "Cum pot rezerva un șezlong?",
      "Ce plaje aveți disponibile?",
      "Cât costă un șezlong?",
      "Aveți oferte speciale?",
      "Cum pot anula o rezervare?"
    ];

    return commonQuestions.map(question => ({
      text: question,
      action: "ask_question",
      question: question
    }));
  }
}

// Creează instanța singleton
const advancedChatService = new AdvancedChatService();

export default advancedChatService;