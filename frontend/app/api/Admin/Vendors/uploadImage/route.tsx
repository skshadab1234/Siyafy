import { Adminurl } from "@/app/layout";

export async function POST(request: Request) {
    try {
        // Extract the token from the request headers
        let formData = await request.formData();

        const requestOptions = {
            method: 'POST',
         
            body: formData,
        };

        const response = await fetch(`${Adminurl}/api/vendors/uploadImage`, requestOptions);

        
        if (response.ok) {
            // Image upload was successful
            const data = await response.json();
            return new Response(JSON.stringify(data), {
                headers: { 'Content-Type': 'application/json' },
            });
        } else {
            // Handle upload failure
            return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    } catch (error) {
        console.error('Error processing request:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
