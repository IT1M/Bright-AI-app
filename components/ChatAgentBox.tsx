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
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../src/theme';
import { GEMINI_API_KEY, GEMINI_API_URL } from '../src/config';

// Define message type structure
interface Message {
  id: string;
  text: string;
  type: 'user' | 'ai' | 'error';
}

const ChatAgentBox = ({ agentName, description, placeholderText = "اكتب رسالتك هنا..." }: { agentName: string; description: string; placeholderText?: string }) => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]); // State for messages
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator
  const scrollViewRef = useRef<ScrollView>(null); // Ref for ScrollView

  // Automatically scroll down when messages change
  useEffect(() => {
    if (scrollViewRef.current) {
      // Use timeout to ensure layout is updated before scrolling
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return; // Don't send empty messages or while loading

    const userMessageText = inputText;
    const userMessage: Message = {
      id: Date.now().toString() + '-user', // Simple unique ID
      text: userMessageText,
      type: 'user',
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
          // Simple text-only request structure for Gemini
          contents: [{ parts: [{ text: userMessageText }] }],
          // Optional: Add generationConfig or safetySettings if needed
          // generationConfig: { temperature: 0.7, maxOutputTokens: 100 },
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

      const aiMessage: Message = {
        id: Date.now().toString() + '-ai',
        text: aiResponseText.trim(),
        type: 'ai',
      };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error: any) {
      console.error("Error calling Gemini API:", error);
      const errorMessage: Message = {
        id: Date.now().toString() + '-error',
        text: `Error: ${error.message || 'Failed to get response.'}`,
        type: 'error',
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

  // Render individual message bubble
  const renderMessage = (message: Message) => {
    const isUser = message.type === 'user';
    const isError = message.type === 'error';
    const bubbleStyle = isUser ? styles.userBubble : (isError ? styles.errorBubble : styles.aiBubble);
    const textStyle = isUser ? styles.userMessageText : (isError ? styles.errorText : styles.aiMessageText);

    return (
      <View
        key={message.id}
        style={[styles.messageBubble, bubbleStyle]}
      >
        <Text style={textStyle}>
          {message.text}
        </Text>
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
        <Text style={styles.agentName}>{agentName}</Text>
        <Text style={styles.description}>{description}</Text>
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
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={COLORS.primary} />
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
    padding: SIZES.base * 1.5,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    backgroundColor: COLORS.background,
  },
  agentName: {
    ...FONTS.h3,
    fontWeight: FONTS.h3.fontWeight as 'bold', // Explicitly cast fontWeight
    color: COLORS.text,
    marginBottom: SIZES.base / 2,
    textAlign: 'right',
  },
  description: {
    ...FONTS.body4,
    color: COLORS.text,
    textAlign: 'right',
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
  messageBubble: {
    paddingVertical: SIZES.base,
    paddingHorizontal: SIZES.base * 1.5,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.base,
    maxWidth: '80%', // Prevent bubbles from taking full width
  },
  userBubble: {
    backgroundColor: COLORS.primary,
    alignSelf: 'flex-end', // Align user messages to the right
  },
  aiBubble: {
    backgroundColor: COLORS.lightGray, // Different background for AI
    alignSelf: 'flex-start', // Align AI messages to the left
  },
  errorBubble: {
      backgroundColor: '#FFD2D2', // Light red background for errors
      alignSelf: 'flex-start',
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
  loadingContainer: {
      alignSelf: 'flex-start', // Show loading near AI response area
      marginVertical: SIZES.base,
      marginLeft: SIZES.base * 1.5, // Indent like AI bubble
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
});

export default ChatAgentBox;