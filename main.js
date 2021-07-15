//Available languages (except the default English).
const languages = ["de"];

//Initialize mermaid - graphs in markdown
mermaid.initialize({ startOnLoad: false });

//docsify settings
window.$docsify = {
  name: 'BitcoinMythBusters',
  repo: 'rene78/BTCMythBusters',
  loadNavbar: true,
  disqus: 'btcmythbusters',
  search: {
    maxAge: 86400000, // Expiration time, the default one day
    paths: [
      '/de/',
      '/'            // => /README.md
    ],
    // Search Localization
    placeholder: {
      '/de/': 'Suchen...',
      '/': 'Search...'
    },
    noData: {
      '/de/': 'Keine Resultate',
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
    EditOnGithubPlugin.create("https://github.com/rene78/BTCMythBusters/blob/main/", null, "Edit on GitHub")
  ],
  copyCode: {
    // copyCode Localization
    buttonText: {
      '/zh/': '点击复制',
      '/ru/': 'Скопировать в буфер обмена',
      '/de/': 'Klicken Sie zum Kopieren',
      '/es/': 'Haga clic para copiar',
      '/': 'Copy to clipboard'
    },
    errorText: {
      '/zh/': '错误',
      '/ru/': 'ошибка',
      '/de/': 'Fehler',
      '/': 'Error'
    },
    successText: {
      '/zh/': '复制',
      '/ru/': 'Скопировано',
      '/de/': 'Kopiert',
      '/es/': 'Copiado',
      '/': 'Copied'
    }
  }
}

//Before page load check if a route is saved in localStorage.
//If yes navigate to it.
//If no: Check if one of the user's favourite browser languages is available on page.
//If no favourite language available on page: Load English version (default).
document.onreadystatechange = () => {
  //First check, if a route is saved in localstorage
  let route = localStorage.getItem("route");
  // console.log("Route on load: " + route);
  //If yes, route to URL
  if (route) window.location.hash = route; //relative to domain
  //Else check the preferred browser languages and see, if we have a translation for it
  else {
    // console.log(navigator.languages);
    //Go through all preferred languages defined in the browser and take the first match. If no match - English will be loaded.
    for (let i = 0; i < navigator.languages.length; i++) {
      const navigatorLanguage = navigator.languages[i].slice(0, 2); //Just keep the first 2 letters (e.g. en-US --> en)
      // console.log(navigatorLanguage);
      if (languages.indexOf(navigatorLanguage) !== -1) {
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