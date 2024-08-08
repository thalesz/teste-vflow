class BotaoSalvarFornecedor {
    constructor(buttonId, fornecedor, gerenciadorProdutos, gerenciadorAnexos) {
        this.$button = $('#' + buttonId);
        this.fornecedor = fornecedor;
        this.gerenciadorProdutos = gerenciadorProdutos;
        this.gerenciadorAnexos = gerenciadorAnexos;

        this.init();
    }

    init() {
        this.$button.on('click', () => this.validarEExibirJSON());
    }

    validarEExibirJSON() {
        // Validar dados do fornecedor
        const fornecedorData = this.fornecedor.getFornecedor();
        let erros = [];

        // Valida se todos os campos obrigatórios estão preenchidos
        if (!fornecedorData.razaoSocial) erros.push('Razão Social é obrigatório.');
        if (!fornecedorData.nomeFantasia) erros.push('Nome Fantasia é obrigatório.');
        if (!fornecedorData.cnpj) erros.push('CNPJ é obrigatório.');
        if (!fornecedorData.endereco) erros.push('Endereço é obrigatório.');
        if (!fornecedorData.nomePessoaContato) erros.push('Nome da pessoa de contato é obrigatório.');
        if (!fornecedorData.telefone) erros.push('Telefone é obrigatório.');
        if (!fornecedorData.email) erros.push('E-mail é obrigatório.');

        // Validar produtos
        const produtos = this.gerenciadorProdutos.getProdutos();
        if (produtos.length === 0) {
            erros.push('A tabela de produtos deve incluir pelo menos 1 item.');
        } else {
            produtos.forEach((p, index) => {
                if (!p.descricaoProduto) erros.push(`Descrição do produto ${index + 1} é obrigatória.`);
                if (!p.unidadeMedida || p.unidadeMedida === 'Escolha uma opção') erros.push(`Unidade de Medida do produto ${index + 1} é obrigatória.`);
                if (p.qtdeEstoque === '' || isNaN(p.qtdeEstoque)) erros.push(`Quantidade em Estoque do produto ${index + 1} é obrigatória e deve ser um número.`);
                if (p.valorUnitario === '' || isNaN(p.valorUnitario)) erros.push(`Valor Unitário do produto ${index + 1} é obrigatório e deve ser um número.`);
                // Valor Total é calculado automaticamente, não precisa ser validado diretamente.
            });
        }

        // Validar anexos
        const anexos = this.gerenciadorAnexos.getAnexos();
        if (anexos.length === 0) {
            erros.push('A tabela de anexos deve incluir pelo menos 1 documento.');
        }

        // Exibir mensagens de erro se houver
        if (erros.length > 0) {
            alert(erros.join('\n'));
            return;
        }

        // Exibir JSON se todas as validações passaram
        const produtosFinal = produtos.map((p, index) => ({
            indice: index + 1,
            descricaoProduto: p.descricaoProduto,
            unidadeMedida: p.unidadeMedida,
            qtdeEstoque: p.qtdeEstoque,
            valorUnitario: p.valorUnitario,
            valorTotal: (p.qtdeEstoque * p.valorUnitario).toFixed(2) // Calcula o valor total
        }));

        const anexosFinal = anexos.map((a, index) => ({
            indice: index + 1,
            nomeArquivo: a.nomeArquivo,
            blobArquivo: a.blobArquivo
        }));

        const fornecedorDataFinal = {
            razaoSocial: fornecedorData.razaoSocial,
            nomeFantasia: fornecedorData.nomeFantasia,
            cnpj: fornecedorData.cnpj,
            inscricaoEstadual: fornecedorData.inscricaoEstadual || '',
            inscricaoMunicipal: fornecedorData.inscricaoMunicipal || '',
            nomeContato: fornecedorData.nomePessoaContato,
            telefoneContato: fornecedorData.telefone,
            emailContato: fornecedorData.email,
            produtos: produtosFinal,
            anexos: anexosFinal
        };

        // Mostrar modal de loading
        this.exibirModalLoading();

        // Exibir o JSON no console
        console.log(JSON.stringify(fornecedorDataFinal, null, 2));
    }

    exibirModalLoading() {
        // Exemplo simples de exibição de modal de loading
        const modal = $('<div class="modal">Processando...</div>');
        $('body').append(modal);
        modal.show();

        // Remove o modal após 2 segundos (simulação de envio)
        setTimeout(() => {
            modal.hide();
            modal.remove();
        }, 2000);
    }
}
