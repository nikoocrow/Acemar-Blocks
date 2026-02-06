import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, Button, SelectControl, ToolbarGroup, ToolbarButton } from '@wordpress/components';
import { InspectorControls, BlockControls } from '@wordpress/block-editor';
import { Fragment, useState } from '@wordpress/element';
import './editor.scss';

const ALLOWED_BLOCKS = [
    'core/heading',
    'core/paragraph',
    'core/button',
    'core/buttons',
];

const TEMPLATE = [
    ['core/heading', { 
        level: 1, 
        placeholder: 'Título del slide...', 
        textAlign: 'center',
        style: { color: { text: '#ffffff' } }
    }],
    ['core/paragraph', { 
        placeholder: 'Descripción...', 
        align: 'center',
        style: { color: { text: '#ffffff' } }
    }],
    ['core/buttons', { 
        layout: { type: 'flex', justifyContent: 'center' } 
    }, [
        ['core/button', { 
            text: 'Ver más',
            style: { 
                color: { background: '#ffffff', text: '#333333' },
                border: { radius: '50px' }
            }
        }]
    ]]
];

export default function Edit({ attributes, setAttributes, clientId }) {
    const { slides } = attributes;
    const [currentSlide, setCurrentSlide] = useState(0);

    const updateSlide = (index, field, value) => {
        const newSlides = [...slides];
        newSlides[index][field] = value;
        setAttributes({ slides: newSlides });
    };

    const addSlide = () => {
        const newSlides = [
            ...slides,
            {
                id: Date.now(),
                mediaType: 'image',
                imageUrl: '',
                imageId: null,
                videoUrl: '',
                alignment: 'center'
            }
        ];
        setAttributes({ slides: newSlides });
        setCurrentSlide(newSlides.length - 1);
    };

    const removeSlide = (index) => {
        if (slides.length === 1) {
            alert('Debe haber al menos 1 slide');
            return;
        }
        const newSlides = slides.filter((_, i) => i !== index);
        setAttributes({ slides: newSlides });
        setCurrentSlide(Math.max(0, currentSlide - 1));
    };

    const duplicateSlide = (index) => {
        const newSlides = [...slides];
        const duplicated = { ...slides[index], id: Date.now() };
        newSlides.splice(index + 1, 0, duplicated);
        setAttributes({ slides: newSlides });
        setCurrentSlide(index + 1);
    };

    const slide = slides[currentSlide] || slides[0];
    const innerBlocksId = `${clientId}-slide-${currentSlide}`;

    return (
        <Fragment>
            <BlockControls>
                <ToolbarGroup>
                    <ToolbarButton
                        icon="align-left"
                        label={__('Alinear izquierda', 'acemar-blocks')}
                        isActive={slide.alignment === 'left'}
                        onClick={() => updateSlide(currentSlide, 'alignment', 'left')}
                    />
                    <ToolbarButton
                        icon="align-center"
                        label={__('Alinear centro', 'acemar-blocks')}
                        isActive={slide.alignment === 'center'}
                        onClick={() => updateSlide(currentSlide, 'alignment', 'center')}
                    />
                    <ToolbarButton
                        icon="align-right"
                        label={__('Alinear derecha', 'acemar-blocks')}
                        isActive={slide.alignment === 'right'}
                        onClick={() => updateSlide(currentSlide, 'alignment', 'right')}
                    />
                </ToolbarGroup>
            </BlockControls>

            <InspectorControls>
                <PanelBody title={__('Configuración del Slide Actual', 'acemar-blocks')}>
                    <SelectControl
                        label={__('Tipo de media', 'acemar-blocks')}
                        value={slide.mediaType}
                        options={[
                            { label: 'Imagen', value: 'image' },
                            { label: 'Video (YouTube/Vimeo)', value: 'video' }
                        ]}
                        onChange={(value) => updateSlide(currentSlide, 'mediaType', value)}
                    />

                    {slide.mediaType === 'image' ? (
                        <MediaUploadCheck>
                            <MediaUpload
                                onSelect={(media) => {
                                    updateSlide(currentSlide, 'imageUrl', media.url);
                                    updateSlide(currentSlide, 'imageId', media.id);
                                }}
                                allowedTypes={['image']}
                                value={slide.imageId}
                                render={({ open }) => (
                                    <div style={{ marginBottom: '15px' }}>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                                            {__('Imagen de fondo', 'acemar-blocks')}
                                        </label>
                                        {slide.imageUrl ? (
                                            <div>
                                                <img 
                                                    src={slide.imageUrl} 
                                                    alt="" 
                                                    style={{ 
                                                        maxWidth: '100%', 
                                                        marginBottom: '10px',
                                                        borderRadius: '4px'
                                                    }}
                                                />
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <Button isSecondary onClick={open}>
                                                        {__('Cambiar imagen', 'acemar-blocks')}
                                                    </Button>
                                                    <Button isDestructive onClick={() => {
                                                        updateSlide(currentSlide, 'imageUrl', '');
                                                        updateSlide(currentSlide, 'imageId', null);
                                                    }}>
                                                        {__('Remover', 'acemar-blocks')}
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <Button isPrimary onClick={open}>
                                                {__('Seleccionar imagen', 'acemar-blocks')}
                                            </Button>
                                        )}
                                    </div>
                                )}
                            />
                        </MediaUploadCheck>
                    ) : (
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                                {__('URL del video', 'acemar-blocks')}
                            </label>
                            <input
                                type="text"
                                value={slide.videoUrl}
                                onChange={(e) => updateSlide(currentSlide, 'videoUrl', e.target.value)}
                                placeholder="https://www.youtube.com/watch?v=..."
                                style={{ width: '100%', padding: '8px' }}
                            />
                            <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                                {__('YouTube o Vimeo', 'acemar-blocks')}
                            </p>
                        </div>
                    )}

                    <SelectControl
                        label={__('Alineación del contenido', 'acemar-blocks')}
                        value={slide.alignment}
                        options={[
                            { label: 'Izquierda', value: 'left' },
                            { label: 'Centro', value: 'center' },
                            { label: 'Derecha', value: 'right' }
                        ]}
                        onChange={(value) => updateSlide(currentSlide, 'alignment', value)}
                    />
                </PanelBody>

                <PanelBody title={__('Gestionar Slides', 'acemar-blocks')} initialOpen={false}>
                    <Button 
                        isPrimary 
                        onClick={addSlide}
                        style={{ marginBottom: '12px', width: '100%' }}
                    >
                        ➕ {__('Agregar Slide', 'acemar-blocks')}
                    </Button>

                    <Button 
                        isSecondary 
                        onClick={() => duplicateSlide(currentSlide)}
                        style={{ marginBottom: '12px', width: '100%' }}
                    >
                        📋 {__('Duplicar Slide Actual', 'acemar-blocks')}
                    </Button>

                    {slides.length > 1 && (
                        <Button 
                            isDestructive 
                            onClick={() => removeSlide(currentSlide)}
                            style={{ width: '100%' }}
                        >
                            🗑️ {__('Eliminar Slide Actual', 'acemar-blocks')}
                        </Button>
                    )}

                    <hr style={{ margin: '16px 0' }} />

                    <div>
                        <strong>{__('Todos los slides:', 'acemar-blocks')}</strong>
                        <div style={{ marginTop: '12px' }}>
                            {slides.map((s, index) => (
                                <Button
                                    key={s.id}
                                    isSecondary={index !== currentSlide}
                                    isPrimary={index === currentSlide}
                                    onClick={() => setCurrentSlide(index)}
                                    style={{ 
                                        marginBottom: '4px', 
                                        width: '100%',
                                        justifyContent: 'flex-start'
                                    }}
                                >
                                    {index + 1}. Slide {index + 1}
                                </Button>
                            ))}
                        </div>
                    </div>
                </PanelBody>
            </InspectorControls>

            <div {...useBlockProps({ className: 'acemar-hero-slider-editor' })}>
                <div className="slide-navigation">
                    <Button
                        icon="arrow-left-alt2"
                        onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
                        disabled={currentSlide === 0}
                        style={{ marginRight: '8px' }}
                    >
                        {__('Anterior', 'acemar-blocks')}
                    </Button>
                    
                    <span style={{ 
                        padding: '0 16px', 
                        fontWeight: '600',
                        fontSize: '14px'
                    }}>
                        Slide {currentSlide + 1} de {slides.length}
                    </span>
                    
                    <Button
                        icon="arrow-right-alt2"
                        iconPosition="right"
                        onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
                        disabled={currentSlide === slides.length - 1}
                        style={{ marginLeft: '8px' }}
                    >
                        {__('Siguiente', 'acemar-blocks')}
                    </Button>
                </div>

                <div className="hero-slide-preview">
                    {slide.mediaType === 'image' && slide.imageUrl && (
                        <div 
                            className="hero-background"
                            style={{ backgroundImage: `url(${slide.imageUrl})` }}
                        />
                    )}
                    
                    {slide.mediaType === 'video' && slide.videoUrl && (
                        <div className="hero-video-indicator">
                            🎥 Video: {slide.videoUrl}
                        </div>
                    )}
                    
                    <div className={`hero-content hero-content-${slide.alignment}`}>
                        <InnerBlocks
                            key={innerBlocksId}
                            allowedBlocks={ALLOWED_BLOCKS}
                            template={TEMPLATE}
                            templateLock={false}
                            renderAppender={() => <InnerBlocks.ButtonBlockAppender />}
                        />
                    </div>
                </div>
            </div>
        </Fragment>
    );
}