interface DropdownButtonProps {
    label: string;
    value: string;
    onClick: () => void;
    icon?: string;
  }
  export function DropdownButton({ label, value, onClick, icon }: DropdownButtonProps) {
    return (
      <div className="relative h-[48px]">
        <span className="absolute left-5 -top-3 px-1 bg-white text-xs text-gray-500">{label}</span>
        <button
          type="button"
          onClick={onClick}
          className="h-full w-full inline-flex items-center justify-between px-7 py-2.5 font-bold text-gray-950 rounded-[3px] outline-1 outline-gray-300 focus:outline-2 focus:outline-gray-600 hover:bg-gray-50"
        >
          {value}
          {icon && <img src={icon} alt="" className="h-5 w-5" />}
        </button>
      </div>
    );
  }
  