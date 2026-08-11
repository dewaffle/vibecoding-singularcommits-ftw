import { TripPlan, DailyPlan, TimelineItem } from '../types';

export const SAMPLE_RIYADH_PLAN: TripPlan = {
  id: 'plan-riyadh-01',
  destinationName: 'الرياض والدرعية التاريخية',
  destinationCode: 'riyadh',
  durationDays: 3,
  startDate: '2026-10-15',
  travelersText: 'عائلة (4 أفراد) • ميسر للكبار والأطفال',
  preferences: {
    weather: true,
    prayer: true,
    traffic: true,
    accessibility: true,
    restaurants: true,
    touristAttractions: true,
    shopping: true,
    nature: false,
    pace: 'balanced'
  },
  hasAlternativePlan: true,
  alternativeReason: 'ارتفاع حرارة نهار الظهيرة وإعادة توجيه المسار إلى متحف مكيف مع نقل الجولة التاريخية للغروب',
  dailyPlans: [
    {
      dayNumber: 1,
      date: 'اليوم الأول - التراث والأصالة النجديّة',
      theme: 'اكتشاف جذور الدولة السعودية وحي الطريف المسجل في اليونسكو',
      weatherSummary: {
        tempRange: '22°م - 31°م',
        condition: 'مشمس ولطيف صُباحاً',
        icon: 'Sun'
      },
      prayerSummary: [
        { name: 'الفجر', time: '04:45 ص', mosque: 'مسجد الفندق / مصلى الإقامة' },
        { name: 'الظهر', time: '11:52 ص', mosque: 'مسجد حي الطريف التاريخي' },
        { name: 'العصر', time: '03:15 م', mosque: 'جامع مطل البجيري' },
        { name: 'المغرب', time: '05:38 م', mosque: 'جامع الإمام تركي بن عبد الله' },
        { name: 'العشاء', time: '07:08 م', mosque: 'مسجد مركز قصر الحكم' }
      ],
      items: [
        {
          id: 'item-101',
          type: 'activity',
          time: '09:00 ص - 11:30 ص',
          title: 'جولة صباحية في حي الطريف التراثي بالدرعية',
          subtitle: 'موقع مسجل في قائمة التراث العالمي (اليونسكو)',
          locationName: 'حي الطريف - الدرعية التاريخية',
          locationArea: 'شمال الرياض',
          duration: 'ساعتان ونصف',
          transport: '15 دقيقة بالسيارة من وسط المدينة',
          description: 'استكشف عمارة الطين النجدية الأصيلة وقصور الأئمة، ومتحف الخيل العربية ومستندات الدولة السعودية الأولى.',
          imageUrl: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=800&q=80',
          category: 'تراث وثقافة',
          weatherInfo: {
            temp: '24°م',
            condition: 'أجواء مشمسة ومعتدلة مناسبة للمشي',
            isIdeal: true
          },
          trafficInfo: {
            status: 'smooth',
            label: 'حركة مرور سلسة جداً صباحاً'
          },
          accessibilityInfo: {
            isAccessible: true,
            notes: 'مسارات الطين محدثة برصف ميسر وسيارة جولف مخصصة عند الطلب'
          },
          tips: ['يُفضل ارتداء أحذية مشي مريحة', 'تتوفر عربات جولف مجانية لكبار السن عند مدخل البجيري'],
          dressCode: 'زي مريح ومحتشم مع نظارة شمسية',
          ticketInfo: 'تذكرة شاملة لدخول الطريف والبجيري'
        },
        {
          id: 'item-102',
          type: 'prayer',
          time: '11:50 ص - 12:25 م',
          title: 'استراحة صلاة الظهر',
          locationName: 'مسجد حي الطريف التاريخي',
          locationArea: 'الدرعية',
          duration: '35 دقيقة',
          transport: '3 دقائق مشياً من المعرض الرئيسي',
          description: 'أداء صلاة الظهر في مسجد مبني على الطراز النجدي العريق مع مصليات مجهزة ومكيفة بالكامل.',
          category: 'استراحة صلاة',
          prayerInfo: {
            name: 'صلاة الظهر (11:52 ص)',
            mosqueName: 'مسجد حي الطريف التاريخي'
          },
          accessibilityInfo: {
            isAccessible: true,
            notes: 'مصلى ميسر بالكامل ومزود بكراسي مخصصة للصلاة'
          }
        },
        {
          id: 'item-103',
          type: 'meal',
          time: '12:30 م - 02:00 م',
          title: 'غداء نجدي أصيل في مطعم قرية النجديّة / مطل البجيري',
          locationName: 'مطل البجيري - الدرعية',
          locationArea: 'الدرعية',
          duration: 'ساعة ونصف',
          transport: '5 دقائق مشياً عبر الجسر الخشبي',
          description: 'تجربة تناول الأطباق السعودية التقليدية كالكبسة والقرصان والجريش في جلسات مريحة مطلة على حي الطريف.',
          imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
          category: 'مطاعم وأغذية',
          weatherInfo: {
            temp: '29°م',
            condition: 'جلسات داخلية مكيفة بزجاج شفاف يطل على الآثار',
            isIdeal: true
          },
          trafficInfo: {
            status: 'smooth',
            label: 'مواقف البجيري متوفرة بسهولة'
          },
          accessibilityInfo: {
            isAccessible: true,
            notes: 'مصاعد متوفرة لجميع الأدوار وجلسات مريحة'
          }
        },
        {
          id: 'item-104',
          type: 'activity',
          time: '02:30 م - 04:30 م',
          title: 'زيارة المتحف الوطني السعودي وحي المربع',
          subtitle: 'رحلة عبر تاريخ شبه الجزيرة العربية',
          locationName: 'المتحف الوطني - وسط الرياض',
          locationArea: 'حي المربع',
          duration: 'ساعتان',
          transport: '20 دقيقة بالسيارة من الدرعية',
          description: 'ثماني قاعات عرض متطورة تستعرض التاريخ الطبيعي والإنساني والرسالة الإسلامية ونشأة المملكة الحديثة.',
          imageUrl: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&w=800&q=80',
          category: 'متاحف وثقافة',
          weatherInfo: {
            temp: '31°م',
            condition: 'متحف مكيف ومظلل بالكامل خلال فترة ذروة الشمس',
            isIdeal: true
          },
          trafficInfo: {
            status: 'moderate',
            label: 'حركة متوسطة على طريق الملك فهد'
          },
          accessibilityInfo: {
            isAccessible: true,
            notes: 'مصاعد متطورة، كراسي متحركة عند الاستقبال مجاناً'
          }
        },
        {
          id: 'item-105',
          type: 'prayer',
          time: '05:30 م - 06:15 م',
          title: 'صلاة المغرب وجولة في سوق الزل التراثي',
          locationName: 'جامع الإمام تركي بن عبد الله وسوق الزل',
          locationArea: 'الديرة - الرياض القديمة',
          duration: '45 دقيقة',
          transport: '10 دقائق بالسيارة من المتحف',
          description: 'أداء صلاة المغرب والاستمتاع برائحة العود والبخور والمزادات التراثية الشهيرة في أعرق أسواق الرياض.',
          category: 'تراث وتسوق',
          prayerInfo: {
            name: 'صلاة المغرب (05:38 م)',
            mosqueName: 'جامع الإمام تركي بن عبد الله'
          },
          trafficInfo: {
            status: 'moderate',
            label: 'منطقة مشاة مريحة مع مواقف قريبة'
          },
          accessibilityInfo: {
            isAccessible: true,
            notes: 'أرضية مستوية ومسارات ممهدة للمشي'
          }
        },
        {
          id: 'item-106',
          type: 'meal',
          time: '07:30 م - 09:30 م',
          title: 'عشاء واستراحة في منطقة كافد (KAFD) الحديثة',
          subtitle: 'الوجهة الماليّة والمعمارية الأولى في الرياض',
          locationName: 'مركز الملك عبد الله المالي - KAFD',
          locationArea: 'طريق الملك فهد',
          duration: 'ساعتان',
          transport: '22 دقيقة بالسيارة',
          description: 'المشي في الوادي المغطى والتصميم المعماري المستقبلي مع خيارات مطاعم عالمية ومقاهي سعودية مختصة.',
          imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
          category: 'مطاعم وتسوق حديث',
          weatherInfo: {
            temp: '23°م',
            condition: 'أجواء مسائية عليلة مع رذاذ تبريد هواء بالمسارات',
            isIdeal: true
          },
          trafficInfo: {
            status: 'smooth',
            label: 'مسارات دائرية ميسرة ومواقف ذكية'
          },
          accessibilityInfo: {
            isAccessible: true,
            notes: 'مصاعد كهربائية وجسور مشاة مكيفة مع كراسي ميسرة'
          }
        }
      ]
    },
    {
      dayNumber: 2,
      date: 'اليوم الثاني - المعالم الحديثة والإطلالات الأفقية',
      theme: 'استكشاف الأبراج، الفنون المعاصرة والتسوق الرفيع',
      weatherSummary: {
        tempRange: '23°م - 32°م',
        condition: 'صافٍ ومشمس',
        icon: 'Sun'
      },
      prayerSummary: [
        { name: 'الفجر', time: '04:46 ص', mosque: 'مصلى الفندق' },
        { name: 'الظهر', time: '11:52 ص', mosque: 'جامع مركز المملكة' },
        { name: 'العصر', time: '03:14 م', mosque: 'مصلى برج الفيصلية' },
        { name: 'المغرب', time: '05:37 م', mosque: 'جامع الراجحي الكبير' },
        { name: 'العشاء', time: '07:07 م', mosque: 'مصلى الرياض بارك' }
      ],
      items: [
        {
          id: 'item-201',
          type: 'activity',
          time: '09:30 ص - 11:30 ص',
          title: 'زيارة جسر المشاهدة العالي في برج المملكة',
          subtitle: 'إطلالة بانورامية بزاوية 360 درجة على العاصمة',
          locationName: 'برج المملكة - طريق العليا',
          locationArea: 'وسط الرياض',
          duration: 'ساعتان',
          transport: '10 دقائق بالسيارة',
          description: 'صعود المصعد السريع إلى الدور 99 ومشاهدة الأفق المعماري الشاسع لمدينة الرياض.',
          imageUrl: 'https://images.unsplash.com/photo-1578898835028-267b093314a8?auto=format&fit=crop&w=800&q=80',
          category: 'معالم وأفق',
          weatherInfo: {
            temp: '25°م',
            condition: 'منطقة مشاهدة داخلية مكيفة بالكامل',
            isIdeal: true
          },
          trafficInfo: {
            status: 'smooth',
            label: 'مرور خفيف صُباحاً'
          },
          accessibilityInfo: {
            isAccessible: true,
            notes: 'مصاعد مخصصة بالكامل لمستخدمي الكراسي المتحركة'
          }
        },
        {
          id: 'item-202',
          type: 'meal',
          time: '01:00 م - 03:00 م',
          title: 'تجربة طعام عالمية وتذوق القهوة السعودية',
          locationName: 'مجمع فيا رياض (Via Riyadh)',
          locationArea: 'حي الهدا',
          duration: 'ساعتان',
          transport: '15 دقيقة بالسيارة',
          description: 'تصميم سالماني معماري بلمسات نجديّة فاخرة مع سينمات خاصة ومطاعم حاصلة على نجمة ميشلان.',
          category: 'مطاعم فاخرة',
          trafficInfo: {
            status: 'smooth',
            label: 'خدمة صف السيارات متوفرة بسهولة'
          },
          accessibilityInfo: {
            isAccessible: true,
            notes: 'مسارات مستوية بدون درج ومصاعد متوفرة'
          }
        },
        {
          id: 'item-203',
          type: 'activity',
          time: '04:30 م - 07:00 م',
          title: 'جولة في وادي حنيفة والحدائق التراثية',
          subtitle: 'متنزه طبيعي بطول 120 كم يقطع العاصمة',
          locationName: 'وادي حنيفة - سد العلب',
          locationArea: 'غرب الرياض',
          duration: 'ساعتان ونصف',
          transport: '20 دقيقة بالسيارة',
          description: 'ممرات مشي بين النخيل وجلسات مطلة على المياه الجارية والأجواء الغروبية الساحرة.',
          imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
          category: 'طبيعة ومتنزهات',
          weatherInfo: {
            temp: '26°م',
            condition: 'نسيم عليل في ساعات الغروب',
            isIdeal: true
          },
          trafficInfo: {
            status: 'smooth',
            label: 'طرق الوصول ميسرة ومواقف واسعة'
          },
          accessibilityInfo: {
            isAccessible: true,
            notes: 'ممرات مشاة ممهدة ومناطق جلوس مظللة'
          }
        }
      ]
    },
    {
      dayNumber: 3,
      date: 'اليوم الثالث - فنون، تسوق وهدايا تذكارية',
      theme: 'زيارة المعارض الفنية والتسوق في المجمعات العصرية',
      weatherSummary: {
        tempRange: '24°م - 33°م',
        condition: 'مشمس',
        icon: 'Sun'
      },
      prayerSummary: [
        { name: 'الفجر', time: '04:46 ص', mosque: 'مصلى الإقامة' },
        { name: 'الظهر', time: '11:52 ص', mosque: 'مصلى رياض بارك' },
        { name: 'العصر', time: '03:14 م', mosque: 'جامع حي حطين' },
        { name: 'المغرب', time: '05:37 م', mosque: 'مصلى مجمع يو ووك' },
        { name: 'العشاء', time: '07:07 م', mosque: 'مسجد مطار الملك خالد' }
      ],
      items: [
        {
          id: 'item-301',
          type: 'activity',
          time: '10:00 ص - 01:00 م',
          title: 'زيارة مجمع الرياض بارك والتسوق للشوكولاتة والعطور السعودية',
          locationName: 'رياض بارك - الطريق الدائري الشمالي',
          locationArea: 'حي العقيق',
          duration: '3 ساعات',
          transport: '15 دقيقة بالسيارة',
          description: 'أرقى الماركات السعودية والعالمية مع منتجات العود المحلي والدهن التراثي وركن الهدايا.',
          category: 'تسوق وهدايا',
          accessibilityInfo: {
            isAccessible: true,
            notes: 'تسهيلات كاملة للكراسي المتحركة وعربات الأطفال'
          }
        },
        {
          id: 'item-302',
          type: 'meal',
          time: '01:30 م - 03:30 م',
          title: 'غداء ومقهى مختص في مجمع U-Walk',
          locationName: 'مجمع يو ووك - طريق الأمير تركي الأول',
          locationArea: 'حي النخيل',
          duration: 'ساعتان',
          transport: '10 دقائق بالسيارة',
          description: 'ممشى خارجي جميل يحيطه العشرات من خيارات المطاعم والمقاهي السعودية المبتكرة.',
          category: 'مطاعم ومقاهي',
          accessibilityInfo: {
            isAccessible: true,
            notes: 'ممشى مسطح بالكامل ومناسب للجميع'
          }
        }
      ]
    }
  ],
  alternativePlans: [
    {
      dayNumber: 1,
      date: 'اليوم الأول - الخطة البديلة المحدثة ذكياً ⚡',
      theme: 'الخطة المحسّنة: نقل الجولة الخارجية للغروب وتفادي ذروة الشمس والازدحام',
      weatherSummary: {
        tempRange: '22°م - 31°م',
        condition: 'تكييف مسار الجولة لحماية العائلة',
        icon: 'Sun'
      },
      prayerSummary: [
        { name: 'الفجر', time: '04:45 ص', mosque: 'مصلى الإقامة' },
        { name: 'الظهر', time: '11:52 ص', mosque: 'جامع مركز المربع' },
        { name: 'العصر', time: '03:15 م', mosque: 'جامع حي الطريف' },
        { name: 'المغرب', time: '05:38 م', mosque: 'جامع البجيري' },
        { name: 'العشاء', time: '07:08 م', mosque: 'مصلى KAFD' }
      ],
      items: [
        {
          id: 'alt-item-101',
          type: 'activity',
          time: '09:30 ص - 12:00 م',
          title: 'زيارة المتحف الوطني وقصر المربع المكيف نهاراً (بديل ذكي)',
          subtitle: 'تعديل الترتيب تجنباً لأشعة الشمس المباشرة في الدرعية',
          locationName: 'المتحف الوطني السعودي',
          locationArea: 'حي المربع',
          duration: 'ساعتان ونصف',
          transport: '15 دقيقة بالسيارة',
          description: 'بدأنا بالمتحف المكيف بالكامل صباحاً لضمان راحة العائلة وكبار السن، وتأجيل المشي الخارجي للغروب.',
          imageUrl: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&w=800&q=80',
          category: 'متاحف وتراث',
          isModifiedInAlternative: true,
          weatherInfo: {
            temp: '28°م (داخل قاعات مكيفة)',
            condition: 'راحة حرارية ممتازة',
            isIdeal: true
          },
          trafficInfo: {
            status: 'smooth',
            label: 'مسار خالي من الازدحام المروري'
          },
          accessibilityInfo: {
            isAccessible: true,
            notes: 'ميسر 100% مع كراسي متحركة متوفرة عند الاستقبال'
          }
        },
        {
          id: 'alt-item-102',
          type: 'prayer',
          time: '12:15 م - 12:45 م',
          title: 'استراحة صلاة الظهر وغداء في المربع',
          locationName: 'جامع المربع ومطعم سهيل التراثي',
          locationArea: 'المربع',
          duration: 'ساعة',
          transport: '3 دقائق مشياً',
          description: 'صلاة الظهر ثم غداء سعودي فاخر ومريح في أجواء هادئة.',
          category: 'صلاة وطعام',
          prayerInfo: {
            name: 'صلاة الظهر (11:52 ص)',
            mosqueName: 'جامع المربع'
          }
        },
        {
          id: 'alt-item-103',
          type: 'activity',
          time: '04:00 م - 07:00 م',
          title: 'جولة غروب السحرية في حي الطريف ومطل البجيري بالدرعية',
          subtitle: 'الموقع التراثي بأجواء الخريف العليلة والإضاءات التراثية',
          locationName: 'حي الطريف - الدرعية التاريخية',
          locationArea: 'الدرعية',
          duration: '3 ساعات',
          transport: '20 دقيقة بالسيارة',
          description: 'استمتاع بمنظر انكسار إضاءات النخل وقصور الطريف مع انخفاض درجات الحرارة وبرودة النسيم المسائي.',
          imageUrl: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=800&q=80',
          category: 'تراث ساحر بالغروب',
          isModifiedInAlternative: true,
          weatherInfo: {
            temp: '22°م',
            condition: 'أجواء غروب باردة ولطيفة جداً للمشي',
            isIdeal: true
          },
          trafficInfo: {
            status: 'smooth',
            label: 'طريق الملك خالد سلس وخالٍ من الاختناقات'
          },
          accessibilityInfo: {
            isAccessible: true,
            notes: 'سيارات الجولف جاهزة ومتاحة مجاناً'
          }
        }
      ]
    }
  ]
};
