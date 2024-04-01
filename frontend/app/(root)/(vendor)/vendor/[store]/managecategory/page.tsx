'use client';
import React, { useEffect, useState } from 'react';
import { Button, Form, Image, Input, Modal, Select, Space, Switch, Table, Tooltip, Typography, Upload, notification } from 'antd';
import { UploadOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import { Edit2, Trash2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { useRouter } from 'next/navigation';
import { checkStoreExists } from '@/components/utils/checkStoreExists';

const ManageCategory = ({ params }: { params: { store: string } }) => {
    // Ensure to define your Hooks at the beginning of the component
    const [categoryData, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDescription, setSelectedDescription] = useState('');
    const [Descp_modalVisible, setDescp_ModalVisible] = useState(false);
    const [modalSubcategory, setModalSubcategories] = useState(false);
    const [UploadImageButtonModal, setUploadImageButtonModal] = useState(false);
    const [CategoryLoading, setCategoryLoading] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [selectedKey, setSelectedKey] = useState(null);
    const [selectedSubKey, setSelectedSubKey] = useState(null);
    const [ModalSubMaincategories, setModalSubMaincategories] = useState(null);
    const [DeletemodalVisibleRole, setDeleteModalCategory] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [DeleteSubcategoryModal, setDeleteSubcategoryModal] = useState(false);

    const [selectedRow, setSelectedRow] = useState([]);
    const [subselectedRow, setSubSelectedRow] = useState([]);
    const [SubMainSelectedRow, setSelectedSubMainSelectedRow] = useState([]);
    const [attributes, setAttributes] = useState([]);
    const [type, setType] = useState('');
    const [visible, setVisible] = useState(false);
    const [selectedAttributes, setSelectedAttributes] = useState([]);
    const [selectedNestedCategory, setSelectedNestedCategory] = useState(null);

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const vendorData = useSelector((state: IRootState) => state.vendor);
    const router = useRouter();

    useEffect(() => {
        if (vendorData?.id && params.store) {
            checkStoreExists(vendorData.id, params.store).then((storeExists) => {
                if (!storeExists?.success) {
                    router.push('/vendor');
                    
                }
                fetchData('', vendorData?.id, params.store)
            });
        }
    }, [vendorData, params]);

    const fetchData = async (search: string, vendor_id: number, store: string) => {
        try {
            const url = `${process.env.ADMINURL}/api/getAllCatgeoryWithSubcategory?pageNumber=${pagination.current}&pageSize=${pagination.pageSize}&search=${search}&vendor_id=${vendor_id}&store=${store}`;
            const categoryResponse = await fetch(url);
            const result = await categoryResponse.json();

            setData(result.data);
            setPagination({
                ...pagination,
                total: result.total || 0,
            });
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    // Fetch data using useEffect
    useEffect(() => {
        fetchData('', vendorData?.id, params.store);
    }, [pagination.current, pagination.pageSize]);

    const handleShowAttributes = (attributes: any) => {
        setSelectedAttributes(attributes);
        setVisible(true);
    };

    const handleCloseModal = () => {
        setVisible(false);
    };

    // Define your columns and handleTableChange function as before
    const columns = [
        {
            title: 'Actions',
            key: 'actions',
            width: 120,
            render: (record) => (
                <Space size="middle" className="flex">
                    {/* Edit Icon */}
                    <Edit2
                        onClick={() => handleUpdate(record.category_id)} // Replace 'id' with 'category_id'
                        className="h-6 w-6 cursor-pointer text-green-600"
                    />

                    {/* Delete Icon */}
                    <Trash2
                        onClick={() => handleDelete(record.category_id)} // Replace 'id' with 'category_id'
                        className="h-6 w-6 cursor-pointer text-red-600"
                    />
                </Space>
            ),
        },
        {
            title: 'Type',
            dataIndex: 'category_type',
            key: 'category_type',
            width: 120,
            sorter: (a, b) => a.category_type.localeCompare(b.category_type), // Add sorter function for string comparison
        },
        {
            title: 'Name',
            dataIndex: 'category_name',
            key: 'category_name',
            width: 250,
            sorter: (a, b) => a.category_name.localeCompare(b.category_name), // Add sorter function for string comparison
            defaultSortOrder: 'ascend', // Set the default sorting order to ascending
            render: (_, record) => (
                <>
                    <p>
                        {record?.category_name}
                    </p>
                </>
            ),
        },
        {
            title: 'Subcategories',
            dataIndex: 'Subcategories',
            key: 'Subcategories',
            width: 250,
            defaultSortOrder: 'ascend', // Set the default sorting order to ascending
            render: (_, record) => (
                <>
                    <div
                        onClick={() => {
                            setSelectedRow(record);
                            setSelectedKey(record.category_id);
                            setModalSubcategories(true);
                        }}
                        className="cursor-pointer"
                    >
                        <p className="text-base text-blue-800">View Subcategories ({record?.subcategories?.length})</p>
                    </div>
                </>
            ),
        },
        {
            title: 'Attribute Linked',
            dataIndex: 'attributes',
            key: 'attributes',
            width: 200,
            render: (_, record) => {
                return (
                    <div className="text-center">
                        <p className="cursor-pointer text-blue-950" onClick={() => handleShowAttributes(record.attributes)}>
                            {record.attributes?.length}
                        </p>
                    </div>
                );
            },
        },
        {
            title: 'Image',
            dataIndex: 'category_image_url',
            key: 'category_image_url',
            width: 100,
            render: (imageUrl, row) => {
                if (imageUrl) {
                    return (
                        <div className="flex overflow-hidden">
                            <Image width={50} height={50} src={`${process.env.ADMINURL}/upload/CatgeoryImages/${imageUrl}`} className="h-full w-full rounded-full border-4  object-contain" />

                            <Edit2
                                className="cursor-pointer text-gray-500"
                                onClick={() => {
                                    setUploadImageButtonModal(true);
                                    setSelectedKey(row.category_id);
                                    setType('category');
                                }}
                            />
                        </div>
                    );
                } else {
                    return (
                        <Edit2
                            className="cursor-pointer text-gray-500"
                            onClick={() => {
                                setUploadImageButtonModal(true);
                                setSelectedKey(row.category_id);
                                setType('category');
                            }}
                        />
                    );
                }
            },
        },
        {
            title: 'Description',
            dataIndex: 'category_description',
            key: 'category_description',
            width: 300,
            render: (category_description) => (
                <Tooltip title={category_description}>
                    <div
                        style={{
                            maxWidth: '200px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {category_description.length > 10 ? (
                            <>
                                {category_description.slice(0, 10)}{' '}
                                <Button type="link" onClick={() => handleDescriptionModal(category_description)}>
                                    Read More
                                </Button>
                            </>
                        ) : (
                            category_description
                        )}
                    </div>
                </Tooltip>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'category_status',
            key: 'category_status',
            render: (status, record) => <Switch checked={status} onChange={(checked) => handleSwitchChange(checked, record.category_id, 'category')} className="bg-red-500" />,
        },
    ];

    const subcategory_columns = [
        {
            title: 'Actions',
            key: 'actions',
            width: 120,
            fixed: 'left',
            render: (record) => (
                <Space size="middle" className="flex">
                    {/* Delete Icon */}
                    <Trash2
                        onClick={() => handleSubcatModal(record.subcategory_id)} // Replace 'id' with 'category_id'
                        className="h-6 w-6 cursor-pointer text-red-600"
                    />
                </Space>
            ),
        },
        { title: 'Subcategory Name', dataIndex: 'subcategory_name', key: 'subcategory_name' },
        {
            title: 'Sub Main categories',
            dataIndex: 'Subcategories',
            key: 'Subcategories',
            width: 250,
            defaultSortOrder: 'ascend', // Set the default sorting order to ascending
            render: (_, record) => (
                <>
                    <div
                        onClick={() => {
                            setSelectedSubMainSelectedRow(record);
                            setSelectedSubKey(record.subcategory_id);
                            setModalSubMaincategories(true);
                        }}
                        className="cursor-pointer"
                    >
                        <p className="text-base text-blue-800">View Nested Subcategories ({record?.nested_subcategories?.length || 0})</p>
                    </div>
                </>
            ),
        },
        {
            title: 'Image',
            dataIndex: 'subcategory_image_url',
            key: 'subcategory_image_url',
            width: 100,
            render: (imageUrl, row) => {
                if (imageUrl) {
                    return (
                        <div className="flex overflow-hidden">
                            <Image width={50} height={50} src={`${process.env.ADMINURL}/upload/SubcategoryImages/${imageUrl}`} className="h-full w-full rounded-full border-4  object-contain" />

                            <Edit2
                                className="cursor-pointer text-gray-500"
                                onClick={() => {
                                    setUploadImageButtonModal(true);
                                    setSelectedKey(row.subcategory_id);
                                    setType('subcategory');
                                }}
                            />
                        </div>
                    );
                } else {
                    return (
                        <Edit2
                            className="cursor-pointer text-gray-500"
                            onClick={() => {
                                setUploadImageButtonModal(true);
                                setSelectedKey(row.subcategory_id);
                                setType('subcategory');
                            }}
                        />
                    );
                }
            },
        },
        {
            title: 'Status',
            dataIndex: 'subcat_status',
            key: 'subcat_status',
            render: (subcat_status, record) => (
                <>
                    <Switch checked={subcat_status} onChange={(checked) => handleSwitchChange(checked, record.subcategory_id, 'subcategory')} className="bg-red-500" />
                    <p>{subcat_status}</p>
                </>
            ),
        },
        // Add more columns as needed
    ];

    const subcategory_main_columns = [
        // {
        //   title: "Actions",
        //   key: "actions",
        //   width: 120,
        //   fixed: 'left',
        //   render: (record) => (
        //     <Space size="middle" className="flex">
        //       {/* Edit Icon */}
        //       {/* <FiEdit3
        //         onClick={() => handleUpdate(record.category_id)} // Replace 'id' with 'category_id'
        //         className="text-green-600 w-6 h-6 cursor-pointer"
        //       /> */}

        //       {/* Delete Icon */}
        //       <FiTrash2
        //         onClick={() => handleSubcatModal(record.subcategory_id)} // Replace 'id' with 'category_id'
        //         className="text-red-600 w-6 h-6 cursor-pointer"
        //       />
        //     </Space>
        //   ),
        // },
        { title: 'Sub Main Category Name', dataIndex: 'nested_subcategory_name', key: 'nested_subcategory_name' },

        {
            title: 'Image',
            dataIndex: 'image_url',
            key: 'image_url',
            width: 100,
            render: (imageUrl, row, index) => {
                if (imageUrl) {
                    return (
                        <div className="flex overflow-hidden">
                            <Image width={50} height={50} src={`${process.env.ADMINURL}/upload/SubMaincategoryImage/${imageUrl}`} className="h-full w-full rounded-full border-4  object-contain" />

                            <Edit2
                                className="cursor-pointer text-gray-500"
                                onClick={() => {
                                    setSelectedNestedCategory(row?.nested_subcategory_name);
                                    setUploadImageButtonModal(true);
                                    setSelectedKey(index);
                                    setType('submaincategory');
                                }}
                            />
                        </div>
                    );
                } else {
                    return (
                        <Edit2
                            className="cursor-pointer text-gray-500"
                            onClick={() => {
                                setSelectedNestedCategory(row?.nested_subcategory_name);
                                setUploadImageButtonModal(true);
                                setSelectedKey(index);
                                setType('submaincategory');
                            }}
                        />
                    );
                }
            },
        },

        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status, record, index) => (
                <>
                    <Switch
                        checked={status}
                        onChange={(checked) => {
                            setSelectedNestedCategory(record?.nested_subcategory_name);
                            handleSwitchChange(checked, record?.nested_subcategory_name, 'submaincategory');
                        }}
                        className="bg-red-500"
                    />
                    <p>{status}</p>
                </>
            ),
        },
        // Add more columns as needed
    ];

    const handleUpdate = (key) => {
        setSelectedKey(key);
        setModalVisible(true);
        const seletcedRow = categoryData?.filter((item) => item.category_id === key);
        form.setFieldsValue(seletcedRow[0]);
        setSelectedRow(seletcedRow[0]);
    };

    function handleDelete(key) {
        setSelectedKey(key);
        const selectedRow = categoryData.find((item) => item.category_id === key);
        setSelectedRow(selectedRow);
        setDeleteModalCategory(true);
    }

    const handleSwitchChange = async (checked, categoryId, type) => {
        try {
            // Send a request to the backend to update the category status
            const response = await fetch(`${process.env.ADMINURL}/api/updateCategoryStatus`, {
                method: 'POST', // Adjust the method based on your backend API
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    categoryId: categoryId,
                    status: checked,
                    type,
                    SubMainSelectedRow,
                }),
            });

            if (response.ok) {
                const data = await response.json();

                setData((prevCategoryData) => {
                    const updatedCategoryData = [...prevCategoryData];

                    if (type === 'subcategory') {
                        const categoryIndex = updatedCategoryData.findIndex((category) => category.subcategories?.some((subcat) => subcat.subcategory_id === categoryId));
                        if (categoryIndex !== -1) {
                            const subcategoryIndex = updatedCategoryData[categoryIndex].subcategories.findIndex((subcat) => subcat.subcategory_id === categoryId);
                            if (subcategoryIndex !== -1) {
                                updatedCategoryData[categoryIndex].subcategories[subcategoryIndex].subcat_status = checked;
                            }
                        }
                    } else if (type === 'category') {
                        const categoryToUpdate = updatedCategoryData.find((category) => category.category_id === categoryId);
                        if (categoryToUpdate) {
                            categoryToUpdate.category_status = checked;
                        }
                    } else if (type === 'submaincategory') {
                        const matchedSubMain = SubMainSelectedRow?.nested_subcategories?.find((item) => item.nested_subcategory_name === categoryId);
                        console.log(matchedSubMain, 'statis');
                        if (matchedSubMain) {
                            matchedSubMain.status = checked;
                        }
                    }

                    return updatedCategoryData;
                });

                // Show a success notification if the request was successful
                const statusMessage = checked ? 'enabled' : 'disabled';
                notification.success({
                    message: 'Success',
                    description: `${type === 'category' ? 'Category' : 'Subcategory'} is now ${statusMessage}.`,
                });
            } else {
                // Handle errors if the request was not successful
                notification.error({
                    message: 'Error',
                    description: 'Failed to update category status.',
                });
            }
        } catch (error) {
            // Handle network errors or other exceptions
            console.error('Error updating category status:', error);
            notification.error({
                message: 'Error',
                description: 'Failed to update category status. Please try again.',
            });
        }
    };

    const handleDescriptionModal = (description) => {
        setSelectedDescription(description);
        setDescp_ModalVisible(true);
    };

    const handleTableChange = (pagination, filters, sorter) => {
        setPagination({
            ...pagination,
            current: pagination.current,
            pageSize: pagination.pageSize,
        });
    };

    function onCancel() {
        setSelectedKey(null);
        setDeleteModalCategory(false);
        setUploadImageButtonModal(false);
        setFileList([]);
        setSelectedKey(null);
        setSelectedSubKey(null);
        setDeleteSubcategoryModal(false);
    }

    const handleBeforeUpload = (file) => {
        // Check file type and size before uploading
        const isImage = file.type === 'image/jpeg' || file.type === 'image/png';

        // If both conditions are met, add the file to the fileList
        if (isImage) {
            setFileList([file]);
        }

        return false; // Prevent automatic upload
    };

    const handleDeleteImage = () => {
        // Clear the selected file and set isEditing to false
        setFileList([]);
    };

    const handleUploadImage = () => {
        try {
            if (fileList.length === 0) {
                // Handle the case when there is no file to upload
                return;
            }

            const file = fileList[0]; // Get the file from fileList at index 0

            const formData = new FormData();
            formData.append('file', file);
            formData.append('selectedKey', selectedKey);
            formData.append('SubMainSelectedRow', JSON.stringify(SubMainSelectedRow));

            if (type === 'category') {
                fetch(`${process.env.ADMINURL}/api/UploadCategoryImage`, {
                    method: 'POST',
                    body: formData,
                })
                    .then(async (response) => {
                        if (response.ok) {
                            // Handle success
                            const data = await response.json();
                            const updatedCategoryData = [...categoryData]; // Create a shallow copy of categoryData to avoid mutating the original array
                            const foundCategoryIndex = updatedCategoryData.findIndex((item) => item.category_id === selectedKey);

                            if (foundCategoryIndex !== -1) {
                                // Update category_image_url for the found category
                                updatedCategoryData[foundCategoryIndex].category_image_url = data?.file;
                                notification.success({
                                    message: 'Success',
                                    description: 'Category Image updated successfully!',
                                });
                                // If you need to update other properties, you can do so here
                                // updatedCategoryData[foundCategoryIndex].otherProperty = 'new_value';
                            }

                            // Use updatedCategoryData in your application

                            setUploadImageButtonModal(false);
                            setCategoryLoading(false);
                            setFileList([]);
                            setSelectedKey(null);
                            console.log('File sent to the backend successfully');
                        } else {
                            // Handle error
                            console.error('Error sending file to the backend');
                        }
                    })
                    .catch((error) => {
                        // Handle network error
                        console.error('Network error:', error);
                    });
            } else if (type === 'subcategory') {
                fetch(`${process.env.ADMINURL}/api/UploadSubcatgeoryImage`, {
                    method: 'POST',
                    body: formData,
                })
                    .then(async (response) => {
                        if (response.ok) {
                            // Handle success
                            const data = await response.json();

                            const foundSubcatIndex = selectedRow?.subcategories?.findIndex((item) => item.subcategory_id === selectedKey);

                            if (foundSubcatIndex !== -1) {
                                // Update category_image_url for the found category
                                selectedRow.subcategories[foundSubcatIndex].subcategory_image_url = data?.file;
                                notification.success({
                                    message: 'Success',
                                    description: 'SubCategory Image updated successfully!',
                                });
                            }

                            setUploadImageButtonModal(false);
                            setCategoryLoading(false);
                            setFileList([]);
                            setSelectedKey(null);
                            console.log('File sent to the backend successfully');
                        } else {
                            // Handle error
                            console.error('Error sending file to the backend');
                        }
                    })
                    .catch((error) => {
                        // Handle network error
                        console.error('Network error:', error);
                    });
            } else if (type === 'submaincategory') {
                fetch(`${process.env.ADMINURL}/api/UploadSubMaincatgeoryImage`, {
                    method: 'POST',
                    body: formData,
                })
                    .then(async (response) => {
                        if (response.ok) {
                            // Handle success
                            const data = await response.json();

                            // SubMainSelectedRow.nested_subcategories[selectedKey].image_url = data?.file;
                            const matchedSubMain = SubMainSelectedRow?.nested_subcategories?.filter((item) => item.nested_subcategory_name === selectedNestedCategory);

                            if (matchedSubMain.length > 0) {
                                // Update the image_url property for the first matched item (assuming there's only one match)
                                const matchedItem = matchedSubMain[0];
                                matchedItem.image_url = data?.file;
                            }

                            notification.success({
                                message: 'Success',
                                description: 'SubCategory Image updated successfully!',
                            });

                            setUploadImageButtonModal(false);
                            setCategoryLoading(false);
                            setFileList([]);
                            setSelectedKey(null);
                            console.log('File sent to the backend successfully');
                        } else {
                            // Handle error
                            console.error('Error sending file to the backend');
                        }
                    })
                    .catch((error) => {
                        // Handle network error
                        console.error('Network error:', error);
                    });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const [form] = Form.useForm();

    function handleCreate() {
        form.resetFields();
        setSelectedKey(null);
        setModalVisible(true);
    }

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 6 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 18 },
        },
    };

    const handleSaveCategories = async () => {
        try {
            setButtonLoading(true);
            // Validate the form fields
            form.validateFields().then(async (values) => {
                if (selectedKey === null) {
                    // Send the values to the backend
                    const response = await fetch(`${process.env.ADMINURL}/api/addNewCategories`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({values, store_name: params.store, vendor_id: vendorData?.id}),
                    });

                    if (response.ok) {
                        // Handle success, maybe show a success message

                        // Fetch and update the category data after successful insertion
                        const result = await response.json();

                        // Fetch the new data (for example, from the server response)
                        const newData = result.addedSubcategories?.[0];

                        setPagination({ current: 1, total: 0, pageSize: 10 });
                        // Append the new data to the existing data
                        setData([
                            {
                                category_id: newData?.category_id,
                                ...values,
                            },
                            ...categoryData,
                        ]);

                        // Show success notification with SweetAlert
                        Swal.fire({
                            icon: 'success',
                            title: 'Success',
                            text: result?.message,
                        });
                        setModalVisible(false);
                    } else {
                        // Handle errors and show appropriate messages
                        const responseData = await response.json();
                        if (responseData && responseData.error) {
                            console.error('Failed to add categories:', responseData.error);
                            // Show error message to the user
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: responseData.error,
                            });
                        } else {
                            console.error('Failed to add categories:', response.statusText);
                            // Show a generic error message to the user
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: 'Failed to add categories. Please try again.',
                            });
                        }
                    }
                } else {
                    setData(categoryData.map((item) => (item.category_id === selectedKey ? { ...item, ...values } : item)));

                    try {
                        const response = await fetch(`${process.env.ADMINURL}/api/updateCategory`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ selectedKey, values, store: params.store, vendorId: vendorData?.id }),
                        });

                        if (response.ok) {
                            // Show success message using Swal.fire
                            Swal.fire({
                                icon: 'success',
                                title: 'Category Updated',
                                text: 'The category has been successfully updated.',
                            });

                            setModalVisible(false);

                            // Perform any additional actions after successful category insertion
                        } else {
                            // Show error message using Swal.fire
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: 'Failed to updated the category. Please try again later.',
                            });
                        }
                    } catch (error) {
                        // Handle any other errors
                        console.error(error);
                    }
                }
            });
        } catch (error) {
            // Handle validation errors or other exceptions
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to add categories. Please check the form and try again.',
            });
        } finally {
            setButtonLoading(false);
        }
    };

    const onDelete = async (selectedKey) => {
        if (selectedKey) {
            try {
                // Send the request to the backend using fetch
                const response = await fetch(`${process.env.ADMINURL}/api/deleteCategory`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ selectedKey }),
                });

                if (!response.ok) {
                    // Handle error response from the server if needed
                    const errorText = await response.text();
                    throw new Error(`Failed to update roles. Server responded with status ${response.status}: ${errorText}`);
                } else {
                    if (response.ok) {
                        // Show a success Swal popup
                        Swal.fire({
                            icon: 'success',
                            title: 'Deleted!',
                            text: 'The item has been deleted.',
                        });
                        setDeleteModalCategory(false);
                        setData(categoryData.filter((item) => item.category_id != selectedKey));
                    } else {
                        // Show an error Swal popup if the response status is not ok
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Failed to delete the item.',
                        });
                    }
                }
            } catch (error) {
                // Show an error Swal popup if there's an error making the request
                console.error('Error during onDelete:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to delete the item.',
                });
            }
        } else {
            setUploadImageButtonModal(false);
        }
    };

    const handleSubcatModal = (key) => {
        const DeleteSubcat = categoryData
            .map((category) => ({
                ...category,
                subcategories: category.subcategories.filter((subcat) => subcat.subcategory_id === key),
            }))
            .filter((category) => category.subcategories.length > 0)
            .map((category) => category.subcategories);

        // The updated categoryData with the subcategory removed
        const firstSubcategory = DeleteSubcat[0][0];

        setSubSelectedRow(firstSubcategory);
        setSelectedSubKey(key);
        setDeleteSubcategoryModal(true);
    };

    const handleDeleteSubcategoryLogic = async (subcategory_id) => {
        try {
            // Send a DELETE request to your backend API to delete the subcategory
            const response = await fetch(`${process.env.ADMINURL}/api/deleteSubcategory`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ subcategory_id }), // Send the subcategory_id in the request body
            });

            if (response.ok) {
                // Subcategory deleted successfully
                const foundSubcatIndex = selectedRow?.subcategories.filter((item) => item.subcategory_id === selectedSubKey);

                const updatedDATA = selectedRow?.subcategories.filter((item) => item.subcategory_id !== foundSubcatIndex[0]?.subcategory_id);
                const craetedata = {
                    ...categoryData,
                    subcategories: updatedDATA,
                };

                const filterCategory = categoryData?.find((item) => item.category_id === selectedKey);

                if (filterCategory) {
                    const filteredSubcategories = filterCategory.subcategories.filter((item) => item.subcategory_id !== subcategory_id);

                    const updatedCategory = {
                        ...filterCategory,
                        subcategories: filteredSubcategories,
                    };

                    const updatedData = categoryData.map((item) => (item.category_id === selectedKey ? updatedCategory : item));

                    setData(updatedData);
                }

                setSelectedRow(craetedata);

                setDeleteSubcategoryModal(false);
                notification.success({ message: 'SubCategory Deleted Successfully' });
            } else {
                // Handle error response
                console.error('Error deleting subcategory:', response.statusText);
                Swal.fire({
                    icon: 'success',
                    title: 'Error deleting subcategory',
                    text: `${response.statusText}`,
                });
            }
        } catch (error) {
            // Handle error
            console.error('Error deleting subcategory:', error);
            Swal.fire({
                icon: 'success',
                title: 'Error deleting subcategory',
                text: `${error}`,
            });
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.ADMINURL}/api/GetAttributesByVendor`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                // Assuming the backend responds with JSON data containing attributes
                const responseData = await response.json();
                const transformedData = responseData.attributes.map((attribute) => ({
                    attribute_id: attribute.attribute_id, // Add this line
                    name: attribute.attribute_name,
                    values: attribute.attribute_values,
                    category: attribute.category,
                    subcategory: attribute.subcategory,
                }));

                // Assuming responseData is the JSON response from your backend
                // Transform the data and set it in your component's state
                setAttributes(transformedData);
            } catch (error) {
                console.error('Error:', error);
                // Handle the error as needed, e.g., show an error message to the user
            }
        };

        // Fetch data when the component mounts
        fetchData();
    }, []);

    const handleCategoryFind = (e) => {
        const query = e.target.value;
        fetchData(query);
    };
    
    return (
        <div className="mb-44 p-4 sm:p-0 ">
            <div className="items-center  justify-between space-y-5 py-10 md:flex">
                <h1 className="text-4xl font-bold text-gray-700">Manage Category</h1>
                <div className="w-full md:w-1/2">
                    <Input.Search onChange={handleCategoryFind} placeholder="Search by Category name, Subcategory name, Nested Category name" />
                </div>
            </div>

            <button onClick={handleCreate} className="absolute right-10 top-20 z-[999] rounded-full bg-[#EC642A] p-2 text-white hover:bg-[#EC642A]/80">
                <svg className="h-10 w-10 " xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            </button>

            <Table
                dataSource={categoryData}
                columns={columns}
                loading={loading}
                pagination={pagination}
                onChange={handleTableChange}
                scroll={{
                    x: 1500,
                    y: 600,
                }}
            />

            <Modal
                title={selectedKey === null ? 'Create category' : 'Update category'}
                visible={modalVisible}
                onOk={handleSaveCategories}
                onCancel={() => setModalVisible(false)}
                okText={selectedKey === null ? 'Create' : 'Update'}
                width={1200}
                okButtonProps={{ style: { backgroundColor: 'green' }, disabled: loading }}
            >
                <Form {...formItemLayout} form={form}>
                    {/* Category Type Input */}
                    <Form.Item
                        label="Category Type"
                        name="category_type"
                        rules={[
                            {
                                required: true,
                                message: 'Please select the category type!',
                            },
                        ]}
                    >
                        <Select placeholder="Select category type">
                            <Select.Option value="Products">Products</Select.Option>
                            <Select.Option value="Services">Services</Select.Option>
                        </Select>
                    </Form.Item>

                    {/* Category Name Input */}
                    <Form.Item
                        label="Category Name"
                        name="category_name"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter the category name!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    {/* Category Description Input */}
                    <Form.Item
                        label="Category Description"
                        name="category_description"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter the category description!',
                            },
                        ]}
                    >
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item
                        label="Select Attribute"
                        name="attribute_cat_id"
                        rules={[
                            {
                                message: 'Please select Attribute',
                            },
                        ]}
                    >
                        <Select
                            showSearch
                            mode="multiple"
                            onChange={(values) => {
                                /* Handle multiple values here */
                            }}
                        >
                            {attributes &&
                                attributes.map((item, index) => (
                                    <Select.Option key={index} value={item.attribute_id}>
                                        {item.name} ({item.values?.join(', ')})
                                    </Select.Option>
                                ))}
                        </Select>
                    </Form.Item>

                    {/* Category Status Input */}
                    <Form.Item
                        label="Category Status"
                        name="category_status"
                        valuePropName="checked" // This allows handling the boolean value as a checkbox
                    >
                        <Switch checked={form.getFieldValue('category_status') || true} className="bg-red-500" />
                    </Form.Item>

                    <hr className="mb-8" />
                    <Form.List name="subcategories">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, fieldKey, ...restField }) => (
                                    <div className="mb-4 border-b" key={key}>
                                        <Form.Item
                                            label={`Name ${key + 1}`}
                                            {...restField}
                                            name={[name, 'subcategory_name']}
                                            fieldKey={[fieldKey, 'subcategory_name']}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please enter the subcategory name!',
                                                },
                                            ]}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            label={`Description ${key + 1}`}
                                            {...restField}
                                            name={[name, 'subcategory_description']}
                                            fieldKey={[fieldKey, 'subcategory_description']}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please enter the subcategory description!',
                                                },
                                            ]}
                                        >
                                            <Input />
                                        </Form.Item>

                                        {/* Nested Subcategories */}
                                        <Form.List name={[name, 'nested_subcategories']}>
                                            {(nestedFields, { add: addNested, remove: removeNested }) => (
                                                <>
                                                    {nestedFields.map(({ key: nestedKey, name: nestedName, fieldKey: nestedFieldKey, ...nestedRestField }) => (
                                                        <div className="mb-4 border-b" key={nestedKey}>
                                                            <Form.Item
                                                                label={`Nested Subcategory Name ${nestedKey + 1}`}
                                                                {...nestedRestField}
                                                                wrapperCol={{ offset: 2, span: 14 }}
                                                                labelCol={{ offset: 2, span: 8 }}
                                                                name={[nestedName, 'nested_subcategory_name']}
                                                                fieldKey={[nestedFieldKey, 'nested_subcategory_name']}
                                                                rules={[
                                                                    {
                                                                        required: true,
                                                                        message: 'Please enter the nested subcategory name!',
                                                                    },
                                                                ]}
                                                            >
                                                                <Input />
                                                            </Form.Item>
                                                            <Form.Item
                                                                label={`Nested Subcategory Description ${nestedKey + 1}`}
                                                                {...nestedRestField}
                                                                wrapperCol={{ offset: 2, span: 14 }}
                                                                labelCol={{ offset: 2, span: 8 }}
                                                                name={[nestedName, 'nested_subcategory_description']}
                                                                fieldKey={[nestedFieldKey, 'nested_subcategory_description']}
                                                                rules={[
                                                                    {
                                                                        required: true,
                                                                        message: 'Please enter the nested subcategory description!',
                                                                    },
                                                                ]}
                                                            >
                                                                <Input />
                                                            </Form.Item>
                                                        </div>
                                                    ))}

                                                    {/* Buttons for Nested Subcategories */}
                                                    <Form.Item wrapperCol={{ offset: 6, span: 14 }} className="flex items-center justify-center">
                                                        <Button type="dashed" onClick={() => addNested()} icon={<PlusOutlined />} className="flex items-center justify-center">
                                                            Add Nested Subcategory
                                                        </Button>
                                                    </Form.Item>

                                                    {nestedFields.length > 0 && (
                                                        <Form.Item wrapperCol={{ offset: 6, span: 14 }}>
                                                            <Button
                                                                type="dashed"
                                                                onClick={() => removeNested(nestedFields.length - 1)}
                                                                icon={<MinusCircleOutlined />}
                                                                className="flex items-center justify-center"
                                                            >
                                                                Remove Last Nested Subcategory
                                                            </Button>
                                                        </Form.Item>
                                                    )}
                                                </>
                                            )}
                                        </Form.List>
                                    </div>
                                ))}

                                {/* Buttons for Subcategories */}
                                <Form.Item wrapperCol={{ offset: 6, span: 14 }} className="flex items-center justify-center">
                                    <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />} className="flex items-center justify-center">
                                        Add Subcategory
                                    </Button>
                                </Form.Item>

                                {fields.length > 0 && (
                                    <Form.Item wrapperCol={{ offset: 6, span: 14 }}>
                                        <Button type="dashed" onClick={() => remove(fields.length - 1)} icon={<MinusCircleOutlined />} className="flex items-center justify-center">
                                            Remove Last Subcategory
                                        </Button>
                                    </Form.Item>
                                )}
                            </>
                        )}
                    </Form.List>
                </Form>
            </Modal>

            <Modal visible={Descp_modalVisible} onCancel={() => setDescp_ModalVisible(false)} footer={null} width={600} title="Description">
                <Typography.Paragraph>{selectedDescription}</Typography.Paragraph>
            </Modal>

            <Modal visible={modalSubcategory} onCancel={() => setModalSubcategories(false)} footer={null} width={600} title="Subcategories">
                <Table dataSource={selectedRow?.subcategories} columns={subcategory_columns} />
            </Modal>

            <Modal visible={ModalSubMaincategories} onCancel={() => setModalSubMaincategories(false)} footer={null} width={600} title="Sub Main categories">
                <Table dataSource={SubMainSelectedRow?.nested_subcategories || []} columns={subcategory_main_columns} />
            </Modal>

            <Modal
                title="Upload Image"
                visible={UploadImageButtonModal}
                onCancel={onCancel}
                footer={[
                    <Button key="cancel" onClick={onCancel}>
                        Cancel
                    </Button>,
                    <Button key="upload" type="default" className="bg-green-500 text-white" onClick={() => handleUploadImage()} loading={CategoryLoading}>
                        Upload
                    </Button>,
                ]}
            >
                <Upload name="category_image" accept=".jpg,.png" beforeUpload={handleBeforeUpload} fileList={fileList} onRemove={handleDeleteImage} listType="picture">
                    {fileList.length === 0 && <Button icon={<UploadOutlined />}>Click to Upload</Button>}
                </Upload>
            </Modal>

            <Modal
                title="Confirm Delete"
                visible={DeletemodalVisibleRole}
                onCancel={onCancel}
                footer={[
                    <Button key="cancel" onClick={onCancel}>
                        Cancel
                    </Button>,
                    <Button key="delete" type="primary" danger onClick={() => onDelete(selectedKey)}>
                        Delete
                    </Button>,
                ]}
            >
                <p>
                    Are you sure you want to delete this category <b>({`${selectedRow?.category_name}`}) </b>?
                </p>
            </Modal>

            <Modal
                title="Confirm Subcategory Delete"
                visible={DeleteSubcategoryModal}
                onCancel={() => {
                    setDeleteSubcategoryModal(false);
                    setSelectedSubKey(null);
                }}
                footer={[
                    <Button
                        key="cancel"
                        onClick={() => {
                            setDeleteSubcategoryModal(false);
                            setSelectedSubKey(null);
                        }}
                    >
                        Cancel
                    </Button>,
                    <Button key="delete" type="primary" danger onClick={() => handleDeleteSubcategoryLogic(selectedSubKey)}>
                        Delete
                    </Button>,
                ]}
            >
                <p>
                    Are you sure you want to delete this category <b>({`${subselectedRow?.subcategory_name}`}) </b>?
                </p>
            </Modal>

            <Modal
                title="Attributes"
                visible={visible}
                onCancel={handleCloseModal}
                footer={[
                    <Button key="close" onClick={handleCloseModal}>
                        Close
                    </Button>,
                ]}
            >
                {selectedAttributes.map((attribute, index) => (
                    <div className="mb-5">
                        <p className="text-xl font-semibold text-gray-700" key={index}>
                            {attribute.attribute_name}
                        </p>
                        <p className="text-base uppercase tracking-widest" key={index}>
                            {attribute?.attribute_values?.join(', ')}
                        </p>
                    </div>
                ))}
            </Modal>
        </div>
    );
};

export default ManageCategory;
