"use client";

import UseAnimations from 'react-useanimations';
import facebook from 'react-useanimations/lib/facebook';
import twitter from 'react-useanimations/lib/twitter';
import instagram from 'react-useanimations/lib/instagram';
import styles from './socialmedya.module.css';
export default function SocialMedia() {
  return (
    <div className={styles.socialMedia}>
      <UseAnimations
        animation={facebook}
        size="100%"
        strokeColor='var(--shark-900)'
      />
      <UseAnimations
        animation={twitter}
        size="100%"
        strokeColor='var(--shark-900)'
      />
      <UseAnimations
        animation={instagram}
        size="100%"
        strokeColor='var(--shark-900)'
      />
    </div>
  )
}