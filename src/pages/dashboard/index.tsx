import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

import Head from 'next/head';
import TextArea from '@/src/components/textarea';

import { FiShare2 } from 'react-icons/fi';
import { FaTrash } from 'react-icons/fa';

import styles from './styles.module.css';

import { db } from '@/src/services/firebase.connection';

import { addDoc, collection, query, orderBy, where, onSnapshot, limit, doc, deleteDoc } from 'firebase/firestore';
import Link from 'next/link';

interface DashboardProps {
  usuario: {
    email: string,
    nome: string
  }
}

export interface TarefaProps {
  id: string,
  data_criacao: Date,
  tarefaPublica: boolean,
  tarefa: string,
  usuario: string
}

export default function Dashboard({ usuario }: DashboardProps) {
  const [input, setInput] = useState("")
  const [tarefaPublica, setTarefaPublica] = useState(false)
  const [tarefas, setTarefas] = useState<TarefaProps[]>([])

  useEffect(() => {
    async function carregarTarefas() {
      const tarefasRef = collection(db, "tarefas")
      const q = query(
        tarefasRef,
        orderBy("data_criacao", "desc"),
        where("usuario", "==", usuario.email)
      )

      onSnapshot(q, s => {
        let lista = [] as TarefaProps[]

        s.forEach(doc => {
          lista.push({
            id: doc.id,
            tarefa: doc.data().tarefa,
            data_criacao: doc.data().data_criacao,
            usuario: doc.data().usuario,
            tarefaPublica: doc.data().tarefaPublica
          })
        });

        if (lista.length > 0) setTarefas(lista)
      })
    }

    carregarTarefas()
  }, [usuario.email])

  function handleTarefaPublica(e: ChangeEvent<HTMLInputElement>) {
    setTarefaPublica(e.target.checked)
  }

  async function handlePublicarTarefa(e: FormEvent) {
    e.preventDefault()

    if (input == "") return

    try {
      await addDoc(collection(db, "tarefas"), {
        tarefa: input,
        data_criacao: new Date(),
        usuario: usuario.email,
        tarefaPublica: tarefaPublica
      })

      setInput("")
      setTarefaPublica(false)
    } catch (error) {
      alert(error)
    }
  }

  async function handleCompartilhar(id: string) {
    await navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_URL}/tarefa/${id}`
    )
  }

  async function handleDeletarTarefa(id: string) {
    const docRef = doc(db, "tarefas", id)
    await deleteDoc(docRef)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title> Lista de Tarefas</title>
      </Head>
      <main className={styles.main}>
        <section className={styles.content}>
          <div className={styles.contentForm}>
            <h1 className={styles.title}>Qual a tarefa?</h1>

            <form className={styles.formulario} onSubmit={handlePublicarTarefa}>
              <TextArea
                placeholder='Digite aqui sua tarefa ...'
                value={input}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)} />
              <div className={styles.checkBoxArea}>
                <input
                  type='checkbox'
                  className={styles.checkBox}
                  checked={tarefaPublica}
                  onChange={handleTarefaPublica} />
                <label> Deixar tarefa publica?</label>
              </div>
              <button className={styles.button} type='submit'> Registrar</button>
            </form>
          </div>
        </section>
        <section className={styles.taskContainer}>
          <h1> Minhas Tarefas </h1>

          {tarefas.map(tarefa => (
            <article className={styles.task}>
              {tarefa.tarefaPublica && (
                <div className={styles.tagContainer}>
                  <label className={styles.tag}> PUBLICO </label>
                  <button className={styles.shareButton} onClick={() => handleCompartilhar(tarefa.id)}>
                    <FiShare2 size={22} color="#3183ff" />
                  </button>
                </div>
              )}

              <div className={styles.taskContent}>
                {tarefa.tarefaPublica ? (
                  <Link href={`/tarefa/${tarefa.id}`} >
                    <p> {tarefa.tarefa}</p>
                  </Link>
                ) : (
                  <p> {tarefa.tarefa}</p>
                )}
                <button className={styles.trashButton} onClick={() => handleDeletarTarefa(tarefa.id)}>
                  <FaTrash size={24} color="#ea3140" />
                </button>
              </div>
            </article>
          ))}

        </section>

      </main>
    </div>
  )
}


export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  if (!session?.user) {
    //se não tem usuario logado redireciona para Home
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    }
  }

  return {
    props: {
      usuario: {
        email: session?.user?.email,
        nome: session?.user?.name
      }
    }
  }
}