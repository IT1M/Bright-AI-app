import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SIZES } from './theme.js'; // Assuming theme.js is in the same src directory

const HomeScreen = () => {
  const handleFreeConsultationPress = () => {
    console.log('Free Consultation button pressed');
    // Navigation logic can be added here later
  };

  const handleDiscoverSolutionsPress = () => {
    console.log('Discover Solutions button pressed');
    // Navigation logic can be added here later
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Text style={styles.miniTitle}>حلول ذكاء اصطناعي متكاملة</Text>
        <Text style={styles.mainTitle}>حوّل أعمالك مع Bright AI</Text>
        <Text style={styles.description}>
          نقدم استشارات وتطوير حلول ذكاء اصطناعي مخصصة لتعزيز نمو أعمالك وزيادة الكفاءة.
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.accentButton]} onPress={handleFreeConsultationPress}>
            <Text style={[styles.buttonText, styles.accentButtonText]}>استشارة مجانية</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.standardButton]} onPress={handleDiscoverSolutionsPress}>
            <Text style={[styles.buttonText, styles.standardButtonText]}>اكتشف حلولنا</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Optional Quick Links Section - Placeholder */}
      {/*
      <View style={styles.quickLinksSection}>
        <Text style={styles.sectionTitle}>روابط سريعة</Text>
        { // Add Touchable Cards or Rows here later }
      </View>
      */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background, // Use theme background color
  },
  contentContainer: {
    padding: SIZES.padding * 2, // Apply appropriate padding
    alignItems: 'flex-start', // Align content to the start for RTL
  },
  heroSection: {
    width: '100%',
    marginBottom: SIZES.padding * 3,
    direction: 'rtl', // Ensure RTL layout for this section
  },
  miniTitle: {
    ...FONTS.body3, // Example style, adjust as needed
    color: COLORS.secondary, // Use a secondary color
    marginBottom: SIZES.padding / 2,
    textAlign: 'right',
  },
  mainTitle: {
    ...FONTS.h1, // Use h1 font style
    color: COLORS.primary, // Use primary theme color
    marginBottom: SIZES.padding,
    textAlign: 'right',
  },
  description: {
    ...FONTS.body2, // Use body font style
    color: COLORS.text, // Use theme text color
    marginBottom: SIZES.padding * 2,
    textAlign: 'right',
    lineHeight: SIZES.body2LineHeight || 22, // Adjust line height if needed
  },
  buttonContainer: {
    flexDirection: 'row-reverse', // Arrange buttons from right to left
    justifyContent: 'flex-start', // Start buttons from the right
    width: '100%',
  },
  button: {
    paddingVertical: SIZES.padding,
    paddingHorizontal: SIZES.padding * 2,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SIZES.padding, // Add space between buttons (marginLeft for RTL)
  },
  accentButton: {
    backgroundColor: COLORS.accent, // Accent color for the primary CTA
  },
  standardButton: {
    backgroundColor: COLORS.secondary, // Standard/secondary color for the other CTA
    // Or use border style:
    // backgroundColor: 'transparent',
    // borderWidth: 1,
    // borderColor: COLORS.primary,
  },
  buttonText: {
    ...FONTS.h4, // Example button text style
  },
  accentButtonText: {
    color: COLORS.white, // Text color for accent button
  },
  standardButtonText: {
    color: COLORS.primary, // Text color for standard button
    // If using border style, might need a different color:
    // color: COLORS.primary,
  },
  // Optional Quick Links Styles
  quickLinksSection: {
    marginTop: SIZES.padding * 2,
    width: '100%',
    direction: 'rtl',
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.primary,
    marginBottom: SIZES.padding,
    textAlign: 'right',
  },
});

export default HomeScreen;
