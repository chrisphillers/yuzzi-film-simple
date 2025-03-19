import Link from 'next/link';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'INSTAGRAM', href: '/journal' },
  { name: 'TWITTER', href: '/archives' },
  { name: 'FACEBOOK', href: '/about' },
];

export const Footer = () => {
  return (
    <footer className="mt-8 w-full bg-black py-2 text-center text-white">
      <div className="flex justify-center space-x-4">
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
    </footer>
  );
};
