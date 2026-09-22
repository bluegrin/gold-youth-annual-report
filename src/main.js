import './style/style.scss';

const menuButton = document.querySelector( '#menu-button' );
const menu = document.querySelector( '#menu' );
const links = document.querySelectorAll( 'a' );
const selfUrl = new URL( window.location.href );

menuButton.addEventListener( 'click', () => {
    if ( menu.classList.contains( 'opened' ) ) {
        menuButton.classList.remove( 'opened' );
        menuButton.classList.add( 'closed' );
        menu.classList.remove( 'opened' );
        menu.classList.add( 'closed' );
    } else {
        menuButton.classList.remove( 'closed' );
        menuButton.classList.add( 'opened' );
        menu.classList.remove( 'closed' );
        menu.classList.add( 'opened' );
    }
} );

links.forEach( ( link ) => {
    link.addEventListener( 'click', ( event ) => {
        const linkUrl = new URL( link.href );

        if ( linkUrl.hash && linkUrl.origin === selfUrl.origin && linkUrl.pathname === selfUrl.pathname ) {
            event.preventDefault();
            document.querySelector( linkUrl.hash ).scrollIntoView( { behavior: 'smooth' } );
        }
    } );
} );
