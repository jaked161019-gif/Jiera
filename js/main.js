import { auth } from './firebase-init.js';
import { initWindows, loadSettings } from './ui-manager.js';
import { bindWatchlistControls, listenToWatchItems, renderWatchlist } from './watchlist.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize UI first so buttons and windows exist
    initWindows();

    // 2. Handle Auth
    auth.onAuthStateChanged(user => {
        const signInBtn = document.getElementById('sign-in-btn');
        if (signInBtn) {
            signInBtn.textContent = user ? 'Sign Out (' + user.displayName + ')' : 'Sign In';
        }

        if (user) {
            loadSettings(user.uid);
            listenToWatchItems(user, (items) => renderWatchlist(items, user));
            bindWatchlistControls(user, (items) => renderWatchlist(items, user));
        }
    });
});
