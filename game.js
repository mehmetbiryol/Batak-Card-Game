let deckOfCards = [['S','ZA'],['S','2'],['S','3'],['S','4'],['S','5'],['S','6'],['S','7'],['S','8'],['S','9'],['S','A10'],['S','J'],['S','Q'],['S','YK'],['H','ZA'],['H','2'],['H','3'],['H','4'],['H','5'],['H','6'],['H','7'],['H','8'],['H','9'],['H','A10'],['H','J'],['H','Q'],['H','YK'],['C','ZA'],['C','2'],['C','3'],['C','4'],['C','5'],['C','6'],['C','7'],['C','8'],['C','9'],['C','A10'],['C','J'],['C','Q'],['C','YK'],['BD','ZA'],['BD','2'],['BD','3'],['BD','4'],['BD','5'],['BD','6'],['BD','7'],['BD','8'],['BD','9'],['BD','A10'],['BD','J'],['BD','Q'],['BD','YK']]
let playerHand = [];
let computer1Hand = []
let computer2Hand = []
let computer3Hand = []
let playerCards = document.querySelectorAll('.player-card')
let computer1Cards = document.querySelector('.computer1-hand')
let computer2Cards = document.querySelector('.computer2-hand')
let computer3Cards = document.querySelector('.computer3-hand')
let groundHand = []
let groundCards = document.querySelectorAll('.ground-card')
let groundCardIndex = 0
let playTurnIndex = 0
let playerDroppedCard;
let comp1DroppedCard;
let comp2DroppedCard;
let comp3DroppedCard;
let droppedCards = []
let playerResult = 0
let comp1Result = 0
let comp2Result = 0
let comp3Result = 0
let playerResultScreen = document.querySelector('.player-result-container')
let comp1ResultScreen = document.querySelector('.comp1-result-container')
let comp2ResultScreen = document.querySelector('.comp2-result-container')
let comp3ResultScreen = document.querySelector('.comp3-result-container')
let resultScreen = document.querySelector('.total-result-screen')
let resultScreenPlayer = document.querySelector('.total-player p')
let resultScreenComp1 = document.querySelector('.total-comp1 p')
let resultScreenComp2 = document.querySelector('.total-comp2 p')
let resultScreenComp3 = document.querySelector('.total-comp3 p')
let playAgainBtn = document.querySelector('#again-btn')
const cardRegex = /(?<=\/)(.*?)(?=\.svg)/

playAgainBtn.addEventListener('click', refreshPage)

function refreshPage(){
    window.location.reload();
}
function dealCards() {
    let gameDeck = deckOfCards;
    gameDeck.sort(() => Math.random() - 0.5);
    playerHand = gameDeck.slice(0,13);
    playerHand.sort().reverse();
    computer1Hand = gameDeck.slice(13,26);
    computer2Hand = gameDeck.slice(26,39);
    computer3Hand = gameDeck.slice(39);
    let playerCardIndex = 0;
    playerCards.forEach(card => {
        card.style.background = `url(img/Cards/${playerHand[playerCardIndex][0]}${playerHand[playerCardIndex][1]}.svg)`;
        card.style.backgroundSize = "90px 120px";
        card.addEventListener('click', playerDropCard);
        playerCardIndex++
        })
}

function playerDropCard(event) {
    let cardMatched = cardRegex.exec(event.target.style.background).toString()
        cardMatched = cardMatched.slice((cardMatched.lastIndexOf("/")+1))
        playerDroppedCard = playerHand.filter(card => card.join("") == cardMatched)[0]
        playerHand.splice(playerHand.findIndex(card => card == playerDroppedCard), 1)
        event.target.remove()
        cardToGround(playerDroppedCard,'player');
        playerCards.forEach(card => {
            card.style.filter = "brightness(0.5)";
            card.removeEventListener('click', playerDropCard);
        })
        playTurnIndex++
        playTurnCheck()
        if(playTurnIndex != 0) {
           setTimeout(() => {
          comp1DropCard()  
        }, 1000); 
        }
}

