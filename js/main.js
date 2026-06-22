import { auth } from './firebase-init.js';
import { initWindows, initControlPanel, loadSettings } from './ui-manager.js';
import { bindWatchlistControls, listenToWatchItems, renderWatchlist } from './watchlist.js';
import {bindCountdownControls, getDDuration} from './coountdown.js'
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize UI elements
    initWindows();
    initControlPanel();

    // 2. Auth Logic
    auth.onAuthStateChanged(user => {
        const signInBtn = document.getElementById('sign-in-btn');
        if (signInBtn) {
            signInBtn.textContent = user ? 'Sign Out' : 'Sign In';
            signInBtn.onclick = () => {
                if (user) auth.signOut();
                else auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
            };
        }

        if (user) {
            loadSettings(user.uid);
            listenToWatchItems(user, renderWatchlist);
            bindWatchlistControls(user, renderWatchlist);
        }
    });
});
