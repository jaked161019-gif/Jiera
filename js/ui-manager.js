import { db } from './firebase-init.js'; // Import the db

// You need to pass currentUser into these functions from main.js 
// because ui-manager doesn't know who the user is by default.


export function initControlPanel() {
    const root = document.documentElement;
    const bgPicker = document.getElementById('bg-picker');
    const shadowRange = document.getElementById('shadow-range');
    const roundRange = document.getElementById('round-range');
    const blurRange = document.getElementById('blur-range');

    const updateUI = () => {
        root.style.setProperty('--bg-color', bgPicker.value + '80');
        root.style.setProperty('--shadow-size', shadowRange.value + 'px');
        root.style.setProperty('--corner-radius', roundRange.value + 'px');
        root.style.setProperty('--blur-amount', blurRange.value + 'px');
    };

    // Attach listeners
    [bgPicker, shadowRange, roundRange, blurRange].forEach(el => {
        if (el) el.addEventListener('input', updateUI);
    });
}

export function initWindows() {
    // 1. Dragging Logic
    document.querySelectorAll('.window').forEach(win => {
        const header = win.querySelector('.window-header');
        header.onmousedown = (e) => {
            let shiftX = e.clientX - win.getBoundingClientRect().left;
            let shiftY = e.clientY - win.getBoundingClientRect().top;
            function moveAt(px, py) { win.style.left = px - shiftX + 'px'; win.style.top = py - shiftY + 'px'; }
            function onMove(e) { moveAt(e.pageX, e.pageY); }
            document.addEventListener('mousemove', onMove);
            document.onmouseup = () => document.removeEventListener('mousemove', onMove);
        };
    });

    // 2. Resizing Logic
    document.querySelectorAll('.window').forEach(win => {
        const r = document.createElement('div');
        r.style.cssText = 'width:10px;height:10px;background:transparent;position:absolute;right:0;bottom:0;cursor:se-resize;';
        win.appendChild(r);
        r.onmousedown = (e) => {
            e.preventDefault();
            let sx = e.clientX, sy = e.clientY;
            let sw = parseInt(getComputedStyle(win).width, 10);
            let sh = parseInt(getComputedStyle(win).height, 10);
            function doDrag(e) { win.style.width = (sw + e.clientX - sx) + 'px'; win.style.height = (sh + e.clientY - sy) + 'px'; }
            function stopDrag() { document.documentElement.removeEventListener('mousemove', doDrag); document.documentElement.removeEventListener('mouseup', stopDrag); }
            document.documentElement.addEventListener('mousemove', doDrag);
            document.documentElement.addEventListener('mouseup', stopDrag);
        };
    });

    // 3. Setup Button Grid
    const buttonGrid = document.createElement('div');
    buttonGrid.className = 'button-grid';
    const windowTitles = ['Resturant Tool','Weather Tool','Outfit Picker','Watch List Tracker','Countdown Timer','Link Tool','Idea Lab','Throwaway Email Creator','Colour Palette','Control Panel'];
    
    // Inside your button loop in ui-manager.js:
windowTitles.forEach(title => {
    const btn = document.createElement('button');
    btn.textContent = title;
    btn.onclick = () => {
        const win = Array.from(document.querySelectorAll('.window')).find(w => 
            w.querySelector('.window-header').textContent === title
        );
        
        // This 'if' prevents the crash if the window isn't found
        if (win) {
            win.style.display = win.style.display === 'none' ? 'block' : 'none';
        } else {
            console.warn("Window not found:", title);
        }
    };
    buttonGrid.appendChild(btn);
});

    document.body.appendChild(buttonGrid);

    // Initial window state
    document.querySelectorAll('.window').forEach(win => { 
        win.style.left = '50px'; win.style.top = '50px'; win.style.display = 'none'; 
        win.addEventListener('mousedown', () => {
            document.querySelectorAll('.window').forEach(w => w.style.zIndex = '10');
            win.style.zIndex = '20';
        });
    });
}

export function applySettings(data) {
    const root = document.documentElement;
    const bgPicker = document.getElementById('bg-picker');
    const shadowRange = document.getElementById('shadow-range');
    const roundRange = document.getElementById('round-range');
    const blurRange = document.getElementById('blur-range');

    bgPicker.value = data.bgColor; shadowRange.value = data.shadow;
    roundRange.value = data.roundness; blurRange.value = data.blur;
    
    root.style.setProperty('--bg-color', data.bgColor + '80');
    root.style.setProperty('--shadow-size', data.shadow + 'px');
    root.style.setProperty('--corner-radius', data.roundness + 'px');
    root.style.setProperty('--blur-amount', data.blur + 'px');
}

export function loadSettings(uid) {
    if (!uid) return;
    db.collection('userSettings').doc(uid).get()
        .then(doc => { if (doc.exists) applySettings(doc.data()); })
        .catch(err => console.error('Load settings failed:', err));
}
