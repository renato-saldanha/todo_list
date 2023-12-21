import Header from './components/Header'

import styles from './App.module.css'
import NewTask from './components/NewTask'
import TodoList from './components/TodoList'
import { useState } from 'react'

export interface TarefaProps {
  id: number,
  descricao: string,
  tarefaConcluida: boolean
}


function App() {
  const [tarefas, setTarefas] = useState(
    [
      {
        id: 1,
        descricao: 'Lavar louças',
        tarefaConcluida: false
      },
      {
        id: 2,
        descricao: 'Arrumar roupas',
        tarefaConcluida: false
      },
      {
        id: 3,
        descricao: 'Guardar sapatos',
        tarefaConcluida: false
      },
      {
        id: 4,
        descricao: 'Guardar louças',
        tarefaConcluida: false
      }
    ])

  function deletarTarefa(tarefa: TarefaProps) {
    const tarefasAtualizadas = tarefas.filter((t) => { return tarefa.id !== t.id });
    setTarefas(tarefasAtualizadas)
  }

  function atualizarTarefa(tarefa: TarefaProps) {
    const tarefasAtualizadas = tarefas.filter((t) => { return tarefa.id !== t.id });
    const tarefaAlterada = tarefas.filter((t) => { return tarefa.id === t.id })[0];
    tarefaAlterada.tarefaConcluida = !tarefaAlterada.tarefaConcluida;
    tarefasAtualizadas.push(tarefaAlterada);
    setTarefas(tarefasAtualizadas)
  }

  function criarTarefa(tarefa: TarefaProps) {
    const tarefasAtualizadas = [...tarefas, tarefa]
    setTarefas(tarefasAtualizadas);
  }

  return (
    <div className={styles.app}>
      <Header />
      <div className={styles.body}>
        <div className={styles.content}>
          <NewTask
            tarefas={tarefas}
            criarTarefa={criarTarefa} />
          <TodoList
            tarefas={tarefas}
            atualizarTarefa={atualizarTarefa}
            deletarTarefa={deletarTarefa} />
        </div>
      </div>
    </div>



  )
}

export default App
