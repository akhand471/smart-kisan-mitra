import { NavLink } from 'react-router-dom';
import {
    HomeIcon, ShoppingBagIcon, CalculatorIcon, CurrencyRupeeIcon, CloudIcon,
} from '@heroicons/react/24/outline';
import {
    HomeIcon as HomeIconSolid,
    ShoppingBagIcon as ShoppingBagIconSolid,
    CalculatorIcon as CalculatorIconSolid,
    CurrencyRupeeIcon as CurrencyRupeeIconSolid,
    CloudIcon as CloudIconSolid,
} from '@heroicons/react/24/solid';
import { useLang } from '../context/LanguageContext';

export default function BottomNav() {
    const { t } = useLang();

    const navItems = [
        { to: '/dashboard', labelKey: 'nav_home', Icon: HomeIcon, ActiveIcon: HomeIconSolid },
        { to: '/mandi', labelKey: 'nav_mandi', Icon: ShoppingBagIcon, ActiveIcon: ShoppingBagIconSolid },
        { to: '/calculator', labelKey: 'nav_calculate', Icon: CalculatorIcon, ActiveIcon: CalculatorIconSolid },
        { to: '/expenses', labelKey: 'nav_expenses', Icon: CurrencyRupeeIcon, ActiveIcon: CurrencyRupeeIconSolid },
        { to: '/weather', labelKey: 'nav_weather', Icon: CloudIcon, ActiveIcon: CloudIconSolid },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg">
            <div className="max-w-md mx-auto flex items-stretch">
                {navItems.map(({ to, labelKey, Icon, ActiveIcon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            `flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors duration-150 relative ${isActive ? 'text-primary-600' : 'text-gray-500 hover:text-primary-500'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                {isActive ? <ActiveIcon className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
                                <span className={`text-[10px] font-medium ${isActive ? 'text-primary-600' : ''}`}>
                                    {t(labelKey)}
                                </span>
                                {isActive && <span className="absolute bottom-0 w-6 h-0.5 bg-primary-600 rounded-t-full" />}
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}
