import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Modal, Button } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface Product {
  id: number;
  name: string;
  description: string;
  detailedDescription: string; // Added detailed description field
  price: number;
  delivery: string;
  imageUrl?: string;
  features: string[];
  category: string;
}

interface CartItem extends Product {}

const products: Product[] = [
  {
    id: 1,
    name: 'تحليل بيانات المبيعات الشهرية',
    description: 'تحليل شامل ومفصل لأداء المبيعات يساعد على تحسين الكفاءة التشغيلية وزيادة الإيرادات.',
    detailedDescription: 'نقدم خدمة تحليل بيانات المبيعات الشهرية لمساعدتك على فهم أداء عملك بشكل أعمق. نقوم بتحليل الاتجاهات، وتحديد المنتجات الأكثر ربحية، وتقييم فعالية الحملات التسويقية. ستحصل على تقارير مرئية وتوصيات قابلة للتنفيذ لتحسين استراتيجيات المبيعات وزيادة الأرباح.\n\nالفوائد والعوائد المالية: زيادة الإيرادات من خلال تحسين استهداف العملاء والعروض، خفض التكاليف بتحديد العمليات غير الفعالة، وتحسين العائد على الاستثمار التسويقي.',
    price: 267,
    delivery: '5-7 أيام عمل',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGF0YSUyMGFuYWx5c2lzfGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60',
    features: [
      'تحليل اتجاهات المبيعات',
      'تقارير أداء المنتجات', 
      'تحليل سلوك العملاء'
    ],
    category: 'تحليل البيانات'
  },
  {
    id: 2,
    name: 'تحليل وتقسيم العملاء',
    description: 'تقسيم العملاء إلى شرائح وتحليل سلوكهم لتحسين استراتيجيات التسويق وزيادة الولاء.',
    detailedDescription: 'تساعدك خدمة تحليل وتقسيم العملاء على فهم قاعدة عملائك بشكل أفضل. نقوم بتقسيم عملائك بناءً على معايير ديموغرافية وسلوكية، ونحلل أنماط الشراء والقيمة الدائمة لكل شريحة. تمكنك هذه الرؤى من تخصيص حملاتك التسويقية وتحسين تجربة العملاء لزيادة الولاء والإيرادات.\n\nالفوائد والعوائد المالية: زيادة معدلات التحويل والاحتفاظ بالعملاء من خلال التسويق المخصص، تحسين قيمة العميل الدائمة (CLV)، وزيادة فعالية الإنفاق التسويقي.',
    price: 301,
    delivery: '7-10 أيام عمل',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGRhdGElMjBhbmFseXRpY3N8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60',
    features: [
      'تحليل سلوك الشراء',
      'تقسيم العملاء',
      'توصيات تسويقية مخصصة'
    ],
    category: 'تحليل البيانات'
  },
  {
    id: 3,
    name: 'تحليل بيانات العملاء والسوق',
    description: 'تقسيم وتحليل بيانات العملاء والسوق باستخدام تقنيات الذكاء الاصطناعي لتحسين استراتيجيات التسويق.',
    detailedDescription: 'استفد من قوة الذكاء الاصطناعي في تحليل بيانات العملاء والسوق. نستخدم خوارزميات متقدمة لتحديد الاتجاهات الناشئة، وفهم تفضيلات العملاء، وتقييم المشهد التنافسي. ستمكنك هذه الخدمة من اتخاذ قرارات تسويقية مستنيرة وتطوير استراتيجيات نمو فعالة.\n\nالفوائد والعوائد المالية: اكتشاف فرص سوقية جديدة، تحسين تطوير المنتجات بناءً على احتياجات العملاء، وزيادة الحصة السوقية من خلال فهم أفضل للمنافسين.',
    price: 300,
    delivery: '5-13 يوم',
    imageUrl: 'https://images.unsplash.com/photo-1488229297570-58520851e868?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZGF0YSUyMHZpc3VhbGl6YXRpb258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60',
    features: [],
    category: 'تحليل البيانات'
  },
  {
    id: 4,
    name: 'تحليل البيانات الصناعية والإنتاجية',
    description: 'استخدام الذكاء الاصطناعي لتحليل بيانات الإنتاج والعمليات الصناعية لزيادة الكفاءة وتقليل الهدر.',
    detailedDescription: 'تهدف هذه الخدمة إلى تحسين العمليات الصناعية من خلال تحليل بيانات الإنتاج. نستخدم الذكاء الاصطناعي لتحديد نقاط الاختناق، وتحسين جداول الصيانة، وتقليل الهدر في المواد والطاقة. ستحصل على رؤى قيمة لزيادة كفاءة الإنتاج وخفض التكاليف التشغيلية.\n\nالفوائد والعوائد المالية: خفض تكاليف الإنتاج من خلال تقليل الهدر وتحسين الكفاءة، زيادة الإنتاجية وتقليل وقت التوقف عن العمل، وتحسين جودة المنتج النهائي.',
    price: 350,
    delivery: '5-13 يوم',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aW5kdXN0cmlhbCUyMGRhdGF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60',
    features: [],
    category: 'تحليل البيانات'
  },
  {
    id: 5,
    name: 'تحليل البيانات الصحية',
    description: 'تحليل بيانات الرعاية الصحية باستخدام الذكاء الاصطناعي لتحسين جودة الخدمات الطبية واتخاذ القرارات العلاجية.',
    detailedDescription: 'نقدم حلول تحليل بيانات متقدمة لقطاع الرعاية الصحية. نستخدم الذكاء الاصطناعي لتحليل السجلات الطبية، والتنبؤ بتفشي الأمراض، وتحسين خطط العلاج. تهدف خدمتنا إلى دعم مقدمي الرعاية الصحية في اتخاذ قرارات أفضل وتحسين نتائج المرضى.\n\nالفوائد والعوائد المالية: تحسين كفاءة تخصيص الموارد الطبية، خفض تكاليف العلاج من خلال التشخيص المبكر والوقاية، وزيادة رضا المرضى من خلال تحسين جودة الرعاية.',
    price: 400,
    delivery: '5-13 يوم',
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGVhbHRoJTIwZGF0YXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60',
    features: [],
    category: 'تحليل البيانات'
  },
  {
    id: 6,
    name: 'تحليل بيانات وسائل التواصل الاجتماعي',
    description: 'تحليل تفاعلات وسائل التواصل الاجتماعي باستخدام الذكاء الاصطناعي لفهم سلوك المستخدمين والتوجهات الرقمية.',
    detailedDescription: 'اكتشف الرؤى القيمة من بيانات وسائل التواصل الاجتماعي. نقوم بتحليل المحادثات، وقياس المشاعر، وتحديد المؤثرين الرئيسيين، وتتبع أداء الحملات. تساعدك هذه الخدمة على فهم جمهورك بشكل أفضل، وتحسين استراتيجيات المحتوى، وتعزيز سمعة علامتك التجارية.\n\nالفوائد والعوائد المالية: زيادة فعالية حملات التسويق عبر وسائل التواصل، تحسين خدمة العملاء من خلال مراقبة الاستفسارات والشكاوى، وتعزيز الوعي بالعلامة التجارية وزيادة المتابعين.',
    price: 200,
    delivery: '5-13 يوم',
    imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c29jaWFsJTIwbWVkaWElMjBhbmFseXRpY3N8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60',
    features: [],
    category: 'تحليل البيانات'
  },
  {
    id: 7,
    name: 'أتمتة خدمة العملاء',
    description: 'استخدام تقنيات الذكاء الاصطناعي لتحسين خدمة العملاء من خلال الدردشة الآلية والردود الذكية.',
    detailedDescription: 'قم بتحسين تجربة خدمة العملاء وتقليل أوقات الانتظار باستخدام حلول الأتمتة الذكية. نوفر روبوتات دردشة قادرة على فهم استفسارات العملاء وتقديم ردود فورية ودقيقة على مدار الساعة. يمكن دمج هذه الحلول مع أنظمة إدارة علاقات العملاء الحالية لديك.\n\nالفوائد والعوائد المالية: خفض تكاليف خدمة العملاء من خلال تقليل الحاجة إلى وكلاء بشريين للمهام المتكررة، زيادة رضا العملاء من خلال الاستجابة السريعة، وتحسين كفاءة فريق الدعم.',
    price: 300,
    delivery: '5-13 يوم',
    imageUrl: 'https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGFpJTIwYm90fGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60',
    features: [],
    category: 'أتمتة الأعمال'
  },
  {
    id: 8,
    name: 'أتمتة إدارة البيانات والوثائق',
    description: 'تحويل العمليات اليدوية لإدارة البيانات والوثائق إلى آلية باستخدام الذكاء الاصطناعي.',
    detailedDescription: 'تخلص من المهام اليدوية المتكررة في إدارة البيانات والوثائق. نستخدم الذكاء الاصطناعي لأتمتة عمليات إدخال البيانات، وتصنيف المستندات، واستخراج المعلومات الهامة. يؤدي ذلك إلى زيادة الدقة، وتقليل الأخطاء، وتحرير وقت موظفيك للتركيز على المهام الأكثر قيمة.\n\nالفوائد والعوائد المالية: خفض التكاليف الإدارية المرتبطة بإدارة البيانات اليدوية، زيادة الإنتاجية من خلال تسريع العمليات، وتحسين الامتثال وتقليل مخاطر الأخطاء.',
    price: 400,
    delivery: '5-13 يوم',
    imageUrl: 'https://images.unsplash.com/photo-1581092916376-14950a7d999c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGF1dG9tYXRpb258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60',
    features: [],
    category: 'أتمتة الأعمال'
  },
  {
    id: 9,
    name: 'أتمتة عمليات التسويق الرقمي',
    description: 'استخدام الذكاء الاصطناعي لأتمتة حملات التسويق الرقمي وتحليل الأداء لتحسين النتائج.',
    detailedDescription: 'عزز جهودك في التسويق الرقمي من خلال الأتمتة الذكية. نقوم بأتمتة إدارة الحملات الإعلانية، وتحسين استهداف الجمهور، وتخصيص رسائل البريد الإلكتروني، وتحليل أداء القنوات المختلفة. تساعدك هذه الخدمة على زيادة عائد الاستثمار التسويقي وتحقيق نتائج أفضل.\n\nالفوائد والعوائد المالية: زيادة عائد الاستثمار (ROI) من الحملات التسويقية، تحسين كفاءة فريق التسويق، وزيادة توليد العملاء المحتملين والمبيعات.',
    price: 600,
    delivery: '5-13 يوم',
    imageUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGRpZ2l0YWwlMjBtYXJrZXRpbmclMjBhdXRvbWF0aW9ufGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60',
    features: [],
    category: 'أتمتة الأعمال'
  },
  {
    id: 10,
    name: 'أتمتة إدارة الموارد البشرية',
    description: 'استخدام الذكاء الاصطناعي لأتمتة مهام الموارد البشرية مثل التوظيف والتدريب وإدارة الأداء.',
    detailedDescription: 'قم بتحويل وظائف الموارد البشرية لديك باستخدام الذكاء الاصطناعي. نقدم حلولاً لأتمتة فحص السير الذاتية، وجدولة المقابلات، وتخصيص خطط التدريب، وتحليل أداء الموظفين. تهدف هذه الخدمة إلى تحسين كفاءة عمليات الموارد البشرية وتعزيز تجربة الموظفين.\n\nالفوائد والعوائد المالية: خفض تكاليف التوظيف والإدارة، زيادة إنتاجية الموظفين من خلال تحسين التدريب وإدارة الأداء، وتحسين معدلات الاحتفاظ بالموظفين.',
    price: 2700,
    delivery: '5-13 يوم',
    imageUrl: 'https://images.unsplash.com/photo-1516110833967-0b5716ca1387?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGF1dG9tYXRpb258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60',
    features: [],
    category: 'أتمتة الأعمال'
  },
  {
    id: 11,
    name: 'وكيل مخصص',
    description: 'نصمم وكيلاً ذكياً مخصصاً وفقاً لاحتياجاتك ومتطلبات عملك.',
    detailedDescription: 'هل لديك مهمة محددة تتطلب حلاً ذكياً؟ نقوم بتصميم وتطوير وكلاء ذكاء اصطناعي مخصصين لتلبية احتياجات عملك الفريدة. سواء كان ذلك لأتمتة عملية معقدة، أو تحليل بيانات متخصصة، أو تقديم توصيات مخصصة، يمكننا بناء الوكيل المثالي لك.\n\nالفوائد والعوائد المالية: حل مشاكل عمل محددة وتحقيق أهداف استراتيجية، زيادة الكفاءة التشغيلية في مجالات مستهدفة، وخلق ميزة تنافسية من خلال حلول مبتكرة.',
    price: 700,
    delivery: '5-13 يوم',
    imageUrl: 'https://images.unsplash.com/photo-1535378620166-273708d44e4c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YWklMjBhZ2VudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60',
    features: [],
    category: 'وكلاء الذكاء الاصطناعي'
  },
  {
    id: 12,
    name: 'وكيل محلل البيانات',
    description: 'يقوم بتحليل البيانات واستخراج النماذج والاتجاهات الهامة.',
    detailedDescription: 'احصل على وكيل ذكاء اصطناعي متخصص في تحليل البيانات. يقوم هذا الوكيل بمعالجة مجموعات البيانات الكبيرة، وتحديد الارتباطات، واكتشاف الأنماط المخفية، وتقديم رؤى قابلة للتنفيذ. مثالي للشركات التي تحتاج إلى قدرات تحليل بيانات متقدمة دون الحاجة إلى فريق متخصص.\n\nالفوائد والعوائد المالية: اتخاذ قرارات عمل أفضل بناءً على البيانات، تحسين الكفاءة من خلال تحديد الاتجاهات والأنماط، وزيادة الربحية من خلال فهم أعمق للسوق والعملاء.',
    price: 499,
    delivery: '5-13 يوم',
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4658e7485?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YWklMjByb2JvdHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60',
    features: [],
    category: 'وكلاء الذكاء الاصطناعي'
  },
  {
    id: 13,
    name: 'وكيل تسويق',
    description: 'يساعد في تنفيذ استراتيجيات التسويق الفعالة لزيادة المبيعات.',
    detailedDescription: 'عزز فريق التسويق لديك بوكيل ذكاء اصطناعي. يمكن لهذا الوكيل المساعدة في إنشاء المحتوى، وإدارة حملات وسائل التواصل الاجتماعي، وتحسين محركات البحث (SEO)، وتحليل أداء التسويق. يعمل الوكيل كشريك استراتيجي لتحقيق أهدافك التسويقية.\n\nالفوائد والعوائد المالية: زيادة فعالية الحملات التسويقية وتحسين عائد الاستثمار، توفير الوقت والموارد لفريق التسويق، وزيادة المبيعات والوعي بالعلامة التجارية.',
    price: 499,
    delivery: '5-13 يوم',
    imageUrl: 'https://images.unsplash.com/photo-1557862921-37829c790f19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bWFya2V0aW5nJTIwYWdlbnR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60',
    features: [],
    category: 'وكلاء الذكاء الاصطناعي'
  },
  {
    id: 14,
    name: 'وكيل محسن لمحركات البحث',
    description: 'يعمل على تحسين موقعك لمحركات البحث لزيادة الظهور.',
    detailedDescription: 'حسّن ترتيب موقعك في نتائج البحث باستخدام وكيل SEO ذكي. يقوم هذا الوكيل بتحليل الكلمات المفتاحية، ومراقبة المنافسين، وتقديم توصيات لتحسين المحتوى والجوانب التقنية للموقع، وبناء الروابط الخلفية. يساعدك على زيادة حركة المرور العضوية وتحقيق ظهور أفضل.\n\nالفوائد والعوائد المالية: زيادة حركة المرور العضوية (المجانية) إلى موقعك، تحسين مصداقية وظهور العلامة التجارية، وزيادة العملاء المحتملين والمبيعات من خلال البحث.',
    price: 499,
    delivery: '5-13 يوم',
    imageUrl: 'https://images.unsplash.com/photo-1562577309-2592ab84b1bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c2VvfGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60',
    features: [],
    category: 'وكلاء الذكاء الاصطناعي'
  }
];

