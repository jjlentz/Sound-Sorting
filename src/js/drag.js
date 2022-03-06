const RANGE_SIZE = 36;
let placedCards = 0;
const placement = {};

$( init );

function init() {

    // Hide the success message
    $('#successMessage').hide();
    $('#successMessage').css( {
        left: '580px',
        top: '250px',
        width: 0,
        height: 0
    } );

    // Reset the game
    placedCards = 0;
    $('#cardPile').html( '' );
    $('#cardSlots').html( '' );
    // remove all the keys from the placement object

    // Create the pile of shuffled cards
    const numbers = [...Array(RANGE_SIZE).keys()].map(x => x + 1);
    numbers.sort( function() { return Math.random() - .5 } );

    for ( var i = 0; i < RANGE_SIZE; i++ ) {
        $('<div>' + numbers[i] + '</div>')
            .data( 'number', numbers[i] )
            .attr( 'id', 'card'+numbers[i] ).appendTo( '#cardPile' )
            .draggable( {
                containment: '#content',
                stack: '#cardPile div',
                cursor: 'move',
                revert: true
            } );
    }
    // Create 4 times as many card slots
    const slotsSize = RANGE_SIZE * 4;
    for ( var i=1; i<= slotsSize; i++ ) {
        $('<div id="`slot${i}`"></div>').data( 'number', i ).appendTo( '#cardSlots' ).droppable( {
            accept: '#cardPile div',
            hoverClass: 'hovered',
            drop: handleCardDrop,
            out: handleCardOut
        } );
    }

}

// TODO add untracking the card/slot combo
function handleCardOut(event, ui) {
    $(this).droppable( "option", "disabled", false );
}

// TODO prevent cards from being dropped on other cards!
function handleCardDrop( event, ui ) {
    var slotNumber = $(this).data( 'number' );
    var cardNumber = ui.draggable.data( 'number' );
    $(this).droppable( "option", "disabled", true );
    ui.draggable.addClass( 'placed' );
    ui.draggable.position( { of: $(this), my: 'left top', at: 'left top' } );
    ui.draggable.draggable( 'option', 'revert', false );
    console.log(`${cardNumber} dropped on slot ${slotNumber}`);
    placement[`${cardNumber}`] = slotNumber
    // need a way to un-count the cards when they are moved off a slot.
    placedCards++;
    // or unassign the "correct" class
    // then base completion on either placedCards count or on counting cards with placed class.

    // If all the cards have been placed correctly then display a message
    // and reset the cards for another go

    if ( placedCards == RANGE_SIZE ) {
        $('#successMessage').show();
        $('#successMessage').animate( {
            left: '80px',
            top: '200px',
            width: '400px',
            height: '100px',
            opacity: 1
        } );

        console.log(`Placement is ${JSON.stringify(placement)}`);
        // how do we write the placement object as something useful?
        // for (key in placement) {
        //     console.log(`${key} on ${placement[key]}`)
        // }

        // Options for successful completion
        // 1. Write data to a dynamoDB graphQL endpoint
        //    - how do we do authentication & authorization?
        //    - how does experimentor get the data?
        // 2. Write data to csv file like last time (using same authentication & authorization)
    }
}

$.when( $.ready ).then(() => {
  $("div.ui-draggable").click((event) => {
      // What is the JQuery way to access data.number assigned to the card?
      console.log(`Whoohoo ${event.target.innerHTML}`, $(event.target))
      // play the sound associated with this card
  })
});
