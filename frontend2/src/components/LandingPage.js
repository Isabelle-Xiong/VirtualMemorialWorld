import React, { Suspense } from 'react';
import styles from '../LandingPage.module.css';
import EarthModel from './EarthModel';
import ButterflyModel from './ButterflyModel';
import Typing from 'react-typing-effect';

function LandingPage() {
    return (
        <div className={styles.landingPage}>
            <header className={styles.landingHeader}>
                <h1>Virtual Memorial World</h1>
            </header>

            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1>Create a lasting memory in a virtual world</h1>
                    <Typing
                        className={styles.typingText}
                        text="Welcome to a place where memories live on."
                        speed={50}
                        eraseDelay={1000}
                    />
                </div>
            </section>

            <section className={`${styles.section} ${styles.aboutSection}`}>
                <div className={styles.content}>
                    <div className={styles.text}>
                        <div className={styles.textContainer}>
                            <h2>About Our World</h2>
                            <p>Our virtual memorial world allows you to create avatars for your deceased loved ones, and watch as the world progresses and new relationships form.</p>
                        </div>
                    </div>
                    <div className={styles.model}>
                        <EarthModel />
                    </div>
                </div>
            </section>

            <section className={`${styles.section} ${styles.featuresSection}`}>
                <div className={styles.textContainer}>
                    <h2>Features</h2>
                    <div className={styles.feature}>Create and customize avatars</div>
                    <div className={styles.feature}>Autonomous world progression</div>
                    <div className={styles.feature}>Form new relationships and memories</div>
                </div>
            </section>

            <section className={`${styles.section} ${styles.testimonialSection}`}>
                <div className={styles.content}>
                    <div className={styles.textContainer}>
                        <h2>Reviews</h2>
                        <div className={styles.testimonial}>
                            "A beautiful way to keep my grandmother's memory alive."
                            <span className={styles.author}> - Jane D.</span>
                        </div>
                        <div className={styles.testimonial}>
                            "This world brings me peace and comfort."
                            <span className={styles.author}> - John S.</span>
                        </div>
                    </div>
                    <div className={styles.butterflyModelContainer}>
                        <Suspense fallback={<div>Loading...</div>}>
                            <ButterflyModel />
                        </Suspense>
                    </div>
                </div>
            </section>

            <footer className={styles.landingFooter}>
                <p>&copy; 2024 Virtual Memorial World. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default LandingPage;