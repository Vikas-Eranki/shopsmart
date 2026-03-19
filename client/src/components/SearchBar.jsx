import { useState, useEffect, useRef } from 'react';

function SearchBar({ onSearch, placeholder = 'Search products...', debounceMs = 300 }) {
    const [query, setQuery] = useState('');
    const timerRef = useRef(null);

    useEffect(() => {
        if (timerRef.current) clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
            if (onSearch) onSearch(query);
        }, debounceMs);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [query, debounceMs, onSearch]);

    const handleClear = () => {
        setQuery('');
        if (onSearch) onSearch('');
    };

    return (
        <div className="search-bar" data-testid="search-bar">
            <span className="search-icon">🔍</span>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                data-testid="search-input"
                aria-label="Search products"
                className="search-input"
            />
            {query && (
                <button
                    className="search-clear-btn"
                    data-testid="search-clear-btn"
                    onClick={handleClear}
                    aria-label="Clear search"
                >
                    ✕
                </button>
            )}
        </div>
    );
}

export default SearchBar;
