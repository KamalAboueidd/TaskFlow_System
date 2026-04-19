import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import SideBar from './SideBar'
import Footer from './Footer'

function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-950 via-blue-950 to-indigo-950 text-white flex flex-col'>
        <Navbar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
        <div className='flex flex-1'>
            <SideBar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
            <main className='flex-1 p-4 md:p-6 overflow-y-auto md:ml-0'>
                <Outlet />
            </main>
        </div>
        <Footer />
    </div>
  )
}

export default Layout