export default function ProductsScreen() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<'bank' | 'paypal' | null>(null);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false); // State for details modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); // State for selected product details

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
            <Image 
              source={{ uri: item.imageUrl || 'https://placehold.co/600x400/EEE/31343C?text=Product+Image' }}
              style={styles.productImage}
            />
      <View style={styles.productContent}>
        <Text style={styles.productCategory}>{item.category}</Text>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productDescription}>{item.description}</Text>
        
        {item.features.length > 0 && (
          <View style={styles.featuresContainer}>
            {item.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <MaterialIcons name="check-circle" size={16} color="#28a745" />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Image 
              source={{ uri: 'https://k.top4top.io/p_3376ht9ju1.png' }}
              style={styles.currencyIcon}
            />
            <Text style={styles.price}>{item.price}</Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialIcons name="access-time" size={20} color="#6c757d" />
            <Text style={styles.delivery}>تسليم خلال {item.delivery}</Text>
          </View>
        </View>
        
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={styles.detailsButton} // New style for details button
            onPress={() => {
              setSelectedProduct(item);
              setIsDetailsVisible(true);
            }}
          >
            <Text style={styles.detailsButtonText}>التفاصيل</Text>
            <MaterialIcons name="info-outline" size={20} color="#4285f4" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.buyButton}
            onPress={() => addToCart(item)}
          >
            <Text style={styles.buyButtonText}>شراء الآن</Text>
            <MaterialIcons name="shopping-cart" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
      />

      {cart.length > 0 && (
        <TouchableOpacity 
          style={styles.cartButton}
          onPress={() => setIsCartVisible(true)}
        >
          <Text style={styles.cartButtonText}>عرض السلة ({cart.length})</Text>
          <MaterialIcons name="shopping-cart" size={20} color="white" />
        </TouchableOpacity>
      )}

      <Modal
        visible={isCartVisible}
        animationType="slide"
        onRequestClose={() => setIsCartVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>سلة التسوق</Text>
          
          {cart.length === 0 ? (
            <Text style={styles.emptyCart}>السلة فارغة</Text>
          ) : (
            <>
              <FlatList
                data={cart}
                renderItem={({ item }) => (
                  <View style={styles.cartItem}>
                    <Text style={styles.cartItemName}>{item.name}</Text>
                    <View style={styles.cartPriceContainer}>
                      <Image 
                        source={{ uri: 'https://k.top4top.io/p_3376ht9ju1.png' }}
                        style={styles.currencyIconSmall}
                      />
                      <Text style={styles.cartItemPrice}>{item.price}</Text>
                    </View>
                    <Button 
                      title="إزالة" 
                      onPress={() => removeFromCart(item.id)} 
                      color="#ff4444"
                    />
                  </View>
                )}
                keyExtractor={item => item.id.toString()}
              />

              <View style={styles.totalContainer}>
                <View style={styles.totalRow}>
                  <Image 
                    source={{ uri: 'https://k.top4top.io/p_3376ht9ju1.png' }}
                    style={styles.currencyIcon}
                  />
                  <Text style={styles.totalText}>المجموع: {totalPrice}</Text>
                </View>
              </View>

              <View style={styles.paymentMethods}>
                <Text style={styles.paymentTitle}>طرق الدفع:</Text>
                
                <TouchableOpacity
                  style={[
                    styles.paymentButton,
                    selectedPayment === 'bank' && styles.selectedPayment
                  ]}
                  onPress={() => setSelectedPayment('bank')}
                >
                  <Text style={styles.paymentButtonText}>تحويل بنكي</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.paymentButton, 
                    selectedPayment === 'paypal' && styles.selectedPayment
                  ]}
                  onPress={() => setSelectedPayment('paypal')}
                >
                  <Text style={styles.paymentButtonText}>PayPal</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[
                  styles.checkoutButton,
                  !selectedPayment && styles.disabledButton
                ]}
                disabled={!selectedPayment}
                onPress={() => {
                  alert(`تم اختيار الدفع عن طريق ${selectedPayment === 'bank' ? 'تحويل بنكي' : 'PayPal'}`);
                  setCart([]);
                  setIsCartVisible(false);
                }}
              >
                <Text style={styles.checkoutButtonText}>إتمام الشراء</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsCartVisible(false)}
          >
            <Text style={styles.closeButtonText}>إغلاق</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Details Modal */}
      <Modal
        visible={isDetailsVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsDetailsVisible(false)}
      >
        <View style={styles.detailsModalOverlay}>
          <View style={styles.detailsModalContainer}>
            <Text style={styles.detailsModalTitle}>{selectedProduct?.name}</Text>
            <Text style={styles.detailsModalDescription}>{selectedProduct?.detailedDescription}</Text>
            <TouchableOpacity
              style={styles.detailsCloseButton}
              onPress={() => setIsDetailsVisible(false)}
            >
              <Text style={styles.detailsCloseButtonText}>إغلاق</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 15
  },
  listContent: {
    paddingBottom: 100
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5
  },
  productImage: {
    width: '100%',
    height: 180
  },
  productContent: {
    padding: 15
  },
  productCategory: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 5,
    textAlign: 'right'
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'right',
    color: '#212529'
  },
  productDescription: {
    fontSize: 15,
    color: '#495057',
    marginBottom: 12,
    textAlign: 'right',
    lineHeight: 22
  },
  featuresContainer: {
    marginBottom: 15
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    justifyContent: 'flex-end'
  },
  featureText: {
    fontSize: 14,
    color: '#343a40',
    marginRight: 5,
    textAlign: 'right'
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginLeft: 5
  },
  currencyIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain'
  },
  currencyIconSmall: {
    width: 16,
    height: 16,
    resizeMode: 'contain'
  },
  cartPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  delivery: {
    fontSize: 14,
    color: '#6c757d',
    marginLeft: 5
  },
  buttonRow: { // Container for the two buttons
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  detailsButton: { // Style for the new Details button
    backgroundColor: '#e3f2fd', // Light blue background
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1, // Take up half the space
    marginRight: 5, // Add some space between buttons
    borderWidth: 1,
    borderColor: '#4285f4',
  },
  detailsButtonText: { // Text style for Details button
    color: '#4285f4', // Blue text
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 8, // Swapped margin to right for RTL
  },
  buyButton: {
    backgroundColor: '#4285f4',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1, // Take up half the space
    marginLeft: 5, // Add some space between buttons
  },
  buyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 8 // Swapped margin to right for RTL
  },
  cartButton: {
    position: 'absolute',
    top: 50, // Changed from bottom to top, adjusted value for status bar etc.
    right: 30,
    backgroundColor: '#FF6B6B',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8
  },
  cartButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 10
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa'
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#212529'
  },
  emptyCart: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
    color: '#6c757d'
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
    marginBottom: 10
  },
  cartItemName: {
    flex: 2,
    textAlign: 'right',
    fontSize: 16
  },
  cartItemPrice: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#2e7d32'
  },
  totalContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#e9ecef',
    borderRadius: 8
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#212529'
  },
  paymentMethods: {
    marginTop: 20
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'right',
    color: '#212529'
  },
  paymentButton: {
    backgroundColor: '#e9ecef',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10
  },
  selectedPayment: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
    borderWidth: 1
  },
  paymentButtonText: {
    fontSize: 16,
    textAlign: 'center'
  },
  checkoutButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    marginTop: 20
  },
  disabledButton: {
    backgroundColor: '#6c757d'
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  closeButton: {
    marginTop: 20,
    padding: 10
  },
  closeButtonText: {
    color: '#4285f4',
    fontSize: 16,
    textAlign: 'center'
  },
  // Styles for Details Modal
  detailsModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  detailsModalContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 25,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  detailsModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'right',
    color: '#212529',
  },
  detailsModalDescription: {
    fontSize: 16,
    color: '#495057',
    marginBottom: 25,
    textAlign: 'right',
    lineHeight: 24,
  },
  detailsCloseButton: {
    backgroundColor: '#6c757d',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  detailsCloseButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
