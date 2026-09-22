import classnames from 'classnames';
const { assign } = lodash;
const { __ } = wp.i18n;
const { addFilter } = wp.hooks;
const { Fragment } = wp.element;
const { useSetting, getColorObjectByColorValue, getColorObjectByAttributeValues, InspectorControls, InspectorAdvancedControls } = wp.blockEditor;
const { createHigherOrderComponent } = wp.compose;
const { BaseControl, ColorPalette } = wp.components;

export const addButtonColorAttribute = ( settings, name ) => {
    if ( 'core/button' === name ) {
        settings.attributes.buttonColor = {
            type: 'string',
        };
    }

    return settings;
};
addFilter( 'blocks.registerBlockType', 'gold-youth/button-color-attribute', addButtonColorAttribute );

export const withButtonColorAdvancedControls = createHigherOrderComponent( ( BlockEdit ) => {
    return ( props ) => {
        const { attributes, setAttributes, isSelected } = props;
        const { buttonColor } = attributes;
        const palette = useSetting( 'color.palette' );

        return (
            <Fragment>
                <BlockEdit { ...props } />
                { isSelected && 'core/button' === props.name &&
                    <InspectorControls group="color">
                        <BaseControl label={ __( 'Combinations', 'gold-youth' ) } >
                            <ColorPalette
                                disableCustomColors={ true }
                                value={ getColorObjectByAttributeValues( palette, buttonColor ).color }
                                colors={ [ ...palette ] }
                                onChange={ ( value ) => setAttributes( { buttonColor: getColorObjectByColorValue( palette, value ).slug } ) }
                            />
                        </BaseControl>
                    </InspectorControls>
                }
            </Fragment>
        );
    };
}, 'withButtonColorAdvancedControls' );
addFilter( 'editor.BlockEdit', 'gold-youth/button-color-control', withButtonColorAdvancedControls );

export const withButtonColorClassname = createHigherOrderComponent( ( BlockListBlock ) => {
    return ( props ) => {
        const { name, attributes } = props;

        if ( 'core/button' !== name ) {
            return <BlockListBlock { ...props } />;
        }

        const { buttonColor } = attributes;

        return <BlockListBlock { ...props } className={ `is-color-${ buttonColor }` } />;
    };
} );
addFilter( 'editor.BlockListBlock', 'gold-youth/button-color-class', withButtonColorClassname );

export const saveButtonColorClassname = ( props, block, attributes ) => {
    if ( 'core/button' === block.name ) {
        const { className } = props;
        const { buttonColor } = attributes;

        return assign( {}, props, {
            className: classnames( className, buttonColor ? `is-color-${ buttonColor }` : '' ),
        } );
    }

    return props;
};
addFilter( 'blocks.getSaveContent.extraProps', 'gold-yotuh/button-color-class-front-end', saveButtonColorClassname );
