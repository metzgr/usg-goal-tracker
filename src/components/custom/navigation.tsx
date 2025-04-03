import { Navbar, NavbarItem, NavbarSection } from '@/components/navbar'

function Navigation() {
  return (
    <Navbar className="flex justify-between">
      <div className="flex">
      <a href="/" aria-label="Home">
      <img src="logo.svg" alt="Logo" className="height-[32px] mr-6" />
      </a>
      <NavbarSection>
        <NavbarItem href="/designsystem" current>
          Explore
        </NavbarItem>
        <NavbarItem href="/designsystem">Analyze</NavbarItem>
      </NavbarSection>
      </div>
      <img src="/icons/share-arrow.svg" alt="Logo" className="height-[32px]" />
    </Navbar>
  )
}

export default Navigation;