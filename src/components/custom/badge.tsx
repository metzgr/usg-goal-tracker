export default function Badge({ children }) {
    return (
      <span className="inline-flex items-center gap-x-1.5 rounded-full px-[10px] text-sm/5 py-[2px] font-medium text-gray-700 ring-1 ring-inset ring-gray-300">
        {children}
      </span>
    );
  }