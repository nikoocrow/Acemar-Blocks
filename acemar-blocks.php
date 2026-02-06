<?php
/**
 * Plugin Name: Acemar Blocks
 * Description: Bloques personalizados de Gutenberg para Acemar
 * Version: 1.0.0
 * Author: AssureSoft
 * Text Domain: acemar-blocks
 */

// Prevenir acceso directo
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Definir constantes
define( 'ACEMAR_BLOCKS_VERSION', '1.0.0' );
define( 'ACEMAR_BLOCKS_PATH', plugin_dir_path( __FILE__ ) );
define( 'ACEMAR_BLOCKS_URL', plugin_dir_url( __FILE__ ) );

/**
 * Registrar categoría de bloques personalizada
 */
function acemar_blocks_category( $categories ) {
    return array_merge(
        array(
            array(
                'slug'  => 'acemar',
                'title' => __( 'Acemar Blocks', 'acemar-blocks' ),
                'icon'  => 'star-filled',
            ),
        ),
        $categories
    );
}
add_filter( 'block_categories_all', 'acemar_blocks_category', 10, 2 );

/**
 * Registrar bloques
 */
function acemar_blocks_register() {
    // Registrar Hero Slider
    register_block_type( ACEMAR_BLOCKS_PATH . 'build/hero-slider' );
}
add_action( 'init', 'acemar_blocks_register' );

/**
 * Enqueue frontend scripts para Splide
 */
function acemar_blocks_frontend_scripts() {
    // Solo cargar en el frontend, no en el editor
    if ( is_admin() ) {
        return;
    }
    
    // Verificar si el bloque está en la página
    if ( has_block( 'acemar/hero-slider' ) ) {
        // Cargar estilos del bloque (incluye Splide CSS)
        wp_enqueue_style(
            'acemar-hero-slider-style',
            ACEMAR_BLOCKS_URL . 'build/hero-slider/style-index.css',
            array(),
            ACEMAR_BLOCKS_VERSION
        );
        
        // Verificar si el archivo asset existe
        $asset_file_path = ACEMAR_BLOCKS_PATH . 'build/hero-slider/frontend.asset.php';
        
        if ( file_exists( $asset_file_path ) ) {
            $asset_file = include( $asset_file_path );
            
            // Encolar el script de frontend
            wp_enqueue_script(
                'acemar-hero-slider-frontend',
                ACEMAR_BLOCKS_URL . 'build/hero-slider/frontend.js',
                $asset_file['dependencies'] ?? array(),
                $asset_file['version'] ?? ACEMAR_BLOCKS_VERSION,
                true
            );
        }
    }
}
add_action( 'wp_enqueue_scripts', 'acemar_blocks_frontend_scripts' );