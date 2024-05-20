import * as funcoes from "./funcoes.js";

// em product__card, se não houver produtos, é exibida uma mensagem indicando que "nenhum produto foi adicionado".

const elementos = await funcoes.pegaProdutos();
const divElementos = document.getElementById('products__render');
funcoes.carregaProdutos(elementos, divElementos);
