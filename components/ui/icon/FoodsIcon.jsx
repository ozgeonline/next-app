import {
  ChefHat,
  Croissant,
  Hamburger,
  IceCreamCone,
  Martini,
  Vegan,
} from "lucide-react";
import styles from "./icon.module.css"

export default function FoodsIcon({stroke, className, width}) {
  return (
    <div className={styles.image} style={{width: width}}>
      <ChefHat stroke={stroke} className={className}/>
      <Croissant stroke={stroke} className={className}  />
      <Hamburger stroke={stroke} className={className}  />
      <IceCreamCone stroke={stroke} className={className}  />
      <Martini stroke={stroke} className={className}  />
      <Vegan stroke={stroke} className={className}  />
    </div>
  );
}