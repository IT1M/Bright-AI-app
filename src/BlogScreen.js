import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, I18nManager } from 'react-native';
import { Colors } from '../constants/Colors'; // Assuming theme constants are here

// --- RTL Support ---
// Uncomment the line below if explicit RTL forcing is needed across the app
I18nManager.forceRTL(true); // <-- Enabled global RTL
// Note: For Expo Go, you MUST restart the app after changing I18nManager settings.
// For development builds, rebuild the app (e.g., npx expo prebuild --clean).
// Often, styling adjustments (textAlign, flexDirection) are sufficient per component.

// Dummy article data (replace with actual data source later)
const dummyArticles = [
  {
    id: '1',
    title: 'مقدمة في الذكاء الاصطناعي',
    date: '25 مارس 2025',
    snippet: 'نظرة عامة على مفاهيم الذكاء الاصطناعي الأساسية وتطبيقاته.',
    category: 'الذكاء الاصطناعي',
    imageUrl: 'https://picsum.photos/seed/ai1/50/50', // Placeholder image
  },
  {
    id: '2',
    title: 'تعلم الآلة للمبتدئين',
    date: '20 مارس 2025',
    snippet: 'شرح مبسط لأساسيات تعلم الآلة وكيفية البدء.',
    category: 'تعلم الآلة',
    imageUrl: 'https://picsum.photos/seed/ml1/50/50',
  },
  {
    id: '3',
    title: 'أحدث التطورات في معالجة اللغات الطبيعية',
    date: '15 مارس 2025',
    snippet: 'استعراض لأهم التقنيات الجديدة في فهم وتوليد اللغة البشرية.',
    category: 'معالجة اللغات',
    imageUrl: 'https://picsum.photos/seed/nlp1/50/50',
  },
  {
    id: '4',
    title: 'أخلاقيات الذكاء الاصطناعي',
    date: '10 مارس 2025',
    snippet: 'مناقشة التحديات الأخلاقية المرتبطة بتطوير ونشر الذكاء الاصطناعي.',
    category: 'أخلاقيات',
    imageUrl: 'https://picsum.photos/seed/ethics1/50/50',
  },
  {
    id: '5',
    title: 'الشبكات العصبية العميقة: كيف تعمل؟',
    date: '5 مارس 2025',
    snippet: 'تبسيط لآلية عمل الشبكات العصبية ودورها في التعلم العميق.',
    category: 'التعلم العميق',
    imageUrl: 'https://picsum.photos/seed/dnn1/50/50',
  },
  {
    id: '6',
    title: 'تطبيقات الذكاء الاصطناعي في الطب',
    date: '1 مارس 2025',
    snippet: 'أمثلة على كيفية استخدام الذكاء الاصطناعي لتحسين التشخيص والعلاج.',
    category: 'تطبيقات AI',
    imageUrl: 'https://picsum.photos/seed/aimed1/50/50',
  },
  {
    id: '7',
    title: 'مستقبل الذكاء الاصطناعي: الفرص والتحديات',
    date: '25 فبراير 2025',
    snippet: 'نظرة استشرافية لما يمكن أن يقدمه الذكاء الاصطناعي والتحديات المتوقعة.',
    category: 'مستقبل AI',
    imageUrl: 'https://picsum.photos/seed/futureai1/50/50',
  },
];

const BlogScreen = () => {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.snippet}>{item.snippet}</Text>
        <Text style={styles.date}>{item.date} - {item.category}</Text>
      </View>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>المكتبة الذكية</Text>
      <FlatList
        data={dummyArticles} // Use the updated articles
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background, // Use theme background color
    paddingTop: 50, // Adjust as needed for status bar/header
    paddingHorizontal: 15,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text, // Use theme text color
    marginBottom: 20,
    textAlign: 'right', // RTL alignment
  },
  listContent: {
    paddingBottom: 20,
  },
  itemContainer: {
    backgroundColor: Colors.light.card, // Slightly different background for items
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row-reverse', // RTL layout for items
    alignItems: 'center',
    // Add shadow or border if desired
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25, // Make it circular
    marginLeft: 15, // Add space between image and text in RTL
  },
  textContainer: {
    flex: 1,
    // marginRight: 15, // Add space if image was on the left (LTR)
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 5,
    textAlign: 'right', // RTL alignment
  },
  snippet: {
    fontSize: 14,
    color: Colors.light.textMuted, // Use a muted text color for snippet
    marginBottom: 8,
    textAlign: 'right', // RTL alignment
  },
  date: {
    fontSize: 12,
    color: Colors.light.textMuted, // Use a muted text color for date/category
    textAlign: 'right', // RTL alignment
  },
});

export default BlogScreen;
