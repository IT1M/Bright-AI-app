import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../src/theme'; // Adjust path if necessary

const Card = ({ iconName, title, description, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.iconContainer}>
        <FontAwesome5 name={iconName} size={SIZES.h1} color={COLORS.primary} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding / 1.5, // Slightly less padding than screen padding
    marginBottom: SIZES.padding / 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    // Shadow (optional, adjust for desired effect)
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3, // for Android
  },
  iconContainer: {
    marginRight: SIZES.padding / 1.5,
    padding: SIZES.base,
    // Optional: Add a background to the icon container
    // backgroundColor: COLORS.lightGray,
    // borderRadius: SIZES.radius / 2,
  },
  textContainer: {
    flex: 1, // Take remaining space
  },
  title: {
    ...FONTS.h4,
    color: COLORS.text,
    marginBottom: SIZES.base / 2,
  },
  description: {
    ...FONTS.body4,
    color: COLORS.text,
    opacity: 0.7, // Make description slightly less prominent
  },
});

export default Card;
