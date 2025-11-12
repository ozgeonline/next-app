export interface Cards {
  infoCard: { title: string; description: string };
  imgCard: {
    images: { src: string; alt: string };
    title: string;
    description: string;
  };
  link?: { href: string; text: string };
}