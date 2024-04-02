import React, { useState } from 'react';
import { Button, Image, Input, Modal } from 'antd';

const LinkedProducts = ({ form }: any) => {
    const [relatedModalVisible, setRelatedModalVisible] = useState(false);
    const [upsellModalVisible, setUpsellModalVisible] = useState(false);
    const [crossSellModalVisible, setCrossSellModalVisible] = useState(false);
    const [selectedRelatedProducts, setSelectedRelatedProducts] = useState([]);
    const [selectedUpsellProducts, setSelectedUpsellProducts] = useState([]);
    const [selectedCrossSellProducts, setSelectedCrossSellProducts] = useState([]);

    const handleRelatedClick = () => {
        setRelatedModalVisible(true);
        // Fetch related products data or set default selected data here
        // Example:
        // setSelectedRelatedProducts([...]);
    };

    const handleUpsellClick = () => {
        setUpsellModalVisible(true);
        // Fetch upsell products data or set default selected data here
        // Example:
        // setSelectedUpsellProducts([...]);
    };

    const handleCrossSellClick = () => {
        setCrossSellModalVisible(true);
        // Fetch cross-sell products data or set default selected data here
        // Example:
        // setSelectedCrossSellProducts([...]);
    };

    const handleRelatedModalCancel = () => {
        setRelatedModalVisible(false);
    };

    const handleUpsellModalCancel = () => {
        setUpsellModalVisible(false);
    };

    const handleCrossSellModalCancel = () => {
        setCrossSellModalVisible(false);
    };

    return (
        <div>
            <h1 className="my-6 text-xl font-semibold tracking-wide text-slate-600 md:text-4xl">Related Products</h1>
            <div className="flex gap-4">
                <Button onClick={handleRelatedClick}>Related</Button>
                <Button onClick={handleUpsellClick}>Upsell Products</Button>
                <Button onClick={handleCrossSellClick}>Cross-sell Products</Button>
            </div>

            <Modal width={1200} title="Related Products" visible={relatedModalVisible} onCancel={handleRelatedModalCancel} footer={null}>
                {/* Display selected related products here */}
                {/* Example: <p>{selectedRelatedProducts}</p> */}
                <Input className="h-12" placeholder="Search by Product name, Unique Id, SKu" />
                <div className="flex h-[70vh] py-5">
                    <div>
                        <ul>
                            <li>
                                <Image src="https://rukminim2.flixcart.com/image/832/832/xif0q/sandal/r/r/z/-original-imagsfdvtyfhzpgg.jpeg?q=70&crop=false" width={300} height={350} />
                                <div className='space-y-1'>
                                    <p className='text-xs tracking-wide'>458569</p>
                                    <span className="text-sm">Product Name</span>
                                    <p>SKu: 45S-K-121</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </Modal>

            <Modal title="Upsell Products" visible={upsellModalVisible} onCancel={handleUpsellModalCancel} footer={null}>
                {/* Display selected upsell products here */}
                {/* Example: <p>{selectedUpsellProducts}</p> */}
            </Modal>

            <Modal title="Cross-sell Products" visible={crossSellModalVisible} onCancel={handleCrossSellModalCancel} footer={null}>
                {/* Display selected cross-sell products here */}
                {/* Example: <p>{selectedCrossSellProducts}</p> */}
            </Modal>
        </div>
    );
};

export default LinkedProducts;
