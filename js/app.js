

class AudioController{
    constructor() {
        this.flipSound = new Audio('audio/flip.wav')
        this.matchSound = new Audio('audio/match.wav')
        this.victorySound = new Audio('audio/victory.wav')
        this.gameOverSound = new Audio('audio/gameover.mp3')
    }

    flip() {
        this.flipSound.play()
    }
    match() {
        this.matchSound.play()
    }
    victory() {
        this.victorySound.play()
    }
    gameOver() {
        this.gameOverSound.play()
    }

}


class GetDrunk {
    constructor(totalTime, cards) {                                         // Конструктор принимает время, массив карт 

        this.cardsArray = cards;                                            // КАРТЫ   
        this.totalTime = totalTime;                                         // ВРЕМЯ
        this.timeRemaining = totalTime;                                     // Таймер(Остолось времени )

        this.timer = document.getElementById('time-remaining');             // СПАН оставшееся время 
        this.ticker = document.getElementById('flips');                     // СПАН клики
        this.infoFlip = document.getElementById('info-flip')                // СПАН Всего клилков
        this.audioContr = new AudioController()
    }


    startGame() {                                                           // НАЧАТЬ НОВУЮ ИГРУ
        // ПОДГОТОВКА НОВОЙ ИГРЫ
        this.cardToCheck = null;                                            // неизвестная карта, для последующей проверки
        this.totalClicks = 0;                                               // количество кликов
        this.timeRemaining = this.totalTime;                                // Время для обратного отсчета
        this.matchedCards = [];                                             // Создаем пустой массив для успешно отгаданых карт // для последующей проверки с масивом предоставленых карт 
        this.busy = true;                                                   // АКТИВНЫЙ
        

        // НАСТРАИВАЕМ ИГРУ
        setTimeout(() => {                                                  // ЗАДЕРЖКА ПЕРЕД ИГРОЙ 
            this.shuffleCards();                                            // тусуем карты
            this.showСards();                                                                    
            this.busy = false;                                              // метка активной карты
        }, 600);

        setTimeout(() => {
            this.hideCards();                                               // прячем карты
            this.countDown = this.startCountDown()                          // отсчет времени
        }, 3000);
                             
        this.timer.textContent = this.timeRemaining;
        this.ticker.textContent = this.totalClicks;
        
    }

    showСards() {
        this.cardsArray.forEach(card => { 
            card.classList.add('visible');
        })
    }

    hideCards() {                                                           // СКРЫТЬ КАРТЫ
        this.cardsArray.forEach(card => { 
            card.classList.remove('visible');
        })
    }


    flipCard(card) {                                                        // ОТКРЫВАЕМ КАРТЫ 
        
        if(this.canFlipCard(card)) {
            this.audioContr.flip()
            this.totalClicks++
            this.ticker.textContent = this.totalClicks;
            card.classList.add('visible');

           if (this.cardToCheck) {
            this.checkForCardMatch(card);
           } else {
               this.cardToCheck = card;                                    
           }
        }
    }


    checkForCardMatch(card) {                                              // ПРОВЕРКА НА СООТВЕТСТВИЕ КАРТ
        if(this.getCardType(card) === this.getCardType(this.cardToCheck)) {
            this.cardMatch(card, this.cardToCheck);
        } else {
            this.cardMisMatch(card, this.cardToCheck);
        }
            this.cardToCheck = null;
    }


    cardMatch(card1, card2) {                                               // КАРТЫ СООТВЕТСТВУЮТ
        this.audioContr.match()
        this.matchedCards.push(card1);                                      // собираем в масив угаданую карту1 для последующей проверки 
        this.matchedCards.push(card2);                                      // собираем в масив угаданую карту2 для последующей проверки

        
        card1.children[1].classList.add('insanity') 
        card2.children[1].classList.add('insanity') 

        
         if(this.matchedCards.length === this.cardsArray.length) {         // проверям два масива на равную длину элементов(карт) ПОБЕДА  
            this.victory(); 
        }
        
    }


    cardMisMatch(card1, card2) {                                           // ЕСЛИ КАРТЫ НЕ СООТВЕТСТВУЮТ
        this.busy = true;
        setTimeout(() => {
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.busy = false;
        }, 700);
    }


    getCardType(card) {                                                     // ПОЛУЧАЕМ ТИП КАРТЫ для сравнения двух карт 
        return card.getElementsByClassName('card-value')[0].src; 
    }


    startCountDown() {                                                      // ОТСЧЕТ ВРЕМЕНИ
        return setInterval(() => {
            this.timeRemaining--;
            this.timer.textContent = this.timeRemaining;
        
            if(this.timeRemaining === 0) {
                this.gameOver();
            }

        }, 1000);
    }


    gameOver() {   
        this.audioContr.gameOver()                                               // ПРОИГРЫШ 
        clearInterval(this.countDown)
        document.getElementById('game-over-text').classList.add('visible')
           
    }


    victory () {  
       this.audioContr.victory()                                                   // ПОБЕДА 
       clearInterval(this.countDown);
       document.getElementById('victory-text').classList.add('visible');
       this.infoFlip.textContent = `Your result ${this.totalClicks} flips`
         
    }


    shuffleCards () {                                                         // ПЕРЕМЕШИВАНИЕ КАРТ // 

        for(let i = this.cardsArray.length - 1; i > 0; i--) {
            let randIndex = Math.floor(Math.random() * (i+1))
            this.cardsArray[randIndex].style.order = i // card 1
            this.cardsArray[i].style.order = randIndex // card 2
        }

    }

    canFlipCard(card) {                                                        //--- МОЖНО ЛИ ПЕРЕВЕРНУТЬ КАРТУ
        // return true
        return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck;    
    }

}



function ready() {

    let overlays = Array.from(document.getElementsByClassName('overlay-text'))   // Собираем HTML-коллекцию в массив, чтобы потом воспользоваться методами массива
    let cards = Array.from(document.getElementsByClassName('card'))              // Деллаем тоже самое с картами 
    let game = new GetDrunk(120, cards)
    
    overlays.forEach(overlay => {                                                // Перебираем массив и навешиваем на каждый эллемент событие
        overlay.addEventListener('click', () => {
            overlay.classList.remove('visible')                                  // Убираем класс видидимости
            game.startGame()                                                     // Старт Игры
        })
    })

    cards.forEach(card => {                                                      // Перебираем массив карт и навешиваем на каждый эллемент событие
        card.addEventListener('click', () => {
            game.flipCard(card)
        })
    })
}


if(document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', ready());
    } else {
        ready();
    }








