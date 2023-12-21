import Logo from '../../assets/logo.png';
import ImgTodo from '../../assets/imgTodo.png';

import styles from './Header.module.css';
import '../../global.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <img src={Logo} alt='logo'/>
      <img src={ImgTodo} alt='imgTodo'/>
    </header>
  )
}