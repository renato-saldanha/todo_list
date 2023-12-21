import { Circle, CheckCircle, Trash } from '@phosphor-icons/react'
import { TarefaProps } from '../../App'

import styles from './Tarefa.module.css'

export default function Tarefa({ tarefa, atualizarTarefa, deletarTarefa }: TarefaProps) {
  function handledeletarTarefa() {
    deletarTarefa(tarefa);
  }

  function handleAtualizarTarefa() {
    atualizarTarefa(tarefa);
  }

  return (
    <div className={styles.task}>
      {tarefa && tarefa.tarefaConcluida ? (
        <CheckCircle
          className={styles.checkedCircle}
          onClick={handleAtualizarTarefa}
          size={16} />
      ) : (
        <Circle
          className={styles.circle}
          onClick={handleAtualizarTarefa}
          size={16} />
      )}
      <b>{tarefa.descricao}</b>
      <Trash
        size={18}
        onClick={handledeletarTarefa}
        className={styles.delete} />
    </div>
  )
}