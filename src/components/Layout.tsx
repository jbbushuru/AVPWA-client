import { Outlet } from 'react-router-dom';
import Sidebar from './Layout/Sidebar';
import BottomNav from './Layout/Bottombar';
import Logo from './Layout/Logo';
import Topbar from './Layout/Topbar';

export default function Layout() {
    return (
        <div className="flex flex-col h-screen w-screen overflow-hidden">
            <div className="flex flex-1 overflow-hidden">
                <div className='border-r border-r-primary bg-white'>
                <Logo/>
                <Sidebar />   
                </div>
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    <Topbar/>
                {/* Outlet for the content is on the RHS of the sidebar, scrollable */}
                <main className="flex-1 overflow-y-auto p-3 md:p-8 bg-[var(--bg-main)]">
                    <Outlet />
                </main>
                </div>

                <BottomNav />
            </div>
        </div>
    );
}
