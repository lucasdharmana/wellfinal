// Character Animation Script for WELL WELL Website
// Simple fade-in transitions with fixed positioning on the section divider

(function() {
    'use strict';

    const characterImages = {
        jew: 'wellwell12347_jew (1).png',
        africa: 'wellwell12347_africa (1).png'
    };

    const config = {
        initialDelay: 1000,        // 1 second initial delay
        sequenceDelay: 800,        // 0.8 seconds between jew and africa
        dropDuration: 1400,        // 1.4 second drop animation
        appearDelay: 400,          // Delay before character becomes visible (after starting to drop)
        characterSize: 200,        // Default size (will scale on mobile)
        mobileScale: 0.5,          // 50% size on mobile
        positions: {
            jew: 0.25,             // 25% from left
            africa: 0.75           // 75% from left
        }
    };

    function createCharacter(imagePath, characterType, delay) {
        setTimeout(() => {
            const character = document.createElement('div');
            character.className = `character character-${characterType}`;

            // Find the section divider and speech bubble
            const divider = document.querySelector('.section-divider');
            const speechBubble = document.querySelector('.speech-bubble');
            if (!divider || !speechBubble) {
                console.error('Section divider or speech bubble not found');
                return;
            }

            const dividerRect = divider.getBoundingClientRect();
            const bubbleRect = speechBubble.getBoundingClientRect();
            const screenWidth = window.innerWidth;
            const isMobile = screenWidth < 768;

            // Calculate size
            const size = isMobile ? config.characterSize * config.mobileScale : config.characterSize;

            // Calculate final position (above the black line)
            const xPosition = screenWidth * config.positions[characterType];
            const finalYPosition = dividerRect.top + window.pageYOffset - (size * 0.7);

            // Start position - BEHIND and ABOVE the speech bubble, completely hidden
            const startYPosition = bubbleRect.top + window.pageYOffset - (size * 1.5);

            // Set initial styles - starting behind and above the logo, invisible
            character.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${xPosition - (size / 2)}px;
                top: ${startYPosition}px;
                opacity: 0;
                z-index: 5;
                pointer-events: none;
                transition: top ${config.dropDuration}ms cubic-bezier(0.4, 0.0, 0.2, 1);
            `;

            // No flipping - PNGs are already in correct orientation

            // Create and add image
            const img = document.createElement('img');
            img.src = imagePath;
            img.style.cssText = `
                width: 100%;
                height: 100%;
                object-fit: contain;
            `;

            img.onload = () => {
                // Start the drop animation
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        character.style.top = `${finalYPosition}px`;
                    });
                });

                // Make character visible after it has cleared the logo
                setTimeout(() => {
                    character.style.opacity = '1';
                    character.style.zIndex = '50';
                }, config.appearDelay);
            };

            img.onerror = () => {
                console.error(`Failed to load image: ${imagePath}`);
                // Create placeholder if image fails
                character.style.background = 'linear-gradient(135deg, #FF6B6B, #4ECDC4)';
                character.style.borderRadius = '50%';
                character.style.opacity = '0.5';
            };
            
            character.appendChild(img);
            document.body.appendChild(character);

            console.log(`${characterType} character created at position ${xPosition}px`);
        }, delay);
    }

    function updateCharacterPositions() {
        const divider = document.querySelector('.section-divider');
        if (!divider) return;

        const dividerRect = divider.getBoundingClientRect();
        const screenWidth = window.innerWidth;
        const isMobile = screenWidth < 768;
        const size = isMobile ? config.characterSize * config.mobileScale : config.characterSize;

        document.querySelectorAll('.character').forEach(character => {
            const characterType = character.className.split('character-')[1];
            if (characterType && config.positions[characterType]) {
                const xPosition = screenWidth * config.positions[characterType];
                const yPosition = dividerRect.top + window.pageYOffset - (size * 0.7);
                
                character.style.width = `${size}px`;
                character.style.height = `${size}px`;
                character.style.left = `${xPosition - (size / 2)}px`;
                character.style.top = `${yPosition}px`;
            }
        });
    }

    function startSequence() {
        console.log('Starting character animation sequence');

        // Create characters with staggered delays - jew first, then africa
        createCharacter(characterImages.jew, 'jew', config.initialDelay);
        createCharacter(characterImages.africa, 'africa', config.initialDelay + config.sequenceDelay);
    }

    function init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', startSequence);
        } else {
            startSequence();
        }

        // Update positions on scroll and resize
        let scrollTimer;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(updateCharacterPositions, 100);
        });

        window.addEventListener('resize', () => {
            updateCharacterPositions();
        });
    }

    // Initialize
    init();

    // Expose API for testing
    window.CharacterAnimation = {
        config: config,
        restart: function() {
            // Remove existing characters
            document.querySelectorAll('.character').forEach(c => c.remove());
            // Restart sequence
            startSequence();
        },
        setDelay: function(initial, sequence) {
            config.initialDelay = initial;
            config.sequenceDelay = sequence;
            this.restart();
        },
        setSize: function(size) {
            config.characterSize = size;
            updateCharacterPositions();
        }
    };

})();