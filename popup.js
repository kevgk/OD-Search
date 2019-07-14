document.addEventListener('DOMContentLoaded', async () => {

  const searchTermInput = document.querySelector('#searchTermInput');
  const searchButton = document.querySelector('#searchButton');
  const searchTypeSelect = document.querySelector('#searchTypeSelect');
  const searchTimeSelect = document.querySelector('#searchTimeSelect');
  const searchEngineSelect = document.querySelector('#searchEngineSelect');
  const copyButton = document.querySelector('#copyButton');
  const excludeWordsInput = document.querySelector('#excludeWordsInput');
  const excludeSitesInput = document.querySelector('#excludeSitesInput');

  const searchEngines = {
    'Google': 'www.google.com/search?q=',
    'DuckDuckGo': 'www.duckduckgo.com/?q=',
    'Startpage': 'www.startpage.com/do/search?query=',
    'Searx': 'www.searx.me/?q='
  };

  searchEngineSelect.innerHTML = await generateSearchEngineOptionsHTML();

  const presets = await loadPresets();
  
  searchTypeSelect.innerHTML = generateSearchTypeOptionsHTML();

  searchButton.addEventListener('click', search);
  copyButton.addEventListener('click', copyQuery);
  
  document.addEventListener('keyup', e => {
    if (e.which === 13) search();
  });

  async function search() {
    if (!searchTermInput.value) return;

    const query = await buildQuery();

    const timespan = getTimeParameter(searchTimeSelect.value);

    const searchEngine = searchEngines[searchEngineSelect.value];

    const url = buildURL(searchEngine, query, timespan);

    browser.tabs.create({
      url,
      active: true
    });
  }

  async function copyQuery () {
    if (!searchTermInput.value) return;

    const query = await buildQuery();
    await navigator.clipboard.writeText(query);
  }

  async function buildQuery () {
    const presetName = searchTypeSelect.value;
    const includeNames = getPresetIncludes(presetName);
    const includes = getContentFromIncludes(includeNames);

    const { prepend = '', append = '' } = presets[presetName].searchTerm || {};
    const searchTerms = searchTermInput.value.split(',').map(term => `${prepend}${term.trim()}${append}`).join(' ');

    const excludeWords = makeParamWithOrList('-insite', excludeWordsInput.value);
    const excludeSites = makeParamWithOrList('-inurl', excludeSitesInput.value);

    await saveSearchEngine(searchEngineSelect.value);

    return `${searchTerms} ${includes} ${excludeWords} ${excludeSites}`;
  }

  function buildURL (searchEngine, query, timespan) {
    return `https://${searchEngine}${encodeURIComponent(query)}${timespan}`;
  }

  async function loadPresets () {
    let { presets } = await browser.storage.sync.get('presets');

    if (true || !presets) {
      const data = await fetch('/presets.json');
      presets = await data.json();

      await browser.storage.sync.set({ presets });
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

  async function generateSearchEngineOptionsHTML () {
    const { searchEngine } = await browser.storage.sync.get('searchEngine');

    const searchEngineNames = Object.keys(searchEngines);
    const options = searchEngineNames.map(engine => {
      const selected = engine === searchEngine ? 'selected' : '';
      return `<option ${selected} value="${engine}">${engine}</option>`;
    });

    return options.join('');
  }

  async function saveSearchEngine (searchEngine) {
    await browser.storage.sync.set({ searchEngine });
  }
});