import { Navbar, NavbarItem, NavbarSection } from 'src/components/base/navbar';

type NavigationProps = {
  activeItem: 'Explore' | 'Analyze' | 'Discover';
};

function Navigation({ activeItem }: NavigationProps) {
  return (
    <Navbar className="flex justify-between">
      <div className="flex">
        <a href="/" aria-label="Home">
          <img src="logo.svg" alt="Logo" className="h-[32px] mr-6" />
        </a>
        <NavbarSection>
          <NavbarItem href="/explore" current={activeItem === 'Explore'}>
            Explore
          </NavbarItem>
          <NavbarItem href="/analyze" current={activeItem === 'Analyze'}>
            Analyze
          </NavbarItem>
        </NavbarSection>
      </div>
      <img src="/icons/share-arrow.svg" alt="Share" className="h-[30px]" />
    </Navbar>
  );
}

export default Navigation;