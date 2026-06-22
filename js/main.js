import { auth } from './firebase-init.js';
import { initWindows } from './ui-manager.js';

document.addEventListener('DOMContentLoaded', () => {
    // Everything that interacts with HTML goes here
    initWindows();

    auth.onAuthStateChanged(user => {
        const signInBtn = document.getElementById('sign-in-btn');
        // Check if it exists before setting textContent
        if (signInBtn) {
            signInBtn.textContent = user ? 'Sign Out (' + user.displayName + ')' : 'Sign In';
        }
        
        if (user) {
            // ... your other init logic ...
        // Initialize user-specific tools
        loadSettings(user.uid);
        bindWatchlistControls(user, (items) => renderWatchlist(items, user));
        listenToWatchItems(user, (items) => renderWatchlist(items, user));
        bindCountdownControls(user, renderCountdowns);
    } else {
        // Clear Watchlist UI if logged out
        const listEl = document.getElementById('wl-list');
        if (listEl) listEl.innerHTML = '<p>Sign in to track shows.</p>';
    }
        }
    });
});
