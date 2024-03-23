import { Adminurl } from "@/app/layout";

export async function POST(request: Request) {
    try {
        // Extract the token from the request headers
        const token = request.headers.get('Authorization')?.split(' ')[1];

        if(!token) return
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Use the token from the request headers
            },
            body: JSON.stringify(await request.json())
        };

        const response = await fetch(`${Adminurl}/api/vendors/delete`, requestOptions);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();
        console.log(responseData);

        return new Response(JSON.stringify(responseData), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error processing request:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
