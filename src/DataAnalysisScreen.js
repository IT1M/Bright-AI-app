import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Platform } from 'react-native'; // Import Platform
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system'; // Keep for native
import { FontAwesome5 } from '@expo/vector-icons'; // Import FontAwesome5
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

// --- Constants ---
// Use the correct model identifier for Gemini 1.5 Pro
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent';
// IMPORTANT: Ensure this environment variable is set, e.g., in a .env file
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

const Section = ({ title, children }) => (
  <View style={styles.sectionContainer}>
    <ThemedText type="subtitle" style={styles.sectionTitle}>{title}</ThemedText>
    <View style={styles.sectionContent}>
      {children}
    </View>
  </View>
);

const Button = ({ title, onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

const SmallButton = ({ title, onPress }) => (
    <TouchableOpacity style={styles.smallButton} onPress={onPress}>
      <Text style={styles.smallButtonText}>{title}</Text>
    </TouchableOpacity>
  );

export default function DataAnalysisScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileUpload = async () => {
    setError(null);
    setAnalysisResult(null);
    setIsLoading(true);

    try {
      const pickerResult = await DocumentPicker.getDocumentAsync({
        type: '*/*', // Allow all file types for now, adjust if needed (e.g., 'text/plain', 'text/csv')
        copyToCacheDirectory: true, // Recommended for accessing file content
      });

      // Check if the user cancelled the picker or didn't select a file
      if (pickerResult.canceled || !pickerResult.assets || pickerResult.assets.length === 0) {
        console.log('File selection cancelled or failed.');
        setIsLoading(false);
        return;
      }

      const fileAsset = pickerResult.assets[0];
      console.log('Selected file:', fileAsset.name, fileAsset.mimeType, fileAsset.uri, fileAsset.file); // Log the file object too

      // Read file content based on platform
      let fileContent = '';
      if (Platform.OS === 'web') {
        // Use FileReader API for web
        if (!fileAsset.file) {
          throw new Error('File object not available in picker result on web.');
        }
        fileContent = await readFileContentWeb(fileAsset.file);
      } else {
        // Use FileSystem for native
        fileContent = await FileSystem.readAsStringAsync(fileAsset.uri, {
          encoding: FileSystem.EncodingType.UTF8,
        });
      }

      if (!fileContent) {
        throw new Error('Could not read file content.');
      }

      // --- Actual API Call ---
      if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_API_KEY_ENV_VARIABLE_NOT_SET') {
          throw new Error("API Key not configured. Please set EXPO_PUBLIC_GEMINI_API_KEY in your .env file.");
      }

      // Modify the prompt to request output in Arabic
      const prompt = `يرجى تحليل البيانات التالية وتقديم رؤى باللغة العربية:\n\n${fileContent}`;

      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          // Optional: Add generationConfig if needed
          // generationConfig: {
          //   temperature: 0.7,
          //   maxOutputTokens: 1024,
          // }
        }),
      });

      const responseData = await response.json();

      if (!response.ok || responseData.error) {
        console.error('Gemini API Error:', responseData);
        throw new Error(responseData.error?.message || `API request failed with status ${response.status}`);
      }

      // Extract text from the response (structure might vary slightly based on Gemini model/version)
      const generatedText = responseData.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!generatedText) {
        console.error('Could not extract text from Gemini response:', responseData);
        throw new Error('Failed to get analysis from API.');
      }

      setAnalysisResult(generatedText);

    } catch (err) {
      console.error('Error during file upload or analysis:', err);
      setError(err.message || 'An unexpected error occurred.');
      Alert.alert('Error', err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to read file content on Web using FileReader
  const readFileContentWeb = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsText(file); // Read as text, adjust if binary needed
    });
  };


  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.headerContainer}>
        <ThemedText type="title" style={styles.headerTitle}>تحليل البيانات بالذكاء الاصطناعي</ThemedText>
      </ThemedView>

      <View style={styles.analysisTypesContainer}>
        <Button title="تحليل تنبؤي" onPress={() => console.log('Predictive Analysis')} />
        <Button title="تحليل وصفي" onPress={() => console.log('Descriptive Analysis')} />
        <Button title="رؤى البيانات" onPress={() => console.log('Data Insights')} />
      </View>

      <Section title="رفع البيانات للتحليل">
        <TouchableOpacity style={styles.fullWidthButton} onPress={handleFileUpload} disabled={isLoading}>
           <Text style={styles.fullWidthButtonText}>
             {isLoading ? 'جاري التحميل...' : 'اضغط هنا لرفع ملفاتك'}
           </Text>
        </TouchableOpacity>
        {isLoading && <ActivityIndicator size="large" color="#0056b3" style={styles.loadingIndicator} />}
        {error && <Text style={styles.errorText}>خطأ: {error}</Text>}
        {analysisResult && (
          <View style={styles.resultContainer}>
            <ThemedText type="subtitle" style={styles.resultTitle}>نتائج التحليل:</ThemedText>
            <Text style={styles.resultText}>{analysisResult}</Text>
          </View>
        )}
      </Section> {/* Correctly close the 'رفع البيانات للتحليل' section */}

      {/* New sections will be added here */}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f8', // Slightly different light background
  },
  headerContainer: {
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0', // Lighter border
    backgroundColor: '#ffffff', // White background for header
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333333', // Darker color for header text
  },
  analysisTypesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#ffffff', // White background for this section
    marginBottom: 15, // Increased margin
  },
  button: {
    backgroundColor: '#0056b3', // Darker Blue for primary buttons
    paddingVertical: 12, // Slightly larger padding
    paddingHorizontal: 15,
    borderRadius: 8,
    minWidth: 110, // Slightly wider
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600', // Bolder text
  },
  sectionContainer: {
    backgroundColor: '#ffffff', // White background for sections
    borderRadius: 10, // Slightly more rounded corners
    marginHorizontal: 12,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08, // Softer shadow
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 19, // Slightly larger title
    fontWeight: '600',
    marginBottom: 12, // More space below title
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8', // Lighter border
    paddingBottom: 8, // More padding below title text
    color: '#444444', // Dark gray for section titles
  },
  sectionContent: {
    marginTop: 5, // Add some top margin to content
  },
  fullWidthButton: {
    backgroundColor: '#5a6268', // Darker Gray for secondary actions
    paddingVertical: 14, // Larger padding
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10, // More space above the button
  },
  fullWidthButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600', // Bolder text
  },
  smallButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center', // Center buttons if they don't fill the row
    marginTop: 8,
  },
  smallButton: {
    backgroundColor: '#20c997', // Teal/Green color for small buttons
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    margin: 6, // Slightly more margin
    minWidth: 80, // Slightly wider
    alignItems: 'center',
  },
  smallButtonText: {
    color: '#ffffff',
    fontSize: 13, // Slightly larger text
    fontWeight: '500',
  },
  loadingIndicator: {
    marginTop: 20,
  },
  errorText: {
    marginTop: 15,
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
    paddingHorizontal: 10,
  },
  resultContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#e9ecef', // Light background for results
    borderRadius: 8,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  resultText: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    marginTop: 10,
  },
  placeholderText: {
    fontSize: 15,
    color: '#6c757d',
    textAlign: 'center',
    paddingHorizontal: 10,
    lineHeight: 22,
  },
  placeholderIcon: {
    marginBottom: 10,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 140,
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
  exportButton: {
    backgroundColor: '#28a745', // Green for export
  },
  saveButton: {
    backgroundColor: '#ffc107', // Yellow/Orange for save
  }
});
