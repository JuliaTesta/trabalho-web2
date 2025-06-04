document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search');
  const searchButton = document.getElementById('search-button');

  function removerAcentos(texto) {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function limparDestaques() {
    document.querySelectorAll('mark.highlight').forEach(mark => {
      const parent = mark.parentNode;
      parent.replaceChild(document.createTextNode(mark.textContent), mark);
      parent.normalize();
    });
  }

  function destacarPalavras(termos) {
    if (termos.length === 0) return;

    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          const parentTag = node.parentNode.tagName;
          if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'MARK', 'INPUT', 'BUTTON'].includes(parentTag)) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      },
      false
    );

    const textNodes = [];
    let node;
    while ((node = walker.nextNode())) {
      textNodes.push(node);
    }

    textNodes.forEach(node => {
      const textoOriginal = node.nodeValue;
      const textoNormalizado = removerAcentos(textoOriginal).toLowerCase();

      let indices = [];

      termos.forEach(termo => {
        const termoNormalizado = removerAcentos(termo.toLowerCase());
        let startIndex = 0;

        while (true) {
          const index = textoNormalizado.indexOf(termoNormalizado, startIndex);
          if (index === -1) break;
          indices.push({ start: index, end: index + termoNormalizado.length });
          startIndex = index + termoNormalizado.length;
        }
      });

      if (indices.length === 0) return;

    
      indices.sort((a, b) => a.start - b.start);
      const merged = [];
      indices.forEach(curr => {
        if (merged.length === 0) {
          merged.push(curr);
        } else {
          const last = merged[merged.length - 1];
          if (curr.start <= last.end) {
            last.end = Math.max(last.end, curr.end);
          } else {
            merged.push(curr);
          }
        }
      });

      const fragment = document.createDocumentFragment();
      let lastIndex = 0;

      merged.forEach(range => {
        if (range.start > lastIndex) {
          fragment.appendChild(document.createTextNode(textoOriginal.substring(lastIndex, range.start)));
        }

        const mark = document.createElement('mark');
        mark.className = 'highlight';
        mark.textContent = textoOriginal.substring(range.start, range.end);
        fragment.appendChild(mark);

        lastIndex = range.end;
      });

      if (lastIndex < textoOriginal.length) {
        fragment.appendChild(document.createTextNode(textoOriginal.substring(lastIndex)));
      }

      node.parentNode.replaceChild(fragment, node);
    });
  }

  searchButton.addEventListener('click', () => {
    limparDestaques();
    const textoBusca = searchInput.value.trim();
    if (!textoBusca) return;
    const termos = textoBusca.split(/\s+/).filter(t => t.length > 0);
    destacarPalavras(termos);
  });

  searchInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
      searchButton.click();
    }
  });
});
