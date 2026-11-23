function rotateProjectCards() {
    document.querySelectorAll('.pointer .project').forEach(card => {
        let scaleAnim = null;

        function getCurrentScale(el) {
            const m = getComputedStyle(el).transform.match(/matrix.*\((.+)\)/);
            return m ? parseFloat(m[1].split(',')[0]) : 1;
        }

        function animateScale(values) {
            if (scaleAnim) scaleAnim.cancel();
            scaleAnim = card.animate([
                { transform: `scale(${values[0]})` },
                { transform: `scale(${values[1]})`, offset: 0.5 },
                { transform: `scale(${values[2]})` }
            ], {
                duration: 800,
                easing: 'cubic-bezier(0.4,0.2,0.2,1)',
                fill: 'forwards'
            });
            scaleAnim.onfinish = () => {
                card.style.transform = `scale(${values[2]})`;
                scaleAnim = null;
            };
        }
        card.addEventListener('mouseenter', () => {
            animateScale([parseFloat(getComputedStyle(card).transform.match(/matrix.*\((.+)\)/)?.[1]?.split(',')[0]) || 1, 0.8, 1]);
        });
        card.addEventListener('mouseleave', () => {
            animateScale([parseFloat(getComputedStyle(card).transform.match(/matrix.*\((.+)\)/)?.[1]?.split(',')[0]) || 1, 0.8, 1]);
        });

    });

}
function adjustProjectHeights() {
    // Get all projects
    const projects = Array.from(document.querySelectorAll('.pointer .project'));
    if (projects.length === 0) return;

    // Reset heights first
    projects.forEach(card => card.style.height = '');

    // Get computed style for margin/gap
    const gap = parseInt(getComputedStyle(projects[0].parentElement).gap || 0, 10);

    // Group projects by top offset (i.e., by row)
    let rows = [];
    projects.forEach(card => {
        const top = card.getBoundingClientRect().top;
        let row = rows.find(r => Math.abs(r.top - top) < 2); // allow for subpixel differences
        if (!row) {
            row = { top, cards: [] };
            rows.push(row);
        }
        row.cards.push(card);
    });

    // For each row, set all cards to the max height of .front/.back
    rows.forEach(row => {
        let max = 0;
        row.cards.forEach(card => {
            const front = card.querySelector('.front');
            const back = card.querySelector('.back');
            // Temporarily set height to 'auto' to measure
            front.style.height = back.style.height = 'auto';
            max = Math.max(max, front.offsetHeight, back.offsetHeight);
        });
        row.cards.forEach(card => {
            card.style.height = max + 'px';
            card.querySelector('.front').style.height = max + 'px';
            card.querySelector('.back').style.height = max + 'px';
        });
    });
}


// Run on load and resize
window.addEventListener('DOMContentLoaded', rotateProjectCards);
window.addEventListener('resize', adjustProjectHeights);

// Optional: re-adjust after images load (for project logos)
window.addEventListener('load', adjustProjectHeights);