function cardToGround(dropped,dropper) {
    let cardForResult = [...dropped,dropper]
    droppedCards.push(cardForResult)
    groundHand.push(dropped);
    groundCards[groundCardIndex].style.background = `url(img/Cards/${dropped[0]}${dropped[1]}.svg)`;
    groundCards[groundCardIndex].style.backgroundSize = "90px 120px";
    groundCardIndex++
    
    if(groundCardIndex == 4) {
        setTimeout(() => {
            groundHand = [];
            groundCards.forEach(cards => cards.style.background = "transparent")
            groundCardIndex = 0
            checkResult()
        }, 2000);
    }
}

function comp1DropCard() {
    playTurnIndex++
    playTurnCheck()
    if (computer1Cards.hasChildNodes()) {
        computer1Cards.removeChild(computer1Cards.children[0]);
      }
    let typeToPlay = groundHand[0][0]
    let typeToPlayInHand = computer1Hand.filter(card => card[0] === typeToPlay).sort()
    let othersInHand = computer1Hand.filter(card => card[0] != typeToPlay).sort()
    if(typeToPlayInHand.length == 0) {
        let spadesInHand = othersInHand.filter(card => card[0] == 'S').sort()
        let otherThanSpadeInHand = othersInHand.filter(card => card[0] != 'S').sort()
        let groundSpades = groundHand.filter(card => card[0] == 'S').sort()
        if(spadesInHand.length != 0) {
            if(groundSpades.length != 0) {
                let spadesBiggerThanGround = spadesInHand.filter(card => card[1] > groundSpades[groundSpades.length-1][1])
                let spadesSmallerThanGround = spadesInHand.filter(card => card[1] < groundSpades[groundSpades.length-1][1])
                if(spadesBiggerThanGround.length != 0) {
                    comp1DroppedCard = spadesBiggerThanGround.splice(0,1)[0]
                    computer1Hand = spadesBiggerThanGround.concat(spadesSmallerThanGround).concat(otherThanSpadeInHand)
                    cardToGround(comp1DroppedCard,'comp1')
                }
                else {
                    comp1DroppedCard = spadesSmallerThanGround.splice(0,1)[0]
                    computer1Hand = spadesSmallerThanGround.concat(otherThanSpadeInHand)
                    cardToGround(comp1DroppedCard,'comp1')
                }
                
            }
            else {
                comp1DroppedCard = spadesInHand.splice(0,1)[0];
                computer1Hand = spadesInHand.concat(otherThanSpadeInHand)
                cardToGround(comp1DroppedCard,'comp1');
            }
        }
        else {
            comp1DroppedCard = otherThanSpadeInHand.splice(0,1)[0]
            computer1Hand = otherThanSpadeInHand
            cardToGround(comp1DroppedCard,'comp1')
        }
    }
    else {
        let checkBigger = groundHand.sort()[groundHand.length-1]
        let tempCompHand = [...typeToPlayInHand]
        tempCompHand = tempCompHand.concat([checkBigger])
        tempCompHand.sort()
        if(tempCompHand[tempCompHand.length-1][1] == checkBigger[1]){
            comp1DroppedCard = typeToPlayInHand.splice(0,1)[0]
            computer1Hand = typeToPlayInHand.concat(othersInHand)
            cardToGround(comp1DroppedCard,'comp1')
        }
        else {
        comp1DroppedCard = typeToPlayInHand.splice(typeToPlayInHand.length-1,1)[0]
        computer1Hand = typeToPlayInHand.concat(othersInHand)
        cardToGround(comp1DroppedCard,'comp1');
        }
    }
    if(playTurnIndex != 0) {
        setTimeout(() => {
            comp2DropCard()  
     }, 1000); 
     }
}
function comp2DropCard() {
    playTurnIndex++
    playTurnCheck()
    if (computer2Cards.hasChildNodes()) {
        computer2Cards.removeChild(computer2Cards.children[0]);
    }
    let typeToPlay = groundHand[0][0]
    let typeToPlayInHand = computer2Hand.filter(card => card[0] === typeToPlay).sort()
    let othersInHand = computer2Hand.filter(card => card[0] != typeToPlay).sort()
    if(typeToPlayInHand.length == 0) {
        let spadesInHand = othersInHand.filter(card => card[0] == 'S').sort()
        let otherThanSpadeInHand = othersInHand.filter(card => card[0] != 'S').sort()
        let groundSpades = groundHand.filter(card => card[0] == 'S').sort()
        if(spadesInHand.length != 0) {
            if(groundSpades.length != 0) {
                let spadesBiggerThanGround = spadesInHand.filter(card => card[1] > groundSpades[groundSpades.length-1][1])
                let spadesSmallerThanGround = spadesInHand.filter(card => card[1] < groundSpades[groundSpades.length-1][1])
                if(spadesBiggerThanGround.length != 0) {
                    comp2DroppedCard = spadesBiggerThanGround.splice(0,1)[0]
                    computer2Hand = spadesBiggerThanGround.concat(spadesSmallerThanGround).concat(otherThanSpadeInHand)
                    cardToGround(comp2DroppedCard,'comp2')
                }
                else {
                    comp2DroppedCard = spadesSmallerThanGround.splice(0,1)[0]
                    computer2Hand = spadesSmallerThanGround.concat(otherThanSpadeInHand)
                    cardToGround(comp2DroppedCard,'comp2')
                }
                
            }
            else {
                comp2DroppedCard = spadesInHand.splice(0,1)[0];
                computer2Hand = spadesInHand.concat(otherThanSpadeInHand)
                cardToGround(comp2DroppedCard,'comp2');
            }
        }
        else {
            comp2DroppedCard = otherThanSpadeInHand.splice(0,1)[0]
            computer2Hand = otherThanSpadeInHand
            cardToGround(comp2DroppedCard,'comp2')
        }
    }
    else {
        let checkBigger = groundHand.sort()[groundHand.length-1]
        let tempCompHand = [...typeToPlayInHand]
        tempCompHand = tempCompHand.concat([checkBigger])
        tempCompHand.sort()
        if(tempCompHand[tempCompHand.length-1][1] == checkBigger[1]){
            comp2DroppedCard = typeToPlayInHand.splice(0,1)[0]
            computer2Hand = typeToPlayInHand.concat(othersInHand)
            cardToGround(comp2DroppedCard,'comp2')
        }
        else {
        comp2DroppedCard = typeToPlayInHand.splice(typeToPlayInHand.length-1,1)[0]
        computer2Hand = typeToPlayInHand.concat(othersInHand)
        cardToGround(comp2DroppedCard,'comp2');
        }
    }
    if(playTurnIndex != 0) {
        setTimeout(() => {
            comp3DropCard()  
     }, 1000); 
     }
}
function comp3DropCard() {
    playTurnIndex++
    playTurnCheck()
    if (computer3Cards.hasChildNodes()) {
        computer3Cards.removeChild(computer3Cards.children[0]);
    }
    let typeToPlay = groundHand[0][0]
    let typeToPlayInHand = computer3Hand.filter(card => card[0] === typeToPlay).sort()
    let othersInHand = computer3Hand.filter(card => card[0] != typeToPlay).sort()
    if(typeToPlayInHand.length == 0) {
        let spadesInHand = othersInHand.filter(card => card[0] == 'S').sort()
        let otherThanSpadeInHand = othersInHand.filter(card => card[0] != 'S').sort()
        let groundSpades = groundHand.filter(card => card[0] == 'S').sort()
        if(spadesInHand.length != 0) {
            if(groundSpades.length != 0) {
                let spadesBiggerThanGround = spadesInHand.filter(card => card[1] > groundSpades[groundSpades.length-1][1])
                let spadesSmallerThanGround = spadesInHand.filter(card => card[1] < groundSpades[groundSpades.length-1][1])
                if(spadesBiggerThanGround.length != 0) {
                    comp3DroppedCard = spadesBiggerThanGround.splice(0,1)[0]
                    computer3Hand = spadesBiggerThanGround.concat(spadesSmallerThanGround).concat(otherThanSpadeInHand)
                    cardToGround(comp3DroppedCard,'comp3')
                }
                else {
                    comp3DroppedCard = spadesSmallerThanGround.splice(0,1)[0]
                    computer3Hand = spadesSmallerThanGround.concat(otherThanSpadeInHand)
                    cardToGround(comp3DroppedCard,'comp3')
                }
                
            }
            else {
                comp3DroppedCard = spadesInHand.splice(0,1)[0];
                computer3Hand = spadesInHand.concat(otherThanSpadeInHand)
                cardToGround(comp3DroppedCard,'comp3');
            }
        }
        else {
            comp3DroppedCard = otherThanSpadeInHand.splice(0,1)[0]
            computer3Hand = otherThanSpadeInHand
            cardToGround(comp3DroppedCard,'comp3')
        }
    }
    else {
        let checkBigger = groundHand.sort()[groundHand.length-1]
        let tempCompHand = [...typeToPlayInHand]
        tempCompHand = tempCompHand.concat([checkBigger])
        tempCompHand.sort()
        if(tempCompHand[tempCompHand.length-1][1] == checkBigger[1]){
            comp3DroppedCard = typeToPlayInHand.splice(0,1)[0]
            computer3Hand = typeToPlayInHand.concat(othersInHand)
            cardToGround(comp3DroppedCard,'comp3')
        }
        else {
        comp3DroppedCard = typeToPlayInHand.splice(typeToPlayInHand.length-1,1)[0]
        computer3Hand = typeToPlayInHand.concat(othersInHand)
        cardToGround(comp3DroppedCard,'comp3');
        }
    }
    if(playTurnIndex != 0) {
        playableCards(); 
     }

}

