'use client';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Dropdown from '@/components/dropdown';
import IconEye from '@/components/icon/icon-eye';
import IconHorizontalDots from '@/components/icon/icon-horizontal-dots';
import IconMenu from '@/components/icon/icon-menu';
import IconNotes from '@/components/icon/icon-notes';
import IconNotesEdit from '@/components/icon/icon-notes-edit';
import IconPencil from '@/components/icon/icon-pencil';
import IconPlus from '@/components/icon/icon-plus';
import IconSquareRotated from '@/components/icon/icon-square-rotated';
import IconStar from '@/components/icon/icon-star';
import IconTrashLines from '@/components/icon/icon-trash-lines';
import IconUser from '@/components/icon/icon-user';
import IconX from '@/components/icon/icon-x';
import { IRootState } from '@/store';
import { Transition, Dialog } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { Group, ListChecksIcon } from 'lucide-react';
import { Drawer, Input, Modal } from 'antd';
import AppProductsComponent from './AppProductsComponent';

const AppProducts = () => {
    const [isShowNoteMenu, setIsShowNoteMenu] = useState<any>(false);
    const [addNewMOdal, setAddNewModal] = useState<any>(false);

    const [searchTerm, setSearchTerm] = useState<string>('');

    const [selectedTab, setSelectedTab] = useState<any>('all');

    const tabChanged = (type: string) => {
        setSelectedTab(type);
        setIsShowNoteMenu(false);
    };

    const handleCreate = (note: any = null) => {
        setIsShowNoteMenu(false);
        setAddNewModal(true);
    };

    // const showMessage = (msg = '', type = 'success') => {
    //     const toast: any = Swal.mixin({
    //         toast: true,
    //         position: 'top',
    //         showConfirmButton: false,
    //         timer: 3000,
    //         customClass: { container: 'toast' },
    //     });
    //     toast.fire({
    //         icon: type,
    //         title: msg,
    //         padding: '10px 20px',
    //     });
    // };

    const handleSearh = (e: any) => {
        const value = e.target.value;
        setSearchTerm(value);
    };

    return (
        <div>
            <div className="relative flex h-full gap-5 sm:h-[calc(100vh_-_150px)]">
                <div className={`absolute z-10 hidden h-full w-full rounded-md bg-black/60 ${isShowNoteMenu ? '!block xl:!hidden' : ''}`} onClick={() => setIsShowNoteMenu(!isShowNoteMenu)}></div>
                <div
                    className={`panel
                    absolute
                    z-10
                    hidden
                    h-full
                    w-[240px]
                    flex-none
                    space-y-4
                    overflow-hidden
                    p-4
                    ltr:rounded-r-none
                    rtl:rounded-l-none
                    ltr:lg:rounded-r-md rtl:lg:rounded-l-md
                    xl:relative xl:block
                    xl:h-auto ${isShowNoteMenu ? '!block h-full ltr:left-0 rtl:right-0' : 'hidden shadow'}`}
                >
                    <div className="flex h-full flex-col pb-16">
                        <div className="flex items-center text-center">
                            <div className="shrink-0">
                                <ListChecksIcon />
                            </div>
                            <h3 className="text-lg font-semibold ltr:ml-3 rtl:mr-3">Manage Products</h3>
                        </div>

                        <div className="my-4 h-px w-full border-b border-white-light dark:border-[#1b2e4b]"></div>
                        <PerfectScrollbar className="relative h-full grow ltr:-mr-3.5 ltr:pr-3.5 rtl:-ml-3.5 rtl:pl-3.5">
                            <div className="space-y-1">
                                <button
                                    type="button"
                                    className={`flex h-10 w-full items-center justify-between rounded-md p-2 font-medium hover:bg-white-dark/10 hover:text-primary dark:hover:bg-[#181F32] dark:hover:text-primary ${
                                        selectedTab === 'all' && 'bg-gray-100 text-primary dark:bg-[#181F32] dark:text-primary'
                                    }`}
                                    onClick={() => tabChanged('all')}
                                >
                                    <div className="flex items-center">
                                        <IconNotesEdit className="shrink-0" />
                                        <div className="ltr:ml-3 rtl:mr-3">All Products</div>
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    className={`flex h-10 w-full items-center justify-between rounded-md p-2 font-medium hover:bg-white-dark/10 hover:text-primary dark:hover:bg-[#181F32] dark:hover:text-primary ${
                                        selectedTab === 'bulk_upload' && 'bg-gray-100 text-primary dark:bg-[#181F32] dark:text-primary'
                                    }`}
                                    onClick={() => tabChanged('bulk_upload')}
                                >
                                    <div className="flex items-center">
                                        <Group className="shrink-0" />
                                        <div className="ltr:ml-3 rtl:mr-3">Bulk Upload</div>
                                    </div>
                                </button>
                                <div className="h-px w-full border-b border-white-light dark:border-[#1b2e4b]"></div>
                            </div>
                        </PerfectScrollbar>
                    </div>
                    <div className="absolute bottom-0 w-full p-4 ltr:left-0 rtl:right-0">
                        <button className="btn btn-primary w-full" type="button" onClick={() => handleCreate()}>
                            <IconPlus className="h-5 w-5 shrink-0 ltr:mr-2 rtl:ml-2" />
                            Add New Product
                        </button>
                    </div>
                </div>
                <div className="panel h-full flex-1 overflow-auto">
                    <div className="h-screen pb-5">
                        <div>
                            <div className="items-center justify-between gap-5 space-y-2 md:flex">
                                <button type="button" className="hover:text-primary xl:hidden" onClick={() => setIsShowNoteMenu(!isShowNoteMenu)}>
                                    <IconMenu />
                                </button>

                                <h3 className="text-lg font-semibold ltr:ml-3 rtl:mr-3">3 Products</h3>
                                <div className="flex flex-1 justify-end">
                                    <Input onChange={handleSearh} className="h-12 !border border-gray-500 placeholder:text-gray-800 md:w-1/2" placeholder="Search by Product Name, Sku" />
                                </div>
                            </div>
                            <div className="my-4 h-px w-full border-b border-white-light dark:border-[#1b2e4b]"></div>
                        </div>
                    </div>
                </div>
            </div>

            <Drawer title={<h1 className="text-xl font-semibold text-gray-600">Create new product</h1>} open={addNewMOdal} onClose={() => setAddNewModal(false)} width="100VW">
                <AppProductsComponent />
            </Drawer>
        </div>
    );
};

export default AppProducts;
