export default function Placard({ children }) {
  return (
    <div className="bg-white p-2">
      <div className="ring-1 ring-inset ring-gray-300 py-4 rounded-[10px]">
      {children}
      </div>
    </div>
  );
}