function comp1RoundStart() {
    if (computer1Cards.hasChildNodes()) {
        computer1Cards.removeChild(computer1Cards.children[0]);
    }
    playTurnIndex++
    let roundStartSpade = computer1Hand.filter(card => card[0] == 'S').sort()
    let roundStartHeart = computer1Hand.filter(card => card[0] == 'H').sort()
    let roundStartClub = computer1Hand.filter(card => card[0] == 'C').sort()
    let roundStartDiamond = computer1Hand.filter(card => card[0] == 'BD').sort()
    let cardsToPlay = [roundStartSpade, roundStartHeart, roundStartClub, roundStartDiamond].filter(type => type.length != 0)
    let typeToPlay = cardsToPlay[Math.floor(Math.random()*cardsToPlay.length)]
    comp1DroppedCard = typeToPlay.splice(typeToPlay.length-1,1)[0]
    computer1Hand = roundStartClub.concat(roundStartDiamond).concat(roundStartHeart).concat(roundStartSpade)
    cardToGround(comp1DroppedCard,'comp1')

    setTimeout(() => {
        comp2DropCard()
    }, 1000);
}

function comp2RoundStart() {
    if (computer2Cards.hasChildNodes()) {
        computer2Cards.removeChild(computer2Cards.children[0]);
    }
    playTurnIndex++
    let roundStartSpade = computer2Hand.filter(card => card[0] == 'S').sort()
    let roundStartHeart = computer2Hand.filter(card => card[0] == 'H').sort()
    let roundStartClub = computer2Hand.filter(card => card[0] == 'C').sort()
    let roundStartDiamond = computer2Hand.filter(card => card[0] == 'BD').sort()
    let cardsToPlay = [roundStartSpade, roundStartHeart, roundStartClub, roundStartDiamond].filter(type => type.length != 0)
    let typeToPlay = cardsToPlay[Math.floor(Math.random()*cardsToPlay.length)]
    comp2DroppedCard = typeToPlay.splice(typeToPlay.length-1,1)[0]
    computer2Hand = roundStartClub.concat(roundStartDiamond).concat(roundStartHeart).concat(roundStartSpade)
    cardToGround(comp2DroppedCard,'comp2')

    setTimeout(() => {
        comp3DropCard()
    }, 1000);
}

