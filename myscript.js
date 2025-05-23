let mudar = document.getElementById('mudar')                       //localiza no html o botao com id mudar
let themeSystem = localStorage.getItem('themeSystem') || 'dark'      //verifica se ja existe um tema salvo no navegador.

mudarTema(themeSystem);                                                //aplica o tema atual que esta no localstorage

if(mudar){                                                                       //verifica se o botao existe
    mudar.addEventListener('click', () => { 
    let temaAtual =document.documentElement.getAttribute('data-theme');           //le o valor atual que esta em data-theme

    if(temaAtual === 'dark'){
        novoTema ='light'
    }
    else{
        novoTema='dark'
    }
    
   localStorage.setItem('themeSystem',novoTema);                                    //salva o novo tema no localstorage 
   
   mudarTema(novoTema)                                                    //aplica novo tema que foi guardado anteriomente
    }) 
}   

   function mudarTema(theme){  
    document.documentElement.setAttribute('data-theme',theme); 
}

