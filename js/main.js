
import { auth } from './firebase-init.js';
import { initWindows, loadSettings } from './ui-manager.js';
import { bindWatchlistControls, listenToWatchItems, renderWatchlist } from './watchlist.js';

// 1. Initialize Window Behavior
initWindows();

// 2. Handle Authentication and Data Loading
auth.onAuthStateChanged(user => {
    const signInBtn = document.getElementById('sign-in-btn');
    signInBtn.textContent = user ? 'Sign Out' : 'Sign In';

    if (user) {
        // Initialize user-specific tools
        loadSettings(user.uid);
        bindWatchlistControls(user, (items) => renderWatchlist(items, user));
        listenToWatchItems(user, (items) => renderWatchlist(items, user));
    } else {
        // Clear Watchlist UI if logged out
        const listEl = document.getElementById('wl-list');
        if (listEl) listEl.innerHTML = '<p>Sign in to track shows.</p>';
    }
});
