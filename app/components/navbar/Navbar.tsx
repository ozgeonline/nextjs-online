
import { Bell } from "lucide-react"
import { links } from "../../data/Navlinks.constant"
import NavbarLink from "./navigation/NavbarLinks"
import Logo_Img from "../ui/assets/Logo_Img"
import Link from "next/link"
import dynamic from 'next/dynamic';
import styles from "./navbar.module.css"
const DropdownNavbarMenu = dynamic(() => import('./navigation/DropdownNavbarMenu'));
const SearchMovieInput = dynamic(() => import('./features/SearchMovieInput'));
const ScrollingElementSSR = dynamic(() => import('./features/ScrollingElementSSR'));
const UserSettingsMenu = dynamic(() => import('./features/UserSettingsMenu'));

export default function Navbar() {
  
  return (
    <ScrollingElementSSR>
      <div className="flex w-full justify-between items-start p-2 md:p-5">
        <div className="flex mx-5">
          <Logo_Img
            logoStyle="relative flex items-center w-24 h-10 md:w-[15vw] md:h-[3vw] lg:w-[8vw] lg:h-[2vw]"
          />
          <ul className="hidden lg:flex lg:px-4 lg:gap-x-5">
            {links.map((link) => (
              <NavbarLink
                key={link.id}
                path={link.href}
                label={link.name}
              />
            ))}
          </ul>
          
          {/* for mobile screen */}
          <DropdownNavbarMenu>
            <ul className={styles["dropdown-navbar-wrapper"]} >
              {links.map((link) => (
                <NavbarLink 
                  key={link.id} 
                  path={link.href} 
                  label={link.name}
                />
              ))}
            </ul>
          </DropdownNavbarMenu>
        </div>
       
        <div className="padding-layout relative flex items-center lg:space-x-5 space-x-2">
          <SearchMovieInput />
          <Link 
            className="hidden lg:flex cursor-pointer" 
            href="/home/kids"
          >
            Kids
          </Link>
          <Bell className="hidden lg:flex size-5 text-gray-300 cursor-not-allowed" />

          {/* User Profile Controls */}
          <UserSettingsMenu />
        </div>
      </div>
    </ScrollingElementSSR>
  )
}