function comp3RoundStart() {
    if (computer3Cards.hasChildNodes()) {
        computer3Cards.removeChild(computer3Cards.children[0]);
    }
    playTurnIndex++
    let roundStartSpade = computer3Hand.filter(card => card[0] == 'S').sort()
    let roundStartHeart = computer3Hand.filter(card => card[0] == 'H').sort()
    let roundStartClub = computer3Hand.filter(card => card[0] == 'C').sort()
    let roundStartDiamond = computer3Hand.filter(card => card[0] == 'BD').sort()
    let cardsToPlay = [roundStartSpade, roundStartHeart, roundStartClub, roundStartDiamond].filter(type => type.length != 0)
    let typeToPlay = cardsToPlay[Math.floor(Math.random()*cardsToPlay.length)]
    comp3DroppedCard = typeToPlay.splice(typeToPlay.length-1,1)[0]
    computer3Hand = roundStartClub.concat(roundStartDiamond).concat(roundStartHeart).concat(roundStartSpade)
    cardToGround(comp3DroppedCard,'comp3')
    playableCards()
}
function playTurnCheck() {
    if(playTurnIndex === 4) {
        playTurnIndex = 0
    }
}

function checkResult() {
    let droppedSpades = droppedCards.filter(card => card[0] == 'S')
    if(droppedSpades.length !=0) {
        droppedSpades.sort()
        switch (droppedSpades[droppedSpades.length-1][2]) {
            case 'player':
                playerResult++
                droppedCards = []
                playerCards.forEach(card => card.style.filter = 'none')
                playerCards.forEach(card => card.addEventListener('click', playerDropCard))
                break;
            case 'comp1':
                comp1Result++
                droppedCards = []
                if(playerHand.length != 0) {
                 comp1RoundStart()   
                }
                break;
            case 'comp2':
                comp2Result++
                droppedCards = []
                if(playerHand.length != 0) {
                  comp2RoundStart()  
                }
                break;
            case 'comp3':
                comp3Result++
                droppedCards = []
                if(playerHand.length != 0) {
                  comp3RoundStart()  
                }
                break;
        }
    }
    else {
        let gameType = droppedCards[0][0]
        let gameTypeResult = droppedCards.filter(card => card[0] == gameType)
        gameTypeResult.sort()
        switch (gameTypeResult[gameTypeResult.length-1][2]) {
            case 'player':
                playerResult++
                droppedCards = []
                playerCards.forEach(card => card.style.filter = 'none')
                playerCards.forEach(card => card.addEventListener('click', playerDropCard))
                break;
            case 'comp1':
                comp1Result++
                droppedCards = []
                if(playerHand.length != 0) {
                  comp1RoundStart()  
                }
                break;
            case 'comp2':
                comp2Result++
                droppedCards = []
                if(playerHand.length != 0) {
                  comp2RoundStart()  
                }
                break;
            case 'comp3':
                comp3Result++
                droppedCards = []
                if(playerHand.length != 0) {
                 comp3RoundStart()   
                }
                break;
        }
    } 
    playerResultScreen.innerText = playerResult;
    comp1ResultScreen.innerText = comp1Result;
    comp2ResultScreen.innerText = comp2Result;
    comp3ResultScreen.innerText = comp3Result;
    if((playerResult+comp1Result+comp2Result+comp3Result) == 13) {
        resultScreen.style.display = 'grid'
        resultScreenPlayer.innerText = playerResult
        resultScreenComp1.innerText = comp1Result
        resultScreenComp2.innerText = comp2Result
        resultScreenComp3.innerText = comp3Result
    }
}

