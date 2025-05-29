document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search');
    const searchButton = document.getElementById('search-button');
  
    function removerAcentos(texto) {
      return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
  
    function limparDestaques() {
      const marks = document.querySelectorAll('mark.highlight');
      marks.forEach(mark => {
        const parent = mark.parentNode;
        parent.replaceChild(document.createTextNode(mark.textContent), mark);
        parent.normalize();
      });
    }
  
    function destacarPalavras(termos) {
      if (!termos.length) return;
  
      const body = document.body;
  
      const walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT, null, false);
      let node;
  
      // Criar regex para todas as palavras (ignorando case e acentos)
      // Como regex não lida fácil com acentos, faremos um "match" manual com strings normalizadas
      // Portanto, no lugar de regex, vamos fazer busca manual palavra por palavra
  
      while (node = walker.nextNode()) {
        if (node.parentNode && !['SCRIPT', 'STYLE', 'NOSCRIPT', 'MARK'].includes(node.parentNode.tagName)) {
          const textoOriginal = node.nodeValue;
          const textoNormalizado = removerAcentos(textoOriginal).toLowerCase();
  
          // Vamos procurar por qualquer termo na string normalizada
          let indices = [];
  
          termos.forEach(termo => {
            let termoNormalizado = removerAcentos(termo.toLowerCase());
            let startIndex = 0;
  
            while (true) {
              let index = textoNormalizado.indexOf(termoNormalizado, startIndex);
              if (index === -1) break;
              indices.push({start: index, end: index + termoNormalizado.length});
              startIndex = index + termoNormalizado.length;
            }
          });
  
          if (indices.length === 0) continue;
  
          // Unir ranges que se sobrepõem para não quebrar o texto errado
          indices.sort((a,b) => a.start - b.start);
  
          let merged = [];
          for(let i = 0; i < indices.length; i++){
            if(merged.length === 0){
              merged.push(indices[i]);
            } else {
              let last = merged[merged.length - 1];
              if(indices[i].start <= last.end){
                // se sobrepõe, ajusta o fim
                last.end = Math.max(last.end, indices[i].end);
              } else {
                merged.push(indices[i]);
              }
            }
          }
  
          // Agora vamos reconstruir o texto substituindo as palavras por <mark>
          const fragment = document.createDocumentFragment();
          let lastIndex = 0;
  
          merged.forEach(range => {
            // parte antes do destaque
            if(range.start > lastIndex){
              fragment.appendChild(document.createTextNode(textoOriginal.substring(lastIndex, range.start)));
            }
            // parte do destaque (usa texto original pra manter acentos e maiúsculas)
            const mark = document.createElement('mark');
            mark.className = 'highlight';
            mark.textContent = textoOriginal.substring(range.start, range.end);
            fragment.appendChild(mark);
            lastIndex = range.end;
          });
  
          // resto do texto após último destaque
          if(lastIndex < textoOriginal.length){
            fragment.appendChild(document.createTextNode(textoOriginal.substring(lastIndex)));
          }
  
          // substitui o nó texto original pelo fragmento com destaques
          node.parentNode.replaceChild(fragment, node);
        }
      }
    }
  
    searchButton.addEventListener('click', () => {
      limparDestaques();
  
      const termoTexto = searchInput.value.trim();
      if (!termoTexto) return;
  
      // Divide em palavras, ignorando espaços extras
      const termos = termoTexto.split(/\s+/);
  
      destacarPalavras(termos);
    });
  
    searchInput.addEventListener('keypress', e => {
      if (e.key === 'Enter') {
        searchButton.click();
      }
    });
  });
  
  
  function mudouTamanho(){
    if(window.innerWidth >= 768){
        itens.style.display = 'block'
    }
    else{
        itens.style.display='none'
    }
}
function clickMenu(){
    let itens = document.getElementById('itens')

    if(itens.style.display == 'block'){
        itens.style.display = 'none'
    }
    else{
        itens.style.display = 'block'
    }
}