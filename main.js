//Available languages
const languages = ["de", "en", "es", "fr", "it", "ja", "pt", "ru", "zh"];

//Initialize mermaid - graphs in markdown
mermaid.initialize({ startOnLoad: false });

//docsify settings
window.$docsify = {
  name: 'BitcoinMythBusters',
  repo: 'rene78/BitcoinMythBusters',
  // loadNavbar: true,
  disqus: 'btcmythbusters',
  search: {
    maxAge: 86400000, // Expiration time, the default one day
    paths: [
      '/de/',
      '/es/',
      '/fr/',
      '/it/',
      '/ja/',
      '/pt/',
      '/ru/',
      '/zh/',
      '/'            // => /README.md
    ],
    // Search Localization
    placeholder: {
      '/de/': 'Suchen...',
      '/es/': 'Buscar...',
      '/fr/': 'Rechercher...',
      '/it/': 'Cerca...',
      '/ja/': '検索...',
      '/pt/': 'Buscar...',
      '/ru/': 'Поиск...',
      '/zh/': '搜索...',
      '/': 'Search...'
    },
    noData: {
      '/de/': 'Keine Resultate',
      '/es/': 'No hay resultados',
      '/fr/': 'Aucun résultat',
      '/it/': 'Nessun risultato',
      '/ja/': '結果なし',
      '/pt/': 'Sem resultados',
      '/ru/': 'Нет результатов',
      '/zh/': '没有结果',
      '/': 'No Results'
    }
  },
  markdown: {
    renderer: {
      code: function (code, lang) {
        if (lang === "mermaid") {
          return (
            '<div class="mermaid">' + mermaid.render(lang, code) + "</div>"
          );
        }
        return this.origin.code.apply(this, arguments);
      }
    }
  },
  plugins: [
    EditOnGithubPlugin.create("https://github.com/rene78/BitcoinMythBusters/blob/main/", null, "Edit on GitHub")
  ],
  copyCode: {
    // copyCode Localization
    buttonText: {
      '/de/': 'Klicken Sie zum Kopieren',
      '/es/': 'Haga clic para copiar',
      '/fr/': 'Cliquez pour copier',
      '/it/': 'Clicca per copiare',
      '/ja/': 'クリックしてコピー',
      '/pt/': 'Clique para copiar',
      '/ru/': 'Скопировать в буфер обмена',
      '/zh/': '点击复制',
      '/': 'Copy to clipboard'
    },
    errorText: {
      '/de/': 'Fehler',
      '/es/': 'Error',
      '/fr/': 'Erreur',
      '/it/': 'Errore',
      '/ja/': 'エラー',
      '/pt/': 'Erro',
      '/ru/': 'ошибка',
      '/zh/': '错误',
      '/': 'Error'
    },
    successText: {
      '/de/': 'Kopiert',
      '/es/': 'Copiado',
      '/fr/': 'Copié',
      '/it/': 'Copiato',
      '/ja/': 'からコピーしました。',
      '/pt/': 'Copiado',
      '/ru/': 'Скопировано',
      '/zh/': '复制',
      '/': 'Copied'
    }
  }
}

//Before page load check if a route is saved in localStorage.
//If yes navigate to it.
//If no: Check if one of the user's favourite browser languages is available on page.
//If no favourite language available on page: Load English version (default).
document.onreadystatechange = () => {
  currLangIndex = document.getElementById("lang-selection");
  //First check, if a route is saved in localstorage
  let route = localStorage.getItem("route");
  // console.log("Route on load: " + route);
  //If yes, route to URL
  if (route) {
    window.location.hash = route; //relative to domain
    //Update language selector
    const lang = route.slice(2, 4); //Gonna be "?i" for default, i.e. English route.
    // console.log(lang);
    currLangIndex.selectedIndex = 1; //set selectedIndex to the default "English" first. Gonna be overwritten if lang != "?i"
    for (let i = 0; i < languages.length; i++) {
      if (languages[i] === lang) {
        currLangIndex.selectedIndex = i;
        break;
      }
    }
  }
  //Else check the preferred browser languages and see, if we have a translation for it
  else {
    // console.log(navigator.languages);
    //Go through all preferred languages defined in the browser and take the first match. If no match - English will be loaded.
    for (let i = 0; i < navigator.languages.length; i++) {
      const navigatorLanguage = navigator.languages[i].slice(0, 2); //Just keep the first 2 letters (e.g. en-US --> en)
      // console.log(navigatorLanguage);
      if (navigatorLanguage === "en") {
        currLangIndex.selectedIndex = 1; //set selectedIndex to "English" in lanugage selector
        break; //Stop code execution, if default language is selected in browser
      }
      if (languages.indexOf(navigatorLanguage) !== -1) {
        currLangIndex.selectedIndex = languages.indexOf(navigatorLanguage);//update selectedIndex in language selector
        window.location.hash = "/" + navigatorLanguage + "/";
        break;
      }
    }
  }
}

//Save route to localStorage whenever the user clicks somewhere
document.addEventListener('click', (e) => {
  setTimeout(() => {//setTimeout needed because the hash change is slower than the click event.
    let hash = window.location.hash;
    // console.log("Current Route: " + hash);
    localStorage.setItem("route", hash);
  }, 500)
});