import { Adminurl } from '@/app/layout';

export async function POST(request: Request) {
    try {
        // Extract the token from the request headers
        const token = request.headers.get('Authorization')?.split(' ')[1];
        
        // Check if token is not present
        if (!token) {
            return new Response(JSON.stringify({ error: 'Authorization token not provided' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Use the token from the request headers
            },
            body: JSON.stringify(await request.json()),
        };

        const response = await fetch(`${Adminurl}/api/vendors/add`, requestOptions);

        // If the response is not okay, capture and return the error from the API
        if (!response.ok) {
            const errorResponse = await response.text(); // Assuming error response might not always be JSON
            return new Response(errorResponse, {
                status: response.status,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const responseData = await response.json();
        
        // Log the successful response data for debugging
        console.log(responseData);

        // Return the successful response from the API to the client
        return new Response(JSON.stringify(responseData), {
            status: response.status, // Reflect the actual response status
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error processing request:', error);
        // Return a generic error message to the client
        // Consider logging detailed error for server-side inspection
        return new Response(JSON.stringify({ error: 'Internal Server Error', message: error.message || 'An unexpected error occurred' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
