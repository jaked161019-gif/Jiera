import { db } from './firebase-init.js';

// Global scope for this file
let watchItems = [];
let unsubWatch = null;

export function bindWatchlistControls(currentUser, renderCallback) {
    document.getElementById('wl-type').onchange = function() {
        document.getElementById('wl-tv-fields').style.display = this.value === 'tv' ? 'flex' : 'none';
    };

    document.getElementById('wl-add-btn').onclick = () => {
        const title = document.getElementById('wl-title').value.trim();
        const type = document.getElementById('wl-type').value;
        const status = document.getElementById('wl-status').value;
        if (!title) return;

        const data = { 
            title, type, status, 
            createdBy: currentUser.uid, 
            createdAt: firebase.firestore.FieldValue.serverTimestamp() 
        };
        
        if (type === 'tv') {
            data.seasons = parseInt(document.getElementById('wl-seasons').value, 10) || null;
            data.episodesWatched = parseInt(document.getElementById('wl-eps-watched').value, 10) || 0;
            data.totalEpisodes = parseInt(document.getElementById('wl-eps-total').value, 10) || null;
        }

        db.collection('trackedItems').add(data)
            .then(() => { document.getElementById('wl-title').value = ''; })
            .catch(err => alert('Add failed: ' + err.message));
    };
}

export function listenToWatchItems(currentUser, renderCallback) {
    if (unsubWatch) unsubWatch();
    
    unsubWatch = db.collection('trackedItems')
        .orderBy('createdAt', 'desc')
        .onSnapshot(async snapshot => {
            watchItems = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            await Promise.all(watchItems.map(loadRatings));
            renderCallback(watchItems, currentUser);
        }, err => console.error('Firestore error:', err));
}

async function loadRatings(item) {
    const snap = await db.collection('trackedItems').doc(item.id).collection('ratings').get();
    item._ratings = snap.docs.map(d => d.data());
    const nums = item._ratings.map(r => r.rating);
    item._avg = nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : null;
}

export function renderWatchlist(items, currentUser) {
    const listEl = document.getElementById('wl-list');
    if (!listEl) return;

    // Filters & Sort (Assume these elements exist in your HTML)
    const filterStatus = document.getElementById('wl-filter-status').value;
    const filterType = document.getElementById('wl-filter-type').value;
    const sort = document.getElementById('wl-sort').value;

    let filteredItems = [...items];
    if (filterStatus !== 'all') filteredItems = filteredItems.filter(i => i.status === filterStatus);
    if (filterType !== 'all') filteredItems = filteredItems.filter(i => i.type === filterType);
    if (sort === 'alpha') filteredItems.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === 'rating') filteredItems.sort((a, b) => (b._avg || 0) - (a._avg || 0));

    listEl.innerHTML = filteredItems.length 
        ? filteredItems.map(item => itemCard(item, currentUser)).join('') 
        : '<p>Nothing here yet.</p>';
}

function itemCard(item, currentUser) {
    const canDelete = item.createdBy === currentUser.uid;
    // ... rest of your itemCard logic (using STATUS_COLOR/LABEL constants) ...
    return `<div class="wl-card">...</div>`; 
}

export function onDelete(itemId, createdBy, currentUser) {
    if (createdBy !== currentUser.uid) return;
    if (!confirm('Delete this item?')) return;
    db.collection('trackedItems').doc(itemId).delete();
}

export function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : str;
    return div.innerHTML;
}
