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

export default function Edit({ attributes, setAttributes }) {
    const { slides } = attributes;
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

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
        setCurrentSlideIndex(newSlides.length - 1);
    };

    const removeSlide = (index) => {
        if (slides.length === 1) {
            alert('Debe haber al menos 1 slide');
            return;
        }
        const newSlides = slides.filter((_, i) => i !== index);
        setAttributes({ slides: newSlides });
        setCurrentSlideIndex(Math.max(0, index - 1));
    };

    const duplicateSlide = (index) => {
        const newSlides = [...slides];
        const duplicated = { ...slides[index], id: Date.now() };
        newSlides.splice(index + 1, 0, duplicated);
        setAttributes({ slides: newSlides });
        setCurrentSlideIndex(index + 1);
    };

    const currentSlide = slides[currentSlideIndex] || slides[0];

    return (
        <Fragment>
            <BlockControls>
                <ToolbarGroup>
                    <ToolbarButton
                        icon="align-left"
                        isActive={currentSlide.alignment === 'left'}
                        onClick={() => updateSlide(currentSlideIndex, 'alignment', 'left')}
                    />
                    <ToolbarButton
                        icon="align-center"
                        isActive={currentSlide.alignment === 'center'}
                        onClick={() => updateSlide(currentSlideIndex, 'alignment', 'center')}
                    />
                    <ToolbarButton
                        icon="align-right"
                        isActive={currentSlide.alignment === 'right'}
                        onClick={() => updateSlide(currentSlideIndex, 'alignment', 'right')}
                    />
                </ToolbarGroup>
            </BlockControls>

            <InspectorControls>
                <PanelBody title={__('Gestionar Slides', 'acemar-blocks')}>
                    <p style={{ marginBottom: '16px' }}>
                        <strong>Slide actual: {currentSlideIndex + 1} de {slides.length}</strong>
                    </p>

                    <Button 
                        isPrimary 
                        onClick={addSlide}
                        style={{ marginBottom: '8px', width: '100%' }}
                    >
                        ➕ Agregar Slide
                    </Button>

                    {slides.length > 1 && (
                        <Button 
                            isDestructive 
                            onClick={() => removeSlide(currentSlideIndex)}
                            style={{ marginBottom: '8px', width: '100%' }}
                        >
                            🗑️ Eliminar Slide
                        </Button>
                    )}

                    <hr style={{ margin: '16px 0' }} />

                    <p><strong>Cambiar a:</strong></p>
                    {slides.map((s, index) => (
                        <Button
                            key={s.id}
                            isSecondary={index !== currentSlideIndex}
                            isPrimary={index === currentSlideIndex}
                            onClick={() => setCurrentSlideIndex(index)}
                            style={{ marginBottom: '4px', width: '100%' }}
                        >
                            Slide {index + 1}
                        </Button>
                    ))}
                </PanelBody>

                <PanelBody title={'Configuración - Slide ' + (currentSlideIndex + 1)}>
                    <SelectControl
                        label="Tipo de media"
                        value={currentSlide.mediaType}
                        options={[
                            { label: 'Imagen', value: 'image' },
                            { label: 'Video', value: 'video' }
                        ]}
                        onChange={(value) => updateSlide(currentSlideIndex, 'mediaType', value)}
                    />

                    {currentSlide.mediaType === 'image' ? (
                        <MediaUploadCheck>
                            <MediaUpload
                                onSelect={(media) => {
                                    updateSlide(currentSlideIndex, 'imageUrl', media.url);
                                    updateSlide(currentSlideIndex, 'imageId', media.id);
                                }}
                                allowedTypes={['image']}
                                value={currentSlide.imageId}
                                render={({ open }) => (
                                    <>
                                        {currentSlide.imageUrl ? (
                                            <>
                                                <img 
                                                    src={currentSlide.imageUrl} 
                                                    alt="" 
                                                    style={{ maxWidth: '100%', marginBottom: '8px', borderRadius: '4px' }}
                                                />
                                                <Button isSecondary onClick={open} style={{ marginRight: '8px' }}>
                                                    Cambiar
                                                </Button>
                                                <Button isDestructive onClick={() => {
                                                    updateSlide(currentSlideIndex, 'imageUrl', '');
                                                    updateSlide(currentSlideIndex, 'imageId', null);
                                                }}>
                                                    Remover
                                                </Button>
                                            </>
                                        ) : (
                                            <Button isPrimary onClick={open}>
                                                Seleccionar imagen
                                            </Button>
                                        )}
                                    </>
                                )}
                            />
                        </MediaUploadCheck>
                    ) : (
                        <input
                            type="text"
                            value={currentSlide.videoUrl || ''}
                            onChange={(e) => updateSlide(currentSlideIndex, 'videoUrl', e.target.value)}
                            placeholder="https://www.youtube.com/watch?v=..."
                            style={{ width: '100%', padding: '8px', marginTop: '8px' }}
                        />
                    )}

                    <SelectControl
                        label="Alineación"
                        value={currentSlide.alignment}
                        options={[
                            { label: 'Izquierda', value: 'left' },
                            { label: 'Centro', value: 'center' },
                            { label: 'Derecha', value: 'right' }
                        ]}
                        onChange={(value) => updateSlide(currentSlideIndex, 'alignment', value)}
                    />
                </PanelBody>
            </InspectorControls>

            <div {...useBlockProps({ className: 'acemar-hero-slider-editor' })}>
                <div className="editor-info">
                    🎬 Hero Slider - Editando Slide {currentSlideIndex + 1} de {slides.length}
                </div>

                <div className="hero-slide-preview">
                    {currentSlide.mediaType === 'image' && currentSlide.imageUrl && (
                        <div 
                            className="hero-background"
                            style={{ backgroundImage: `url(${currentSlide.imageUrl})` }}
                        />
                    )}
                    
                    {currentSlide.mediaType === 'video' && currentSlide.videoUrl && (
                        <div className="hero-video-indicator">
                            🎥 Video: {currentSlide.videoUrl.substring(0, 50)}...
                        </div>
                    )}
                    
                    <div className={`hero-content hero-content-${currentSlide.alignment}`}>
                        <InnerBlocks
                            allowedBlocks={ALLOWED_BLOCKS}
                            template={TEMPLATE}
                        />
                    </div>
                </div>
            </div>
        </Fragment>
    );
}