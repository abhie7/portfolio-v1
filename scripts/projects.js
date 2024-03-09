import { mapClasses, previews } from './data.js';

document.addEventListener("DOMContentLoaded", function () {
    const container  = document.querySelector(".container");
    const previewBg = document.querySelector(".preview-bg");

    previewBg.style.backgroundImage = `url(../assets/img/default-img.jpg)`; // Set default background image or video

    const items = document.querySelectorAll(".item");
    let activePreview = document.querySelector(".preview.default");

    let isMouseOverItem = false;

    const defaultClipPaths = {
        "variant-1": "polygon(0% 100%, 100% 100%, 100% 100%, 0 100%)",
        "variant-2": "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)",
        "variant-3": "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
    };

    const variantTransforms = {
        "variant-1": {
            title: { x: 75, opacity: 0 },
            tags: { x: -75, opacity: 0 },
            description: { x: -75, opacity: 0 },
        },
        "variant-2": {
            title: { x: -75, opacity: 0 },
            tags: { x: -75, opacity: 0 },
            description: { x: 75, opacity: 0 },
        },
        "variant-3": {
            title: { x: 75, opacity: 0 },
            tags: { x: 75, opacity: 0 },
            description: { x: 75, opacity: 0 },
        },
    };

    function getDefaultClipPath(previewElement) {
        if (!previewElement) return ""; // Return empty string if previewElement is null
        for (const variant in defaultClipPaths) {
            if (previewElement.classList.contains(variant)) {
                return defaultClipPaths[variant];
            }
        }
        return "polygon(100% 0%, 0% 0%, 0% 100%, 100% 100%)";
    }

    function applyVariantStyles(previewElement) {
        const variant = previewElement.className
            .split(" ")
            .find((className) => className.startsWith("variant-"));
        if (variant && variantTransforms[variant]) {
            Object.entries(variantTransforms[variant]).forEach(
                ([elementClass, transform]) => {
                    const element = previewElement.querySelector(
                        `.preview-${elementClass}`
                    );
                    if (element) {
                        gsap.set(element, transform);
                    }
                }
            );
        }
    }

    function changeBg(bgSrc, cardSrc) {
        changeBackground(bgSrc);
        changePreviewImage(cardSrc);
    }

    function changeBackground(newBgSrc) {
        const newBg = document.createElement("video");
        newBg.src = newBgSrc;
        newBg.autoplay = true;
        newBg.loop = true;
        newBg.muted = true;
        newBg.style.position = "absolute";
        newBg.style.top = "0";
        newBg.style.left = "0";
        newBg.style.width = "100%";
        newBg.style.height = "100%";
        newBg.style.objectFit = "cover";
        newBg.style.opacity = "0";

        // Clear previous background images
        previewBg.innerHTML = '';
        previewBg.appendChild(newBg);

        // Fade old video out and new video in
        gsap.to(newBg, { opacity: 1, duration: 0.5 });
    }

    function changePreviewImage(previewImgSrc) {
        const previewImg = document.querySelector(".preview-img img");
        if (previewImg) {
            gsap.to(previewImg, {
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                    previewImg.src = previewImgSrc;
                    gsap.to(previewImg, { opacity: 1, duration: 0.5 });
                },
            });
        }
    }

    previews.forEach((preview, index) => {
        const previewElement = document.createElement("div");
        previewElement.className = `preview ${mapClasses[index]} preview-${index + 1}`;
        previewElement.innerHTML = `
            <div class="preview-img"><img src="${preview.card}" alt="Project Image"></div>
            <div class="preview-title"><h1>${preview.title}</h1></div>
            <div class="preview-tags"><p>${preview.tags}</p></div>
            <div class="preview-description"><p>${preview.description}</p></div>
        `;
        container.appendChild(previewElement);
        applyVariantStyles(previewElement);
    });

    items.forEach((item, index) => {
        item.addEventListener("mouseenter", () => {
            isMouseOverItem = true;
            const newActivePreview = document.querySelector(`.preview-${index + 1}`);
            if (newActivePreview && activePreview !== newActivePreview) {
                const newBg = previews[index].bg;
                const newPreviewImg = previews[index].card;
                changeBg(newBg, newPreviewImg);

                // Hide the previous active preview
                if (activePreview) {
                    gsap.to(activePreview, {
                        opacity: 0,
                        duration: 0.3,
                        delay: 0.2,
                    });
                    applyVariantStyles(activePreview, true);
                }

                // Show the new active preview
                gsap.to(newActivePreview, { opacity: 1, duration: 0.1 });
                activePreview = newActivePreview;
            }
        });

        item.addEventListener("mouseleave", () => {
            isMouseOverItem = false;
            setTimeout(() => {
                if (!isMouseOverItem) {
                    const defaultBg = `../assets/img/default-img.jpg`; // Default background image or video URL
                    changeBg(defaultBg);

                    // Hide the active preview
                    if (activePreview) {
                        gsap.to(activePreview, { opacity: 0, duration: 0.1 });
                        activePreview = null;
                    }
                }
            }, 10);
        });
    });
});
