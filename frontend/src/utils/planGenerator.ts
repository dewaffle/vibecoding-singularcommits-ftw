import { TripPlan, TripSetupData, DailyPlan, TimelineItem } from '../types';
import { SAMPLE_RIYADH_PLAN } from '../data/mockPlans';
import { SAUDI_DESTINATIONS } from '../data/destinations';

export function generateSmartTripPlan(setupData: TripSetupData): TripPlan {
  const destinationObj = SAUDI_DESTINATIONS.find(d => d.id === setupData.destination) || SAUDI_DESTINATIONS[0];
  
  // If Riyadh is selected, build or refine around SAMPLE_RIYADH_PLAN
  if (setupData.destination === 'riyadh' || setupData.destination === 'diriyah') {
    return {
      ...SAMPLE_RIYADH_PLAN,
      durationDays: setupData.duration,
      travelersText: getTravelersText(setupData),
      dailyPlans: SAMPLE_RIYADH_PLAN.dailyPlans.slice(0, setupData.duration)
    };
  }

  // Generate dynamic custom plans for other cities (AlUla, Jeddah, Abha, Madinah)
  if (setupData.destination === 'alula') {
    return createAlUlaPlan(setupData, destinationObj.nameAr);
  } else if (setupData.destination === 'jeddah') {
    return createJeddahPlan(setupData, destinationObj.nameAr);
  } else if (setupData.destination === 'abha') {
    return createAbhaPlan(setupData, destinationObj.nameAr);
  } else if (setupData.destination === 'madinah') {
    return createMadinahPlan(setupData, destinationObj.nameAr);
  }

  // Default fallback
  return {
    ...SAMPLE_RIYADH_PLAN,
    destinationName: destinationObj.nameAr,
    durationDays: setupData.duration,
    travelersText: getTravelersText(setupData),
    dailyPlans: SAMPLE_RIYADH_PLAN.dailyPlans.slice(0, setupData.duration)
  };
}

function getTravelersText(setup: TripSetupData): string {
  const typeMap: Record<string, string> = {
    solo: 'مسافر بمفردي',
    family: 'عائلة',
    friends: 'مجموعة أصدقاء',
    accessible: 'متطلبات إتاحة خاصة / كبار السن'
  };
  return `${typeMap[setup.travelersType] || 'مسافرون'} (${setup.travelersCount} أفراد)`;
}

