'use client';
import { useEffect, useState } from 'react';
import { Table, Modal, Button, Pagination, Input, Spin, Switch, Select, Form } from 'antd';
import PageHeaderWithBreadcrumb from '@/components/utils/pageHeaderwithBreadcrumb';
import { getCookie } from '@/components/layouts/header';
import { formatDateTime } from '@/utils';
import { debounce } from 'lodash';
import { Edit3Icon } from 'lucide-react';

const AllConsultation = () => {
    const [form] = Form.useForm();
    const [consultationData, setConsultationData] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearch] = useState('');

    const [pageSize, setPageSize] = useState(10);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingButton, setButtonLoading] = useState(false);

    const [showModalfix, setShowModal] = useState(false);

    useEffect(() => {
        fetchData(currentPage, pageSize, searchTerm);
    }, [currentPage, pageSize]);

    const fetchData = async (page: any, pageSize: any, searchTerm: any) => {
        const token = getCookie('tokenSagartech');

        try {
            const response = await fetch(`${process.env.ADMINURL}/api/consultation?page=${parseInt(page)}&pageSize=${parseInt(pageSize)}&search=${searchTerm}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const { data, total } = await response.json();
                setConsultationData(data);
                setTotalRecords(total);
            } else {
                console.error('Failed to fetch data');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTableChange = (page: number, pageSize: number) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    const columns = [
        {
            title: '',
            render: (_: string, record: any) => {
                return <Edit3Icon onClick={() => handleUpdate(record)} className=" cursor-pointer text-green-700" />;
            },
        },
        {
            title: 'Appointment Date & Time',
            key: 'appointment_date_time',
            width: 350,
            render: (text: string, record: any) => {
                try {
                    const { start, end } = formatDateTime(record.preferred_date, record.preferred_time, record.appointment_till_date, record.appointment_till_time);
                    return (
                        <div>
                            <h2>
                                <b>Start: </b>
                                {start}
                            </h2>
                            <h2>
                                <b>End: </b>
                                {end}
                            </h2>
                            <h2>
                                {record?.appointmentstatus}
                            </h2>
                        </div>
                    );
                } catch (error) {
                    return 'Invalid date or time';
                }
            },
        },
        { title: 'Full Name', dataIndex: 'full_name', key: 'full_name', width: 200 },
        { title: 'Location', dataIndex: 'location', key: 'location', width: 200 },
        { title: 'Age', dataIndex: 'age', key: 'age', width: 200 },
        {
            title: 'Contact Number',
            dataIndex: 'contact_number',
            width: 200,
            key: 'contact_number',
            render: (text: string) => <a href={`tel:${text}`}>{text}</a>, // Add a link with the tel protocol to initiate a phone call
        },
        { title: 'Purpose of Yoga', width: 200, dataIndex: 'purpose_of_yoga', key: 'purpose_of_yoga' },
        {
            title: 'Action',
            key: 'action',
            width: 200,

            render: (text: string, record: any) => (
                <div>
                    <Button type="link" onClick={() => showModal(record)}>
                        View Details
                    </Button>
                </div>
            ),
        },
    ];

    const handleUpdate = (record: any) => {
        setSelectedRecord(record);
        setShowModal(true);
        form.setFieldsValue({ appointmentstatus: record?.appointmentstatus, additionaltext: record?.additionaltext });
    };

    const showModal = (record: any) => {
        setSelectedRecord(record);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setSelectedRecord(null);
    };

    const handleSearch = debounce((text: string) => {
        fetchData(1, 10, text);
    }, 300); // Adjust the debounce delay (in milliseconds) as needed

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        handleSearch(value);
    };

    console.log(consultationData, 'con');

    return (
        <div>
            <PageHeaderWithBreadcrumb
                crumbs={[{ title: 'Home', href: '/admin' }, { title: 'Consultation', href: '/admin/consultation/all' }, { title: 'All Consultation' }]}
                title="All Consultation"
                description="Find all consultation information here."
            />
            <div className="h-full w-full bg-white ">
                <div className="my-4 p-4">
                    <Input onChange={onInputChange} className="h-12 text-xl font-semibold text-gray-800 placeholder:text-xl" placeholder="Search customer name, contact number" />
                </div>
                <Spin spinning={loading}>
                    <Table columns={columns} dataSource={consultationData} rowKey="id" pagination={false} />
                </Spin>
                <div className="flex items-center justify-center py-10">
                    <Pagination
                        showTotal={(total) => `Total ${total} items`}
                        current={currentPage}
                        pageSize={pageSize}
                        total={totalRecords}
                        onChange={(page, pageSize) => handleTableChange(page, pageSize)}
                    />
                </div>
            </div>

            <Modal
                title="Consultation Details"
                open={isModalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button key="close" onClick={handleCancel}>
                        Close
                    </Button>,
                ]}
            >
                {selectedRecord && (
                    <div>
                        <p>
                            <strong>Full Name:</strong> {selectedRecord.full_name}
                        </p>
                        <p>
                            <strong>Location:</strong> {selectedRecord.location}
                        </p>
                        <p>
                            <strong>Age:</strong> {selectedRecord.age}
                        </p>
                        <p>
                            <strong>Contact Number:</strong> {selectedRecord.contact_number}
                        </p>
                        <p>
                            <strong>Alternate Mobile Number:</strong> {selectedRecord.alternate_mobile_number}
                        </p>
                        <p>
                            <strong>Diet Preference:</strong> {selectedRecord.diet_preference}
                        </p>
                        <p>
                            <strong>Zodiac Sign:</strong> {selectedRecord.zodiac_sign}
                        </p>
                        <p>
                            <strong>Relationship Status:</strong> {selectedRecord.relationship_status}
                        </p>
                        <p>
                            <strong>Medicine Consumption:</strong> {selectedRecord.medicine_consumption}
                        </p>
                        <p>
                            <strong>Disorders or Disease:</strong> {selectedRecord.disorders_or_disease}
                        </p>
                        <p>
                            <strong>Purpose of Yoga:</strong> {selectedRecord.purpose_of_yoga}
                        </p>
                        <p>
                            <strong>Personal Notes:</strong> {selectedRecord.personal_notes}
                        </p>
                        <p>
                            <strong>Created At:</strong> {selectedRecord.created_at}
                        </p>
                    </div>
                )}
            </Modal>

            <Modal
                title="Update Appointment Status"
                open={showModalfix}
                footer={null}
                onCancel={() => {
                    setShowModal(false);
                    setSelectedRecord(null);
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={async (values) => {
                        try {
                            setButtonLoading(true);
                            const token = getCookie('tokenSagartech');
                            const id = selectedRecord?.id; // Assuming selectedRecord contains the ID

                            const response = await fetch(`${process.env.ADMINURL}/api/update-consultation/${id}`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${token}`,
                                },
                                body: JSON.stringify(values),
                            });

                            if (response.ok) {
                                // Handle success
                                console.log('Appointment status updated successfully');

                                // Assuming the response includes the updated consultation object
                                const updatedConsultation = await response.json();

                                console.log(updatedConsultation, 'upad');

                                // Update the local state with the updated consultation object
                                setConsultationData((prevData) => {
                                    return prevData.map((item) => {
                                        if (item.id === updatedConsultation.consultation.id) {
                                            return updatedConsultation.consultation;
                                        } else {
                                            return item;
                                        }
                                    });
                                });
                                setShowModal(false);
                                // You can also update the UI or perform other actions here if needed
                            } else {
                                // Handle error
                                console.error('Failed to update appointment status');
                                // You can also show an error message or perform other actions here if needed
                            }
                        } catch (error) {
                            console.error('Error updating appointment status:', error);
                            // You can also show an error message or perform other actions here if needed
                        } finally {
                            setButtonLoading(false);
                        }
                    }}
                >
                    <Form.Item label="Appointment Status" name="appointmentstatus" className="mb-5">
                        <Select placeholder="Select Appointment Status" className="h-12 text-xl font-semibold placeholder:text-xl">
                            <Select.Option value="attended">Attended</Select.Option>
                            <Select.Option value="not_attended">Not Attended</Select.Option>
                            <Select.Option value="cancelled">Cancelled</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Additional Text" name="additionaltext">
                        <Input.TextArea rows={4} placeholder="Enter additional text here..." />
                    </Form.Item>
                    <Form.Item className="flex justify-end">
                        <Button loading={loadingButton} className="h-12 bg-blue-500 px-5 text-lg font-semibold text-white" htmlType="submit">
                            Update Record
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AllConsultation;
