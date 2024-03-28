'use client';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { toggleSidebar } from '@/store/themeConfigSlice';
import AnimateHeight from 'react-animate-height';
import { IRootState } from '@/store';
import { useState, useEffect } from 'react';
import IconCaretsDown from '@/components/icon/icon-carets-down';
import IconCaretDown from '@/components/icon/icon-caret-down';
import IconMinus from '@/components/icon/icon-minus';
import { useParams, usePathname } from 'next/navigation';
import { getTranslation } from '@/i18n';
import IconMenuInvoice from '../icon/menu/icon-menu-invoice';
import { User2 } from 'lucide-react';

const VendorSidebarDocs = () => {
    const { store } = useParams();

    const dispatch = useDispatch();
    const { t } = getTranslation();
    const pathname = usePathname();
    const [currentMenu, setCurrentMenu] = useState<string>('');
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);

    const semidark = useSelector((state: IRootState) => state.themeConfig.semidark);
    const stores = useSelector((state: IRootState) => state.vendor);

    const toggleMenu = (value: string) => {
        console.log(value);

        setCurrentMenu((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };

    useEffect(() => {
        setCurrentMenu(pathname);
    }, [pathname]);

    useEffect(() => {
        const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
        if (selector) {
            selector.classList.add('active');
            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link') || [];
                if (ele.length) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele.click();
                    });
                }
            }
        }
    }, []);

    useEffect(() => {
        setActiveRoute();
        if (window.innerWidth < 1024 && themeConfig.sidebar) {
            dispatch(toggleSidebar());
        }
    }, [pathname]);

    const setActiveRoute = () => {
        let allLinks = document.querySelectorAll('.sidebar ul a.active');
        for (let i = 0; i < allLinks.length; i++) {
            const element = allLinks[i];
            element?.classList.remove('active');
        }
        const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
        selector?.classList.add('active');
    };

    return (
        <div className={semidark ? 'dark' : ''}>
            <nav
                className={`sidebar fixed bottom-0 top-0 z-50 h-full min-h-screen w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-all duration-300 ${semidark ? 'text-white-dark' : ''}`}
            >
                <div className="h-full bg-white dark:bg-black">
                    <div className="flex items-center justify-between px-4 py-3">
                        <Link href="/" className="main-logo flex shrink-0 items-center">
                            {/* <img className="ml-[5px] w-8 flex-none" src="/assets/images/logo.svg" alt="logo" /> */}
                            <span className="align-middle text-2xl font-semibold ltr:ml-1.5 rtl:mr-1.5 dark:text-white-light lg:inline">{process.env.DOCS_WEBSITE_NAME}</span>
                        </Link>

                        <button
                            type="button"
                            className="collapse-icon flex h-8 w-8 items-center rounded-full transition duration-300 hover:bg-gray-500/10 rtl:rotate-180 dark:text-white-light dark:hover:bg-dark-light/10"
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            <IconCaretsDown className="m-auto rotate-90" />
                        </button>
                    </div>
                    <PerfectScrollbar className="relative h-[calc(100vh-80px)]">
                        <ul className="relative space-y-0.5 p-4 py-0 font-semibold">
                            <h2 className="-mx-4 mb-1 flex items-center bg-white-light/30 px-7 py-3 font-extrabold uppercase dark:bg-dark dark:bg-opacity-[0.08]">
                                <IconMinus className="hidden h-5 w-4 flex-none" />
                                <span>{t('Main')}</span>
                            </h2>

                            <li className="menu nav-item">
                                <button
                                    type="button"
                                    className={`${currentMenu === `/vendor/${store}/docs` ? 'active' : ''} nav-link group w-full`}
                                    onClick={() => toggleMenu(`/vendor/${store}/docs`)}
                                >
                                    <div className="flex items-center">
                                        <IconMenuInvoice className="shrink-0 group-hover:!text-primary" />
                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('Getting Started')}</span>
                                    </div>

                                    <div className={currentMenu !== `/vendor/${store}/docs` ? '-rotate-90 rtl:rotate-90' : ''}>
                                        <IconCaretDown />
                                    </div>
                                </button>

                                <AnimateHeight duration={300} height={currentMenu === `/vendor/${store}/docs` ? 'auto' : 0}>
                                    <ul className="sub-menu text-gray-500">
                                        <li className={currentMenu === `/vendor/${store}/docs` && 'text-blue-800'}>
                                            <Link href={`/vendor/${store}/docs`}>{t('Introduction')}</Link>
                                        </li>
                                    </ul>
                                </AnimateHeight>
                            </li>

                            <li className="menu nav-item">
                                <button
                                    type="button"
                                    className={`${currentMenu === `/vendor/${store}/docs/customer/registration` ? 'active' : ''} nav-link group w-full`}
                                    onClick={() => toggleMenu(`/vendor/${store}/docs/customer/registration`)}
                                >
                                    <div className="flex items-center">
                                        <User2 className="shrink-0 group-hover:!text-primary" />
                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('Customer')}</span>
                                    </div>

                                    <div className={currentMenu !== `/vendor/${store}/docs/customer/registration` ? '-rotate-90 rtl:rotate-90' : ''}>
                                        <IconCaretDown />
                                    </div>
                                </button>

                                <AnimateHeight duration={300} height={currentMenu === `/vendor/${store}/docs/customer/registration` ? 'auto' : 0}>
                                    <ul className="sub-menu text-gray-500">
                                        <li className={currentMenu === `/vendor/${store}/docs/customer/registration` && 'text-blue-800'}>
                                            <Link href={`/vendor/${store}/docs/customer/registration`}>{t('Registration')}</Link>
                                        </li>
                                    </ul>
                                </AnimateHeight>
                            </li>
                        </ul>
                    </PerfectScrollbar>
                </div>
            </nav>
        </div>
    );
};

export default VendorSidebarDocs;