function createAlUlaPlan(setup: TripSetupData, nameAr: string): TripPlan {
  const dailyPlans: DailyPlan[] = [
    {
      dayNumber: 1,
      date: 'اليوم الأول - عجائب الحِجر والبلدة القديمة',
      theme: 'اكتشاف حضارة الأنباط والواحة التاريخية مع مرشد متخصص',
      weatherSummary: {
        tempRange: '18°م - 26°م',
        condition: 'أجواء عليلة ولطيفة جداً',
        icon: 'Sun'
      },
      prayerSummary: [
        { name: 'الفجر', time: '04:55 ص', mosque: 'مصلى المنتجع' },
        { name: 'الظهر', time: '12:05 م', mosque: 'مسجد بلدة العلا القديمة' },
        { name: 'العصر', time: '03:25 م', mosque: 'مسجد الواحة' },
        { name: 'المغرب', time: '05:48 م', mosque: 'مصلى صخرة الفيل' },
        { name: 'العشاء', time: '07:18 م', mosque: 'جامع الحجر' }
      ],
      items: [
        {
          id: 'alula-101',
          type: 'activity',
          time: '08:30 ص - 11:30 ص',
          title: 'جولة الحِجر الأثرية ومقابر الأنباط المحفورة',
          subtitle: 'أول موقع سعودي في قائمة التراث العالمي اليونسكو',
          locationName: 'موقع الحِجر الأثري',
          locationArea: 'العُلا',
          duration: '3 ساعات',
          transport: 'حافلة كهربائية ميسرة ومكيفة',
          description: 'جولة بسيارة جيب أو حافلة فاخرة بين مقابر قصر الفريد، وجبل إثلب ومقابر الخريمات النبطية.',
          imageUrl: 'https://images.unsplash.com/photo-1627916607164-7b20241db935?auto=format&fit=crop&w=800&q=80',
          category: 'آثار عالمية',
          weatherInfo: {
            temp: '20°م',
            condition: 'شمس صباحية دافئة ونسيم واحة لطيف',
            isIdeal: true
          },
          trafficInfo: {
            status: 'smooth',
            label: 'مسار الحافلات مخصص وسلس جداً'
          },
          accessibilityInfo: {
            isAccessible: true,
            notes: 'حافلات مكيفة مجهزة بمنصة كراسي متحركة ومسارات مستوية'
          }
        },
        {
          id: 'alula-102',
          type: 'prayer',
          time: '12:00 م - 12:40 م',
          title: 'استراحة صلاة الظهر في بلدة العلا القديمة',
          locationName: 'مسجد البلدة القديمة العريق',
          locationArea: 'العُلا القديمة',
          duration: '40 دقيقة',
          transport: '10 دقائق بالسيارة',
          description: 'أداء صلاة الظهر والاستراحة بين مباني الطين والمتاجر الحرفية التراثية.',
          category: 'استراحة صلاة',
          prayerInfo: {
            name: 'صلاة الظهر (12:05 م)',
            mosqueName: 'مسجد بلدة العلا القديمة'
          }
        },
        {
          id: 'alula-103',
          type: 'meal',
          time: '01:00 م - 02:30 م',
          title: 'غداء تحت ظلال نخيل الواحة في مطعم سهيل العُلا',
          locationName: 'واحة العُلا - الممر الخضري',
          locationArea: 'الواحة',
          duration: 'ساعة ونصف',
          transport: 'مشياً 5 دقائق عبر ممر الواحة',
          description: 'وجبة غداء أورجانيك من خيرات الواحة الحمضية والتمور الفاخرة.',
          category: 'مطاعم الواحة',
          accessibilityInfo: {
            isAccessible: true,
            notes: 'مسارات خشبية ممهدة بين الأشجار'
          }
        },
        {
          id: 'alula-104',
          type: 'activity',
          time: '04:30 م - 07:00 م',
          title: 'جلسة غروب وسحر النجوم عند صخرة الفيل',
          subtitle: 'تكوين صخري طبيعي عملاق وسط الرمال الذهبية',
          locationName: 'صخرة الفيل (Elephant Rock)',
          locationArea: 'صحراء العُلا',
          duration: 'ساعتان ونصف',
          transport: '15 دقيقة بالسيارة',
          description: 'الجين المريح في جلسات دائرية غاطسة بالرمال مع شرب القهوة السعودية ومتابعة إضاءة الجبل الساحرة.',
          imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
          category: 'طبيعة وغروب',
          weatherInfo: {
            temp: '22°م',
            condition: 'برودة الخريف الساحرة مع شبة نار دافئة',
            isIdeal: true
          },
          accessibilityInfo: {
            isAccessible: true,
            notes: 'مسارات خشبية من الموقف حتى الجلسات'
          }
        }
      ]
    }
  ];

  return {
    id: 'plan-alula',
    destinationName: nameAr,
    destinationCode: 'alula',
    durationDays: setup.duration,
    startDate: setup.startDate || '2026-11-01',
    travelersText: getTravelersText(setup),
    preferences: setup.preferences,
    hasAlternativePlan: true,
    alternativeReason: 'تجنب حرارة الظهيرة وتغيير جولة الواحة المفتوحة إلى المعرض الداخلي لمرايا',
    dailyPlans: dailyPlans.slice(0, setup.duration),
    alternativePlans: dailyPlans
  };
}

