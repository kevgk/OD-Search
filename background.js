document.addEventListener('DOMContentLoaded', async () => {

  const searchTermInput = document.querySelector('#searchTermInput');
  const searchButton = document.querySelector('#searchButton');
  const searchTypeSelect = document.querySelector('#searchTypeSelect');
  const searchTimeSelect = document.querySelector('#searchTimeSelect');
  const searchEngineSelect = document.querySelector('#searchEngineSelect');
  const excludeWordsInput = document.querySelector('#excludeWordsInput');
  const excludeSitesInput = document.querySelector('#excludeSitesInput');

  const searchEngines = {
    'google': 'www.google.com/search?q=',
    'duckduckgo': 'www.duckduckgo.com/?q=',
    'startpage': 'www.startpage.com/do/search?query=',
    'searx': 'www.searx.me/?q=',
    'qwant': 'www.lite.qwant.com/?q='
  };

  const presets = await loadPresets();
  
  searchTypeSelect.innerHTML = generateSearchTypeOptionsHTML();

  searchButton.addEventListener('click', search);
  
  document.addEventListener('keyup', e => {
    if (e.which === 13) search();
  });

  function search() {
    if (!searchTermInput.value) return;

    const url = buildQuery();

    browser.tabs.create({
      url,
      active: true
    });
  }

  function buildQuery () {
    const preset = searchTypeSelect.value;
    const includeNames = getPresetIncludes(preset);
    const includes = getContentFromIncludes(includeNames);

    const { prepend = '', append = '' } = preset.searchTerm || {};
    const searchTerms = searchTermInput.value.split(',').map(term => `${prepend}${term.trim()}${append}`).join(' ');

    const excludeWords = makeParamWithOrList('-insite', excludeWordsInput.value);
    const excludeSites = makeParamWithOrList('-inurl', excludeSitesInput.value);

    const timeParam = getTimeParameter(searchTimeSelect.value);

    const searchQuery = `${searchTerms} ${includes} ${excludeWords} ${excludeSites}`;

    return `https://${searchEngines[searchEngineSelect.value]}${encodeURIComponent(searchQuery)}${timeParam}`;
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

  function getPresetIncludes(original) {
    if (!presets[original]) return [];
    return [].concat(presets[original].include || []).reduce(
      (r, name) => [...r, ...getPresetIncludes(name)],
      [original]
    );
  }

  function getContentFromIncludes (includes) {
    const contents = includes.map(incName => {
      return presets[incName].content ? presets[incName].content.join(' ') : '';
    });
    return contents.join(' ');
  }

  function makeParamWithOrList (name, values) {
    if (!values.length) return '';

    values = values.replace(/\s*,\s*/g, '|');
    return `${name}:(${values})`;
  }

  function getTimeParameter (value = '') {
    return `&tbs=qdr:${value}`;
  }

  function generateSearchTypeOptionsHTML () {
    const presetNames = Object.keys(presets);
    const options = presetNames.map(key => {
      const { hidden, title } = presets[key];
      if (!hidden) return `<option value="${key}">${title}</option>`;
    });
    
    return options.join(' ');
  }
});