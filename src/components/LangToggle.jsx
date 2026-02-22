import { useLang } from '../context/LanguageContext';

export default function LangToggle({ className = '' }) {
    const { lang, toggleLang } = useLang();

    return (
        <button
            onClick={toggleLang}
            title={lang === 'en' ? 'हिंदी में बदलें' : 'Switch to English'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-xs
        bg-white/15 hover:bg-white/25 text-white transition-all duration-200 active:scale-95 border border-white/20
        ${className}`}
        >
            <span className="text-base leading-none">{lang === 'en' ? '🇮🇳' : '🇬🇧'}</span>
            <span>{lang === 'en' ? 'हिंदी' : 'EN'}</span>
        </button>
    );
}
