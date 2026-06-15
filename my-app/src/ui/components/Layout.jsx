import React from 'react';
// import { Outlet } from 'react-router-dom';
// import  Navbar  from './Navbar';
// import Footer  from './Footer';
import Home from '../pages/Home';

 const Layout=()=> {
  return (
    <div className="min-h-screen flex flex-col bg-brand-dark">
  
      <main className="flex-grow">
        <Home />
      </main>

    </div>
  );
}

export default Layout;
