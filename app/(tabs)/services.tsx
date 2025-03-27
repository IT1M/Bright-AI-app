import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Card from '../../components/Card'; // Adjust path if necessary
import { COLORS, SIZES, FONTS } from '../../src/theme'; // Adjust path if necessary

// Placeholder service data (replace with actual data if available)
const servicesData = [
  {
    id: '1',
    icon: 'chart-line',
    title: 'تحليل البيانات المتقدم',
    description: 'نقدم حلولاً تحليلية متقدمة لفهم أعمق لبياناتك.',
  },
  {
    id: '2',
    icon: 'brain',
    title: 'الذكاء الاصطناعي وتعلم الآلة',
    description: 'تطوير نماذج ذكاء اصطناعي مخصصة لاحتياجات عملك.',
  },
  {
    id: '3',
    icon: 'cloud',
    title: 'الحوسبة السحابية',
    description: 'حلول سحابية مرنة وآمنة لتعزيز البنية التحتية.',
  },
  {
    id: '4',
    icon: 'cogs',
    title: 'أتمتة العمليات',
    description: 'تبسيط وأتمتة المهام المتكررة لزيادة الكفاءة.',
  },
  {
    id: '5',
    icon: 'shield-alt',
    title: 'أمن المعلومات السيبراني',
    description: 'حماية بياناتك وأنظمتك من التهديدات الرقمية.',
  },
  {
    id: '6',
    icon: 'comments',
    title: 'استشارات تقنية',
    description: 'خبراتنا لمساعدتك في اتخاذ القرارات التقنية الصحيحة.',
  },
];

export default function ServicesScreen() {
  const handleCardPress = (serviceTitle: string) => {
    console.log(`Card pressed: ${serviceTitle}`);
    // Navigate to service details screen or perform other actions here
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>خدماتنا المتكاملة</Text>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {servicesData.map((service) => (
          <Card
            key={service.id}
            iconName={service.icon}
            title={service.title}
            description={service.description}
            onPress={() => handleCardPress(service.title)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background, // Use theme background color
    paddingTop: SIZES.padding * 2, // Add padding at the top (adjust as needed)
  },
  title: {
    ...FONTS.h2,
    fontWeight: 'bold', // Explicitly set fontWeight
    color: COLORS.primary, // Use theme primary color for title
    textAlign: 'center',
    marginBottom: SIZES.padding,
    paddingHorizontal: SIZES.padding,
  },
  scrollViewContent: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: SIZES.padding, // Add padding at the bottom of the scroll view
  },
});
