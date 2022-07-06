const Main = {
    // -------Funções-------
    init: function() {
        this.cacheSelectors()
        this.bindEvents() 
        this.getStoraged()
        this.buildTasks()
        // nesse contexto "this" quer dizer que a função cacheSelectors e bindEvents está no pai da função init (Main)
    },

    // ---------Seletores-----
    cacheSelectors: function() {
        this.$checkButtons = document.querySelectorAll('.check')
        this.$inputTask = document.querySelector('#inputTask')
        this.$list = document.querySelector('#list')
        this.$removeButtons = document.querySelectorAll('.remove')

        // Colocar um $ sempre que a variável for armazenar algum elemento HTML: Boa prática
        
    },

    bindEvents: function() { // Dentro do bindEvents o this é o Main

        const self = this // Self = This = Main - Utilizado para resolver o problema.

        // Ao usar o this, é importante sempre verificar quem é o this naquele contexto utilizando console.log , pois algumas vezes pode apresentar um comportamento estranho.

        this.$checkButtons.forEach(function(button){ 
            button.onclick = self.Events.checkButton_click.bind(self)
            // Nesse caso o This estaria enxergando o objeto window
        })

        this.$inputTask.onkeypress = self.Events.inputTask_keypress.bind(this)
    
        // .bind(this) = Serve para ligar o this para essa função

        this.$removeButtons.forEach(function(button){
            button.onclick = self.Events.removeButton_click.bind(self)
        })
    },

    // ------ Pegar do local storage-------
    getStoraged: function() {
    const tasks = localStorage.getItem('tasks')
    
    if (tasks) {
        this.tasks = JSON.parse(tasks)
    } else {
        localStorage.setItem('tasks', JSON.stringify([]))
    }
    },
    
    // ------ Função para reutilizar a árvore do HTML --------
    getTaskHtml: function(task, isDone) {
        return `
          <li class="${isDone ? 'done' : ''}" data-task="${task}">          
            <div class="check" ></div>
            <label class="task">
              ${task}
            </label>
            <button class="remove"></button>
          </li>
        `
    },

    // ------- Função para inserir o HTML --------
    insertHTML: function(element, htmlString) {
        element.innerHTML += htmlString
    
        this.cacheSelectors()
        this.bindEvents()
      },
    
    // -------- Construir as tarefas no HTML--------
    buildTasks: function() {
        let html = ''
    
        this.tasks.forEach(item => {
          html += this.getTaskHtml(item.task, item.done)
        })
    
        this.insertHTML(this.$list, html)
    },

    //--------- Todos os eventos--------
    Events: {
        checkButton_click: function(e) {
          const li = e.target.parentElement
          const value = li.dataset['task']
          const isDone = li.classList.contains('done')
          
          // contains : Verificar se existe uma classe específica dentro do classList
          // Tem a classe: True / Não tem a classe = False

          const newTasksState = this.tasks.map(item => {
            if (item.task === value) {
              item.done = !isDone
            }
    
            return item
          })
    
          localStorage.setItem('tasks', JSON.stringify(newTasksState))

          
          // É uma boa prática verificar primeiro a negação da variável e se caso entrar no if nós já queremos retornar um determinado valor
          
          // Nesse caso, nós estamos retornando a adição da classe done
    
          if (!isDone) { // Se não tiver a classe : Adiciona
            return li.classList.add('done')  // O return é pora não deixar a execução passar.
          }
    
          li.classList.remove('done')
        },
    
        // function(e) = Pegar o evento
        inputTask_keypress: function(e){      
          const key = e.key
          const value = e.target.value
          const isDone = false

            // Dentro de uma função de evento o this será o própio elemento que nós adicionamos o evento (html)
    
          if (key === 'Enter') {
            const taskHtml = this.getTaskHtml(value, isDone)
    
            this.insertHTML(this.$list, taskHtml) // Sempre que a gente modificar a árvore de HTML ou inserir um item novo devemos adicionar os eventos novamente!
    
            e.target.value = ''        
    
            const savedTasks = localStorage.getItem('tasks')
            const savedTasksArr = JSON.parse(savedTasks)        
    
            const arrTasks = [
              { task: value, done: isDone },
              ...savedTasksArr,
            ]
    
            const jsonTasks = JSON.stringify(arrTasks)
    
            this.tasks = arrTasks
            localStorage.setItem('tasks', jsonTasks)
          }
        },
    
        removeButton_click: function(e){
          const li = e.target.parentElement
          const value = li.dataset['task']  
          
          console.log(this.tasks)
    
          const newTasksState = this.tasks.filter(item => {
            console.log(item.task, value)
            return  item.task !== value
          })
    
          localStorage.setItem('tasks', JSON.stringify(newTasksState))
          this.tasks = newTasksState
    
          li.classList.add('removed')
    
          setTimeout(function(){
            li.classList.add('hidden')
          },300)
        }
      }
    
    }

Main.init()
