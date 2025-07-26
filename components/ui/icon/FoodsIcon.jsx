import {
  ChefHat,
  Croissant,
  Hamburger,
  IceCreamCone,
  Martini,
  Vegan,
} from "lucide-react";
import styles from "./icon.module.css"

export default function FoodsIcon({stroke, className, style}) {
  return (
    <div className={styles.image}>
      <ChefHat stroke={stroke} className={className} style={style}/>
      <Croissant stroke={stroke} className={className}  style={style} />
      <Hamburger stroke={stroke} className={className}  style={style} />
      <IceCreamCone stroke={stroke} className={className}  style={style} />
      <Martini stroke={stroke} className={className}  style={style} />
      <Vegan stroke={stroke} className={className}  style={style} />
    </div>
  );
}