document.addEventListener('DOMContentLoaded', async () => {

  const searchEngines = {
    'google': 'www.google.com/search?q=',
    'duckduckgo': 'www.duckduckgo.com/?q=',
    'startpage': 'www.startpage.com/do/search?query='
  };

  const presets = await loadPresets();

  const searchTermInput = document.querySelector('#searchTermInput');
  const searchButton = document.querySelector('#searchButton');
  const searchTypeSelect = document.querySelector('#searchTypeSelect');
  const searchTimeSelect = document.querySelector('#searchTimeSelect');
  const searchEngineSelect = document.querySelector('#searchEngineSelect');

  const excludeWordsInput = document.querySelector('#excludeWordsInput');
  const excludeSitesInput = document.querySelector('#excludeSitesInput');
  
  searchTypeSelect.innerHTML = generateSearchTypeOptionsHTML();

  function getIncludes(original) {
    if (!presets[original]) return [];
    return [].concat(presets[original].include || []).reduce(
      (r, name) => [...r, ...getIncludes(name)],
      [original]
    );
  }

  searchButton.addEventListener('click', search);
  
  document.addEventListener('keyup', e => {
    if (e.which === 13) search();
  });

  function search() {
    if (!searchTermInput.value) return;

    const preset = searchTypeSelect.value;
    const includeNames = getIncludes(preset);

    const includes = includeNames.map(inc => {
      if (presets[inc].content) return presets[inc].content.join(' ');
      return '';
    }).join(' ');


    const searchEngines = [
      'www.google.com/search?q=',
      'www.duckduckgo.com/?q=',
      'www.startpage.com/do/search?query='
    ];

    const { prepend = '', append = '' } = preset.searchTerm || {};
    const searchTerms = searchTermInput.value.split(',').map(term => `${prepend}${term.trim()}${append}`).join(' ');
    const excludeWords = excludeWordsInput.value.length > 0 ? excludeWordsInput.value.split(',').map(word => `-intext:"${word}"`).join(' ') : '';
    const excludeSites = excludeSitesInput.value.length > 0 ? excludeSitesInput.value.split(',').map(site => `-site:"${site}"`).join(' ') : '';
    const timeParam = getTimeParameter(searchTimeSelect.value);

    const searchQuery = `${searchTerms} ${includes} ${excludeWords} ${excludeSites}`;

    const url = `https://${searchEngines[searchEngineSelect.value]}${encodeURIComponent(searchQuery)}${timeParam}`;

    browser.tabs.create({
      url,
      active: true
    });
  }

  async function loadPresets () {
    let { presets } = await browser.storage.sync.get("presets");

    if (!presets) {
      const data = await fetch('/presets.json');
      presets = await data.json();

      await browser.storage.sync.set({
        presets
      });
    }
    return presets;
  }

  function getTimeParameter (value) {
    const timeParams = ['', 'h', 'd', 'w', 'm', 'y'];
    return value ? `&tbs=qdr:${timeParams[value]}` : '';
  }

  function generateSearchTypeOptionsHTML () {
    return Object.keys(presets).map(key => {
      const { hidden, title } = presets[key];
      if (!hidden) return `<option value="${key}">${title}</option>`;
    }).join('');
  }
});