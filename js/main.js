
const Main = {

    init: function() {
        this.cacheSelectors()
        this.bindEvents() 
        // nesse contexto "this" quer dizer que a função cacheSelectors e bindEvents está no pai da função init (Main)
    },

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
            button.onclick = self.Events.checkButton_click 
            // Nesse caso o This estaria enxergando o objeto window
        })

        this.$inputTask.onkeypress = self.Events.inputTask_keypress.bind(this)
    
        // .bind(this) = Serve para ligar o this para essa função

        this.$removeButtons.forEach(function(button){
            button.onclick = self.Events.removeButton_click
        })
    },


    Events: {
        checkButton_click: function(e) {
            const li = e.target.parentElement
            const isDone = li.classList.contains('done')

            // contains : Verificar se existe uma classe específica dentro do classList
            // Tem a classe: True / Não tem a classe = False
            

            // É uma boa prática verificar primeiro a negação da variável e se caso entrar no if nós já queremos retornar um determinado valor

            // Nesse caso, nós estamos retornando a adição da classe done
            if (!isDone) { // Se não tiver a classe : Adiciona
                 return li.classList.add('done')
                 // O return é pora não deixar a execução passar.
            }

            li.classList.remove('done')
        },

        // function(e) = Pegar o evento
        inputTask_keypress: function(e) {
            const key = e.key
            const value = e.target.value

            // Dentro de uma função de evento o this será o própio elemento que nós adicionamos o evento (html)

            if (key === 'Enter') {
                this.$list.innerHTML += `
                    <li>
                        <div class="check"></div>
                        <label class="task">
                            ${value}
                        </label>
                        <button class="remove"></button>
                    </li>
                `

                e.target.value = ''

                this.cacheSelectors()
                this.bindEvents()

                // Sempre que a gente modificar a árvore de HTML ou inserir um item novo devemos adicionar os eventos novamente!
            }
        },

        removeButton_click: function(e){
            let li = e.target.parentElement

            li.classList.add('removed')

            setTimeout(function(){
                li.classList.add('hidden')
            },300)
        }
    }
}


Main.init()