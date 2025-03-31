import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native'; // Import FlatList and Dimensions
import { Link } from 'expo-router'; // Import Link for navigation
import { COLORS, SIZES, FONTS } from '../../src/theme'; // Adjust path if necessary
import { FontAwesome5 } from '@expo/vector-icons'; // For list item icon

const { width } = Dimensions.get('window'); // Get screen width
const numColumns = 2; // Number of columns in the grid
const itemMargin = SIZES.padding / 2; // Margin around items
const itemWidth = (width - itemMargin * (numColumns + 1)) / numColumns; // Calculate item width based on columns and margins

// Define the agent data with icons and short descriptions
const agents = [
  {
    id: '1',
    name: 'BrightSupport',
    description: 'روبوت محادثة متخصص في خدمة العملاء، يقدم دعماً فورياً على مدار الساعة ويحل المشكلات الشائعة بكفاءة عالية.',
    shortDescription: 'روبوت خدمة عملاء', // Added short description
    placeholder: 'كيف يمكنني مساعدتك اليوم؟',
    icon: 'headset', // Icon for support
  },
  {
    id: '2',
    name: 'BrightSales',
    description: 'روبوت ذكي يساعد في تأهيل العملاء المحتملين وزيادة المبيعات من خلال التفاعل الشخصي والإجابة على استفسارات المنتجات.',
    shortDescription: 'روبوت مبيعات', // Added short description
    placeholder: 'هل لديك أي استفسار عن منتجاتنا؟',
    icon: 'chart-line', // Icon for sales/growth
  },
  {
    id: '3',
    name: 'BrightRecruiter',
    description: 'روبوت متخصص في عمليات التوظيف، يساعد في فرز السير الذاتية وإجراء المقابلات الأولية وتقييم المرشحين بكفاءة.',
    shortDescription: 'روبوت توظيف', // Added short description
    placeholder: 'أخبرني عن خبراتك أو اسأل عن الوظائف الشاغرة...',
    icon: 'user-tie', // Icon for recruitment/professional
  },
  {
    id: '4',
    name: 'BrightProject',
    description: 'روبوت إدارة مشاريع ذكي يساعد في تنظيم المهام ومتابعة التقدم وتحسين التواصل بين أعضاء الفريق.',
    shortDescription: 'روبوت إدارة مشاريع', // Added short description
    placeholder: 'ما هي المهمة التي تريد تنظيمها أو متابعتها؟',
    icon: 'tasks', // Icon for project management/tasks
  },
  {
    id: '5',
    name: 'BrightMath',
    description: 'مساعد متخصص في تعليم الرياضيات للطلاب الثانوية ومساعدتك في المشاريع، يقدم شرحاً مفصلاً وحلولاً للمسائل الرياضية بأسلوب سهل وتفاعلي.',
    shortDescription: 'مساعد رياضيات', // Added short description
    placeholder: 'ما هي المسألة الرياضية التي تحتاج مساعدة فيها؟',
    icon: 'calculator', // Icon for math
  },
  {
    id: '6',
    name: 'BrightTourism',
    description: 'مرشد سياحي ذكي يقدم معلومات شاملة عن المواقع السياحية والتراثية في المملكة العربية السعودية.',
    shortDescription: 'مرشد سياحي', // Added short description
    placeholder: 'عن أي معلم سياحي في السعودية تود أن تسأل؟',
    icon: 'map-marked-alt', // Icon for tourism/maps
  },
];

// Define the type for an agent item, including the new shortDescription
type Agent = typeof agents[0];

export default function AgentsScreen() {

  const renderAgentItem = ({ item: agent }: { item: Agent }) => ( // Use the Agent type
     <Link
        key={agent.id} // Key should be on the outermost element in the map/renderItem
        href={{
            pathname: `/chat/${agent.id}` as any, // Cast to any to satisfy typed routes
                params: { // Pass data needed by the chat screen (including full description)
                    agentName: agent.name,
                    description: agent.description, // Pass the original full description
                    placeholderText: agent.placeholder
                }
              }}
        asChild // Use TouchableOpacity as the child component for styling/press handling
     >
        <TouchableOpacity style={styles.agentItem}>
            {/* Icon centered at the top */}
            <View style={styles.iconContainer}>
                {/* Reduced icon size */}
                <FontAwesome5 name={agent.icon} size={24} color={COLORS.primary} />
            </View>
            {/* Text below the icon */}
            <View style={styles.agentTextContainer}>
                <Text style={styles.agentName}>{agent.name}</Text>
                {/* Display the short description */}
                <Text style={styles.agentDescription}>{agent.shortDescription}</Text>
            </View>
            {/* Info icon can be placed differently if needed, or removed for grid simplicity */}
            {/* <FontAwesome5 name="info-circle" size={22} color={COLORS.lightGray} style={styles.infoIcon} /> */}
        </TouchableOpacity>
     </Link>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>اختر الوكيل المناسب لك</Text>
        <FlatList
          data={agents}
          renderItem={renderAgentItem}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          style={styles.flatList}
          contentContainerStyle={styles.flatListContent}
          showsVerticalScrollIndicator={false}
        />
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
    paddingHorizontal: 0, // Remove horizontal padding from main container for grid
    paddingTop: SIZES.padding,
  },
  title: {
    ...FONTS.h2,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SIZES.padding * 1.2, // More space below title
    fontWeight: 'bold',
    paddingHorizontal: SIZES.padding, // Add padding back for title
  },
  flatList: {
    flex: 1,
  },
  flatListContent: {
    paddingHorizontal: itemMargin / 2, // Half margin on the sides of the list
    paddingBottom: SIZES.padding,
  },
  agentItem: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius * 1.2, // Standard radius
    marginBottom: itemMargin * 2, // Further increased bottom margin
    marginHorizontal: itemMargin / 2, // Half margin between items
    width: itemWidth, // Set calculated width
    padding: SIZES.padding, // Use full padding value
    alignItems: 'center', // Center content horizontally
    // Keep shadow/elevation
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    // Elevation for Android
    elevation: 5,
    // minHeight: 180, // Removed minHeight to allow cards to grow
  },
  iconContainer: {
      width: 50, // Reduced container size
      height: 50,
      borderRadius: 25, // Adjust border radius for circle
      backgroundColor: `${COLORS.primary}1A`, // Slightly different opacity
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: SIZES.padding * 0.6, // Space below icon
      // marginLeft removed, centering content now
  },
  agentTextContainer: {
      // flex: 1 removed, content is centered
      alignItems: 'center', // Center text horizontally
  },
  agentName: {
    ...FONTS.h4, // Adjusted size for grid item
    fontWeight: 'bold', // Keep bold
    color: COLORS.black,
    marginBottom: SIZES.base * 0.5, // Reduced spacing
    textAlign: 'center', // Center align name
  },
  agentDescription: {
    ...FONTS.body4, // Changed back to body4 for better readability
    color: COLORS.text,
    textAlign: 'center', // Center align description
    paddingHorizontal: SIZES.base / 2, // Add slight horizontal padding
  },
  // infoIcon style removed as the element is removed for simplicity in grid
});
