// Add event listeners to the navbar links to scroll to the sections
document.querySelectorAll('nav a').forEach(el => {
    el.addEventListener('click', e => {
        e.preventDefault();
        document.querySelector(el.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const typedOutput = document.getElementById('typed-output');
    const cursorElement = document.getElementById('cursor');
    const typewriterApp = document.getElementById('typewriter-app');

    // Configuration for the typewriter effect
    const config = {
        text: ["UI/UX Designer", "Front-End Engineer"],
        typingSpeed: 80,
        deletingSpeed: 40,
        pauseDuration: 1500,
        loop: true,
        showCursor: true,
        hideCursorWhileTyping: false,
        cursorCharacter: "|",
        cursorBlinkDuration: 0.5,
        textColors: ["#60A5FA", "orange"],
        variableSpeed: { min: 40, max: 120 },
        startOnVisible: true, // Start animation when component is visible
        reverseMode: false, // Type in reverse (deleting initially)
    };

    let displayedText = "";
    let currentCharIndex = 0;
    let isDeleting = false;
    let currentTextIndex = 0;
    let isVisible = !config.startOnVisible;
    let timeoutId;

    // Function to get a random typing speed if variableSpeed is enabled
    const getRandomSpeed = () => {
        if (!config.variableSpeed) return config.typingSpeed;
        const { min, max } = config.variableSpeed;
        return Math.random() * (max - min) + min;
    };

    // Function to set the current text color
    const setCurrentTextColor = () => {
        const color = config.textColors[currentTextIndex % config.textColors.length] || '#ffffff';
        typedOutput.style.color = color;
        cursorElement.style.color = color; // Cursor color matches text
    };

    // Function to update the displayed text and cursor visibility
    const updateDisplay = () => {
        typedOutput.textContent = displayedText;

        // Handle cursor visibility while typing/deleting
        if (config.showCursor && cursorElement) {
            const shouldHide = config.hideCursorWhileTyping &&
                (currentCharIndex < config.text[currentTextIndex].length || isDeleting);
            cursorElement.classList.toggle('typewriter-cursor--hidden', shouldHide);
        }
    };

    // Main typing/deleting animation logic
    const executeTypingAnimation = () => {
        clearTimeout(timeoutId); // Clear any existing timeout

        const currentPhrase = config.text[currentTextIndex];
        const processedPhrase = config.reverseMode
            ? currentPhrase.split("").reverse().join("")
            : currentPhrase;

        setCurrentTextColor(); // Update text color for the current phrase

        if (isDeleting) {
            // Deleting phase
            if (displayedText.length > 0) {
                displayedText = processedPhrase.substring(0, displayedText.length - 1);
                updateDisplay();
                timeoutId = setTimeout(executeTypingAnimation, config.deletingSpeed);
            } else {
                // Finished deleting
                isDeleting = false;
                if (config.loop || currentTextIndex < config.text.length - 1) {
                    // Move to the next text in the array
                    currentTextIndex = (currentTextIndex + 1) % config.text.length;
                    currentCharIndex = 0; // Reset character index for the new text
                    timeoutId = setTimeout(executeTypingAnimation, config.pauseDuration); // Pause before typing next
                } else {
                    // If not looping and it's the last text, stop
                    if (config.showCursor && cursorElement) {
                        // Stop cursor blinking after animation finishes
                        if (window.gsap) {
                            window.gsap.killTweensOf(cursorElement);
                            window.gsap.set(cursorElement, { opacity: 1 }); // Keep it visible at the end
                        }
                    }
                }
            }
        } else {
            // Typing phase
            if (currentCharIndex < processedPhrase.length) {
                displayedText = processedPhrase.substring(0, currentCharIndex + 1);
                updateDisplay();
                currentCharIndex++;
                const speed = config.variableSpeed ? getRandomSpeed() : config.typingSpeed;
                timeoutId = setTimeout(executeTypingAnimation, speed);
            } else {
                // Finished typing current text
                if (config.text.length > 1 || config.loop) {
                    isDeleting = true; // Start deleting
                    timeoutId = setTimeout(executeTypingAnimation, config.pauseDuration);
                } else {
                    // If only one text and not looping, stop cursor blinking
                    if (config.showCursor && cursorElement) {
                        if (window.gsap) {
                            window.gsap.killTweensOf(cursorElement);
                            window.gsap.set(cursorElement, { opacity: 1 });
                        }
                    }
                }
            }
        }
    };

    // Intersection Observer to start animation when visible
    if (config.startOnVisible) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !isVisible) {
                        isVisible = true;
                        timeoutId = setTimeout(executeTypingAnimation, config.initialDelay);
                        observer.disconnect(); // Disconnect once visible
                    }
                });
            },
            { threshold: 0.1 }
        );
        observer.observe(typewriterApp);
    } else {
        // If not starting on visible, start immediately after initial delay
        isVisible = true;
        timeoutId = setTimeout(executeTypingAnimation, config.initialDelay);
    }

    // GSAP for cursor blinking (if showCursor is true)
    if (config.showCursor && cursorElement && typeof window.gsap !== 'undefined') {
        window.gsap.set(cursorElement, { opacity: 1 }); // Ensure cursor is visible initially
        window.gsap.to(cursorElement, {
            opacity: 0,
            duration: config.cursorBlinkDuration,
            repeat: -1,
            yoyo: true,
            ease: "power2.inOut",
        });
    } else if (config.showCursor && cursorElement) {
        // Fallback CSS animation for cursor if GSAP is not available
        cursorElement.style.animation = `blink-caret ${config.cursorBlinkDuration}s step-end infinite`;
    }
});


const icons = document.querySelectorAll('.icon');
const descriptions = {
    'css': 'I use CSS for styling and layout. I create responsive and accessible designs.',
    'figma': 'I use Figma for designing UI/UX experiences. I create prototypes and high-fidelity designs for web and mobile applications.',
    'html': 'I use HTML for structuring and organizing content. I create semantic and accessible HTML.',
    'photoshop': 'I use Photoshop for creating visual elements. I create logos, icons, and other visual elements for web and mobile applications.',
    'js': 'I use JavaScript for adding interactivity and functionality. I create dynamic and responsive web applications.',
    'github': 'I use GitHub for version control. I collaborate with other developers and manage different versions of my code.',
    'illustrator': 'I use Illustrator for vector design. I create logos, illustrations, and scalable graphics.',
};

icons.forEach(icon => {
    icon.addEventListener('click', function () {
        const description = document.querySelector('.skills-description');
        const iconClass = [...this.classList].find(cls => descriptions.hasOwnProperty(cls));
        description.textContent = descriptions[iconClass] || 'Description not found.';
        description.style.display = "block";
    });
});
