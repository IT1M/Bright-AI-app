import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Animated, 
  Dimensions, 
  Image,
  TextInput,
  Modal,
  ActivityIndicator,
  Platform,
  StatusBar,
  SafeAreaView,
  Linking
} from 'react-native';
import { COLORS, FONTS, SIZES } from './theme.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5 } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

// Get environment variables
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.brightai.com';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

/**
 * Animated particle component for the background effect
 * Creates a floating particle that moves around the screen
 */
const Particle = ({ startPosition, endPosition, duration, delay, size, color }) => {
  const position = useRef(new Animated.ValueXY(startPosition)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(position, {
          toValue: endPosition,
          duration: duration,
          useNativeDriver: false,
        }),
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0.8,
            duration: duration * 0.3,
            useNativeDriver: false,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: duration * 0.7,
            useNativeDriver: false,
          }),
        ]),
      ]),
    ]).start(() => {
      position.setValue(startPosition);
      opacity.setValue(0);
      // Restart animation
      Animated.sequence([
        Animated.delay(Math.random() * 1000),
        Animated.parallel([
          Animated.timing(position, {
            toValue: {
              x: Math.random() * width,
              y: Math.random() * height * 0.5,
            },
            duration: 3000 + Math.random() * 2000,
            useNativeDriver: false,
          }),
          Animated.sequence([
            Animated.timing(opacity, {
              toValue: 0.8,
              duration: 1000,
              useNativeDriver: false,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 2000,
              useNativeDriver: false,
            }),
          ]),
        ]),
      ]).start();
    });
  }, []);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        opacity: opacity,
        transform: [
          { translateX: position.x },
          { translateY: position.y },
        ],
      }}
    />
  );
};

/**
 * Virtual Assistant Component
 * Provides AI-powered chat functionality using Gemini API
 */
