import { ActionFunctionArgs, data } from "@shopify/remix-oxygen";

export const action = async ({ request, context }: ActionFunctionArgs) => {
    if (request.method !== 'POST') {
        return data({ error: 'Method not allowed' }, { status: 405 });
    }

    const formData = await request.formData();

    const sessionId = formData.get('session_id');

    console.log('Session ID:', sessionId);
    
    try {
        return data({ success: true }, { status: 200 });
    } catch (error) {
        console.error('Quiz statistics error:', error);
        return data({ error: 'Internal server error' }, { status: 500 });
    }
}