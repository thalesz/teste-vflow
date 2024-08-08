$(document).ready(function() {
    console.log('Documento pronto.');

    let gerenciadorProdutos;
    let fornecedor;
    let gerenciadorAnexos;
    let botaoSalvarFornecedor;

    // Carregar cabeçalho
    $('#header').load('components/Header.html', function() {
        console.log('Cabeçalho carregado.');
    });

    // Carregar formulário de fornecedor
    $('#fornecedor-form').load('components/Fornecedor.html', function() {
        console.log('Formulário de fornecedor carregado.');
        fornecedor = new Fornecedor();
    });

    // Carregar seção de produtos
    $('#produtos-section').load('components/Produtos.html', function() {
        console.log('Seção de produtos carregada.');
        gerenciadorProdutos = new GerenciadorProdutos();
    });

    // Carregar seção de anexos e criar o Botão Salvar Fornecedor após
    $('#anexos-section').load('components/Anexos.html', function() {
        console.log('Seção de anexos carregada.');
        gerenciadorAnexos = new GerenciadorAnexos('anexosContainer', 'templateAnexo', 'addAnexoBtn', 'fileInput');

        // Após carregar e inicializar gerenciadorAnexos
        $('#btn-submit-section').load('components/Botao.html', function() {
            console.log('Botão carregado.');
            botaoSalvarFornecedor = new BotaoSalvarFornecedor('saveFornecedorBtn', fornecedor, gerenciadorProdutos, gerenciadorAnexos);
        });
    });
});
