import { useEffect, useRef } from 'react';

function GmfScript({ token }: { token: string | null }) {
    const hasInit = useRef(false);

    useEffect(() => {
        if (hasInit.current) return;

        hasInit.current = true;

        window.gmf = function () {
            (window._gmf = window._gmf || []).push(Object.values(arguments));
        };

        const s = document.createElement("script");
        s.type = "text/javascript";
        s.src = "https://cdn.gamifiera.com/static/gmf/loader.js";
        s.async = true;
        document.head.appendChild(s);

        const gmf = window.gmf('init', {
            merchantId: 6006,
            locale: 'sv_SE',
            customerToken: token,
        });
    }, [token]);

    return null;
}

export default GmfScript;
