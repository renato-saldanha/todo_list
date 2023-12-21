import styles from './TodoList.module.css'

import Tarefa from '../Tarefa'
import { TarefaProps } from '../../App';
import { ClipboardText } from '@phosphor-icons/react';

interface Tarefas {
  tarefas: TarefaProps[];
}

export default function TodoList({ tarefas, atualizarTarefa, deletarTarefa, }: Tarefas) {
  function getQuantiaTarefasCriadas() {
    return tarefas.length;
  }

  function getQuantiaTarefasConcluidas() {
    const totalTarefas = tarefas.length;
    const totalTarefasConcluidas = tarefas.filter(t => t.tarefaConcluida !== false).length;
    return totalTarefasConcluidas + ' de ' + totalTarefas;
  }

  return (
    <div className={styles.todoList}>
      <div className={styles.statusLista}>
        <div className={styles.tarefasCriadas}>
          <b className={styles.textoTarefasCriadas}>Tarefas Criadas</b>
          <div className={styles.countTarefasCriadas}>
            {getQuantiaTarefasCriadas()}
          </div>
        </div>
        <div className={styles.tarefasConcluidas}>
          <b className={styles.textoTarefasConcluidas}>Concluídas</b>
          <div className={styles.countTarefasConcluidas}>
            {getQuantiaTarefasConcluidas()}
          </div>
        </div>
      </div>

      {tarefas && tarefas.length > 0 ? (
        tarefas.map((tarefa) => (
          <Tarefa
            key={tarefa.id}
            tarefa={tarefa}
            atualizarTarefa={atualizarTarefa}
            deletarTarefa={deletarTarefa} />
        ))
      ) : (
        <div className={styles.lista}>
          <ClipboardText size={56} />
          <b>Você ainda não tem tarefas cadastradas</b>
          <b style={{ fontWeight: 'normal' }}>Crie tarefas e organize seus itens a fazer</b>
        </div>
      )}
    </div>
  )
}