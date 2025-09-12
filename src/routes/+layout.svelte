<script lang="ts">
    import { Toaster } from "svelte-hot-french-toast";
    import logo from "$lib/assets/LinkTreeLogo-02.png";
    import "./global.css";
    import Navbar from "../Navbar.svelte";
    import { page } from '$app/stores';
    import { onMount } from "svelte";
    
    // Include children for Svelte 5 render API (replaces deprecated <slot />)
    let { data, children } = $props();
    let loggedInAs = data.data.loggedInAs;
    let loggedIn = data.data.loggedIn;
    
    // Background particles
    let particles = [];
    let canvas;
    let ctx;
    let mouseX = 0;
    let mouseY = 0;
    let mouseRadius = 120; // Further reduced radius
    let mouseActive = false;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let animationFrameId;
    let particleCount = 200;
    
    // Define missing variables
    let isScrolling = false;
    let scrollTimeout;
    let fpsCheckInterval;
    let frameCount = 0;
    let lastFrameTime = 0;
    let lowPerformanceMode = false;

    onMount(() => {
        
        // // Initialize background particles if supported
        // if (typeof window !== 'undefined') {
        //     canvas = document.getElementById('background-canvas');
        //     if (canvas) {
        //         ctx = canvas.getContext('2d');
                
        //         initCanvas();
        //         createParticles();
                
        //         if (!lowPerformanceMode) {
        //             animateParticles();
        //         } else {
        //             // For low performance devices, just draw static particles once
        //             drawStaticParticles();
        //         }
                
        //         // Passive event listeners improve scroll performance
        //         window.addEventListener('mousemove', handleMouseMove, { passive: true });
        //         window.addEventListener('scroll', handleScroll, { passive: true });
        //         canvas.addEventListener('mouseenter', () => mouseActive = true);
        //         canvas.addEventListener('mouseleave', () => mouseActive = false);
                
        //         // Clean up all event listeners and timers on unmount
        //         return () => {
        //             window.removeEventListener('mousemove', handleMouseMove);
        //             window.removeEventListener('scroll', handleScroll);
        //             if (animationFrameId) {
        //                 cancelAnimationFrame(animationFrameId);
        //             }
        //             if (fpsCheckInterval) {
        //                 clearInterval(fpsCheckInterval);
        //             }
        //             if (scrollTimeout) {
        //                 clearTimeout(scrollTimeout);
        //             }
        //         };
        //     }
        // }

        // Search bar enhancement
        const searchInputs = document.querySelectorAll('input[type="search"]');
        searchInputs.forEach(input => {
            if (!input.parentElement.classList.contains('custom-search-container')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'custom-search-container';
                
                const underline = document.createElement('div');
                underline.className = 'search-underline';
                
                input.parentNode.insertBefore(wrapper, input);
                wrapper.appendChild(input);
                wrapper.appendChild(underline);
                
                input.classList.add('custom-search-input');
            }
        });
    });

    // Handle scrolling - pause animations during scroll
    function handleScroll() {
        if (!isScrolling) {
            isScrolling = true;
            
            // If we're already in low performance mode, don't bother with animations
            if (!lowPerformanceMode && animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
        }
        
        // Clear previous timeout
        if (scrollTimeout) clearTimeout(scrollTimeout);
        
        // Reset the scroll state after scrolling stops
        scrollTimeout = setTimeout(() => {
            isScrolling = false;
            
            // Resume animation if not in low performance mode
            if (!lowPerformanceMode && !animationFrameId) {
                animateParticles();
            }
        }, 200); // Wait 200ms after scroll ends before resuming
    }

    // Detect performance capability and adjust settings accordingly
    function detectPerformance() {
        // Start with performance monitoring
        fpsCheckInterval = setInterval(() => {
            if (frameCount < 25) { // If fewer than 25fps
                if (!lowPerformanceMode) {
                    lowPerformanceMode = true;
                    console.log('Switching to low performance mode');
                    
                    // Cancel animation loop and just draw static particles
                    if (animationFrameId) {
                        cancelAnimationFrame(animationFrameId);
                        animationFrameId = null;
                    }
                    
                    createParticles(); // Recreate particles with reduced count
                    drawStaticParticles(); // Draw static particles once
                }
            }
            frameCount = 0;
        }, 1000);
    }

    function handleMouseMove(e) {
        // Skip mouse move handling during scroll for better performance
        if (isScrolling) return;
        
        lastMouseX = mouseX;
        lastMouseY = mouseY;
        mouseX = e.clientX;
        mouseY = e.clientY;
        mouseActive = true;
    }

    function initCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Use efficient event listener for resize
        const resizeObserver = new ResizeObserver(entries => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
            // If in low performance mode, just redraw static particles
            if (lowPerformanceMode) {
                createParticles();
                drawStaticParticles();
            } else {
                createParticles();
            }
        });
        
        resizeObserver.observe(document.body);
    }
    
    function createParticles() {
        particles = [];
        // Even further reduced particle count
        particleCount = lowPerformanceMode ? 
            Math.min(30, Math.floor(window.innerWidth / 150)) : // Very few particles in low performance mode
            Math.min(80, Math.floor(window.innerWidth / 50));   // Limited maximum particles
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.2 + 0.3, // Smaller particles
                color: `rgba(0, 195, 255, ${Math.random() * 0.2 + 0.05})`, // More transparent
                baseSpeedX: Math.random() * 0.15 - 0.075, // Even slower
                baseSpeedY: Math.random() * 0.15 - 0.075,
                speedX: Math.random() * 0.15 - 0.075,
                speedY: Math.random() * 0.15 - 0.075
            });
        }
    }
    
    // Draw static particles for low performance mode
    function drawStaticParticles() {
        if (!ctx) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();
        });
        
        // Draw a few static connections for visuals
        if (particles.length > 10) {
            for (let i = 0; i < Math.min(15, particles.length); i++) {
                const p1 = particles[i];
                const p2 = particles[(i + 5) % particles.length];
                
                const distance = Math.hypot(p1.x - p2.x, p1.y - p2.y);
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(0, 195, 255, ${0.05 * (1 - distance / 100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }
    
    function animateParticles() {
        const now = performance.now();
        frameCount++;
        
        // Skip frame if scrolling
        if (isScrolling) {
            animationFrameId = requestAnimationFrame(animateParticles);
            return;
        }
        
        // Lower frame rate for better performance (aim for 30fps in normal mode)
        if (now - lastFrameTime > 33 || !lowPerformanceMode) {
            lastFrameTime = now;
            
            if (!ctx) return;
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw particles with minimal operations
            particles.forEach(particle => {
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.fill();
                
                // Extremely simplified motion logic
                if (mouseActive) {
                    const dx = mouseX - particle.x;
                    const dy = mouseY - particle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < mouseRadius && distance > 5) {
                        const angle = Math.atan2(dy, dx);
                        const force = (mouseRadius - distance) / mouseRadius * 0.7; // Reduced force
                        
                        // Super simplified orbital motion
                        const perpX = Math.cos(angle + Math.PI/2);
                        const perpY = Math.sin(angle + Math.PI/2);
                        
                        particle.speedX = perpX * force * 0.8 + particle.baseSpeedX * (1 - force);
                        particle.speedY = perpY * force * 0.8 + particle.baseSpeedY * (1 - force);
                    } else {
                        particle.speedX = particle.baseSpeedX;
                        particle.speedY = particle.baseSpeedY;
                    }
                } else {
                    particle.speedX = particle.baseSpeedX;
                    particle.speedY = particle.baseSpeedY;
                }
                
                // Update position
                particle.x += particle.speedX;
                particle.y += particle.speedY;
                
                // Wrap around screen
                if (particle.x < 0) particle.x = canvas.width;
                if (particle.x > canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = canvas.height;
                if (particle.y > canvas.height) particle.y = 0;
            });
            
            // Only draw connections for particles near cursor and only if mouse is active
            if (mouseActive) {
                // Extremely limited connections - only close to cursor
                const nearCursorParticles = particles.filter(p => {
                    const dx = mouseX - p.x;
                    const dy = mouseY - p.y;
                    return Math.sqrt(dx * dx + dy * dy) < mouseRadius;
                }).slice(0, 10); // Only use at most 10 particles
                
                // Draw minimal connections
                nearCursorParticles.forEach((p1, i) => {
                    for (let j = i + 1; j < Math.min(nearCursorParticles.length, i + 3); j++) { // Max 2 connections per particle
                        const p2 = nearCursorParticles[j];
                        const distance = Math.hypot(p1.x - p2.x, p1.y - p2.y);
                        if (distance < 60) { // Very short connections
                            ctx.beginPath();
                            ctx.moveTo(p1.x, p1.y);
                            ctx.lineTo(p2.x, p2.y);
                            ctx.strokeStyle = `rgba(0, 195, 255, ${0.05 * (1 - distance / 60)})`;
                            ctx.lineWidth = 0.5;
                            ctx.stroke();
                        }
                    }
                });
            }
        }
        
        animationFrameId = requestAnimationFrame(animateParticles);
    }

    function search(event) {
        if (event.key === "Enter") {
            window.location.href = `/search/${event.target.value}`;
        }
    }
</script>

<!-- <canvas id="background-canvas" class="background-effect"></canvas> -->

<div class="app-container">
    <Navbar loggedIn={loggedIn} loggedInAs={loggedInAs} />

    <div class="children">
        {#if children}
            {@render children()}
        {/if}
    </div>
</div>

<Toaster />

<style>
    .app-container {
        width: 100%;
        height: 100%;
        position: relative;
        z-index: 1;
    }

    :global(html),
    :global(body) {
        margin: 0;
        width: 100%;
        height: 100%;
        overflow-x: hidden;
        overscroll-behavior-y: none;
        background: var(--bg-primary) !important;
        color: var(--text-secondary);
    }

    /* Remove legacy gradient and shimmer overrides */
    :global(.route-content::before),
    :global(main::before),
    :global(.container::before),
    :global(.page-container::before) {
        content: none !important;
    }

    :global(.route-content),
    :global(main),
    :global(.container),
    :global(.page-container) {
        background: transparent !important;
        position: relative;
        z-index: 2;
        min-height: 80vh;
    }

    /* Scrollbar in dark theme */
    :global(::-webkit-scrollbar) { width: 8px; }
    :global(::-webkit-scrollbar-track) { background: var(--bg-secondary); }
    :global(::-webkit-scrollbar-thumb) { background: var(--primary); border-radius: 4px; }
    :global(::-webkit-scrollbar-thumb:hover) { background: var(--primary-light); }
</style>
