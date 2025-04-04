export default function Placard({ children }) {
    return (
      <div className="bg-white p-2 group cursor-pointer">
        {children}
      </div>
    );
  }