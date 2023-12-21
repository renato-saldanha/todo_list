import { useState } from 'react';
import { TarefaProps } from '../../App';
import styles from './NewTask.module.css';
import { PlusCircle } from '@phosphor-icons/react';

export default function NewTask({ tarefas, criarTarefa }: TarefaProps) {
  const [descricaoTarefa, setDescricaoTarefa] = useState('')

  function handleCriarTarefa(event) {
    event.preventDefault();


    const novaTarefa: TarefaProps = {
      id: tarefas.length + 1,
      descricao: descricaoTarefa,
      tarefaConcluida: false
    }

    criarTarefa(novaTarefa)
  }

  return (
    <div className={styles.newTask}>
      <input
        id='descricaoTarefa'
        name='descricaoTarefa'
        value={descricaoTarefa}
        onChange={e => setDescricaoTarefa(e.target.value)}
        type='text'
        placeholder='   Digite a nova tarefa aqui' />
      <button onClick={handleCriarTarefa} > Criar <PlusCircle style={{ marginLeft: 5 }} size={18} /> </button>
    </div >
  )
}