function createJeddahPlan(setup: TripSetupData, nameAr: string): TripPlan {
  const dailyPlans: DailyPlan[] = [
    {
      dayNumber: 1,
      date: 'اليوم الأول - عروس البحر ورواشين البلد التاريخية',
      theme: 'رحلة بين حواري جدة القديمة، مساجدها العريقة والكورنيش الساحلي',
      weatherSummary: {
        tempRange: '25°م - 30°م',
        condition: 'نسيم ساحلي لطيف',
        icon: 'Sun'
      },
      prayerSummary: [
        { name: 'الفجر', time: '05:00 ص', mosque: 'مسجد الفندق' },
        { name: 'الظهر', time: '12:15 م', mosque: 'مسجد الشافعي التاريخي بالبلد' },
        { name: 'العصر', time: '03:35 م', mosque: 'مسجد المعمار' },
        { name: 'المغرب', time: '05:58 م', mosque: 'المسجد العائم (مسجد الرحمة)' },
        { name: 'العشاء', time: '07:28 م', mosque: 'جامع تقوى الكورنيش' }
      ],
      items: [
        {
          id: 'jed-101',
          type: 'activity',
          time: '09:00 ص - 12:00 م',
          title: 'جولة رواشين جدة التاريخية (حي البلد)',
          subtitle: 'موقع تراث عالمي مسجل باليونسكو',
          locationName: 'حي البلد التاريخي',
          locationArea: 'وسط جدة',
          duration: '3 ساعات',
          transport: '15 دقيقة بالسيارة من الكورنيش',
          description: 'استكشف بيت نصيف، بيت المتبولي، والأزقة الحجازية المتميزة برواشين خشب التيك والمقاهي التقليدية.',
          imageUrl: 'https://images.unsplash.com/photo-1578898835028-267b093314a8?auto=format&fit=crop&w=800&q=80',
          category: 'تراث حجازي',
          weatherInfo: {
            temp: '26°م',
            condition: 'ظل المظلات الخشبية ورسيم البحر',
            isIdeal: true
          },
          accessibilityInfo: {
            isAccessible: true,
            notes: 'عربات جولف تراثية ميسرة متوفرة عند باب مكة'
          }
        },
        {
          id: 'jed-102',
          type: 'prayer',
          time: '12:10 م - 01:00 م',
          title: 'صلاة الظهر في أقدم مساجد جدة (مسجد الشافعي)',
          locationName: 'مسجد الشافعي التاريخي',
          locationArea: 'حارة المظلوم - البلد',
          duration: '50 دقيقة',
          transport: 'مشياً 3 دقائق من بيت نصيف',
          description: 'أداء الصلاة في مسجد يعود تاريخه لأكثر من 1400 عام والمبني من أحجار الشعب المرجانية.',
          category: 'مساجد عريقة',
          prayerInfo: {
            name: 'صلاة الظهر (12:15 م)',
            mosqueName: 'مسجد الشافعي التاريخي'
          }
        },
        {
          id: 'jed-103',
          type: 'meal',
          time: '01:15 م - 03:00 م',
          title: 'غداء أسماك حجازي في مطعم السقالة / المطاعم البحرية',
          locationName: 'الكورنيش الأوسط',
          locationArea: 'جدة البحرية',
          duration: 'ساعة ونصف',
          transport: '12 دقيقة بالسيارة',
          description: 'تذوق أطباق السي فود الطازجة والناجل والحريد المطبوخة بالبهارات الحجازية الأصيلة.',
          category: 'مأكولات بحرية'
        },
        {
          id: 'jed-104',
          type: 'activity',
          time: '05:00 م - 08:00 م',
          title: 'جولة الغروب في الكورنيش والواجهة البحرية والمسجد العائم',
          subtitle: 'عرض نافورة الملك فهد الأطول عالمياً',
          locationName: 'واحة الكورنيش الشمالي والمسجد العائم',
          locationArea: 'الكورنيش',
          duration: '3 ساعات',
          transport: '10 دقائق مشياً أو بالسيارة',
          description: 'المشي على الجسور البحرية الممتدة فوق مياه البحر الأحمر ومتابعة إضاءة نافورة الملك فهد الساحرة.',
          category: 'بحر وترفيه',
          weatherInfo: {
            temp: '27°م',
            condition: 'أجواء مسائية ساحلية منعشة',
            isIdeal: true
          },
          accessibilityInfo: {
            isAccessible: true,
            notes: 'مسارات المشاة بالواجهة البحرية مسطحة ومجهزة بمصاعد ودورات مياه ميسرة'
          }
        }
      ]
    }
  ];

  return {
    id: 'plan-jeddah',
    destinationName: nameAr,
    destinationCode: 'jeddah',
    durationDays: setup.duration,
    startDate: setup.startDate || '2026-10-20',
    travelersText: getTravelersText(setup),
    preferences: setup.preferences,
    hasAlternativePlan: true,
    alternativeReason: 'تجنب رطوبة الكورنيش المرتفعة ونقل النشاط المسائي لمتحف قصر خزام المكيف',
    dailyPlans: dailyPlans.slice(0, setup.duration),
    alternativePlans: dailyPlans
  };
}

