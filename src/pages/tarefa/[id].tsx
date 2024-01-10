import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/src/services/firebase.connection'

import styles from './styles.module.css'

import TextArea from '@/src/components/textarea'

import { getSession, useSession } from 'next-auth/react'
import { ChangeEvent, ComponentProps, FormEvent, startTransition, useState } from 'react'
import { FaTrash } from 'react-icons/fa'

interface TarefaProps {
  tarefa: {
    tarefa: string,
    data_criacao: Date,
    usuario: string,
    email: string,
    idTarefa: string,
  },
  listaComentarios: ComentarioProps[]
}

interface ComentarioProps {
  id: string,
  comentario: string,
  data_criacao: string,
  idTarefa: string,
  usuario: string,
  email: string
}

export default function Tarefa({ tarefa, listaComentarios }: TarefaProps) {
  const [comentario, setComentario] = useState("")
  const [comentarios, setComentarios] = useState<ComentarioProps[]>(listaComentarios || [])
  const { data: session } = useSession()

  async function handleEnviarComentario(e: FormEvent) {
    e.preventDefault();

    if (comentario === "") return

    if (!session?.user?.email || !session?.user?.name) return

    try {
      const comentarioRef = await addDoc(collection(db, "comentarios"), {
        comentario: comentario,
        data_criacao: new Date(),
        usuario: session?.user?.name,
        email: session?.user?.email,
        idTarefa: tarefa?.idTarefa,
      })

      const data: ComentarioProps = {
        id: comentarioRef.id,
        data_criacao: new Date().toDateString(),
        comentario: comentario,
        usuario: session.user.name,
        email: session.user.email,
        idTarefa: tarefa.idTarefa
      }

      setComentarios((comentariosAntigos) => [...comentariosAntigos, data])
    } catch (error) {
      alert("Ocorreu um erro ao enviar o comentário:" + error)
    }
  }

  async function handleDeletarComentaio(id: string) {
    try {
      const docRef = doc(db, "comentarios", id)
      await deleteDoc(docRef)

      const comentariosRestantes = comentarios.filter(c=> c.id !== id)
      setComentarios(comentariosRestantes)
    } catch (error) {
      alert(error)
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title> Detalhes da tarefa </title>
      </Head>

      <main className={styles.main}>
        <h1> Tarefa </h1>

        <article className={styles.tarefa}>
          <p>
            {tarefa.tarefa}
          </p>
        </article>
      </main>

      <section className={styles.comentario}>
        <h2> Deixar comentário </h2>
        <form onSubmit={handleEnviarComentario}>
          <TextArea
            placeholder='Digite seu comentário...'
            value={comentario}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setComentario(e.target.value)} />
          <button
            className={styles.button}
            disabled={!session?.user}
          > Enviar comentario
          </button>
        </form>
      </section>

      <section className={styles.comentario}>
        <h2> Todos os comentários </h2>
        {comentarios.length === 0 && (
          <span> Sem comentários ...</span>
        )}

        {comentarios.map((comentario: ComentarioProps) => (
          <article
            key={comentario.id}
            className={styles.comentario}>
            <div className={styles.headComentario}>
              <label className={styles.identificacaoComentario}>
                {comentario.usuario}
              </label>
              <span className={styles.dataPostagem}>
                {comentario.data_criacao}
              </span>
              {comentario.usuario === session?.user?.name && (
                <button
                  className={styles.buttonDeletar}
                  onClick={() => handleDeletarComentaio(comentario.id)}>
                  <FaTrash size={18} color="#EA3140" />
                </button>
              )}
            </div>
            <p> {comentario.comentario}</p>
          </article>
        ))}
      </section>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params, req }) => {
  const id = params?.id as string;
  const docRef = doc(db, "tarefas", id);
  const snapshotTarefas = await getDoc(docRef)
  const session = await getSession({ req });

  const q = query(collection(db, "comentarios"), where("idTarefa", "==", id))
  const snapshotComentarios = await getDocs(q)

  let listaComentarios: ComentarioProps[] = []

  snapshotComentarios.forEach((doc) => {
    const milisegundosComentarios = doc.data()?.data_criacao?.seconds * 1000
    listaComentarios.push({
      id: doc.id,
      comentario: doc.data().comentario,
      idTarefa: doc.data().idTarefa,
      data_criacao: new Date(milisegundosComentarios).toLocaleDateString(),
      usuario: doc.data().usuario,
      email: doc.data().email
    })
  })

  if (!session?.user) {
    //se não tem usuario logado redireciona para Home
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    }
  }

  if (snapshotTarefas.data() === undefined) {
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    }
  }


  if (!snapshotTarefas.data()?.tarefaPublica) {
    return {
      props: {
        destination: "/",
        permanent: false
      }
    }
  }

  const milisegundosTarefas = snapshotTarefas.data()?.data_criacao?.seconds * 1000

  const tarefa = {
    tarefa: snapshotTarefas.data()?.tarefa,
    tarefaPuplica: snapshotTarefas.data()?.tarefaPublica,
    data_criacao: new Date(milisegundosTarefas).toLocaleDateString(),
    usuario: snapshotTarefas.data()?.usuario,
    idTarefa: id,
  }


  return {
    props: {
      tarefa: tarefa,
      listaComentarios: listaComentarios
    }
  }
}