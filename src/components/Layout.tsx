import { Outlet } from 'react-router-dom';
import Sidebar from './Layout/Sidebar';
import BottomNav from './Layout/Bottombar';
import Logo from './Layout/Logo';

export default function Layout() {
    return (
        <div className="flex flex-col h-screen w-screen overflow-hidden">
            <div className="flex flex-1 overflow-hidden">
                <div className='border-r border-r-primary bg-white'>
                <Logo/>
                <Sidebar />   
                </div>
                {/* Outlet for the content is on the RHS of the sidebar, scrollable */}
                <main className="flex-1 overflow-y-auto p-8 bg-amber-50">
                    <Outlet />
                </main>

                <BottomNav />
            </div>
        </div>
    );
}
