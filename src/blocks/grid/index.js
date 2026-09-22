import metadata from './block.json';

const { registerBlockType } = wp.blocks;
const { InnerBlocks, useBlockProps } = wp.blockEditor;

registerBlockType( metadata, {
    edit: () => {
        const blockProps = useBlockProps();

        return (
            <div {...blockProps}>
                <InnerBlocks
                    allowedBlocks={[ 'gold-youth/grid-item' ]}
                    template={[
                        [ 'gold-youth/grid-item', {} ],
                        [ 'gold-youth/grid-item', {} ],
                        [ 'gold-youth/grid-item', {} ],
                    ]}
                />
            </div>
        );
    },
    save: () => {
        const blockProps = useBlockProps.save();

        return (
            <div {...blockProps}>
                <InnerBlocks.Content/>
            </div>
        );
    },
} );
