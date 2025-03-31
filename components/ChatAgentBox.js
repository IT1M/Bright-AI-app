import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator, // Import ActivityIndicator
  Clipboard, // Import Clipboard
  Alert, // Import Alert for feedback (optional)
  Animated, // Import Animated for typing indicator
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../src/theme';
import { GEMINI_API_KEY, GEMINI_API_URL } from '../src/config';

/**
 * @typedef {Object} Message
 * @property {string} id
 * @property {string} text
 * @property {('user'|'ai'|'error')} type
 * @property {Date} timestamp
 */

const ChatAgentBox = ({ agentName, description, placeholderText = "اكتب رسالتك هنا..." }) => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]); // State for messages
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator
  const scrollViewRef = useRef(null); // Ref for ScrollView
  const dotOpacity = useRef([new Animated.Value(0.5), new Animated.Value(0.5), new Animated.Value(0.5)]).current; // For typing animation

  // Automatically scroll down when messages change
  useEffect(() => {
    if (scrollViewRef.current) {
      // Use timeout to ensure layout is updated before scrolling
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages]);

  // Typing indicator animation effect
  useEffect(() => {
    if (isLoading) {
      const animations = dotOpacity.map((opacity) => {
        return Animated.sequence([
          Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0.5, duration: 400, useNativeDriver: true }),
        ]);
      });
      Animated.loop(Animated.stagger(200, animations)).start();
    } else {
      dotOpacity.forEach(opacity => opacity.setValue(0.5)); // Reset opacity when not loading
    }
    // Cleanup function to stop animation if component unmounts while loading
    return () => dotOpacity.forEach(opacity => opacity.stopAnimation());
  }, [isLoading, dotOpacity]);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return; // Don't send empty messages or while loading

    const userMessageText = inputText;
    const userMessage = {
      id: Date.now().toString() + '-user', // Simple unique ID
      text: userMessageText,
      type: 'user',
      timestamp: new Date(), // Add timestamp
    };

    // Add user message immediately and clear input
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true); // Show loading indicator

    // --- Actual API Call ---
    try {
      // IMPORTANT: Ensure GEMINI_API_KEY is loaded securely via environment variables
      if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_API_KEY_ENV_VARIABLE_NOT_SET') {
         throw new Error("API Key not configured. Please set EXPO_PUBLIC_GEMINI_API_KEY in your .env file.");
      }

      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Add agent context to the prompt
          contents: [{ parts: [{ text: `You are ${agentName}. ${description}. Please respond to the following user message based on your role:\n\nUser: ${userMessageText}\n\n${agentName}:` }] }],
          // Optional: Add generationConfig or safetySettings if needed
          // generationConfig: { temperature: 0.9, maxOutputTokens: 250 }, // Example adjustments
          // safetySettings: [{ category: "HARM_CATEGORY_...", threshold: "BLOCK_MEDIUM_AND_ABOVE" }]
        }),
      });

      // Improved error handling for non-ok responses
      if (!response.ok) {
        let errorBody = null;
        try {
            errorBody = await response.json(); // Try to parse error details
        } catch (parseError) {
            // Ignore if response body is not JSON or empty
        }
        console.error("API Error Response:", response.status, response.statusText, errorBody);
        throw new Error(`API Error: ${response.status} ${response.statusText}. ${errorBody?.error?.message || 'Check console for details.'}`);
      }

      const data = await response.json();

      // Extract the response text - check structure carefully based on actual Gemini response
      const aiResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!aiResponseText) {
          console.error("Could not parse AI response:", data);
          throw new Error("Received an empty or invalid response from the AI.");
      }

      const aiMessage = {
        id: Date.now().toString() + '-ai',
        text: aiResponseText.trim(),
        type: 'ai',
        timestamp: new Date(), // Add timestamp
      };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error("Error calling Gemini API:", error);
      const errorMessage = {
        id: Date.now().toString() + '-error',
        text: `Error: ${error.message || 'Failed to get response.'}`,
        type: 'error',
        timestamp: new Date(), // Add timestamp
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false); // Hide loading indicator
    }
    // --- End API Call ---
  };

  const handleAttachFile = () => {
    console.log("File attachment functionality to be implemented.");
    // import * as DocumentPicker from 'expo-document-picker';
    // ... DocumentPicker logic ...
  };

  // Function to copy text to clipboard
  const handleCopy = (textToCopy) => {
    Clipboard.setString(textToCopy);
    // Optional: Show feedback to the user
    Alert.alert("تم النسخ", "تم نسخ نص الرسالة إلى الحافظة.");
  };

  // Function to clear chat messages
  const handleClearChat = () => {
    Alert.alert(
      "مسح المحادثة",
      "هل أنت متأكد أنك تريد مسح جميع الرسائل في هذه المحادثة؟",
      [
        { text: "إلغاء", style: "cancel" },
        { text: "مسح", onPress: () => setMessages([]), style: "destructive" },
      ]
    );
  };

  // Render individual message bubble
  const renderMessage = (message) => {
    const isUser = message.type === 'user';
    const isAi = message.type === 'ai';
    const isError = message.type === 'error';
    const bubbleStyle = isUser ? styles.userBubble : (isError ? styles.errorBubble : styles.aiBubble);
    const textStyle = isUser ? styles.userMessageText : (isError ? styles.errorText : styles.aiMessageText);

    return (
      <View key={message.id} style={[styles.messageContainer, isUser ? styles.userMessageContainer : styles.aiMessageContainer]}>
        <View style={[styles.messageBubble, bubbleStyle]}>
          <Text style={textStyle}>{message.text}</Text>
          <View style={styles.messageInfoContainer}>
            <Text style={styles.timestampText}>
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
            </Text>
            {isAi && (
              <TouchableOpacity onPress={() => handleCopy(message.text)} style={styles.copyButton}>
                <FontAwesome5 name="copy" size={14} color={COLORS.text} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0} // Adjust offset if needed
    >
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
            <Text style={styles.agentName}>{agentName}</Text>
            <Text style={styles.description}>{description}</Text>
        </View>
        <TouchableOpacity onPress={handleClearChat} style={styles.clearButton}>
            <FontAwesome5 name="trash-alt" size={20} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {/* Message history */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messageHistory}
        contentContainerStyle={styles.messageHistoryContent}
        keyboardShouldPersistTaps="handled" // Allow tapping send while keyboard is up
      >
        {messages.length === 0 && !isLoading && (
           <Text style={styles.placeholderText}>Start the conversation...</Text>
        )}
        {messages.map(renderMessage)}
        {isLoading && (
          <View style={styles.typingIndicatorContainer}>
            <Animated.View style={[styles.typingDot, { opacity: dotOpacity[0] }]} />
            <Animated.View style={[styles.typingDot, { opacity: dotOpacity[1] }]} />
            <Animated.View style={[styles.typingDot, { opacity: dotOpacity[2] }]} />
          </View>
        )}
      </ScrollView>

      <View style={styles.inputArea}>
        <TouchableOpacity onPress={handleAttachFile} style={styles.iconButton} disabled={isLoading}>
          <FontAwesome5 name="paperclip" size={20} color={isLoading ? COLORS.lightGray : COLORS.primary} />
        </TouchableOpacity>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder={placeholderText}
          placeholderTextColor={COLORS.lightGray}
          multiline
          editable={!isLoading} // Disable input while loading
        />
        <TouchableOpacity onPress={handleSend} style={styles.iconButton} disabled={isLoading}>
          <FontAwesome5 name="paper-plane" size={20} color={isLoading ? COLORS.lightGray : COLORS.primary} solid />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    marginBottom: SIZES.padding,
    overflow: 'hidden',
    // Use height instead of minHeight for better KeyboardAvoidingView behavior
    height: 400, // Adjust height as needed, or make it more dynamic
    flexDirection: 'column',
  },
  header: {
    paddingHorizontal: SIZES.base * 1.5,
    paddingVertical: SIZES.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    backgroundColor: COLORS.background,
    flexDirection: 'row-reverse', // Align items for RTL
    justifyContent: 'space-between', // Space out text and button
    alignItems: 'center',
  },
  headerTextContainer: {
      flex: 1, // Allow text to take available space
      marginRight: SIZES.base, // Add space between text and button
  },
  agentName: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: SIZES.base / 2,
    textAlign: 'right',
  },
  description: {
    ...FONTS.body4,
    color: COLORS.text,
    textAlign: 'right',
  },
  clearButton: {
      padding: SIZES.base, // Add padding for easier tapping
  },
  messageHistory: {
    flex: 1, // Takes up available space between header and input
  },
  messageHistoryContent: {
      padding: SIZES.base * 1.5,
      paddingBottom: SIZES.base * 3, // Extra padding at bottom
      flexGrow: 1, // Ensure content pushes input down
      justifyContent: 'flex-end', // Align messages to bottom initially
  },
  placeholderText: {
    ...FONTS.body4,
    color: COLORS.lightGray,
    textAlign: 'center',
    paddingVertical: SIZES.padding, // Give placeholder some space
  },
   messageContainer: {
    marginBottom: SIZES.base,
    // No alignSelf here, handled by specific containers
  },
  userMessageContainer: {
    alignItems: 'flex-end', // Align user content to the right
  },
  aiMessageContainer: {
    alignItems: 'flex-start', // Align AI content to the left
  },
  messageBubble: {
    paddingVertical: SIZES.base,
    paddingHorizontal: SIZES.base * 1.5,
    borderRadius: SIZES.radius,
    // Removed marginBottom, handled by messageContainer
    maxWidth: '85%', // Allow slightly wider bubbles
    minWidth: '20%', // Ensure small messages have some width
  },
  userBubble: {
    backgroundColor: COLORS.primary,
    // Removed duplicate backgroundColor
  },
  aiBubble: {
    backgroundColor: COLORS.lightGray, // Different background for AI
    // alignSelf removed, handled by aiMessageContainer
  },
  errorBubble: {
      backgroundColor: '#FFD2D2', // Light red background for errors
      // alignSelf removed, handled by aiMessageContainer
  },
   messageInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Space out timestamp and copy button
    alignItems: 'center',
    marginTop: SIZES.base / 2,
  },
  userMessageText: {
    ...FONTS.body4,
    color: COLORS.white,
    textAlign: 'left',
  },
  aiMessageText: {
    ...FONTS.body4,
    color: COLORS.text,
    textAlign: 'left',
  },
  errorText: {
      ...FONTS.body4,
      color: '#D8000C', // Dark red text for errors
      textAlign: 'left',
  },
  typingIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginVertical: SIZES.base,
    marginLeft: SIZES.base * 1.5,
    paddingHorizontal: SIZES.base * 1.5,
    paddingVertical: SIZES.base,
    backgroundColor: COLORS.lightGray,
    borderRadius: SIZES.radius,
  },
  typingDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: COLORS.text, // Use text color for dots
      marginHorizontal: 3,
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.base,
    paddingVertical: SIZES.base,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    backgroundColor: COLORS.background,
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius / 2,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    paddingHorizontal: SIZES.base * 1.5,
    paddingVertical: Platform.OS === 'ios' ? SIZES.base : SIZES.base / 2, // Adjust padding for platform
    marginHorizontal: SIZES.base,
    ...FONTS.body4,
    color: COLORS.text,
    textAlign: 'right',
  },
  iconButton: {
    padding: SIZES.base,
  },
  timestampText: {
    ...FONTS.body5, // Use body5 instead of caption
    color: COLORS.text, // Use text (dark gray) instead of darkGray
    marginTop: SIZES.base / 2,
    // fontSize: 10, // Font size is now controlled by FONTS.body5 (which is 12)
    // alignSelf: 'flex-end', // Timestamp is now part of messageInfoContainer
  },
   copyButton: {
    marginLeft: SIZES.base, // Add space between timestamp and copy button
    padding: 2, // Small padding for easier tap
  },
});

export default ChatAgentBox;
