import { createContext, useContext, useState } from 'react';

const LanguageContext = createContext(null);

export const translations = {
    en: {
        // Common
        appName: 'Smart Kisan Mitra',
        appTagline: 'Your Agriculture Companion',
        logout: 'Logout',
        loading: 'Loading...',
        noData: 'No data found',
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        add: 'Add',
        search: 'Search',
        filter: 'Filter',
        results: 'results found',

        // Bottom Nav
        nav_home: 'Home',
        nav_mandi: 'Mandi',
        nav_calculate: 'Calculate',
        nav_expenses: 'Expenses',
        nav_weather: 'Weather',

        // Splash
        splash_loading: 'Loading your farm dashboard...',
        splash_tagline: 'Made for Indian Farmers',

        // Login
        login_title: 'Login to access your farm dashboard',
        login_enter_mobile: 'Enter Mobile Number',
        login_otp_sent: 'We will send an OTP to verify',
        login_mobile_label: 'Mobile Number',
        login_send_otp: 'Send OTP',
        login_secure: '🔒 Your data is safe and secure',
        login_enter_otp: 'Enter OTP',
        login_otp_sent_to: 'Sent to +91',
        login_otp_label: '6-Digit OTP',
        login_verify_btn: 'Verify & Login',
        login_change_number: '← Change Number',
        login_demo_hint: '💡 Use 123456 for demo',
        login_terms: 'By continuing, you agree to our',
        login_policy: 'Terms of Service & Privacy Policy',

        // Register tab
        tab_login: 'Login',
        tab_register: 'Create Account',
        reg_title: 'Create New Account',
        reg_subtitle: 'Join Smart Kisan Mitra today',
        reg_name_label: 'Your Full Name',
        reg_name_placeholder: 'e.g. Ramesh Kumar',
        reg_name_error: 'Please enter your name',
        reg_phone_label: 'Mobile Number',
        reg_send_otp: 'Send OTP & Continue',
        reg_otp_label: '6-Digit OTP',
        reg_otp_hint: '💡 Use 123456 for demo',
        reg_create_btn: 'Create My Account',
        reg_success: 'Account created! Welcome 🎉',
        reg_already: 'Already have an account?',
        login_no_account: 'New user?',

        // Dashboard
        dash_good_morning: 'Good Morning',
        dash_good_afternoon: 'Good Afternoon',
        dash_good_evening: 'Good Evening',
        dash_today: 'Today',
        dash_farm_summary: 'Farm Summary',
        dash_quick_actions: 'Quick Actions',
        dash_weather_label: "Today's Weather",
        dash_wheat_price: 'Wheat Price',
        dash_per_quintal: 'per Quintal',
        dash_total_expenses: 'Total Expenses',
        dash_all_time: 'All time',
        dash_est_profit: 'Est. Profit',
        dash_profit: '🟢 Profit',
        dash_loss: '🔴 Loss',
        dash_mandi: '🌾 Mandi Prices',
        dash_calculator: '🧮 Crop Calculator',
        dash_expenses: '💰 Track Expenses',
        dash_weather: '⛅ Weather Forecast',
        dash_tip_title: '💡 Farmer Tip',
        dash_tip_text: "Check today's mandi prices before selling your crops to get the best value in the market.",
        dash_view_prices: 'View Prices',

        // Mandi
        mandi_title: '🌾 Mandi Prices',
        mandi_subtitle: 'Live crop prices from markets',
        mandi_select_crop: 'Select Crop',
        mandi_select_state: 'Select State',
        mandi_all: 'All',
        mandi_search_placeholder: 'Search by crop or market...',
        mandi_no_prices: 'No prices found',
        mandi_no_prices_sub: 'Try a different crop or state',
        mandi_per_qtl: 'per Qtl',

        // Calculator
        calc_title: '🧮 Crop Calculator',
        calc_subtitle: 'Estimate your profit or loss',
        calc_enter_details: 'Enter Farm Details',
        calc_seed: 'Seed Cost (₹)',
        calc_fertilizer: 'Fertilizer (₹)',
        calc_labour: 'Labour Cost (₹)',
        calc_land: 'Land Area (Acres)',
        calc_yield: 'Expected Yield (Qtl)',
        calc_price_qtl: 'Price/Quintal (₹)',
        calc_btn: 'Calculate Profit',
        calc_results: '📊 Calculation Results',
        calc_total_cost: 'Total Cost',
        calc_revenue: 'Expected Revenue',
        calc_cost_per_acre: 'Cost per Acre',
        calc_profit: '🟢 Estimated Profit',
        calc_loss: '🔴 Estimated Loss',
        calc_tip_title: '💡 How to use:',
        calc_tip_text: 'Enter all your farming costs and expected yield. The calculator will show if you\'ll make a profit or loss.',
        calc_placeholder: 'e.g.',

        // Expenses
        expense_title: '💰 Expense Tracker',
        expense_subtitle: 'Track your farming costs',
        expense_this_month: 'This Month',
        expense_all_time: 'All Time Total',
        expense_recorded: 'expense(s) recorded',
        expense_empty: 'No expenses yet',
        expense_empty_sub: 'Tap the + button to add your first expense',
        expense_add_title: 'Add Expense',
        expense_cat_label: 'Category',
        expense_amount_label: 'Amount (₹)',
        expense_amount_placeholder: 'Enter amount',
        expense_date_label: 'Date',
        expense_note_label: 'Note (Optional)',
        expense_note_placeholder: 'e.g. DAP fertilizer',
        expense_add_btn: 'Add Expense',

        // Weather
        weather_title: '⛅ Weather Report',
        weather_feels: 'Feels like',
        weather_humidity: 'Humidity',
        weather_rain: 'Rain',
        weather_wind: 'Wind',
        weather_uv: 'UV Index',
        weather_advice_title: 'Farming Advice',
        weather_advice_high: '🌧️ High chance of rain. Avoid spraying pesticides today.',
        weather_advice_med: '🌦️ Moderate rain chance. Check fields before irrigation.',
        weather_advice_low: '☀️ Good day for farming activities!',
        weather_forecast_title: '5-Day Forecast',
        weather_tips_title: '🌾 Seasonal Farming Tips',
        weather_tip1: '• Water crops in early morning to reduce evaporation',
        weather_tip2: '• Monitor soil moisture before irrigation',
        weather_tip3: '• Check weather forecast before applying fertilizers',
        weather_today: 'Today',
    },

    hi: {
        // Common
        appName: 'स्मार्ट किसान मित्र',
        appTagline: 'आपका कृषि साथी',
        logout: 'लॉगआउट',
        loading: 'लोड हो रहा है...',
        noData: 'कोई डेटा नहीं मिला',
        save: 'सहेजें',
        cancel: 'रद्द करें',
        delete: 'हटाएं',
        add: 'जोड़ें',
        search: 'खोजें',
        filter: 'फ़िल्टर',
        results: 'परिणाम मिले',

        // Bottom Nav
        nav_home: 'होम',
        nav_mandi: 'मंडी',
        nav_calculate: 'गणना',
        nav_expenses: 'खर्च',
        nav_weather: 'मौसम',

        // Splash
        splash_loading: 'आपका कृषि डैशबोर्ड लोड हो रहा है...',
        splash_tagline: 'भारतीय किसानों के लिए',

        // Login
        login_title: 'अपने फार्म डैशबोर्ड तक पहुंचने के लिए लॉगिन करें',
        login_enter_mobile: 'मोबाइल नंबर दर्ज करें',
        login_otp_sent: 'हम सत्यापन के लिए OTP भेजेंगे',
        login_mobile_label: 'मोबाइल नंबर',
        login_send_otp: 'OTP भेजें',
        login_secure: '🔒 आपका डेटा सुरक्षित है',
        login_enter_otp: 'OTP दर्ज करें',
        login_otp_sent_to: '+91 पर भेजा गया',
        login_otp_label: '6-अंकीय OTP',
        login_verify_btn: 'जाँचें और लॉगिन करें',
        login_change_number: '← नंबर बदलें',
        login_demo_hint: '💡 डेमो के लिए 123456 उपयोग करें',
        login_terms: 'जारी रखकर आप हमारी शर्तें मानते हैं',
        login_policy: 'सेवा की शर्तें और गोपनीयता नीति',

        // Register tab
        tab_login: 'लॉगिन',
        tab_register: 'नया खाता बनाएं',
        reg_title: 'नया खाता बनाएं',
        reg_subtitle: 'Smart Kisan Mitra से जुड़ें',
        reg_name_label: 'आपका पूरा नाम',
        reg_name_placeholder: 'जैसे. रमेश कुमार',
        reg_name_error: 'कृपया अपना नाम दर्ज करें',
        reg_phone_label: 'मोबाइल नंबर',
        reg_send_otp: 'OTP भेजें और आगे बढ़ें',
        reg_otp_label: '6-अंकीय OTP',
        reg_otp_hint: '💡 डेमो के लिए 123456 उपयोग करें',
        reg_create_btn: 'मेरा खाता बनाएं',
        reg_success: 'खाता बन गया! स्वागत है 🎉',
        reg_already: 'पहले से खाता है?',
        login_no_account: 'नए उपयोगकर्ता?',

        // Dashboard
        dash_good_morning: 'सुप्रभात',
        dash_good_afternoon: 'नमस्ते',
        dash_good_evening: 'शुभ संध्या',
        dash_today: 'आज',
        dash_farm_summary: 'खेत सारांश',
        dash_quick_actions: 'त्वरित कार्य',
        dash_weather_label: 'आज का मौसम',
        dash_wheat_price: 'गेहूं भाव',
        dash_per_quintal: 'प्रति क्विंटल',
        dash_total_expenses: 'कुल खर्च',
        dash_all_time: 'सभी समय',
        dash_est_profit: 'अनुमानित लाभ',
        dash_profit: '🟢 लाभ',
        dash_loss: '🔴 हानि',
        dash_mandi: '🌾 मंडी भाव',
        dash_calculator: '🧮 फसल कैलकुलेटर',
        dash_expenses: '💰 खर्च ट्रैक करें',
        dash_weather: '⛅ मौसम पूर्वानुमान',
        dash_tip_title: '💡 किसान सलाह',
        dash_tip_text: 'बेहतर मूल्य पाने के लिए फसल बेचने से पहले आज के मंडी भाव जरूर देखें।',
        dash_view_prices: 'भाव देखें',

        // Mandi
        mandi_title: '🌾 मंडी भाव',
        mandi_subtitle: 'मंडियों से सीधे फसल के भाव',
        mandi_select_crop: 'फसल चुनें',
        mandi_select_state: 'राज्य चुनें',
        mandi_all: 'सभी',
        mandi_search_placeholder: 'फसल या मंडी खोजें...',
        mandi_no_prices: 'कोई भाव नहीं मिला',
        mandi_no_prices_sub: 'कोई अन्य फसल या राज्य चुनें',
        mandi_per_qtl: 'प्रति क्विं.',

        // Calculator
        calc_title: '🧮 फसल कैलकुलेटर',
        calc_subtitle: 'लाभ या हानि का अनुमान लगाएं',
        calc_enter_details: 'खेत की जानकारी दर्ज करें',
        calc_seed: 'बीज लागत (₹)',
        calc_fertilizer: 'खाद लागत (₹)',
        calc_labour: 'मजदूरी (₹)',
        calc_land: 'भूमि क्षेत्र (एकड़)',
        calc_yield: 'अपेक्षित उत्पादन (क्विं.)',
        calc_price_qtl: 'भाव/क्विंटल (₹)',
        calc_btn: 'लाभ की गणना करें',
        calc_results: '📊 गणना के परिणाम',
        calc_total_cost: 'कुल लागत',
        calc_revenue: 'अपेक्षित आय',
        calc_cost_per_acre: 'प्रति एकड़ लागत',
        calc_profit: '🟢 अनुमानित लाभ',
        calc_loss: '🔴 अनुमानित हानि',
        calc_tip_title: '💡 कैसे उपयोग करें:',
        calc_tip_text: 'अपनी सभी खेती की लागत और अपेक्षित उत्पादन दर्ज करें। कैलकुलेटर बताएगा कि लाभ होगा या हानि।',
        calc_placeholder: 'जैसे',

        // Expenses
        expense_title: '💰 खर्च ट्रैकर',
        expense_subtitle: 'अपनी खेती का खर्च ट्रैक करें',
        expense_this_month: 'इस महीने',
        expense_all_time: 'कुल खर्च',
        expense_recorded: 'खर्च दर्ज हैं',
        expense_empty: 'अभी कोई खर्च नहीं',
        expense_empty_sub: 'पहला खर्च जोड़ने के लिए + बटन दबाएं',
        expense_add_title: 'खर्च जोड़ें',
        expense_cat_label: 'श्रेणी',
        expense_amount_label: 'राशि (₹)',
        expense_amount_placeholder: 'राशि दर्ज करें',
        expense_date_label: 'तारीख',
        expense_note_label: 'नोट (वैकल्पिक)',
        expense_note_placeholder: 'जैसे. DAP खाद',
        expense_add_btn: 'खर्च जोड़ें',

        // Weather
        weather_title: '⛅ मौसम रिपोर्ट',
        weather_feels: 'महसूस होता है',
        weather_humidity: 'नमी',
        weather_rain: 'वर्षा',
        weather_wind: 'हवा',
        weather_uv: 'UV इंडेक्स',
        weather_advice_title: 'खेती सलाह',
        weather_advice_high: '🌧️ बारिश की अधिक संभावना। आज कीटनाशक न डालें।',
        weather_advice_med: '🌦️ मध्यम बारिश संभव। सिंचाई से पहले खेत जांचें।',
        weather_advice_low: '☀️ खेती के कामों के लिए अच्छा दिन!',
        weather_forecast_title: '5 दिन का पूर्वानुमान',
        weather_tips_title: '🌾 मौसमी खेती सलाह',
        weather_tip1: '• वाष्पीकरण कम करने के लिए सुबह जल्दी सिंचाई करें',
        weather_tip2: '• सिंचाई से पहले मिट्टी की नमी जांचें',
        weather_tip3: '• खाद डालने से पहले मौसम का पूर्वानुमान देखें',
        weather_today: 'आज',
    },
};

export function LanguageProvider({ children }) {
    const [lang, setLang] = useState(() => localStorage.getItem('kisan_lang') || 'en');

    const toggleLang = () => {
        const newLang = lang === 'en' ? 'hi' : 'en';
        setLang(newLang);
        localStorage.setItem('kisan_lang', newLang);
    };

    const t = (key) => translations[lang][key] || translations['en'][key] || key;

    return (
        <LanguageContext.Provider value={{ lang, toggleLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLang() {
    const ctx = useContext(LanguageContext);
    if (!ctx) throw new Error('useLang must be used within LanguageProvider');
    return ctx;
}
