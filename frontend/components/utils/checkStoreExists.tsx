export async function checkStoreExists(vendorId, store) {
    try {
        console.log(vendorId, store);
        
        const res = await fetch(`${process.env.ADMINURL}/api/checkStoreExists/${vendorId}/${store}`);
        if (res.ok) {
            const data = await res.json();
            return { success: data.success, data: data }; // Return both the success flag and the full data
        } else {
            console.error('Server error:', res.statusText);
            return { success: false, error: 'Server error' };
        }
    } catch (error) {
        console.error('Fetch error:', error);
        return { success: false, error: 'Fetch error' };
    }
}
