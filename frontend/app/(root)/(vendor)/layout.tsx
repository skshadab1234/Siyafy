'use client';

import VendorSidebarDocs from '@/components/layouts/VendorSideBarDocs';
import ContentAnimation from '@/components/layouts/content-animation';
import Footer from '@/components/layouts/footer';
import MainContainer from '@/components/layouts/main-container';
import Overlay from '@/components/layouts/overlay';
import ScrollToTop from '@/components/layouts/scroll-to-top';
import Setting from '@/components/layouts/setting';
import VendorHeader from '@/components/layouts/vendorHeader';
import VendorSidebar from '@/components/layouts/vendorSidebar';
import Portals from '@/components/portals';
import { usePathname } from 'next/navigation';
export default function DefaultLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <>
            {/* BEGIN MAIN CONTAINER */}
            <div className="relative">
                <Overlay />
                <ScrollToTop />

                {/* BEGIN APP SETTING LAUNCHER */}
                <Setting />
                {/* END APP SETTING LAUNCHER */}

                <MainContainer>
                    {/* BEGIN SIDEBAR */}
                    {pathname.includes('/docs') ? <VendorSidebarDocs /> : <VendorSidebar />}
                    {/* END SIDEBAR */}
                    <div className="main-content flex min-h-screen flex-col">
                        {/* BEGIN TOP NAVBAR */}
                        <VendorHeader />
                        {/* END TOP NAVBAR */}

                        {/* BEGIN CONTENT AREA */}
                        <ContentAnimation>{children}</ContentAnimation>
                        {/* END CONTENT AREA */}

                        {/* BEGIN FOOTER */}
                        <Footer />
                        {/* END FOOTER */}
                        <Portals />
                    </div>
                </MainContainer>
            </div>
        </>
    );
}
