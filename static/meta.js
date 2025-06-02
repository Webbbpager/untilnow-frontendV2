/**
 * Dynamically sets meta tags, Open Graph, Twitter, canonical, and alternate hreflang links.
 * Usage: setMeta({...});
 */
function setMeta({
    title,
    description,
    keywords,
    ogTitle,
    ogDescription,
    ogUrl,
    ogImage,
    twitterTitle,
    twitterDescription,
    canonical,
    hreflang
}) {
    // Helper: Set or create meta tag by name/property
    function setMetaTag(attr, attrVal, content) {
        let selector = attr === "name" ? `meta[name="${attrVal}"]` : `meta[property="${attrVal}"]`;
        let tag = document.head.querySelector(selector);
        if (!tag) {
            tag = document.createElement('meta');
            tag.setAttribute(attr, attrVal);
            document.head.appendChild(tag);
        }
        tag.setAttribute('content', content);
    }

    // Title
    if (title) document.title = title;

    // Standard meta tags
    if (description) setMetaTag('name', 'description', description);
    if (keywords) setMetaTag('name', 'keywords', keywords);

    // Canonical link
    if (canonical) {
        let link = document.head.querySelector('link[rel="canonical"]');
        if (!link) {
            link = document.createElement('link');
            link.rel = "canonical";
            document.head.appendChild(link);
        }
        link.href = canonical;
    }

    // hreflang alternates
    if (hreflang && typeof hreflang === "object") {
        // Remove all previous alternates for clean insert
        document.querySelectorAll('link[rel="alternate"]').forEach(e=>e.remove());
        // Set main language and alternates
        for (const [lang, url] of Object.entries(hreflang)) {
            let l = document.createElement('link');
            l.rel = "alternate";
            l.hreflang = lang;
            l.href = url;
            document.head.appendChild(l);
        }
        // Add x-default (German as main unless you want English)
        if (!hreflang["x-default"]) {
            let defaultUrl = hreflang["de"] || Object.values(hreflang)[0];
            let l = document.createElement('link');
            l.rel = "alternate";
            l.hreflang = "x-default";
            l.href = defaultUrl;
            document.head.appendChild(l);
        }
    }

    // Open Graph tags
    if (ogTitle) setMetaTag('property', 'og:title', ogTitle);
    if (ogDescription) setMetaTag('property', 'og:description', ogDescription);
    if (ogUrl) setMetaTag('property', 'og:url', ogUrl);
    if (ogImage) setMetaTag('property', 'og:image', ogImage);
    setMetaTag('property', 'og:type', 'website');
    // Try to guess locale from url, fallback to de_DE
    let pageLang = (
        (location.pathname.match(/\/(en|es|fr)\//) && location.pathname.match(/\/(en|es|fr)\//)[1]) ||
        location.pathname.match(/\/(en|es|fr)\./) && location.pathname.match(/\/(en|es|fr)\./)[1] ||
        document.documentElement.lang ||
        "de"
    );
    let locales = { de: "de_DE", en: "en_US", es: "es_ES", fr: "fr_FR" };
    setMetaTag('property', 'og:locale', locales[pageLang] || "de_DE");

    // Twitter tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    if (twitterTitle) setMetaTag('name', 'twitter:title', twitterTitle);
    if (twitterDescription) setMetaTag('name', 'twitter:description', twitterDescription);

    // (Optional) Always make sure favicon is there if not
    if (!document.head.querySelector('link[rel="icon"]')) {
        let f = document.createElement('link');
        f.rel = "icon";
        f.type = "image/png";
        f.href = "../faviUntilNow.png";
        document.head.appendChild(f);
    }
}
