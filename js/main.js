import { auth } from './firebase-init.js';
import { initWindows, loadSettings } from './ui-manager.js';
import { bindWatchlistControls, listenToWatchItems, renderWatchlist } from './watchlist.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize UI
    initWindows();

    // 2. Handle Auth
    auth.onAuthStateChanged(user => {
        const signInBtn = document.getElementById('sign-in-btn');
        if (signInBtn) {
            signInBtn.textContent = user ? 'Sign Out (' + user.displayName + ')' : 'Sign In';
        }

        if (user) {
            loadSettings(user.uid);
            // Notice the parentheses and braces matching here:
            listenToWatchItems(user, (items) => renderWatchlist(items, user));
            bindWatchlistControls(user, (items) => renderWatchlist(items, user));
        } else {
            const listEl = document.getElementById('wl-list');
            if (listEl) listEl.innerHTML = '<p>Sign in to track shows.</p>';
        }
    }); // Closes auth.onAuthStateChanged
}); // Closes document.addEventListener
