export default function Input({
    label,
    id,
    error,
    helperText,
    className = '',
    ...props
}) {
    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {label}
                </label>
            )}
            <input
                id={id}
                className={`input-field ${error ? 'input-error' : ''}`}
                {...props}
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            {helperText && !error && <p className="mt-1 text-xs text-gray-500">{helperText}</p>}
        </div>
    );
}
