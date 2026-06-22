import { auth } from './firebase-init.js';
import { initWindows, loadSettings } from './ui-manager.js';
import { bindWatchlistControls, listenToWatchItems, renderWatchlist } from './watchlist.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize UI elements
    initWindows();

    // Handle Authentication
    auth.onAuthStateChanged(user => {
        const signInBtn = document.getElementById('sign-in-btn');
        if (signInBtn) {
            signInBtn.textContent = user ? 'Sign Out (' + user.displayName + ')' : 'Sign In';
        }

        if (user) {
            loadSettings(user.uid);
            // These calls pass the user and the render function to your logic files
            listenToWatchItems(user, renderWatchlist);
            bindWatchlistControls(user, renderWatchlist);
        } else {
            const listEl = document.getElementById('wl-list');
            if (listEl) {
                listEl.innerHTML = '<p>Sign in to track shows and movies.</p>';
            }
        }
    });
});
