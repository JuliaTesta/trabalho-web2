let mudar = document.getElementById('mudar')                       //localiza no html o botao com id toggle
let themeSystem = localStorage.getItem('themeSystem') || 'dark'      //verifica se ja existe um tema salvo no navegador.

mudarTema(themeSystem); //aplica o tema atual que esta no localstorage

if(mudar){ //verifica se o botao existe
    mudar.addEventListener('click', () => {  //add determinada acao quando eu 'clicar'. quando clicar vai acontecer oq   tem dentro dessa chave.
    let temaAtual =document.documentElement.getAttribute('data-theme'); //le o valor atual que esta em data-theme

    if(temaAtual === 'dark'){
        novoTema ='light'
    }
    else{
        novoTema='dark'
    }
    
   localStorage.setItem('themeSystem',novoTema); //salva o novo tema no localstorage 
   
   mudarTema(novoTema) //aplica novo tema que foi guardado anteriomente
    }) 
}   
//essa parte meio que serve para mudar no css a paleta de uma pra outra 
   function mudarTema(theme){ //theme vai receber o valor que foi passado anteriormente no novo tema. 
    document.documentElement.setAttribute('data-theme',theme);      //se o theme for light, substitui as cores do dark 
}