function createAbhaPlan(setup: TripSetupData, nameAr: string): TripPlan {
  const dailyPlans: DailyPlan[] = [
    {
      dayNumber: 1,
      date: 'اليوم الأول - قمم عسير الخضراء وضباب السودة',
      theme: 'استنشاق هواء الجبال العليل واكتشاف الفنون العسيرية التراثية',
      weatherSummary: {
        tempRange: '14°م - 22°م',
        condition: 'غائم جزئياً مع ضباب خفيف',
        icon: 'CloudRain'
      },
      prayerSummary: [
        { name: 'الفجر', time: '04:50 ص', mosque: 'مصلى الفندق' },
        { name: 'الظهر', time: '12:08 م', mosque: 'مسجد قمم السودة' },
        { name: 'العصر', time: '03:28 م', mosque: 'جامع قرية رجال ألمع' },
        { name: 'المغرب', time: '05:51 م', mosque: 'جامع الجبل الأخضر' },
        { name: 'العشاء', time: '07:21 م', mosque: 'جامع الملك فهد بأبها' }
      ],
      items: [
        {
          id: 'abha-101',
          type: 'activity',
          time: '09:00 ص - 12:00 م',
          title: 'جولة منتزه السودة والتلفريك فوق جبال عسير',
          subtitle: 'أعلى قمة جبلية في المملكة بارتفاع 3,000 متر',
          locationName: 'منتزه السودة الوطني',
          locationArea: 'جبال أبها',
          duration: '3 ساعات',
          transport: '20 دقيقة بالسيارة من وسط المدينة',
          description: 'إطلالات على أودية تهامة والقرى المعلقة بين أشجار العرعر والضباب الساحر.',
          imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
          category: 'طبيعة وجبال',
          weatherInfo: {
            temp: '16°م',
            condition: 'طقس رائع بارد يحتاج سترة خفيفة',
            isIdeal: true
          },
          accessibilityInfo: {
            isAccessible: true,
            notes: 'عربات التلفريك مجهزة للمقاعد المتحركة والمطلات مزودة بروامب'
          }
        },
        {
          id: 'abha-102',
          type: 'activity',
          time: '01:30 م - 04:30 م',
          title: 'زيارة قرية رجال ألمع التراثية ومتحف فن القط العسيري',
          subtitle: 'قصور الحجر متعددة الأدوار الملونة بالنقوش التراثية',
          locationName: 'قرية رجال ألمع التاريخية',
          locationArea: 'محافظة رجال ألمع',
          duration: '3 ساعات',
          transport: '30 دقيقة عبر عقبة الصماء الميسرة',
          description: 'اكتشف فن القط العسيري المدرج في قائمة اليونسكو وعمارة الحصون العسيرية الشامخة.',
          category: 'تراث وفنون'
        }
      ]
    }
  ];

  return {
    id: 'plan-abha',
    destinationName: nameAr,
    destinationCode: 'abha',
    durationDays: setup.duration,
    startDate: setup.startDate || '2026-08-15',
    travelersText: getTravelersText(setup),
    preferences: setup.preferences,
    hasAlternativePlan: false,
    dailyPlans: dailyPlans.slice(0, setup.duration)
  };
}

function createMadinahPlan(setup: TripSetupData, nameAr: string): TripPlan {
  const dailyPlans: DailyPlan[] = [
    {
      dayNumber: 1,
      date: 'اليوم الأول - سكينة طيبة الطيبة والمساجد التاريخية',
      theme: 'الزيارات الروحانية والمشي الميسر في ممرات الحرم الخضراء',
      weatherSummary: {
        tempRange: '20°م - 29°م',
        condition: 'صافي ولطيف',
        icon: 'Sun'
      },
      prayerSummary: [
        { name: 'الفجر', time: '04:52 ص', mosque: 'المسجد النبوي الشريف' },
        { name: 'الظهر', time: '12:02 م', mosque: 'المسجد النبوي الشريف' },
        { name: 'العصر', time: '03:22 م', mosque: 'مسجد قباء' },
        { name: 'المغرب', time: '05:45 م', mosque: 'المسجد النبوي الشريف' },
        { name: 'العشاء', time: '07:15 م', mosque: 'المسجد النبوي الشريف' }
      ],
      items: [
        {
          id: 'mad-101',
          type: 'activity',
          time: '08:00 ص - 10:30 ص',
          title: 'زيارة ممشى الجوار ومسجد قباء التاريخي',
          subtitle: 'أول مسجد أسس على التقوى',
          locationName: 'طريق قباء - الممشى التراثي',
          locationArea: 'المدينة المنورة',
          duration: 'ساعتان ونصف',
          transport: 'حافلة المدينة الذكية أو مشياً',
          description: 'المشي في الطريق المظلل المخصص للمشاة والواصل بين الحرم النبوي الشريف ومسجد قباء.',
          imageUrl: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=800&q=80',
          category: 'روحانيات وتراث',
          weatherInfo: {
            temp: '22°م',
            condition: 'نسمات صُباحية مباركة ومظللة',
            isIdeal: true
          },
          accessibilityInfo: {
            isAccessible: true,
            notes: 'طريق ممهد ومسطح تماماً مخصص للمشاة والسيارات الكهربائية المجانية'
          }
        },
        {
          id: 'mad-102',
          type: 'meal',
          time: '01:00 م - 02:30 م',
          title: 'غداء مديني وتذوق التمور في بستان ومقهى عثمان بن عفان',
          locationName: 'بستان سيدنا عثمان بن عفان رضي الله عنه',
          locationArea: 'المنطقة المركزية',
          duration: 'ساعة ونصف',
          transport: '10 دقائق بالسيارة',
          description: 'الجلسات بين النخيل الباسقة وتذوق تمر العجوة والصفاوي وشرب النعناع المديني الفاخر.',
          category: 'مزارع وتراث'
        }
      ]
    }
  ];

  return {
    id: 'plan-madinah',
    destinationName: nameAr,
    destinationCode: 'madinah',
    durationDays: setup.duration,
    startDate: setup.startDate || '2026-10-10',
    travelersText: getTravelersText(setup),
    preferences: setup.preferences,
    hasAlternativePlan: false,
    dailyPlans: dailyPlans.slice(0, setup.duration)
  };
}
