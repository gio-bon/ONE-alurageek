const porta = 3001;

export async function pegaProdutos() {
    const dados = await fetch(`http://localhost:${porta}/produtos`);
    const json = await dados.json();
    return json;
}

export async function carregaProdutos(elementos, divElementos) {
    let contagem = 0;
    elementos.forEach(element => {
        const novoElemento = document.createElement('div');
        novoElemento.classList.add('product__card');
        novoElemento.innerHTML = `
            <div class="product__card" data-id="${element.id}">
                <img src="${element.imagem}" alt="Imagem do produto" class="product__image">
                <h2 class="product__title">${element.nome}</h2>
                <div class="card__text">
                    <p class="product__price">R$ ${element.preco}</p>
                    <button id="btn-delete" data-delete-id="${element.id}"><i class="nf nf-md-delete"></i></button>
                </div>
            </div>`;
        
        divElementos.appendChild(novoElemento);
        contagem = contagem + 1;
    });
    adicionaEventosDeletar();
    if(contagem == 0) {
        const div_empty = document.getElementById('img-empty');
        const titulo = document.getElementById('tit-prod');
        const novoElemento = document.createElement('div');
        novoElemento.innerHTML = `<img src="Assets/undraw_taken.svg" alt="Imagem de sem produtos" id="sem-produtos">`;
        div_empty.appendChild(novoElemento);
        titulo.textContent = 'Nenhum produto foi adicionado';
    }
}

function adicionaEventosDeletar() {
    document.querySelectorAll('[data-delete-id]').forEach(deleteButton => {
        deleteButton.addEventListener('click', (event) => {
            const id = event.target.closest('[data-delete-id]').getAttribute('data-delete-id');
            deletaProduto(id);
        });
    });
}

export async function deletaProduto(id) {
    try {
        const response = await fetch(`http://localhost:${porta}/produtos/${id}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            document.querySelector(`[data-id="${id}"]`).remove();
            console.log(`Produto com ID ${id} deletado com sucesso`);
        } else {
            console.error(`Falha ao deletar o produto com ID ${id}`);
        }
    } catch (error) {
        console.error('Erro:', error);
    }
}

function insereProdutos(nome, valor, imagem) {
    fetch(`http://localhost:${porta}/produtos`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nome: nome,
            preco: valor,
            imagem: imagem
        })
    });
}

/* evento de captura do formulário */
document.getElementById('form-add').addEventListener('submit', async (event) => {
    event.preventDefault();
    const nome = document.querySelector('[data-nome]').value;
    let valor = document.querySelector('[data-valor]').value;
    const imagem = document.querySelector('[data-imagem]').value;

    try{
        valor = Number(valor);
        let formulario = document.getElementById('form-add');

        if (isNaN(valor)) {
            let msg_erro = document.createElement('span');
            msg_erro.classList.add('form__error');
            msg_erro.textContent = 'O valor deve ser um número';
            formulario.appendChild(msg_erro);
            return;
        }
        if (!isValidURL(imagem)) {
            let msg_erro = document.createElement('span');
            msg_erro.classList.add('form__error');
            msg_erro.textContent = 'A imagem deve ser uma URL';
            formulario.appendChild(msg_erro);
            return;
        }
        
    }
    catch(error){
        console.log(error);
    }

    insereProdutos(nome, valor, imagem);
    document.getElementById('form-add').reset();
});

function isValidURL(url) {
    const urlPattern = /^(https?:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/.*)?$/;
    return urlPattern.test(url);
}


document.getElementById('form-add').addEventListener('reset', (event) => {
    console.log('Botao de reset foi pressionado');
    const messages_erro = document.querySelectorAll('.form__error');
    messages_erro.forEach(message => {
        message.remove();
    });
});
