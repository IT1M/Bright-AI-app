import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router'; // Import Link for navigation
import { COLORS, SIZES, FONTS } from '../../src/theme'; // Adjust path if necessary
import { FontAwesome5 } from '@expo/vector-icons'; // For list item icon

// Define the agent data with icons
const agents = [
  {
    id: '1',
    name: 'BrightSupport',
    description: 'روبوت محادثة متخصص في خدمة العملاء، يقدم دعماً فورياً على مدار الساعة ويحل المشكلات الشائعة بكفاءة عالية.',
    placeholder: 'كيف يمكنني مساعدتك اليوم؟',
    icon: 'headset', // Icon for support
  },
  {
    id: '2',
    name: 'BrightSales',
    description: 'روبوت ذكي يساعد في تأهيل العملاء المحتملين وزيادة المبيعات من خلال التفاعل الشخصي والإجابة على استفسارات المنتجات.',
    placeholder: 'هل لديك أي استفسار عن منتجاتنا؟',
    icon: 'chart-line', // Icon for sales/growth
  },
  {
    id: '3',
    name: 'BrightRecruiter',
    description: 'روبوت متخصص في عمليات التوظيف، يساعد في فرز السير الذاتية وإجراء المقابلات الأولية وتقييم المرشحين بكفاءة.',
    placeholder: 'أخبرني عن خبراتك أو اسأل عن الوظائف الشاغرة...',
    icon: 'user-tie', // Icon for recruitment/professional
  },
  {
    id: '4',
    name: 'BrightProject',
    description: 'روبوت إدارة مشاريع ذكي يساعد في تنظيم المهام ومتابعة التقدم وتحسين التواصل بين أعضاء الفريق.',
    placeholder: 'ما هي المهمة التي تريد تنظيمها أو متابعتها؟',
    icon: 'tasks', // Icon for project management/tasks
  },
  {
    id: '5',
    name: 'BrightMath',
    description: 'مساعد متخصص في تعليم الرياضيات للطلاب الثانوية ومساعدتك في المشاريع، يقدم شرحاً مفصلاً وحلولاً للمسائل الرياضية بأسلوب سهل وتفاعلي.',
    placeholder: 'ما هي المسألة الرياضية التي تحتاج مساعدة فيها؟',
    icon: 'calculator', // Icon for math
  },
  {
    id: '6',
    name: 'BrightTourism',
    description: 'مرشد سياحي ذكي يقدم معلومات شاملة عن المواقع السياحية والتراثية في المملكة العربية السعودية.',
    placeholder: 'عن أي معلم سياحي في السعودية تود أن تسأل؟',
    icon: 'map-marked-alt', // Icon for tourism/maps
  },
];

export default function AgentsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>اختر الوكيل المناسب لك  وشاهد مُشرقة وهي تجعل عمل ساعات ينتهي بثوانٍ</Text>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          {agents.map((agent) => (
            // Use Link to navigate, passing agent data as query params
            <Link
              key={agent.id}
              href={{
                pathname: `/chat/${agent.id}` as any, // Cast to any to satisfy typed routes
                params: { // Pass data needed by the chat screen
                    agentName: agent.name,
                    description: agent.description,
                    placeholderText: agent.placeholder
                }
              }}
              asChild // Use TouchableOpacity as the child component for styling/press handling
            >
              <TouchableOpacity style={styles.agentItem}>
                 {/* Icon on the right */}
                <View style={styles.iconContainer}>
                   <FontAwesome5 name={agent.icon} size={24} color={COLORS.primary} />
                </View>
                {/* Text on the left */}
                <View style={styles.agentTextContainer}>
                    <Text style={styles.agentName}>{agent.name}</Text>
                    <Text style={styles.agentDescription} numberOfLines={2}>{agent.description}</Text>
                </View>
                {/* Chevron still on the far left (due to row-reverse) */}
                <FontAwesome5 name="chevron-left" size={16} color={COLORS.lightGray} style={styles.chevron} />
              </TouchableOpacity>
            </Link>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: SIZES.padding / 2,
    paddingTop: SIZES.padding,
  },
  title: {
    ...FONTS.h2,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SIZES.padding,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: SIZES.padding,
  },
  agentItem: {
    backgroundColor: COLORS.white,
    paddingVertical: SIZES.padding * 0.75,
    paddingHorizontal: SIZES.padding / 2, // Adjust horizontal padding
    borderRadius: SIZES.radius,
    marginBottom: SIZES.base * 1.5,
    flexDirection: 'row-reverse', // Reverse direction for RTL layout (Icon | Text | Chevron)
    alignItems: 'center', // Center items vertically
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  iconContainer: {
      width: 40, // Fixed width for icon container
      alignItems: 'center', // Center icon horizontally
      justifyContent: 'center', // Center icon vertically
      marginLeft: SIZES.base, // Space between icon and text
  },
  agentTextContainer: {
      flex: 1, // Allow text to take available space
      // marginRight is removed as flexDirection is reversed
  },
  agentName: {
    ...FONTS.h4,
    fontWeight: FONTS.h4.fontWeight as 'bold', // Explicitly cast fontWeight
    color: COLORS.text,
    marginBottom: SIZES.base / 2,
    textAlign: 'right', // Align text right for Arabic
  },
  agentDescription: {
    ...FONTS.body4,
    color: COLORS.text,
    textAlign: 'right', // Align text right for Arabic
  },
  chevron: {
      marginLeft: SIZES.base * 1.5, // Space between text and chevron
  }
});
