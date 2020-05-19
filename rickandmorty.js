var canvas = document.getElementById("meuCanvas");
var ctx = canvas.getContext("2d");

document.getElementById("meuCanvas").style.cursor = "none";
    
var x = (canvas.width/2) - 65;
var y = canvas.height - 50 ;
var dy = -5;
var dy1 = 5.5;

var direitaPressionado = false;
var esquerdaPressionado = false;

var quantLinhasCabecas = 4;
var quantColunasCabecas = 9;
var largCabeca = 25;
var alturaCabeca = 38;
var espacoEntreCabecasDireita = 80;
var espacoEntreCabecasTopo = 40;
var espacoCabecasTopo = 20;
var espacoCabecasEsquerda = 50;

function iniciar(){
    var inicio = new Audio('Efeitos/inicio.mp3');
    inicio.play()

    canvas.onmousedown = function(e){
        loopGame()
        document.getElementById("meuCanvas").style.background = "url('Imagens/espaço.jpg')";
    }
}

iniciar();

function loopGame(){
    var score = 0;
    var lifes = 3;
    var quant_cor = 0;    

    var tiro = new Audio('Efeitos/tiro.mp3');
    var tranquileba = new Audio('Musicas/tranquileba.mp3')
    var abaixada = new Audio('Musicas/abaixada.mp3')
    var vaia = new Audio('Efeitos/vaia.mp3')
    var caramba = new Audio('Efeitos/caramba.mp3')

    tranquileba.loop = true
    abaixada.loop = true

    var cabecas = [];
    var tiros = [];
    var tiros_cabecas = [];
    var coracoes = [{x:35, y: 5, status: 1}, {x: 20, y: 5, status: 1}, {x: 5, y: 5, status: 1}]

    var num = 1

    for(c = 0; c < quantColunasCabecas; c++) {
        cabecas[c] = [];
        for(l = 0; l < quantLinhasCabecas; l++) {
            cabecas[c][l] = {x: x, y: 640, status: 1, id: num};
            num++;
        }
    }

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener("mousemove", mouseMoveHandler, false);

    function keyDownHandler(e) {
        if(e.keyCode == 39) {
            direitaPressionado = true;
        }
        else if(e.keyCode == 37) {
            esquerdaPressionado = true;
        }

        else if(e.keyCode == 32){
            tiros.push({x: x+30, y: 580, status: 1})
            tiro.playbackRate = 2.0;
            tiro.play();
        }
    }

    function keyUpHandler(e) {
        if(e.keyCode == 39) {
            direitaPressionado = false;
        }
        else if(e.keyCode == 37) {
            esquerdaPressionado = false;
        }
    }

    function mouseMoveHandler(e) {
        var relativeX = e.clientX - canvas.offsetLeft;
        if(relativeX > 50 && relativeX < canvas.width - 30) {
            x = relativeX - 100/2;
        }
    }

    canvas.onmousedown = function(e){
        tiros.push({x: x+30, y: 580, status: 1})
        tiro.playbackRate = 2.0;
        tiro.play();
    }

    function colisaoTiroCabeca() {
        for (c = 0; c < quantColunasCabecas; c++) {
            for (l = 0; l < quantLinhasCabecas; l++) { 
                for (t = 0; t < tiros.length; t++) {   
                    var ca = cabecas[c][l]            
                    if (ca.status == 1) {
                        if(tiros[t].x > ca.x && tiros[t].x < ca.x+largCabeca && tiros[t].y > ca.y && tiros[t].y < ca.y+alturaCabeca) {
                            ca.status = 0;                    
                            tiros[t].status = 0;
                            score++;
                            vaia.playbackRate = 2.0;
                            vaia.play()
                        }
                    }
                }
            }
        }
    }

    function colisaoTiroNave(){
        for (t = 0; t < tiros_cabecas.length; t++) {
            if(tiros_cabecas[t].x > x && tiros_cabecas[t].x < x+65 && tiros_cabecas[t].y > y && tiros_cabecas[t].y < y+50){
                tiros_cabecas[t].status = 0
                lifes --;
                tiros = [];
                tiros_cabecas = [];
                coracoes[quant_cor].status = 0   
                quant_cor ++;
                x = 480;
                caramba.play()           
            }
        }  
    }

    function desenharTiro(){
        for (t = 0; t < tiros.length; t++) {
            if (tiros[t].status == 1) {
                ctx.beginPath();
                ctx.rect(tiros[t].x, tiros[t].y, 5, 20);
                ctx.fillStyle = "#52EE4D";
                ctx.fill();
                ctx.closePath();

                tiros[t].y += dy;
            }
        }
    }

    function adicionarTiroCabecas(){
        var who = Math.floor((Math.random() * num) + 1);
        var who2 = Math.floor((Math.random() * num) + 1);

        for(c = 0; c < quantColunasCabecas; c++) {
            for(l = 0; l < quantLinhasCabecas; l++) {
                if(cabecas[c][l].status == 1) {
                    if (cabecas[c][l].id == who) {
                        tiros_cabecas.push({x: cabecas[c][l].x+10, y: cabecas[c][l].y+30})                        
                    }
                    if (cabecas[c][l].id == who2) {
                        tiros_cabecas.push({x: cabecas[c][l].x+10, y: cabecas[c][l].y+30})                        
                    }
                }
            }
        }    
    }

    function desenharTiroCabecas(){
        for (t = 0; t < tiros_cabecas.length; t++) {
            ctx.beginPath();
            ctx.rect(tiros_cabecas[t].x, tiros_cabecas[t].y, 5, 20);
            ctx.fillStyle = "#FE49F6";
            ctx.fill();
            ctx.closePath();

            tiros_cabecas[t].y += dy1;            
        }        
    }

    function desenharNave(){
        var nave = document.getElementById("nave");
        ctx.drawImage(nave, x, y);
    }

    function desenharCabecas() {
        for(c = 0; c < quantColunasCabecas; c++) {
            for(l = 0; l < quantLinhasCabecas; l++) {
                if(cabecas[c][l].status == 1) {
                    var cabecaX = (c * (largCabeca + espacoEntreCabecasDireita)) + espacoCabecasEsquerda;
                    var cabecaY = (l * (alturaCabeca + espacoEntreCabecasTopo)) + espacoCabecasTopo;

                    cabecas[c][l].x = cabecaX;
                    cabecas[c][l].y = cabecaY;

                    var cabeca = document.getElementById("cabeca");
                    ctx.drawImage(cabeca, cabecaX, cabecaY);
                }
            }
        }
    }

    function desenharCoracoes(){
        for (c = coracoes.length-1; c >= 0; c--){
            if (coracoes[c].status == 1){
                var coracao = document.getElementById("coracao");
                ctx.drawImage(coracao, coracoes[c].x, coracoes[c].y);
            }
        }
    }

    function desenhar() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        desenharCabecas();
        desenharTiro();
        desenharTiroCabecas();
        desenharNave();
        desenharCoracoes();
        colisaoTiroCabeca();
        colisaoTiroNave();
            
        if(direitaPressionado && x < canvas.width-83) {
            x += 5;
        }
        else if(esquerdaPressionado && x > 0) {
            x -= 5;
        }

        if (score < (num/2)){
            tranquileba.play();
            tranquileba.volume = 0.6;
        }

        else if(score >= (num/2)){
            tranquileba.loop = false;
            tranquileba.pause();
            abaixada.play();
            abaixada.volume = 0.6;
        }

        if(score == quantColunasCabecas*quantLinhasCabecas) {
            abaixada.loop = false
            abaixada.pause()
            clearInterval(intervaloDesenho);
            clearInterval(intervaloTirosCabecas);
            imagem_final_ganhou();
        }

        if(lifes == 0) {
            abaixada.loop = false
            abaixada.pause()
            clearInterval(intervaloDesenho);
            clearInterval(intervaloTirosCabecas);   
            lifes = 3;         
            imagem_final_perdeu();
        }
    }

    var intervaloDesenho = setInterval(desenhar, 10);
    var intervaloTirosCabecas = setInterval(adicionarTiroCabecas, 250)
}

function imagem_final_ganhou(){
    var gostei = new Audio('Efeitos/gostei.mp3')
    gostei.play()

    var img = document.getElementById("gostei");
    ctx.drawImage(img, 0, 0);

    canvas.onmousedown = function(e){
        encerrar()
    }
}

function imagem_final_perdeu(){
    var desqualificado = new Audio('Efeitos/desqualificado.mp3')
    desqualificado.play()

    var img = document.getElementById("desqualificado");
    ctx.drawImage(img, 0, 0);

    canvas.onmousedown = function(e){
        encerrar()
    }
}

function encerrar(){
    
    document.location.reload();
}