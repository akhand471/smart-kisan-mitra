export default function Button({
    children,
    variant = 'primary',
    loading = false,
    disabled = false,
    onClick,
    type = 'button',
    className = '',
    icon: Icon,
}) {
    const base =
        variant === 'primary'
            ? 'btn-primary'
            : variant === 'secondary'
                ? 'btn-secondary'
                : variant === 'danger'
                    ? 'btn-danger'
                    : 'btn-primary';

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${base} ${className}`}
        >
            {loading ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
            ) : (
                Icon && <Icon className="h-5 w-5" />
            )}
            {children}
        </button>
    );
}
