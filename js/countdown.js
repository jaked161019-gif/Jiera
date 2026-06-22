
import { db } from './firebase-init.js';

export function bindCountdownControls(currentUser, renderCallback) {
    document.getElementById('cd-add-btn').onclick = () => {
        const title = document.getElementById('cd-title').value;
        const targetDate = document.getElementById('cd-date').value;
        
        db.collection('userCountdowns').add({
            title, targetDate, userId: currentUser.uid
        });
    };
}

// Logic to calculate time difference
export function getDuration(targetDate) {
    const now = new Date();
    const target = new Date(targetDate);
    const diffMs = target - now; // Difference in milliseconds

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    return {
        total: { days: days % 365, hours: hours % 24, minutes: minutes % 60, seconds: seconds % 60 },
        decimal: {
            years: diffMs / (1000 * 60 * 60 * 24 * 365.25),
            months: diffMs / (1000 * 60 * 60 * 24 * 30.44),
            days: diffMs / (1000 * 60 * 60 * 24)
        }
    };
}
