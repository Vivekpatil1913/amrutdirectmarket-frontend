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
    offline: 'नवीनतम माहिती लोड होऊ शकली नाही; पूर्वी जतन केलेली माहिती दाखवत आहोत.',
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
