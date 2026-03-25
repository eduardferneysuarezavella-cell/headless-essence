import { json, LoaderFunctionArgs } from "@shopify/remix-oxygen";
import invariant from "tiny-invariant";
import { Answers, ExtensiveChoice } from "~/data/questions";

var Base64 = {_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e: any){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e:any){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e:any){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e:any){var t="";var n=0;var r,c1,c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);var c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

export async function action({ request, params, context }: LoaderFunctionArgs) {
    if (request.method !== 'POST') {
        throw new Error('Invalid request method');
    }

    const formData = await request.formData();

    const fields = Object.fromEntries(formData);

    invariant(fields.email, 'Du måste ange en e-postadress.');
    invariant(fields.likedPerfumes, 'Du måste ange vilken parfymer du gillar.');
    invariant(fields.dislikedPerfumes, 'Du måste ange vilken parfymer du inte gillar.');
    invariant(fields.other, 'Du måste ange andra parfymer du gillar.');

    const answers = JSON.parse(fields.answers.toString()) as Answers;

    const gender = answers.PerfumeGender?.[0] ?? 'Okänt';
    const perfumeBrand = answers.PerfumeBrand ? answers.PerfumeBrand?.[0] as { essnceName: string, brand: string, name: string } : undefined;

    const gorgiasPayload = {
        customer: {
            email: fields.email,
        },
        messages: [
            {
                sender: {
                    email: fields.email,
                },
                body_html: `<p>Hej, denna person önskar få en parfymguide:</p>
                            <p><strong>Epost:</strong> ${fields.email}</p>
                            <p><strong>Kön:</strong> ${gender} </p>
                            <p><strong>Parfymer jag gillar:</strong> ${fields.likedPerfumes}</p>
                            <p><strong>Parfymer jag ogillar:</strong> ${fields.dislikedPerfumes}</p>¨
                            <p><strong>Övrigt:</strong> ${fields.other}</p>
                            <p><strong>Favorit Original:</strong> ${(perfumeBrand !== undefined) ? `${perfumeBrand.essnceName} - (${perfumeBrand.brand} ${perfumeBrand.name})` : 'Inte ifyllt'}</p>
                            <p><strong>Doftfamiljer valda:</strong> ${answers.ScentFamily?.map((choice) => (choice as ExtensiveChoice).title ?? '').join(", ")}</p>`,
                channel: 'api',
                from_agent: false,
                subject: 'Något vill ha ett parfymguide - från Quiz',
                via: 'api'
            }
        ],
        tags: [{ name: 'Parfymguide'}],
        channel: 'api',
        from_agent: false,
        status: 'open',
        via: 'api',
    }

    try {
        const response = await fetch('https://essnce.gorgias.com/api/tickets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${Base64.encode('andreas@ribban.co' + ':' + '699e267bc5d19bbbe19b0e83e64ef9bb2488617e47187b01b8bf5f5d82fb79cb')}`, // Ensure this is your server-side environment variable
            },
            body: JSON.stringify(gorgiasPayload),
        });

        const data = await response.json();

        if (response.ok) {
            return json({
                success: true,
                data: data
            }, {
                status: 200
            });
        } else {
            return json({
                success: false,
                error: response.statusText
            }, {
                status: response.status
            });
        }
    } catch (error) {
        console.log(error);

        return json({
            success: false,
            error: 'An unknown error occurred'
        }, {
            status: 500
        });
    }

    return json({
        success: true,
    });
}

const extractName = (name: string) => {
    const [firstName, lastName] = name.split(' ');
    return { firstName, lastName };
}