function playableCards() {
    let playableType = groundHand[0][0];
    let playableTpeInHand = playerHand.filter(card => card[0] === playableType).sort()
    let checkGroundSpades = groundHand.filter(card => card[0] === 'S')
    if(playableTpeInHand.length != 0) {
        if(checkGroundSpades.length === 0) {
            let groundHighestCard = groundHand.filter(card => card[0] === playableType).sort()
            groundHighestCard = groundHighestCard[groundHighestCard.length-1]
            let playableTypeCardsBiggerThanGround = playableTpeInHand.filter(card => card[1] > groundHighestCard[1])
            if(playableTypeCardsBiggerThanGround.length != 0) {
                for(let j = 0; j < playableTypeCardsBiggerThanGround.length; j++) {
                    for(let k = 0; k < playerCards.length; k++) {
                        let cardMatched1 = cardRegex.exec(playerCards[k].style.background)[0].slice(6)
                        let checkCard = playableTypeCardsBiggerThanGround[j].join("")
                        if(cardMatched1 == checkCard) {
                            playerCards[k].style.filter = 'none'
                            playerCards[k].addEventListener('click', playerDropCard)
                        }
                    }
                }
                
            }
            else {
                for(let j = 0; j < playableTpeInHand.length; j++) {
                    for(let k = 0; k < playerCards.length; k++) {
                        let cardMatched1 = cardRegex.exec(playerCards[k].style.background)[0].slice(6)
                        let checkCard = playableTpeInHand[j].join("")
                        if(cardMatched1 == checkCard) {
                            playerCards[k].style.filter = 'none'
                            playerCards[k].addEventListener('click', playerDropCard)
                        }
                    }
                }
            }
        }
        else {
            for(let j = 0; j < playableTpeInHand.length; j++) {
                for(let k = 0; k < playerCards.length; k++) {
                    let cardMatched1 = cardRegex.exec(playerCards[k].style.background)[0].slice(6)
                    let checkCard = playableTpeInHand[j].join("")
                    if(cardMatched1 == checkCard) {
                        playerCards[k].style.filter = 'none'
                        playerCards[k].addEventListener('click', playerDropCard)
                    }
                }
            }
        }
    }
    else {
        let playableSpadeInHand = playerHand.filter(card => card[0] === 'S').sort()
        if(playableSpadeInHand.length != 0) {
            if(checkGroundSpades.length != 0) {
                let groundHighestSpade = groundHand.filter(card => card[0] === 'S').sort()
                groundHighestSpade = groundHighestSpade[groundHighestSpade.length-1]
                let playableSpadeBiggerThanGround = playableSpadeInHand.filter(card => card[1] > groundHighestSpade[1])
                if(playableSpadeBiggerThanGround.length != 0) {
                    for(let j = 0; j < playableSpadeBiggerThanGround.length; j++) {
                        for(let k = 0; k < playerCards.length; k++) {
                            let cardMatched1 = cardRegex.exec(playerCards[k].style.background)[0].slice(6)
                            let checkCard = playableSpadeBiggerThanGround[j].join("")
                            if(cardMatched1 == checkCard) {
                                playerCards[k].style.filter = 'none'
                                playerCards[k].addEventListener('click', playerDropCard)
                            }
                        }
                    }
                    
                }
            }
            else {
                for(let j = 0; j < playableSpadeInHand.length; j++) {
                    for(let k = 0; k < playerCards.length; k++) {
                        let cardMatched1 = cardRegex.exec(playerCards[k].style.background)[0].slice(6)
                        let checkCard = playableSpadeInHand[j].join("")
                        if(cardMatched1 == checkCard) {
                            playerCards[k].style.filter = 'none'
                            playerCards[k].addEventListener('click', playerDropCard)
                        }
                    }
                }
            }
        }
        else {
            playerCards.forEach(card => card.style.filter = 'none')
            playerCards.forEach(card => card.addEventListener('click', playerDropCard))
        }
        
    }
}


 dealCards();
// yere maça atılınca hepsini oynanabilir sayıyor onu düzelt
//  oyuncuda droppedCardsın ilkinin türünde bir kart yoksa eğer elde maça varsa maçaları ayır eğer yerde maça atılmışsa yerdeki maçadan büyükleri renklendir ve event listener ekle maça atılmamışsa bütün maçaları renklendir ve event listener ekle
//  eğer elde maça da yoksa bütün kartları renklendir ve event listener ekle

 