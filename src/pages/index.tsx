import Image from 'next/image'
import styles from '../styles/home.module.css'
import heroImg from '../../public/assets/hero.png'
import Head from 'next/head'
import { GetStaticProps } from 'next'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../services/firebase.connection'

interface HomeProps {
  posts: string,
  comentarios: string
}

export default function Home({posts, comentarios}:HomeProps) {
  return (
    <div className={styles.container}>
      <Head>
        <title> Tarefas + </title>
      </Head>

      <main className={styles.main}>
        <div className={styles.imgContainer}>
          <Image className={styles.img} alt='Logo' src={heroImg} />
        </div>
        <h1 className={styles.title}>
          Sistema para organizar suas tarefas
        </h1>
        <div className={styles.infoContent}>
          <section className={styles.box}>
            <span> + {posts} Posts </span>
          </section>
          <section className={styles.box}>
            <span> + {comentarios} Comentários </span>
          </section>
        </div>
      </main>
    </div>
  )
}


export const getStaticProps: GetStaticProps = async () => {
  const comentariosRef = collection(db, "comentarios")
  const postsRef = collection(db, "tarefas")

  const comentarioSnapshot = await getDocs(comentariosRef)
  const postsSnapshot = await getDocs(postsRef)

  return {
    props: {
      posts: postsSnapshot.size || 0,
      comentarios: comentarioSnapshot.size || 0
    }, 
    revalidate: 60,
  }
}