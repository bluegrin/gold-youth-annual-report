const { registerBlockStyle, unregisterBlockStyle } = wp.blocks;
const { __ } = wp.i18n;

registerBlockStyle( 'core/buttons', {
    name: 'circles',
    label: __( 'Circles', 'gold-youth' ),
} );

registerBlockStyle( 'core/button', {
    name: 'circle',
    label: __( 'Circle', 'gold-youth' ),
} );

registerBlockStyle( 'core/image', {
    name: 'gold-border',
    label: __( 'Gold Border', 'gold-youth' ),
} );

registerBlockStyle( 'core/image', {
    name: 'bottom-border',
    label: __( 'Bottom Border', 'gold-youth' ),
} );

registerBlockStyle( 'core/image', {
    name: 'inverted',
    label: __( 'Inverted', 'gold-youth' ),
} );

registerBlockStyle( 'core/media-text', {
    name: 'gold-border',
    label: __( 'Gold Border', 'gold-youth' ),
} );

registerBlockStyle( 'core/media-text', {
    name: 'bottom-border',
    label: __( 'Bottom Border', 'gold-youth' ),
} );

registerBlockStyle( 'core/cover', {
    name: 'country-snapshot',
    label: __( 'Country Snapshot', 'gold-youth' ),
} );
