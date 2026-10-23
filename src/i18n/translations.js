// Interface strings for the public site (Marathi default, as on other AMRUT
// sites). Editable website content — headings, descriptions, lists, contact
// details, images — is managed in the CMS and loaded from the API; only fixed
// UI wording (accessibility labels, validation messages, system states) lives
// here.

export const LANGUAGES = [
  { code: 'mr', label: 'मराठी' },
  { code: 'en', label: 'English' },
]

export const DEFAULT_LANG = 'mr'

const mr = {
  a11y: {
    skip: 'मुख्य मजकुराकडे जा',
    textSize: 'मजकुराचा आकार',
    smaller: 'मजकूर लहान करा',
    reset: 'मूळ आकार',
    larger: 'मजकूर मोठा करा',
    language: 'भाषा',
    mainNav: 'मुख्य मेनू',
    footerNav: 'तळटीप मेनू',
    openMenu: 'मेनू उघडा',
    closeMenu: 'मेनू बंद करा',
    backToTop: 'वर जा',
    newTab: '(नवीन टॅबमध्ये उघडते)',
  },
  state: {
    loading: 'माहिती लोड होत आहे…',
    loadError: 'संकेतस्थळाची माहिती सध्या लोड होऊ शकली नाही.',
    loadErrorHint: 'कृपया आपले इंटरनेट कनेक्शन तपासा आणि पुन्हा प्रयत्न करा.',
    retry: 'पुन्हा प्रयत्न करा',
    offline: 'नवीनतम माहिती लोड होऊ शकली नाही; पूर्वी जतन केलेली माहिती दाखवत आहोत.'},
  gov: {
    state: 'महाराष्ट्र शासन',
    org: 'महाराष्ट्र संशोधन, उन्नती व प्रशिक्षण प्रबोधिनी (अमृत)',
  },
  preview: {
    banner: 'पूर्वावलोकन: या संकेतस्थळावरील चौकशी अर्ज माहिती पाठवत नाही.',
    short: 'पूर्वावलोकन',
  },
  brand: { name: 'अमृत पेठ थेट बाजार पेठ', sub: 'थेट बाजार' },
  nav: {
    home: 'मुख्य पृष्ठ',
    about: 'अमृत पेठ थेट बाजार पेठ',
    highlights: 'वैशिष्ट्ये',
    participate: 'सहभाग',
    contact: 'संपर्क',
    cta: 'नोंदणी करा',
  },
  hero: {
    eyebrow: 'महाराष्ट्र शासन · अमृत',
    title: 'अमृत पेठ थेट बाजार पेठ',
    tagline: 'स्थानिक उद्योजकांसाठी थेट बाजारपेठ',
    desc: 'स्थानिक उद्योजक, कारागीर आणि शेतकरी अमृत पेठ थेट बाजार पेठ प्रदर्शनांमध्ये आपली उत्पादने थेट ग्राहकांना विकतात — योग्य किंमत, अस्सल उत्पादने, मध्यस्थी नाही.',
    primary: 'सहभागासाठी नोंदणी करा',
    secondary: 'बाजार जाणून घ्या',
    facts: [
      { label: 'आयोजक', value: 'अमृत' },
      { label: 'कोणासाठी', value: 'स्थानिक उद्योजक' },
      { label: 'स्वरूप', value: 'प्रदर्शन-बाजार' },
      { label: 'मध्यस्थी', value: 'नाही' },
    ],
    photoAlts: ['बाजारातील स्टॉलवर मांडलेली ताजी फळे व भाज्या', 'खडे मसाले आणि ताजे पदार्थ'],
    chip: 'उत्पादकांकडून थेट ग्राहकांपर्यंत',
    quickLabel: 'झटपट दुवे',
    quick: {
      about: 'अमृत पेठ थेट बाजार पेठ म्हणजे काय',
      highlights: 'उद्योजकांसाठी फायदे',
      participate: 'स्टॉल घेण्याची सोपी प्रक्रिया',
      contact: 'चौकशी व संपर्क',
    },
  },
  about: {
    badge: 'परिचय',
    title: 'उत्पादकांना थेट बाजारपेठेशी जोडणारा उपक्रम',
    p1: 'अमृत पेठ थेट बाजार पेठ हा महाराष्ट्र शासनाची स्वायत्त संस्था असलेल्या महाराष्ट्र संशोधन, उन्नती व प्रशिक्षण प्रबोधिनीचा (अमृत) उपक्रम आहे.',
    p2: 'राज्यभर आयोजित होणाऱ्या प्रदर्शन-बाजारांमध्ये उत्पादक ग्राहकांना प्रत्यक्ष भेटतात. महिला उद्योजक, स्वयं-सहायता गट, शेतकरी आणि कारागीर यांच्यावर विशेष भर दिला जातो.',
    caption: 'मध्यस्थी नाही — योग्य किंमत आणि अस्सल स्थानिक उत्पादने.',
    photoAlt: 'विक्रीसाठी मांडलेल्या ताज्या भाज्यांचे कप्पे',
    findTitle: 'येथे काय मिळेल',
    categories: [
      'अन्न व कृषी',
      'प्रक्रियाकृत अन्न',
      'हस्तकला व कला',
      'वस्त्र व कापड',
      'गृह व जीवनशैली',
      'आरोग्य व निरामय',
      'पादत्राणे व चर्मवस्तू',
      'दागिने व ॲक्सेसरीज',
    ],
  },
  highlights: {
    badge: 'अमृत पेठ थेट बाजार पेठ का?',
    title: 'स्थानिक व्यवसायांसाठी उभारलेला बाजार',
    lead: 'लहान उद्योजकांना घराजवळच ग्राहकांपर्यंत पोहोचण्याचा आणि व्यवसाय वाढवण्याचा सोपा, पाठबळ असलेला मार्ग.',
    items: [
      { title: 'थेट ग्राहकांना विक्री', desc: 'ग्राहकांना प्रत्यक्ष भेटा आणि संपूर्ण नफा तुमच्याकडेच ठेवा — मध्ये कोणताही मध्यस्थी नाही.' },
      { title: 'शासनाचे पाठबळ', desc: 'महाराष्ट्र शासनाची स्वायत्त संस्था असलेल्या अमृतद्वारे आयोजित.' },
      { title: 'प्रदर्शनात स्टॉल', desc: 'महाराष्ट्रभर भरणाऱ्या अमृत पेठ थेट बाजार पेठ प्रदर्शनांमध्ये स्टॉल घ्या.' },
      { title: 'ब्रँड वाढवा', desc: 'आपली ब्रँड ओळख निर्माण करा, ग्राहकांचा अभिप्राय मिळवा आणि ग्राहकवर्ग वाढवा.' },
    ],
  },
  participate: {
    badge: 'सहभाग',
    title: 'स्टॉल घेणे सोपे आहे',
    lead: 'महाराष्ट्रातील कोणताही स्थानिक उद्योजक, कारागीर, शेतकरी किंवा लघु व्यावसायिक अर्ज करू शकतो. महिला उद्योजक, स्वयं-सहायता गट आणि अमृत प्रशिक्षणार्थींना प्राधान्य दिले जाते.',
    whoLabel: 'कोण अर्ज करू शकतो',
    who: ['स्थानिक उद्योजक', 'कारागीर', 'शेतकरी', 'लघु व्यवसाय', 'महिला उद्योजक', 'स्वयं-सहायता गट'],
    cta: 'नोंदणी करा',
    stepsLabel: 'सहभागाची प्रक्रिया',
    step: 'टप्पा',
    steps: [
      { title: 'आपली इच्छा नोंदवा', desc: 'चौकशी अर्जाद्वारे आपले संपर्क तपशील आणि उत्पादनांची माहिती द्या.' },
      { title: 'अमृतकडून निश्चिती', desc: 'अधिकृत स्टॉल बुकिंग आपल्या अमृत जिल्हा कार्यालयामार्फत निश्चित केले जाते.' },
      { title: 'स्टॉल लावा व विक्री करा', desc: 'प्रदर्शनात आपली उत्पादने मांडा आणि थेट ग्राहकांना विका.' },
    ],
  },
  participate: { step: 'टप्पा' },
  register: {
    optional: '(ऐच्छिक)',
    hintMin: 'किमान २०',
    sending: 'पाठवत आहे…',
    submitError: 'चौकशी पाठवता आली नाही. कृपया पुन्हा प्रयत्न करा.',
    networkError: 'सर्व्हरशी संपर्क होऊ शकला नाही. कृपया आपले कनेक्शन तपासून पुन्हा प्रयत्न करा.',
    rateLimited: 'खूप चौकश्या पाठवल्या गेल्या आहेत. कृपया थोड्या वेळाने पुन्हा प्रयत्न करा.',
    errors: {
      name: 'नाव आवश्यक आहे.',
      email: 'वैध ईमेल आवश्यक आहे.',
      phone: 'वैध १० अंकी मोबाईल क्रमांक लिहा.',
      subject: 'कृपया विषय निवडा.',
      message: 'संदेश किमान २० अक्षरांचा असावा.',
      consent: 'पुढे जाण्यासाठी कृपया संमती द्या.',
    },
  },
  notFound: {
    title: 'पृष्ठ सापडले नाही',
    desc: 'आपण शोधत असलेले पृष्ठ अस्तित्वात नाही किंवा हलवले गेले आहे.',
    home: 'मुख्य पृष्ठावर जा',
  },
}

