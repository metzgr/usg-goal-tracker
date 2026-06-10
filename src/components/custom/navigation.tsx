import { Navbar, NavbarItem, NavbarSection } from 'src/components/custom/navbar';

type NavigationProps = {
  activeItem: 'Explore' | 'Analyze';
};

function Navigation({ activeItem }: NavigationProps) {
  return (
    <Navbar className="flex justify-between">
      <div className="flex">
        <a href="/" aria-label="Home">
          <img src="/logo.svg" alt="Logo" width={56} height={28} className="h-[28px] w-[56px] mr-6" />
        </a>
        <NavbarSection className="">
          <NavbarItem href="/explore" current={activeItem === 'Explore'}>
            Explore
          </NavbarItem>
          <NavbarItem href="/analyze" current={activeItem === 'Analyze'}>
            Analyze
          </NavbarItem>
        </NavbarSection>
      </div>
    </Navbar>
  );
}

export default Navigation;