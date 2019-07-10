document.addEventListener('DOMContentLoaded', () => {
  const searchTermInput = document.querySelector('#searchTermInput');
  const searchButton = document.querySelector('#searchButton');
  const searchTypeSelect = document.querySelector('#searchTypeSelect');

  const excludeWordsInput = document.querySelector('#excludeWordsInput');
  const excludeSitesInput = document.querySelector('#excludeSitesInput');
  
  const commons = `
    -inurl:(jsp|pl|php|html|aspx|htm|cf|shtml)
    -inurl:(index_of|listen77|mp3raid|mp3toss|mp3drug|index_of|wallywashis)
    intitle:\"index.of./\"
  `;

  const extensions = [
    '(avi|mkv|mov|mp4|mpg|wmv)',
    '(ac3|flac|m4a|mp3|ogg|wav|wma)',
    '(CBZ|CBR|CHM|DOC|DOCX|EPUB|MOBI|ODT|PDF|RTF|txt)',
    '(bmp|gif|jpg|jpeg|png|psd|tif|tiff)',
    '(apk|exe)',
    '(iso|rar|tar|zip|7z)'
  ];

  function search() {
    const searchTerms = searchTermInput.value.split(',').map(term => `intext:"${term.trim()}"`).join(' ');
    const excludeWords = excludeWordsInput.value.split(',').map(word => `-intext:"${word}"`).join(' ') || '';
    const excludeSites = excludeSitesInput.value.split(',').map(site => `-site:"${site}"`).join(' ') || '';

    const finalquery = `${searchTerms} ${extensions[searchTypeSelect.value]} ${commons} ${excludeWords} ${excludeSites}`;

    const url = `https://www.google.com/search?q=${encodeURIComponent(finalquery)}`;
    
    browser.tabs.create({
      url,
      active: true
    });
  }

  searchButton.addEventListener('click', search);
});