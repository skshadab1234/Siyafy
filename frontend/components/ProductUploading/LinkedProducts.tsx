import React, { useEffect, useState } from 'react';
import { Button, Image, Input, Modal } from 'antd';
import { getCookie } from '../layouts/header';

const LinkedProducts = ({ form, onReturn }: any) => {
    const [relatedModalVisible, setRelatedModalVisible] = useState(false);
    const [upsellModalVisible, setUpsellModalVisible] = useState(false);
    const [crossSellModalVisible, setCrossSellModalVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [products, setProducts] = useState(null);

    const [selectedRelatedProducts, setSelectedRelatedProducts] = useState(form.getFieldValue('related_ids') || []);
    const [selectedUpsellProducts, setSelectedUpsellProducts] = useState(form.getFieldValue('upsell_ids') || []);
    const [selectedCrossSellProducts, setSelectedCrossSellProducts] = useState(form.getFieldValue('cross_sell_ids') || []);

    useEffect(() => {
        const fetchSearchProducts = () => {
            const token = getCookie('tokenVendorsSagartech'); // Assuming getCookie is a function to retrieve cookies

            if (!token) {
                console.error('Token not found');
                return;
            }

            const url = `${process.env.ADMINURL}/api/products/search?q=${searchTerm}`;
            fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => {
                    if (!res.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return res.json();
                })
                .then((data) => {
                    setProducts(data || []);
                    // Process the fetched data as needed
                })
                .catch((error) => {
                    console.error('There was a problem with the fetch operation:', error);
                });
        };

        searchTerm.trim() != '' && fetchSearchProducts();
    }, [searchTerm]);

    const handleRelatedClick = () => {
        setRelatedModalVisible(true);
        setProducts(selectedRelatedProducts || []);
    };

    const handleUpsellClick = () => {
        setUpsellModalVisible(true);
        setProducts(selectedUpsellProducts || []);
    };

    const handleCrossSellClick = () => {
        setCrossSellModalVisible(true);
        setProducts(selectedCrossSellProducts || []);
    };

    const handleRelatedModalCancel = () => {
        setRelatedModalVisible(false);
        setProducts(null);
        setSearchTerm('');
    };

    const handleUpsellModalCancel = () => {
        setUpsellModalVisible(false);
        setProducts(null);
        setSearchTerm('');
    };

    const handleCrossSellModalCancel = () => {
        setCrossSellModalVisible(false);
        setProducts(null);
        setSearchTerm('');
    };

    const handleProductToggle = (product, type) => {
        switch (type) {
            case 'related':
                if (selectedRelatedProducts.find((selectedProduct) => selectedProduct.id === product.id)) {
                    setSelectedRelatedProducts(selectedRelatedProducts.filter((selectedProduct) => selectedProduct.id !== product.id));
                } else {
                    setSelectedRelatedProducts([...selectedRelatedProducts, product]);
                }
                break;
            case 'upsell':
                if (selectedUpsellProducts.find((selectedProduct) => selectedProduct.id === product.id)) {
                    setSelectedUpsellProducts(selectedUpsellProducts.filter((selectedProduct) => selectedProduct.id !== product.id));
                } else {
                    setSelectedUpsellProducts([...selectedUpsellProducts, product]);
                }
                break;
            case 'crossSell':
                if (selectedCrossSellProducts.find((selectedProduct) => selectedProduct.id === product.id)) {
                    setSelectedCrossSellProducts(selectedCrossSellProducts.filter((selectedProduct) => selectedProduct.id !== product.id));
                } else {
                    setSelectedCrossSellProducts([...selectedCrossSellProducts, product]);
                }
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        onReturn({ related_ids: selectedRelatedProducts, upsell_ids: selectedUpsellProducts, cross_sell_ids: selectedCrossSellProducts });
    }, [selectedUpsellProducts, selectedCrossSellProducts, selectedRelatedProducts]);

    // ProductCard component
    const ProductCard = ({ product, type }: any) => {
        const isSelected =
            type === 'related'
                ? selectedRelatedProducts.find((selectedProduct) => selectedProduct.id === product.id)
                : type === 'upsell'
                ? selectedUpsellProducts.find((selectedProduct) => selectedProduct.id === product.id)
                : selectedCrossSellProducts.find((selectedProduct) => selectedProduct.id === product.id);

        // Function to format currency
        const formatCurrency = (priceInCents: any) => {
            const formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
            });
            const priceInDollars = priceInCents / 100; // Convert cents to dollars
            return formatter.format(priceInDollars);
        };

        const handleClick = () => {
            handleProductToggle(product, type);
        };

        let imageUrl = ''; // Initialize imageUrl variable

        // Check if product.images is an array and contains image objects
        if (Array.isArray(product.images) && product.images.length > 0) {
            // Extract URL from the first image object
            imageUrl = product.images[0] || '';
        }

        return (
            <div className={`overflow-hidden rounded-lg border bg-white shadow-md ${isSelected ? 'border-3 border-purple-600 shadow-lg' : ''}`} onClick={handleClick}>
                <img
                    src={imageUrl || 'https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg'} // Set a placeholder image URL here
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg'; // Set a placeholder image URL here
                    }}
                    alt="Product Image"
                    className="h-64 w-full object-cover"
                />
                <div className="p-4">
                    <p className="text-xs tracking-wide text-gray-500">{product.parent_id}</p>
                    <h3 className="mb-2 text-base font-semibold text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-700">SKU: {product.sku}</p>
                    <div className="relative flex justify-between">
                        <p className="text-base font-semibold text-gray-900" id={`price_${product.id}`}>
                            {formatCurrency(product.price)}
                        </p>
                        {isSelected && <h1 className="absolute -bottom-4 -right-4 rounded-br-sm bg-purple-500 px-4 py-1 text-white">Selected</h1>}
                    </div>
                </div>
            </div>
        );
    };

    const renderNoFOund = () => {
        return (
            <div className="flex flex-col items-center justify-center">
                <img src="/notfound-product.gif" width={300} height={350} className="object-cover" />
                <p className="text-xl font-semibold">No Product found </p>
            </div>
        );
    };

    return (
        <div>
            <h1 className="my-6 text-xl font-semibold tracking-wide text-slate-600 md:text-4xl">Linked Products</h1>
            <div className="flex flex-wrap gap-4">
                <Button className="flex h-24 items-center justify-center border border-dashed bg-gray-100 px-10 text-base md:text-xl" onClick={handleRelatedClick}>
                    ({selectedRelatedProducts?.length}) Related Product
                </Button>
                <Button className="flex h-24 items-center justify-center border border-dashed bg-gray-100 px-10 text-base md:text-xl" onClick={handleUpsellClick}>
                    ({selectedUpsellProducts?.length}) Upsell Products
                </Button>
                <Button className="flex h-24 items-center justify-center border border-dashed bg-gray-100 px-10 text-base md:text-xl" onClick={handleCrossSellClick}>
                    ({selectedCrossSellProducts?.length}) Cross-sell Products
                </Button>
            </div>

            <Modal width={1200} title="Related Products" visible={relatedModalVisible} onCancel={handleRelatedModalCancel} footer={null}>
                {/* Display selected related products here */}
                <Input className="h-12" placeholder="Search by Product name, Unique Id, SKU" onChange={(e) => setSearchTerm(e.target.value)} />
                <div className="mt-5">
                    {products && products.length === 0 ? (
                        renderNoFOund()
                    ) : (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {products && products.map((product) => <ProductCard key={product.id} product={product} type="related" />)}
                        </div>
                    )}
                </div>
            </Modal>

            <Modal width={1200} title="Upsell Products" visible={upsellModalVisible} onCancel={handleUpsellModalCancel} footer={null}>
                {/* Display selected upsell products here */}
                <Input className="h-12" placeholder="Search by Product name, Unique Id, SKU" onChange={(e) => setSearchTerm(e.target.value)} />
                <div className="mt-5">
                    {products && products.length === 0 ? (
                        renderNoFOund()
                    ) : (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {products && products.map((product) => <ProductCard key={product.id} product={product} type="upsell" />)}
                        </div>
                    )}
                </div>
            </Modal>

            <Modal width={1200} title="Cross-sell Products" visible={crossSellModalVisible} onCancel={handleCrossSellModalCancel} footer={null}>
                {/* Display selected cross-sell products here */}
                <Input className="h-12" placeholder="Search by Product name, Unique Id, SKU" onChange={(e) => setSearchTerm(e.target.value)} />
                <div className="mt-5">
                    {products && products.length === 0 ? (
                        renderNoFOund()
                    ) : (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {products && products.map((product) => <ProductCard key={product.id} product={product} type="crossSell" />)}
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default LinkedProducts;
