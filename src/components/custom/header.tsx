import UsgBanner from "src/components/custom/usg-banner";
import Navigation from "src/components/custom/navigation";

export default function Header({ activeItem = "Explore" }) {
  return (
    <header>
      <UsgBanner />
      <Navigation activeItem={activeItem} />
    </header>
  );
}