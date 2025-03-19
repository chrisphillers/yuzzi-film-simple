import Link from 'next/link';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'JOURNAL', href: '/journal' },
  { name: 'ARCHIVES', href: '/archives' },
  { name: 'ABOUT', href: '/about' },
  { name: 'SHOP', href: '/shop' },
];

export const NavBar = () => {
  return (
    <div className="container mx-auto px-4">
      <nav className="mx-auto flex w-full justify-between py-4">
        <div>
          <Link
            href="/"
            className="text-lg font-bold tracking-tighter transition-opacity hover:opacity-80"
          >
            LE YUZZI
          </Link>
        </div>
        <div className="flex justify-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn('text-sm tracking-wide transition-opacity hover:opacity-80')}
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div>
          <Link
            href="/newsletter"
            className="text-sm tracking-wide transition-opacity hover:opacity-80"
          >
            NEWSLETTER
          </Link>
        </div>
      </nav>
    </div>
  );
};
