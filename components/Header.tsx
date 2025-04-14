import { HeaderLinks } from './HeaderLinks';

export function Header() {
    return (
      <header className="bg-pm-nav-orange text-pm-white p-4 shadow-md">
        <nav className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-anton tracking-wider">PLANET MADO</h1>
          <HeaderLinks />
        </nav>
      </header>
    );
  }