const en = {
  a11y: {
    skip: 'Skip to main content',
    textSize: 'Text size',
    smaller: 'Decrease text size',
    reset: 'Default text size',
    larger: 'Increase text size',
    language: 'Language',
    mainNav: 'Main navigation',
    footerNav: 'Footer navigation',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    backToTop: 'Back to top',
    newTab: '(opens in a new tab)',
  },
  state: {
    loading: 'Loading…',
    loadError: 'The website content could not be loaded right now.',
    loadErrorHint: 'Please check your internet connection and try again.',
    retry: 'Try again',
    offline: 'Showing previously saved content — the latest version could not be loaded.',
  },
  participate: { step: 'Step' },
  register: {
    optional: '(optional)',
    hintMin: '20 min',
    sending: 'Sending…',
    submitError: 'Your enquiry could not be sent. Please try again.',
    networkError: 'Could not reach the server. Please check your connection and try again.',
    rateLimited: 'Too many enquiries were sent. Please try again a little later.',
    errors: {
      name: 'Name is required.',
      email: 'Valid email required.',
      phone: 'Enter a valid 10-digit mobile number.',
      subject: 'Please select a subject.',
      message: 'Message must be at least 20 characters.',
      consent: 'Please agree to continue.',
    },
  },
  notFound: {
    title: 'Page not found',
    desc: 'The page you’re looking for doesn’t exist or may have moved.',
    home: 'Back to home',
  },
}

export const translations = { mr, en }
