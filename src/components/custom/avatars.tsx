export default function Avatars({
    count = 1,
    avatar1,
    avatar2,
    avatar3,
    avatar4,
  }) {
    // Collect non-empty avatar props into an array
    const avatars = [avatar1, avatar2, avatar3, avatar4].filter(Boolean).slice(0, count);
  
    // Conditional sizing: if count <= 2, use larger dimensions (w-8 h-8), else use smaller (w-6 h-6)
    const sizeClass = count <= 2 ? "w-8 h-8" : "w-6 h-6";
  
    return (
      <div className="flex -space-x-1 overflow-hidden">
        {avatars.map((avatar, index) => (
          <img
            key={index}
            className={`inline-block ${sizeClass} rounded-full ring-1 ring-white`}
            src={`/avatars/seals/${avatar}.png`}
            alt={`avatar ${avatar}`}
          />
        ))}
      </div>
    );
  }