const VirtualAssistant = ({ onError }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Sends user message to Gemini API and processes the response
   */
  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);
    
    try {
      // Validate API key
      if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_API_KEY_ENV_VARIABLE_NOT_SET') {
        const errorMsg = "API Key not configured. Please set EXPO_PUBLIC_GEMINI_API_KEY in your .env file.";
        throw new Error(errorMsg);
      }

      // System prompt defining the assistant's role and context
      const systemPrompt = {
        role: 'user', // Treat system prompt as initial user instruction for context
        parts: [{ text: "أنت مساعد افتراضي متخصص في تطبيق Bright AI. مهمتك هي الإجابة على أسئلة المستخدمين حول جميع ميزات وخدمات التطبيق بطريقة احترافية ومفيدة. كن دقيقًا وموجزًا في ردودك. يمكنك الوصول إلى معلومات حول تحليل البيانات، استشارات الذكاء الاصطناعي، الحلول المخصصة، وكيفية التواصل مع الدعم." }]
      };
      
      // Prepare conversation history including the system prompt
      const conversationHistory = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user', // Map roles correctly for API ('model' for assistant)
        parts: [{ text: msg.content }]
      }));

      // Construct the final contents array for the API
      const apiContents = [
        systemPrompt, // Add system prompt first
        ...conversationHistory, // Add existing messages
        { role: 'user', parts: [{ text: input }] } // Add the new user message
      ];
      
      // API endpoint for Gemini 1.5 Pro
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=' + GEMINI_API_KEY, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: apiContents, // Use the modified contents array including the system prompt
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1000,
          },
        }),
      });
      
      // Handle network errors
      if (!response.ok) {
        throw new Error(`Network error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || 'Error communicating with Gemini API');
      }
      
      // Extract the assistant's response
      const assistantResponse = data.candidates[0]?.content?.parts[0]?.text || 'لم أستطع فهم طلبك. هل يمكنك إعادة صياغته؟';
      
      setMessages(prev => [...prev, { role: 'assistant', content: assistantResponse }]);
    } catch (err) {
      console.error('Gemini API Error:', err);
      const errorMessage = err.message || 'حدث خطأ أثناء الاتصال بالمساعد الافتراضي';
      setError(errorMessage);
      if (onError) onError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Clear chat history
  const handleClearChat = () => {
    setMessages([]);
  };

  // Scroll to bottom of messages when new message is added
  const scrollViewRef = useRef();
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (
    <>
      {/* Assistant Icon */}
      <TouchableOpacity 
        style={styles.assistantIcon} 
        onPress={() => setIsOpen(true)}
        activeOpacity={0.7}
      >
        <View style={styles.assistantIconInner}>
          <FontAwesome5 name="robot" size={24} color={COLORS.primary} />
        </View>
      </TouchableOpacity>
      
      {/* Assistant Modal */}
      <Modal
        visible={isOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>المساعد الافتراضي</Text>
              <View style={styles.headerButtons}>
                <TouchableOpacity 
                  onPress={handleClearChat} 
                  style={styles.headerButton}
                  disabled={messages.length === 0}
                >
                  <FontAwesome5 
                    name="trash-alt" 
                    size={16} 
                    color={messages.length === 0 ? COLORS.lightGray : COLORS.accent} 
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setIsOpen(false)} style={styles.headerButton}>
                  <FontAwesome5 name="times" size={18} color={COLORS.accent} />
                </TouchableOpacity>
              </View>
            </View>
            
            <ScrollView 
              style={styles.messagesContainer}
              ref={scrollViewRef}
              contentContainerStyle={styles.messagesContentContainer}
            >
              {messages.length === 0 ? (
                <View style={styles.welcomeMessageContainer}>
                  <FontAwesome5 name="robot" size={40} color={COLORS.primary} style={styles.welcomeIcon} />
                  <Text style={styles.welcomeMessage}>
                    مرحباً! أنا المساعد الافتراضي الخاص بك. كيف يمكنني مساعدتك اليوم؟
                  </Text>
                  <View style={styles.suggestionContainer}>
                    <TouchableOpacity 
                      style={styles.suggestionButton}
                      onPress={() => {
                        setInput('كيف يمكنني استخدام تحليل البيانات في تطبيق Bright AI؟');
                      }}
                    >
                      <Text style={styles.suggestionText}>كيف يمكنني استخدام تحليل البيانات؟</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.suggestionButton}
                      onPress={() => {
                        setInput('ما هي الخدمات التي يقدمها تطبيق Bright AI؟');
                      }}
                    >
                      <Text style={styles.suggestionText}>ما هي الخدمات المتاحة؟</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                messages.map((msg, index) => (
                  <View 
                    key={index} 
                    style={[
                      styles.messageBubble,
                      msg.role === 'user' ? styles.userMessage : styles.assistantMessage
                    ]}
                  >
                    {msg.role === 'assistant' && (
                      <View style={styles.assistantAvatar}>
                        <FontAwesome5 name="robot" size={14} color={COLORS.white} />
                      </View>
                    )}
                    <Text style={[
                      styles.messageText,
                      msg.role === 'user' ? styles.userMessageText : styles.assistantMessageText
                    ]}>
                      {msg.content}
                    </Text>
                  </View>
                ))
              )}
              {isLoading && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color={COLORS.primary} />
                  <Text style={styles.loadingText}>جاري التفكير...</Text>
                </View>
              )}
              {error && (
                <View style={styles.errorContainer}>
                  <FontAwesome5 name="exclamation-circle" size={16} color="#D32F2F" style={styles.errorIcon} />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}
            </ScrollView>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={input}
                onChangeText={setInput}
                placeholder="اكتب سؤالك هنا..."
                placeholderTextColor={COLORS.lightGray}
                multiline
                textAlign="right"
                maxLength={500}
                returnKeyType="send"
                onSubmitEditing={() => input.trim() && handleSend()}
              />
              <TouchableOpacity 
                style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]} 
                onPress={handleSend}
                disabled={!input.trim() || isLoading}
                activeOpacity={0.7}
              >
                <FontAwesome5 
                  name="paper-plane" 
                  size={18} 
                  color={!input.trim() || isLoading ? COLORS.lightGray : COLORS.white} 
                />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
};

/**
 * Main HomeScreen Component
 * Displays the welcome section, features, and virtual assistant
 */
const HomeScreen = () => {
  const [greeting, setGreeting] = useState('');
  const [username, setUsername] = useState('');
  const [visitCount, setVisitCount] = useState(0);
  const [particles, setParticles] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generate particles for the animated background
  useEffect(() => {
    generateParticles();
  }, []);

  // Regenerate particles when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      generateParticles();
      return () => {}; // Cleanup function
    }, [])
  );

  // Generate particles for animation
  const generateParticles = () => {
    const particlesArray = [];
    for (let i = 0; i < 20; i++) {
      particlesArray.push({
        id: i,
        startPosition: {
          x: Math.random() * width,
          y: Math.random() * height * 0.5,
        },
        endPosition: {
          x: Math.random() * width,
          y: Math.random() * height * 0.5,
        },
        duration: 3000 + Math.random() * 2000,
        delay: Math.random() * 2000,
        size: 3 + Math.random() * 5,
        color: i % 3 === 0 ? COLORS.primary : i % 3 === 1 ? COLORS.accent : COLORS.lightGray,
      });
    }
    setParticles(particlesArray);
  };

  // Set greeting based on time of day
  useEffect(() => {
    updateGreeting();
    // Update greeting every hour
    const intervalId = setInterval(updateGreeting, 3600000);
    return () => clearInterval(intervalId);
  }, []);

  const updateGreeting = () => {
    const hour = new Date().getHours();
    let timeGreeting = '';
    
    if (hour >= 5 && hour < 12) {
      timeGreeting = 'صباح الخير';
    } else if (hour >= 12 && hour < 17) {
      timeGreeting = 'مساء الخير';
    } else if (hour >= 17 && hour < 22) {
      timeGreeting = 'مساء النور';
    } else {
      timeGreeting = 'ليلة سعيدة';
    }
    
    setGreeting(timeGreeting);
  };

  // Load user data from AsyncStorage
  useEffect(() => {
    loadUserData();
    fetchNotifications();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const storedUsername = await AsyncStorage.getItem('username');
      const storedVisitCount = await AsyncStorage.getItem('visitCount');
      
      if (storedUsername) {
        setUsername(storedUsername);
      }
      
      const count = storedVisitCount ? parseInt(storedVisitCount, 10) : 0;
      setVisitCount(count + 1);
      
      // Save updated visit count
      await AsyncStorage.setItem('visitCount', (count + 1).toString());
    } catch (error) {
      console.error('Error loading user data:', error);
      setError('فشل في تحميل بيانات المستخدم');
    } finally {
      setLoading(false);
    }
  };

  // Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      // This is a placeholder for actual API call
      // In a real app, you would fetch from your backend
      setNotifications([
        {
          id: '1',
          title: 'تحديث جديد',
          message: 'تم إضافة ميزات جديدة لتحليل البيانات',
          date: new Date().toISOString(),
          read: false
        },
        {
          id: '2',
          title: 'عرض خاص',
          message: 'احصل على استشارة مجانية هذا الأسبوع',
          date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
          read: true
        }
      ]);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Handle button press events
  const handleFreeConsultationPress = () => {
    console.log('Free Consultation button pressed');
    // Navigation logic can be added here later
  };

  const handleDiscoverSolutionsPress = () => {
    console.log('Discover Solutions button pressed');
    // Navigation logic can be added here later
  };

  const handleDataAnalysisPress = () => {
    console.log('Data Analysis button pressed');
    // Navigation to Data Analysis screen
  };

  const handleContactPress = () => {
    Linking.openURL('mailto:support@brightai.com');
  };

  // Handle errors from child components
  const handleError = (errorMessage) => {
    setError(errorMessage);
    // Could show a toast or alert here
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Section with Animated Background */}
        <View style={styles.welcomeSection}>
          {/* Animated Particles Background */}
          {particles.map((particle) => (
            <Particle
              key={particle.id}
              startPosition={particle.startPosition}
              endPosition={particle.endPosition}
              duration={particle.duration}
              delay={particle.delay}
              size={particle.size}
              color={particle.color}
            />
          ))}
          
          {/* Welcome Content */}
          <View style={styles.welcomeContent}>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.welcomeTitle}>
              {username ? `أهلاً بك مجدداً، ${username}` : 'أهلاً بك في Bright AI'}
            </Text>
            <Text style={styles.welcomeDescription}>
              {visitCount <= 1 
                ? 'نحن سعداء بانضمامك إلينا. استكشف حلولنا الذكية لتطوير أعمالك.' 
                : 'نحن هنا لمساعدتك في تطوير أعمالك باستخدام أحدث تقنيات الذكاء الاصطناعي.'}
            </Text>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, styles.accentButton]} 
                onPress={handleFreeConsultationPress}
                activeOpacity={0.8}
              >
                <FontAwesome5 name="headset" size={16} color={COLORS.white} style={styles.buttonIcon} />
                <Text style={[styles.buttonText, styles.accentButtonText]}>استشارة مجانية</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.standardButton]} 
                onPress={handleDiscoverSolutionsPress}
                activeOpacity={0.8}
              >
                <FontAwesome5 name="lightbulb" size={16} color={COLORS.primary} style={styles.buttonIcon} />
                <Text style={[styles.buttonText, styles.standardButtonText]}>اكتشف حلولنا</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>خدماتنا المميزة</Text>
          
          <View style={styles.featuresGrid}>
            <TouchableOpacity style={styles.featureCard} onPress={handleDataAnalysisPress}>
              <View style={styles.featureIconContainer}>
                <FontAwesome5 name="chart-bar" size={24} color={COLORS.primary} />
              </View>
              <Text style={styles.featureTitle}>تحليل البيانات</Text>
              <Text style={styles.featureDescription}>
                حلول متقدمة لتحليل البيانات واستخراج الرؤى القيمة
              </Text>
            </TouchableOpacity>
            
            {/* AI Consulting Card (Placeholder) */}
            <TouchableOpacity style={styles.featureCard} onPress={() => console.log('AI Consulting Pressed')} activeOpacity={0.7}>
              <View style={styles.featureIconContainer}>
                <FontAwesome5 name="brain" size={24} color={COLORS.primary} />
              </View>
              <Text style={styles.featureTitle}>استشارات الذكاء الاصطناعي</Text>
              <Text style={styles.featureDescription}>
                خبرات متخصصة لمساعدتك في تبني الذكاء الاصطناعي
              </Text>
            </TouchableOpacity>

            {/* Custom Solutions Card (Placeholder) */}
            <TouchableOpacity style={styles.featureCard} onPress={() => console.log('Custom Solutions Pressed')} activeOpacity={0.7}>
              <View style={styles.featureIconContainer}>
                <FontAwesome5 name="cogs" size={24} color={COLORS.primary} />
              </View>
              <Text style={styles.featureTitle}>حلول مخصصة</Text>
              <Text style={styles.featureDescription}>
                تطوير حلول ذكاء اصطناعي مصممة خصيصاً لاحتياجاتك
              </Text>
            </TouchableOpacity>

             {/* Contact Card */}
             <TouchableOpacity style={styles.featureCard} onPress={handleContactPress} activeOpacity={0.7}>
              <View style={styles.featureIconContainer}>
                <FontAwesome5 name="envelope" size={24} color={COLORS.primary} />
              </View>
              <Text style={styles.featureTitle}>تواصل معنا</Text>
              <Text style={styles.featureDescription}>
                هل لديك أسئلة؟ تواصل مع فريق الدعم لدينا
              </Text>
            </TouchableOpacity>

          </View>
        </View>
        {/* End Features Section */}

      </ScrollView>
      {/* Place Virtual Assistant outside ScrollView */}
      <VirtualAssistant onError={handleError} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { // Added SafeArea style
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    paddingBottom: SIZES.padding * 2, // Added padding at the bottom
    alignItems: 'center', // Center content horizontally
    paddingHorizontal: SIZES.padding * 2, // Horizontal padding
  },
  welcomeSection: {
    width: '100%',
    minHeight: height * 0.45, // Adjusted height
    marginBottom: SIZES.padding * 2, // Reduced margin
    position: 'relative',
    overflow: 'hidden',
    borderRadius: SIZES.radius * 2,
    backgroundColor: 'rgba(245, 247, 250, 0.8)', // Light background with some transparency
    padding: SIZES.padding * 2, // Added padding inside the section
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
  },
  welcomeContent: {
    width: '100%',
    alignItems: 'center', // Center text content
    zIndex: 2, // Ensure content is above particles
  },
  greeting: {
    ...FONTS.h3,
    color: COLORS.accent,
    marginBottom: SIZES.padding / 2,
    textAlign: 'center', // Center align text
  },
  welcomeTitle: {
    ...FONTS.h1,
    color: COLORS.primary,
    marginBottom: SIZES.padding,
    textAlign: 'center', // Center align text
  },
  welcomeDescription: {
    ...FONTS.body2,
    color: COLORS.text,
    marginBottom: SIZES.padding * 2,
    textAlign: 'center', // Center align text
    lineHeight: SIZES.body2LineHeight || 22,
    maxWidth: '90%', // Prevent text from stretching too wide
  },
  buttonContainer: {
    flexDirection: 'row', // Changed to row for side-by-side buttons
    justifyContent: 'center', // Center buttons
    width: '100%',
    marginTop: SIZES.padding, // Add some margin top
  },
  button: {
    flexDirection: 'row', // Align icon and text horizontally
    paddingVertical: SIZES.padding * 1.2, // Adjusted padding
    paddingHorizontal: SIZES.padding * 1.8, // Adjusted padding
    borderRadius: SIZES.radius * 1.5, // Slightly larger radius
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: SIZES.padding / 2, // Space between buttons
    minWidth: 150, // Ensure buttons have a minimum width
    elevation: 2, // Add subtle shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
  },
  accentButton: {
    backgroundColor: COLORS.accent,
  },
  standardButton: {
    backgroundColor: COLORS.secondary,
  },
  buttonText: {
    ...FONTS.h4,
    fontWeight: '600', // Slightly bolder text
  },
  accentButtonText: {
    color: COLORS.white,
  },
  standardButtonText: {
    color: COLORS.primary,
  },
  buttonIcon: {
    marginRight: 8, // Space between icon and text
  },

  // Features Section Styles
  featuresSection: {
    width: '100%',
    marginTop: SIZES.padding * 2,
    marginBottom: SIZES.padding * 3,
  },
  sectionTitle: {
    ...FONTS.h2,
    color: COLORS.primary,
    marginBottom: SIZES.padding * 1.5,
    textAlign: 'center', // Center section title
  },
  featuresGrid: {
    flexDirection: 'row', // Keep as row
    flexWrap: 'wrap',
    justifyContent: 'space-around', // Distribute space around items
    marginHorizontal: -SIZES.padding / 2, // Counteract card margin
  },
  featureCard: {
    width: '47%', // Slightly reduce width for better spacing
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius * 1.5, // Match button radius
    paddingVertical: SIZES.padding * 1.8, // Slightly reduce vertical padding
    paddingHorizontal: SIZES.padding * 1.5, // Keep horizontal padding
    marginBottom: SIZES.padding * 2, // Keep increased bottom margin
    alignItems: 'center', // Center card content horizontally
    justifyContent: 'center', // Center content vertically again
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginHorizontal: SIZES.padding / 2, // Add horizontal margin
  },
  featureIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.secondary, // Use secondary color for icon background
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  featureTitle: {
    ...FONTS.h4,
    fontSize: SIZES.h4 * 0.9, // Slightly smaller font size
    color: COLORS.primary,
    marginBottom: SIZES.padding / 2,
    textAlign: 'center', // Center feature title
  },
  featureDescription: {
    ...FONTS.body4,
    fontSize: SIZES.body4 * 0.95, // Slightly smaller font size
    color: COLORS.text,
    textAlign: 'center', // Center feature description
    lineHeight: SIZES.body4LineHeight || 18,
  },

  // Virtual Assistant Styles
  assistantIcon: {
    position: 'absolute',
    bottom: 90, // Raised the icon even further
    right: 30, // Positioned to the right
    left: undefined, // Remove left positioning
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 1000, // Ensure it's above everything
  },
  assistantIconInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: SIZES.radius * 2,
    borderTopRightRadius: SIZES.radius * 2,
    height: height * 0.8, // Increased height
    padding: SIZES.padding,
    paddingBottom: SIZES.padding * 2, // Add more padding at the bottom
  },
  modalHeader: {
    flexDirection: 'row', // Keep row direction
    justifyContent: 'space-between', // Space between title and buttons
    alignItems: 'center',
    marginBottom: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    paddingBottom: SIZES.padding, // Increased padding
    paddingHorizontal: SIZES.padding, // Add horizontal padding
  },
  modalTitle: {
    ...FONTS.h2,
    color: COLORS.primary,
    textAlign: 'center', // Center title
    flex: 1, // Allow title to take available space
    marginLeft: 60, // Offset for buttons
  },
  headerButtons: {
    flexDirection: 'row', // Keep row
    alignItems: 'center',
  },
  headerButton: {
    marginLeft: SIZES.padding * 1.5,
    padding: 5,
  },
  messagesContainer: {
    flex: 1,
    marginBottom: SIZES.padding,
    paddingHorizontal: SIZES.padding, // Add horizontal padding
  },
  messagesContentContainer: {
     paddingBottom: SIZES.padding * 2, // Ensure space at the bottom
  },
  welcomeMessageContainer: {
    alignItems: 'center',
    paddingVertical: SIZES.padding * 3,
    paddingHorizontal: SIZES.padding,
  },
  welcomeIcon: {
    marginBottom: SIZES.padding * 1.5,
  },
  welcomeMessage: {
    ...FONTS.body3,
    color: COLORS.text,
    textAlign: 'center',
    marginVertical: SIZES.padding, // Adjusted margin
  },
  suggestionContainer: {
    marginTop: SIZES.padding * 1.5, // Adjusted margin
    width: '100%',
    alignItems: 'center',
  },
  suggestionButton: {
    backgroundColor: COLORS.secondary, // Use secondary color
    paddingVertical: SIZES.padding, // Adjusted padding
    paddingHorizontal: SIZES.padding * 1.8, // Adjusted padding
    borderRadius: SIZES.radius * 2,
    marginBottom: SIZES.padding,
    borderWidth: 0, // Remove border
    width: '80%', // Set width for suggestions
  },
  suggestionText: {
    ...FONTS.body3, // Slightly larger text
    color: COLORS.primary,
    textAlign: 'center',
    fontWeight: '500',
  },
  messageBubble: {
    paddingVertical: SIZES.padding * 0.8, // Adjusted padding
    paddingHorizontal: SIZES.padding * 1.2, // Adjusted padding
    borderRadius: SIZES.radius * 1.5, // Match other radii
    marginBottom: SIZES.padding, // Increased margin
    maxWidth: '85%', // Slightly wider bubbles
    flexDirection: 'row', // Use row for avatar alignment
    alignItems: 'flex-end', // Align items at the bottom
  },
  userMessage: {
    backgroundColor: COLORS.primary,
    alignSelf: 'flex-end',
    borderBottomRightRadius: SIZES.radius * 0.5, // Slightly different corner for visual cue
  },
  assistantMessage: {
    backgroundColor: COLORS.secondary,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: SIZES.radius * 0.5, // Slightly different corner
  },
  assistantAvatar: {
    width: 28, // Slightly larger avatar
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.padding * 0.8, // Space between avatar and bubble
    marginLeft: 0, // Reset margin left
  },
  messageText: {
    ...FONTS.body3,
    flexShrink: 1,
    paddingHorizontal: 4, // Add slight horizontal padding within the text container
  },
  userMessageText: {
    color: COLORS.white,
    textAlign: 'left', // Align text left within the bubble
  },
  assistantMessageText: {
    color: COLORS.text,
    textAlign: 'left', // Align text left within the bubble
  },
  loadingContainer: {
    flexDirection: 'row', // Keep row
    alignItems: 'center',
    justifyContent: 'center', // Center loading indicator
    padding: SIZES.padding,
    alignSelf: 'center', // Center within the scroll view
  },
  loadingText: {
    ...FONTS.body4,
    color: COLORS.text,
    marginLeft: SIZES.padding / 2, // Use margin left for LTR text
  },
  errorContainer: {
    padding: SIZES.padding,
    backgroundColor: '#FFCDD2', // Lighter error background
    borderRadius: SIZES.radius,
    marginVertical: SIZES.padding / 2,
    flexDirection: 'row', // Keep row
    alignItems: 'center',
    marginHorizontal: SIZES.padding, // Add horizontal margin
  },
  errorIcon: {
    marginRight: SIZES.padding / 2,
    color: '#B71C1C', // Darker error icon color
  },
  errorText: {
    ...FONTS.body4,
    color: '#B71C1C', // Darker error text color
    textAlign: 'left', // Align text left
    flexShrink: 1, // Allow text to wrap
  },
  inputContainer: {
    flexDirection: 'row', // Keep row
    alignItems: 'flex-end', // Align items to bottom for multiline input
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingTop: SIZES.padding,
    paddingHorizontal: SIZES.padding, // Add horizontal padding
    paddingBottom: SIZES.padding / 2, // Add bottom padding
  },
  input: {
    flex: 1,
    ...FONTS.body3,
    color: COLORS.text,
    backgroundColor: '#F0F0F0', // Slightly darker input background
    borderRadius: SIZES.radius * 1.5, // Match other radii
    paddingHorizontal: SIZES.padding * 1.5, // Increase horizontal padding
    paddingTop: SIZES.padding * 1.2, // Adjust top padding
    paddingBottom: SIZES.padding * 1.2, // Adjust bottom padding
    marginRight: SIZES.padding, // Use margin right for LTR layout
    minHeight: 48, // Ensure minimum height
    maxHeight: 120, // Increase max height
    textAlign: 'left', // Align text left
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius * 1.5, // Match input radius
    padding: SIZES.padding * 1.2, // Match input padding
    justifyContent: 'center',
    alignItems: 'center',
    height: 48, // Match minimum input height
    width: 48, // Make it square
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.lightGray,
  },
  // Remove sendButtonText as we only have an icon now
});

export default HomeScreen;
