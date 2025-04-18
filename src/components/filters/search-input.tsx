interface SearchInputProps {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
  }
  export function SearchInput({ value, onChange, placeholder }: SearchInputProps) {
    return (
      <div className="relative flex-1">
        <input
          type="search"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-[48px] rounded-[3px] bg-gray-50 pl-12 pr-3 font-bold text-base text-gray-950 outline-1 outline-gray-300 focus:outline-2 focus:outline-gray-600"
        />
        <img
          src="/icons/search-icon.svg"
          alt=""
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5"
        />
      </div>
    );
  }
  