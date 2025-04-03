// src/components/Artwork.jsx
export default function Artwork({ artwork = "farmer" }) {
    return (
      <div className="w-full h-[120px] relative">
        <img
          src={`/artwork/goal/${artworkFile}.jpg`}
          alt={artwork}
          className="block mx-auto h-full w-auto object-center"
        />
      </div>
    );
  }