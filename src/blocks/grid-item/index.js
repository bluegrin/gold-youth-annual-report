import metadata from './block.json';

const { registerBlockType } = wp.blocks;
const { InnerBlocks, useBlockProps } = wp.blockEditor;

registerBlockType( metadata, {
    edit: () => {
        const blockProps = useBlockProps();

        return (
            <div {...blockProps}>
                <InnerBlocks
                    template={[
                        [ 'core/paragraph', {} ],
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
