'use client';

import Link from 'next/link';
import React from 'react';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Image from 'next/image';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { navLinks } from '../../../constancts';
import { usePathname } from 'next/navigation';
import { Button } from 'react-day-picker';

const MobileNav = () => {
  const pathname = usePathname();
  return (
    <header className='header'>
      <Link href={'/'} className=''>
        <Image src='/logo.png' alt='logo' width={150} height={150} />
      </Link>

      <nav className='flex gap-2'>
        <SignedIn>
          <UserButton afterSignOutUrl='/' />

          <Sheet>
            <SheetTrigger>
              <Image
                src='/assets/icons/menu.svg'
                alt='hamburger-menu'
                width={32}
                height={32}
                className='cursor-pointer'
              />
            </SheetTrigger>
            <SheetContent className='sheet-content sm-64'>
              <>
                <Image
                  src={'/assets/images/logo.png'}
                  alt='logo'
                  width={150}
                  height={150}
                />
                <ul className='header-nav_elements'>
                  {navLinks.map((link) => {
                    const isActive = link.route === pathname;

                    return (
                      <li
                        key={link.route}
                        className={`${isActive && 'gradient-text'} p-18 whitespace-nowrap text-dark-700`}
                      >
                        <Link className='sidebar-link cursor-pointer' href={link.route}>
                          <Image
                            src={link.icon}
                            alt='logo'
                            width={24}
                            height={24}
                          />
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </>
            </SheetContent>
          </Sheet>
        </SignedIn>
        <SignedOut>
            <Button className='button bg-purple-gradient bg-cover'>
                <Link href="/sign-in">Login</Link>
            </Button>
           </SignedOut>
      </nav>
    </header>
  );
};

export default MobileNav;
