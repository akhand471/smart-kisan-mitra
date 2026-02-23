import { NavLink } from 'react-router-dom';
import {
    HomeIcon, ShoppingBagIcon, CalculatorIcon, CurrencyRupeeIcon, CloudIcon, SparklesIcon,
} from '@heroicons/react/24/outline';
import {
    HomeIcon as HomeIconSolid,
    ShoppingBagIcon as ShoppingBagIconSolid,
    CalculatorIcon as CalculatorIconSolid,
    CurrencyRupeeIcon as CurrencyRupeeIconSolid,
    CloudIcon as CloudIconSolid,
    SparklesIcon as SparklesIconSolid,
} from '@heroicons/react/24/solid';
import { useLang } from '../context/LanguageContext';

export default function BottomNav() {
    const { t } = useLang();

    const navItems = [
        { to: '/dashboard', label: 'Home', Icon: HomeIcon, ActiveIcon: HomeIconSolid },
        { to: '/mandi', label: 'Mandi', Icon: ShoppingBagIcon, ActiveIcon: ShoppingBagIconSolid },
        { to: '/recommend', label: 'Crops', Icon: SparklesIcon, ActiveIcon: SparklesIconSolid },
        { to: '/calculator', label: 'Profit', Icon: CalculatorIcon, ActiveIcon: CalculatorIconSolid },
        { to: '/expenses', label: 'Expenses', Icon: CurrencyRupeeIcon, ActiveIcon: CurrencyRupeeIconSolid },
        { to: '/weather', label: 'Weather', Icon: CloudIcon, ActiveIcon: CloudIconSolid },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg">
            <div className="max-w-md mx-auto flex items-stretch">
                {navItems.map(({ to, label, Icon, ActiveIcon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            `flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors duration-150 relative ${isActive ? 'text-primary-600' : 'text-gray-500 hover:text-primary-500'}`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                {isActive ? <ActiveIcon className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                                <span className={`text-[9px] font-medium leading-tight ${isActive ? 'text-primary-600' : ''}`}>
                                    {label}
                                </span>
                                {isActive && <span className="absolute bottom-0 w-5 h-0.5 bg-primary-600 rounded-t-full" />}
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}
