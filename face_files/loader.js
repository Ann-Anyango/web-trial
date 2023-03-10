(function loader() {
  const src = document.currentScript.src;
  const indexSrc = src.replace('loader.js', 'index.js');

  const script = document.createElement('script');
  script.src = indexSrc;
  script.type = 'module';
  script.defer = true;
  script.async = true;

  document.currentScript.parentNode.appendChild(script);
})();
