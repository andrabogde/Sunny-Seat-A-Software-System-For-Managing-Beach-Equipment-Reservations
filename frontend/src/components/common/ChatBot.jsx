import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconSend, IconX, IconMessageCircle, IconRobot, IconUser, IconBrain } from '@tabler/icons-react';
import advancedChatService from '../../services/advancedChatService';
import { AuthContext } from '../../contexts/AuthContext';


// Definim culorile personalizate (păstrate din codul original)
const colors = {
  primary: '#3498db',     // Albastru
  secondary: '#2ecc71',   // Verde
  accent: '#f39c12',      // Portocaliu
  turquoise: '#20c997',   // Turcoaz
  dark: '#2c3e50',        // Albastru închis
  light: '#ecf0f1'        // Gri deschis
};

// Componenta pentru afișarea mesajelor cu confidence score
const MessageWithConfidence = ({ message, confidence }) => {
  const getConfidenceColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning'; 
    return 'secondary';
  };

  const getConfidenceText = (score) => {
    if (score >= 80) return 'Răspuns sigur';
    if (score >= 60) return 'Răspuns probabil';
    return 'Răspuns aproximativ';
  };

  return (
    <div className="message-content">
      {message}
      {confidence > 0 && (
        <div className="mt-2">
          <small className={`badge bg-${getConfidenceColor(confidence)} opacity-75`}>
            <IconBrain size={12} className="me-1" />
            {getConfidenceText(confidence)} ({Math.round(confidence)}%)
          </small>
        </div>
      )}
    </div>
  );
};

// Componenta pentru butoanele de acțiuni rapide
const QuickActionButtons = ({ buttons, onButtonClick, onAskQuestion }) => {
  if (!buttons || buttons.length === 0) return null;

  return (
    <div className="quick-buttons d-flex flex-wrap gap-2 mt-3">
      {buttons.map((button, index) => (
        <button
          key={index}
          className="btn btn-sm btn-outline-primary"
          onClick={() => {
            if (button.action === 'ask_question') {
              onAskQuestion(button.question);
            } else {
              onButtonClick(button.action, button.url);
            }
          }}
          style={{
            borderRadius: '1rem',
            fontSize: '0.85rem',
            transition: 'all 0.2s ease'
          }}
        >
          {button.text}
        </button>
      ))}
    </div>
  );
};

// Componenta pentru sugestiile de întrebări
const QuestionSuggestions = ({ suggestions, onSelectSuggestion }) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="suggestions-container mt-3">
      <small className="text-muted mb-2 d-block">💡 Întrebări frecvente:</small>
      <div className="d-flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            className="btn btn-sm btn-light border"
            onClick={() => onSelectSuggestion(suggestion.question)}
            style={{
              borderRadius: '1rem',
              fontSize: '0.8rem'
            }}
          >
            {suggestion.text}
          </button>
        ))}
      </div>
    </div>
  );
};

const AdvancedChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef(null);
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Configurează utilizatorul pentru personalizarea răspunsurilor
  const currentUser = isAuthenticated ? {
    ...user,
    isAuthenticated: true
  } : null;

  // Inițializare cu mesajul de întâmpinare personalizat
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting = advancedChatService.getGreeting(currentUser);
      setMessages([{
        id: Date.now(),
        type: 'bot',
        message: greeting.message,
        buttons: greeting.buttons,
        confidence: 100,
        timestamp: new Date()
      }]);
    }
  }, [isOpen, messages.length, currentUser]);

  // Auto-scroll la ultimul mesaj
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handler pentru trimiterea mesajelor
  const handleSendMessage = async (messageText = input) => {
    if (!messageText.trim()) return;

    // Adaugă mesajul utilizatorului
    const userMessage = {
      id: Date.now(),
      type: 'user',
      message: messageText.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setShowSuggestions(false);

    // Procesează mesajul cu serviciul avansat
    setTimeout(() => {
      const response = advancedChatService.processMessage(messageText, currentUser);
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        message: response.message,
        buttons: response.buttons,
        confidence: response.confidence || 0,
        category: response.category,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);

      // Execută acțiunea dacă există
      if (response.action === 'redirect' && response.url) {
        setTimeout(() => {
          navigate(response.url);
          setIsOpen(false);
        }, 1500);
      }
    }, 800 + Math.random() * 400);
  };

  // Handler pentru butoanele de acțiuni rapide
  const handleButtonClick = (action, url) => {
    if (action === 'redirect' && url) {
      navigate(url);
      setIsOpen(false);
    } else if (action === 'show_help') {
      handleSendMessage('ajutor');
    } else if (action === 'show_main_menu') {
      const greeting = advancedChatService.getGreeting(currentUser);
      const botMessage = {
        id: Date.now(),
        type: 'bot',
        message: greeting.message,
        buttons: greeting.buttons,
        confidence: 100,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }
  };

  // Handler pentru întrebările suggerate
  const handleSelectSuggestion = (question) => {
    handleSendMessage(question);
  };

  // Handler pentru întrebările rapide din butoane
  const handleAskQuestion = (question) => {
    handleSendMessage(question);
  };

  // Handler pentru submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage();
  };

  // Formatează ora pentru timestamp
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Toggle minimizare chat
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // Obține sugestiile de întrebări
  const suggestions = advancedChatService.getSuggestions();

  return (
    <>
      {/* Buton pentru deschiderea chatbot-ului */}
      {!isOpen && (
        <button
          className="chat-toggle-btn shadow-lg"
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: colors.turquoise,
            color: 'white',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 1000,
            transition: 'all 0.3s ease'
          }}
        >
          <IconMessageCircle size={24} />
        </button>
      )}
      
      {/* Container chatbot */}
      {isOpen && (
        <div
          className="chat-container shadow-lg"
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            width: '380px',
            height: isMinimized ? '60px' : '550px',
            borderRadius: isMinimized ? '30px' : '1rem',
            backgroundColor: 'white',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
            border: `1px solid ${colors.light}`,
            transition: 'all 0.3s ease',
            boxShadow: '0 5px 25px rgba(0, 0, 0, 0.15)'
          }}
        >
          {/* Header chatbot */}
          <div
            className="chat-header d-flex justify-content-between align-items-center p-3"
            style={{
              backgroundColor: colors.turquoise,
              color: 'white',
              cursor: isMinimized ? 'pointer' : 'default'
            }}
            onClick={isMinimized ? () => setIsMinimized(false) : undefined}
          >
            <div className="d-flex align-items-center">
              <IconRobot size={20} className="me-2" />
              <div>
                <h5 className="m-0">SunnySeat AI</h5>
                <small className="opacity-75">
                  {currentUser ? `Bună, ${currentUser.prenume || 'Utilizator'}!` : 'Asistent virtual'}
                </small>
              </div>
            </div>
            <div className="d-flex gap-2">
              <button
                className="btn btn-sm text-white p-1"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMinimize();
                }}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none'
                }}
              >
                {isMinimized ? 
                  <IconMessageCircle size={20} /> : 
                  <span style={{ fontSize: '1.5rem', lineHeight: '0.6' }}>-</span>
                }
              </button>
              <button
                className="btn btn-sm text-white p-1"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                  advancedChatService.clearHistory();
                }}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none'
                }}
              >
                <IconX size={20} />
              </button>
            </div>
          </div>
          
          {/* Conținut chatbot (ascuns când e minimizat) */}
          {!isMinimized && (
            <>
              {/* Zona de mesaje */}
              <div
                className="chat-messages p-3"
                style={{
                  flexGrow: 1,
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}
              >
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`message ${message.type === 'user' ? 'user-message' : 'bot-message'} mb-3`}
                    style={{
                      alignSelf: message.type === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: '85%'
                    }}
                  >
                    <div className="d-flex align-items-start gap-2">
                      {message.type === 'bot' && (
                        <div className="rounded-circle bg-primary p-1" style={{ minWidth: '32px', height: '32px' }}>
                          <IconRobot size={20} className="text-white" />
                        </div>
                      )}
                      
                      <div className="flex-grow-1">
                        <div
                          className="message-bubble p-3"
                          style={{
                            backgroundColor: message.type === 'user' ? colors.primary : colors.light,
                            color: message.type === 'user' ? 'white' : colors.dark,
                            borderRadius: message.type === 'user' ? '1rem 1rem 0 1rem' : '1rem 1rem 1rem 0',
                            whiteSpace: 'pre-wrap'
                          }}
                        >
                          {message.type === 'bot' ? (
                            <MessageWithConfidence 
                              message={message.message} 
                              confidence={message.confidence} 
                            />
                          ) : (
                            message.message
                          )}
                        </div>
                        
                        {/* Butoane pentru mesajele bot */}
                        {message.type === 'bot' && message.buttons && (
                          <QuickActionButtons 
                            buttons={message.buttons} 
                            onButtonClick={handleButtonClick}
                            onAskQuestion={handleAskQuestion}
                          />
                        )}
                        
                        <div
                          className="message-time text-muted small mt-1"
                          style={{
                            textAlign: message.type === 'user' ? 'right' : 'left',
                            fontSize: '0.7rem'
                          }}
                        >
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                      
                      {message.type === 'user' && (
                        <div className="rounded-circle bg-secondary p-1" style={{ minWidth: '32px', height: '32px' }}>
                          <IconUser size={20} className="text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {/* Indicator "scrie..." */}
                {isTyping && (
                  <div className="typing-indicator mb-3" style={{ alignSelf: 'flex-start' }}>
                    <div className="d-flex align-items-start gap-2">
                      <div className="rounded-circle bg-primary p-1" style={{ minWidth: '32px', height: '32px' }}>
                        <IconRobot size={20} className="text-white" />
                      </div>
                      <div
                        className="p-3"
                        style={{
                          backgroundColor: colors.light,
                          borderRadius: '1rem',
                          width: 'fit-content'
                        }}
                      >
                        <div className="typing-dots">
                          <span className="dot"></span>
                          <span className="dot"></span>
                          <span className="dot"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sugestii de întrebări */}
                {showSuggestions && messages.length <= 1 && !isTyping && (
                  <QuestionSuggestions 
                    suggestions={suggestions}
                    onSelectSuggestion={handleSelectSuggestion}
                  />
                )}
                
                {/* Referință pentru scroll automat */}
                <div ref={messagesEndRef} />
              </div>
              
              {/* Formular trimitere mesaj */}
              <form
                className="chat-input-form p-3 border-top"
                onSubmit={handleSubmit}
                style={{
                  display: 'flex',
                  gap: '0.5rem'
                }}
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Scrie o întrebare sau alege o opțiune..."
                  className="form-control"
                  style={{
                    borderRadius: '1.5rem',
                    border: `1px solid ${colors.light}`,
                    padding: '0.75rem 1rem'
                  }}
                />
                <button
                  type="submit"
                  className="btn"
                  disabled={!input.trim() || isTyping}
                  style={{
                    backgroundColor: colors.turquoise,
                    color: 'white',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <IconSend size={18} />
                </button>
              </form>

              {/* Footer cu informații */}
              <div className="chat-footer px-3 pb-2">
                <small className="text-muted d-flex align-items-center justify-content-center">
                  <IconBrain size={12} className="me-1" />
                  Alimentat de AI • Căutare inteligentă activă
                </small>
              </div>
            </>
          )}
          
          {/* Stiluri pentru animații */}
          <style>
            {`
              /* Animație pentru butonul de chat */
              .chat-toggle-btn:hover {
                transform: scale(1.1);
                box-shadow: 0 10px 20px rgba(0,0,0,0.15);
              }
              
              /* Animație pentru mesaje */
              .message {
                animation: fadeIn 0.3s ease;
              }
              
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
              }
              
              /* Animație pentru indicatorul de typing */
              .typing-dots {
                display: flex;
                gap: 3px;
              }
              
              .dot {
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background-color: ${colors.dark};
                opacity: 0.8;
                display: inline-block;
                animation: bounce 1.4s infinite ease-in-out both;
              }
              
              .dot:nth-child(1) {
                animation-delay: -0.32s;
              }
              
              .dot:nth-child(2) {
                animation-delay: -0.16s;
              }
              
              @keyframes bounce {
                0%, 80%, 100% { transform: scale(0); }
                40% { transform: scale(1); }
              }
              
              /* Stiluri scrollbar */
              .chat-messages::-webkit-scrollbar {
                width: 6px;
              }
              
              .chat-messages::-webkit-scrollbar-track {
                background: transparent;
              }
              
              .chat-messages::-webkit-scrollbar-thumb {
                background-color: rgba(0,0,0,0.2);
                border-radius: 3px;
              }
              
              /* Animație pentru butoanele de sugestii */
              .quick-buttons .btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 3px 8px rgba(0,0,0,0.1);
              }

              .suggestions-container .btn:hover {
                background-color: ${colors.primary} !important;
                color: white !important;
                border-color: ${colors.primary} !important;
              }
              
              /* Stiluri pentru confidence badge */
              .message-content .badge {
                font-size: 0.65rem;
              }
              
              /* Responsive pentru mobile */
              @media (max-width: 768px) {
                .chat-container {
                  width: calc(100vw - 2rem) !important;
                  right: 1rem !important;
                  left: 1rem !important;
                }
                
                .chat-toggle-btn {
                  right: 1rem !important;
                }
              }
            `}
          </style>
        </div>
      )}
    </>
  );
};

export default AdvancedChatBot;