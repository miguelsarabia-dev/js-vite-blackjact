import _ from 'underscore';
// import { crearDeck as crearNuevoDeck } from './usecases/crear-deck'; // se da un alias para trabajar en este archivo
// import crearDeck, { miNombre } from './usecases/crear-deck'; // importacion por default e importacion independiente
import { crearDeck, pedirCarta, valorCarta } from './usecases';

const miModulo = (() => {
    'use strict'

    let deck         = [];
    const tipos      = ['C', 'D', 'H', 'S'],
          especiales = ['A', 'J', 'Q', 'K' ];

    let puntosJugadores = [];

    // Referencias HTML

    const btnPedir   = document.querySelector('#btnPedir'),
          btnNuevo   = document.querySelector('#btnNuevo'),
          btnDetener = document.querySelector('#btnDetener'),
          divCartasJugadores = document.querySelectorAll('.divCartas'),
          puntosHTML    = document.querySelectorAll('small');


    // Esta función inicializa el juego
    const inicializarJuego = ( numJugadores = 2 ) => {
        deck = crearDeck( tipos, especiales );
        puntosJugadores = [];
        for( let i = 0; i < numJugadores; i++ ){
            puntosJugadores.push(0);
        }

        puntosHTML.forEach( elem => elem.innerText = 0 );    
        divCartasJugadores.forEach( elem => elem.innerText = '' );

        btnPedir.disabled   = false;
        btnDetener.disabled = false;
    }

    //TODO:
    // Turno: 0 = primer jugador y el ultimo será la computadora
    const acumularPuntos = ( carta, turno ) => {

        puntosJugadores[turno] = puntosJugadores[turno] + valorCarta( carta );
        puntosHTML[turno].innerText = puntosJugadores[turno];

        return puntosJugadores[turno];

    }

    //TODO:
    const crearCarta = ( carta, turno ) => {
       
        const imgCarta = document.createElement('img');
        imgCarta.src   = `assets/cartas/${ carta }.png`;
        imgCarta.classList.add('carta');
        divCartasJugadores[ turno ].append( imgCarta );
    }

    //TODO: 
    const determinarGanador = () => {

        const [ puntosMinimos, puntosComputadora ] = puntosJugadores;

        setTimeout(() => {
            
            if (puntosComputadora === puntosMinimos ){
                alert('Nadie gana :(');
            } else if ( (puntosComputadora < puntosMinimos) && ( puntosMinimos < 21 ) ){
                alert('Jugador gana');
            } else if ( puntosMinimos > 21 ){
                alert('Computadora gana');
            } else if ( puntosComputadora > 21 ){
                alert('Jugador gana');
            } else {
                alert('Computadora gana'); 
            }

        }, 100);
    }

    // TODO:
 const turnoComputadora = ( puntosMinimos ) => {

    if ( !puntosMinimos ) throw new Error( 'Puntos minimos son necesarios' ); 
    if ( !deck ) throw new Error( 'El deck es necesario' );

    let puntosComputadora = 0;
    do {

        const carta = pedirCarta( deck );
        puntosComputadora = acumularPuntos(carta, puntosJugadores.length - 1);
        crearCarta( carta, puntosJugadores.length - 1 );

    } while( ( puntosComputadora < puntosMinimos ) && ( puntosMinimos <= 21 ));

    determinarGanador();
    
}

    // Eventos
    btnPedir.addEventListener('click', () => {
        
        const carta = pedirCarta( deck );
        const puntosJugador = acumularPuntos( carta, 0 );

        crearCarta( carta, 0 );

        if( puntosJugador > 21 ){
            console.warn( 'Lo siento mucho, perdiste' );
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora( puntosJugador );
        } else if ( puntosJugador === 21 ){
            console.warn( '21, genial' );
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora( puntosJugador );
        }


    })

    btnDetener.addEventListener('click', ()=> {
        btnPedir.disabled = true;
        btnDetener.disabled = true;
        turnoComputadora( puntosJugadores[0] );
        
    })

    btnNuevo.addEventListener('click', () =>{
        inicializarJuego();
    })


    
    //Counter exercise

    //'use strict'

//   let count = 0;

//   const counterDisplay = document.querySelector('#counter');
//   const button = document.querySelector('#increment');
//   const btnReset = document.querySelector('#reset');
  
//   button.addEventListener('click', () => {
//     count++;
//     counterDisplay.innerText = count;
//     console.log(`Count: ${count}`);
//   });

//   btnReset.addEventListener('click', () => {

//     count = 0;
//     counterDisplay.innerText = 0;
//     console.log('Reinicio del contador');

//   });

    return {
        nuevoJuego: inicializarJuego
    };

})();



