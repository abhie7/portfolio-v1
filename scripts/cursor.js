var cursor = document.createElement('div');
cursor.classList.add('cursor');

document.body.appendChild(cursor);

cursorScale = gsap.to(cursor, {
    scale: 0.5,
    duration: 0.5,
    paused: true
});

var mouse = { x: 0, y: 0 }

gsap.to({}, 0.05, {
    repeat: -1,
    onRepeat: function() {
        gsap.set(cursor, {
            x: mouse.x,
            y: mouse.y,
            duration: 0.4,
        })
    }
});

window.addEventListener("mousemove", function(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});



