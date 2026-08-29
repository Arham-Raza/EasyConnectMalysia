// Initialize Google Translate Element
window.googleTranslateElementInit = function() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,ms,zh-CN',
        autoDisplay: false
    }, 'google_translate_element');
};

function setLanguage(lang) {
    // Map our UI language codes to Google Translate codes
    const map = {
        'en': 'en',
        'ms': 'ms',
        'zh': 'zh-CN'
    };
    const googleLang = map[lang];
    
    // Set the googtrans cookie for both the root domain and current domain
    document.cookie = `googtrans=/en/${googleLang}; path=/`;
    document.cookie = `googtrans=/en/${googleLang}; domain=${window.location.hostname}; path=/`;
    
    // Save to local storage for our custom UI
    localStorage.setItem('preferredLang', lang);
    
    // Reload the page to apply translation instantly
    location.reload();
}

document.addEventListener('DOMContentLoaded', () => {
    // Create hidden div for Google Translate widget
    const gtDiv = document.createElement('div');
    gtDiv.id = 'google_translate_element';
    gtDiv.style.display = 'none';
    document.body.appendChild(gtDiv);

    // Inject Google Translate script dynamically
    const script = document.createElement('script');
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.head.appendChild(script);

    // Update active state on language buttons
    const savedLang = localStorage.getItem('preferredLang') || 'en';
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('onclick').includes(`'${savedLang}'`));
    });
});
