document.addEventListener('DOMContentLoaded', async () => {

  const presets = await loadPresets();

  const searchTermInput = document.querySelector('#searchTermInput');
  const searchButton = document.querySelector('#searchButton');
  const searchTypeSelect = document.querySelector('#searchTypeSelect');
  const searchTimeSelect = document.querySelector('#searchTimeSelect');

  const excludeWordsInput = document.querySelector('#excludeWordsInput');
  const excludeSitesInput = document.querySelector('#excludeSitesInput');
  
  searchTypeSelect.innerHTML = presets.map(({ id, title, hidden }) => {
    if (!hidden) return `<option value="${id}">${title}</option>`;
  });

  function getIncludes (original) {
    let output = [];

    function recursion (package) {
      if (package.content) output.push(package.content.join(' '));
      if (package.include) {
        return package.include.forEach(str => {
          let c = presets.find(obj => obj.name === str);
          if (c.content) output.push(c.content.join(' '));
          recursion(c.id)
        });
      }
    }

    recursion(original);
    return output.join(' ');
  }

  searchButton.addEventListener('click', search);
  
  document.addEventListener('keyup', e => {
    if (e.which === 13) search();
  });

  function search() {
    if (!searchTermInput.value) return;

    const preset = presets[searchTypeSelect.value];
    const includes = getIncludes(preset);
    const { prepend = '', append = '' } = preset.searchTerm || {};
    const searchTerms = searchTermInput.value.split(',').map(term => `${prepend}${term.trim()}${append}`).join(' ');
    const excludeWords = excludeWordsInput.value.split(',').map(word => `-intext:"${word}"`).join(' ') || '';
    const excludeSites = excludeSitesInput.value.split(',').map(site => `-site:"${site}"`).join(' ') || '';
    const timeParam = getTimeParameter(searchTimeSelect.value);

    const searchQuery = `${searchTerms} ${includes} ${excludeWords} ${excludeSites}`;

    const url = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}${timeParam}`;

    browser.tabs.create({
      url,
      active: true
    });
  }

  async function loadPresets () {
    const data = await fetch('/presets.json');
    return await data.json();
  }

  function getTimeParameter (value) {
    const timeParams = ['', 'h', 'd', 'w', 'm', 'y'];
    return value ? `&tbs=qdr:${timeParams[value]}` : '';
  }
});