import React from 'react';
import styles from '../LandingPage.module.css'; 

function LandingPage() {
    return (
        <div className={styles.landingPage}>
            <header className={styles.landingHeader}>
                <h1>Virtual Memorial World</h1>
            </header>

            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1>Create a lasting memory in a virtual world</h1>
                    <p>Welcome to a place where memories live on.</p>
                </div>
            </section>

            <div className={styles.separator}></div> {/* Separator */}

            <section className={styles.section}>
                <h2>About Our World</h2>
                <p>Our virtual memorial world allows you to create avatars for your deceased loved ones, and watch as the world progresses and new relationships form.</p>
            </section>

            <div className={styles.separator}></div> {/* Separator */}

            <section className={styles.section}>
                <h2>Features</h2>
                <div className={styles.feature}>Create and customize avatars</div>
                <div className={styles.feature}>Autonomous world progression</div>
                <div className={styles.feature}>Form new relationships and memories</div>
            </section>

            <div className={styles.separator}></div> {/* Separator */}

            <section className={styles.section}>
                <h2>What Our Users Say</h2>
                <div className={styles.testimonial}>"A beautiful way to keep my grandmother's memory alive." - Jane D.</div>
                <div className={styles.testimonial}>"This world brings me peace and comfort." - John S.</div>
            </section>

            <footer className={styles.landingFooter}>
                <p>&copy; 2024 Virtual Memorial World. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default LandingPage;