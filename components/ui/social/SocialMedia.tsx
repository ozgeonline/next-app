"use client";

import UseAnimations from 'react-useanimations';
import facebook from 'react-useanimations/lib/facebook';
import twitter from 'react-useanimations/lib/twitter';
import instagram from 'react-useanimations/lib/instagram';
import styles from './socialmedya.module.css';

interface SocialMediaProps {
  strokeColor?: string
}

export default function SocialMedia({ strokeColor }: SocialMediaProps) {
  return (
    <div className={styles.socialMedia}>
      <UseAnimations
        animation={facebook}
        size={30}
        strokeColor={strokeColor}
      />
      <UseAnimations
        animation={twitter}
        size={30}
        strokeColor={strokeColor}
      />
      <UseAnimations
        animation={instagram}
        size={30}
        strokeColor={strokeColor}
      />
    </div>
  )
}