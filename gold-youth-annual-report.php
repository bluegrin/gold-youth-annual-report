<?php
/**
 * Plugin Name: gold Youth Annual Report
 * Description: Adds a page template for creating an independently-themed page for the annual report within the site.
 * Version 1.0.0
 * Requires PH: 8.1
 * Author: Think Craft
 * Author URI: https://thinkcraft.co.za
 * Text Domain: gold-youth
 */

define( 'GY_PLUGIN_PATH', plugin_dir_path( __FILE__ ) );
define( 'GY_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'GY_PAGE_TEMPLATE', GY_PLUGIN_PATH . 'template.php' );
define( 'GY_STYLESHEET', GY_PLUGIN_PATH . 'src/style/config/_palette.scss' );
define( 'GY_COLOR_PALETTE', gold_youth_get_color_palette() );
define( 'GY_PLUGIN_VERSION', gold_youth_plugin_version() );

/**
 * Loops through all custom blocks and calls the provided callable on the file matching $filename.
 *
 * First callable argument is the SplFileInfo $file. Remaining arguments are provided with $args.
 *
 * @param string $filename
 * @param string|closure $callback
 * @param ...$args
 *
 * @return void
 */
function gold_youth_block_iterator( string $filename, string|closure $callback, ...$args ) {

    $block_iterator = new RecursiveDirectoryIterator( GY_PLUGIN_PATH . 'src/blocks' );

    foreach ( new RecursiveIteratorIterator( $block_iterator ) as $file ) {

        /** @var SplFileInfo $file */

        if ( $filename === $file->getFilename() && ( is_string( $callback ) || is_callable( $callback ) ) ) {

            match ( $callback ) {
                'require' => require $file->getPathname(),
                'require_once' => require_once $file->getPathname(),
                'include' => include $file->getPathname(),
                'include_once' => include_once $file->getPathname(),
                default => call_user_func( $callback, is_string( $callback ) ? $file->getPathname() : $file, ...$args ),
            };
        }
    }
}

gold_youth_block_iterator( 'functions.php', 'require_once' );

/**
 * Returns the plugin version when on production or the current timestamp otherwise, for version-controlling assets
 *
 * @return int|mixed
 */
function gold_youth_plugin_version() {

    if( ! function_exists('get_plugin_data') ){
        require_once( ABSPATH . 'wp-admin/includes/plugin.php' );
    }

    $asset_file = include( GY_PLUGIN_PATH . 'build/index.asset.php' );
    $plugin_data = get_plugin_data( __FILE__ );

    return 1 === preg_match( '/goldyouth\.org$/', $_SERVER['HTTP_HOST'] ) ? $plugin_data['Version'] ?? $asset_file['version'] : time();
}

/**
 * Fetches the default palette from the source Sass/SCSS and returns it as a block-editor-friendly array.
 *
 * @return array
 */
function gold_youth_get_color_palette(): array {

    $palette = array();

    if ( file_exists( GY_STYLESHEET ) ) {

        preg_match(  '/\/\* BEGIN SWATCHES \*\/[\r\n]([\s\S]*[\s\S])\/\* END SWATCHES \*\//m', file_get_contents( GY_STYLESHEET ), $matches );
        preg_match_all( '/\$swatch-(.*): (#.*);/m', $matches[1], $swatches, PREG_SET_ORDER );

        foreach ( $swatches as $swatch ) {
            $palette[] = array( 'name' => __( mb_convert_case( str_replace( '-', ' ', $swatch[1] ), MB_CASE_TITLE ), 'gold-youth' ), 'slug' => $swatch[1], 'color' => $swatch[2] );
        }
    }

    return $palette;
}

/**
 * Returns whether the current page is using the gold Youth Annual Report template
 *
 * @return bool
 */
function gold_youth_is_annual_report_page(): bool {

    if ( is_page() && GY_PAGE_TEMPLATE == get_post_meta( get_the_ID(), '_wp_page_template', true ) ) {
        return true;
    }

    return false;
}

/**
 * Adds the plugin page template to the list of available page templates in the page editor.
 *
 * @param string[] $post_templates
 *
 * @return string[]
 */
function gold_youth_page_template( array $post_templates ): array {

    $post_templates[ GY_PAGE_TEMPLATE ] = __( 'Annual Report', 'gold-youth' );

    return $post_templates;
}
add_filter( 'theme_page_templates', 'gold_youth_page_template' );

/**
 * Includes the plugin page template when it is selected as the page template.
 *
 * @param string $template
 *
 * @return string
 */
function gold_youth_page_template_render( string $template ): string {

    if ( gold_youth_is_annual_report_page() ) {
        return GY_PAGE_TEMPLATE;
    }

    return $template;
}
add_filter( 'template_include', 'gold_youth_page_template_render' );

/**
 * Enqueues the block editor JavaScript
 *
 * @return void
 */
function gold_youth_block_editor_scripts(): void {

    if ( GY_PAGE_TEMPLATE == get_post_meta( get_the_ID(), '_wp_page_template', true ) ) {
        $asset_file = include( GY_PLUGIN_PATH . 'build/index.asset.php' );
        wp_enqueue_script( 'gold-youth-block-editor', GY_PLUGIN_URL . 'build/index.js', $asset_file['dependencies'], $asset_file['version'], true );
        wp_localize_script( 'gold-youth-block-editor', 'wpAjaxObject', array( 'ajaxUrl' => admin_url( 'admin-ajax.php' ) ) );
    }
}
add_action( 'enqueue_block_editor_assets', 'gold_youth_block_editor_scripts' );

/**
 * Adds the editor color palette and editor style
 *
 * @return void
 */
function gold_youth_block_editor_style(): void {
    add_theme_support( 'editor-styles' );
    add_editor_style( GY_PLUGIN_URL . 'build/index.css' );
    register_nav_menu( 'annual_report', __( 'Annual Report', 'gold-youth' ) );
}
add_action( 'after_setup_theme', 'gold_youth_block_editor_style', PHP_INT_MAX );

/**
 * Enqueues the front-end style and scripts
 *
 * @return void
 */
function gold_youth_enqueue_assets(): void {

    if ( gold_youth_is_annual_report_page() ) {

        wp_enqueue_style( 'gold-youth-annual-report', GY_PLUGIN_URL . 'assets/main.css', array(), GY_PLUGIN_VERSION );
        wp_enqueue_script( 'gold-youth-annual-report', GY_PLUGIN_URL . 'assets/main.js', array( 'jquery' ), GY_PLUGIN_VERSION, true );
    }
}
add_action( 'wp_enqueue_scripts', 'gold_youth_enqueue_assets' );

/**
 * @return void
 */
function gold_youth_register_block_types(): void {
    gold_youth_block_iterator( 'block.json', function ( SplFileInfo $file ) {
        register_block_type( $file->getPathname() );
    } );
}
add_action( 'init', 'gold_youth_register_block_types' );

/**
 * @return void
 */
function gold_youth_ajax_get_color_palette(): void {
    wp_send_json_success( gold_youth_get_color_palette() );
}
add_action( 'wp_ajax_gold_youth_color_palette', 'gold_youth_ajax_get_color_palette' );
