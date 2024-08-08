class GerenciadorProdutos {
    constructor() {
        this.produtos = [];
        this.id = 0;

        this.inicializarEventos();
        this.adicionarProduto(); // Inicializa a exibição com um produto de exemplo
    }

    inicializarEventos() {
        $('#addProductBtn').on('click', () => this.adicionarProduto());
        $('#produtosContainer').on('click', '.remove-product-btn', (e) => {
            const produtoId = $(e.currentTarget).closest('.produto-component').data('key').split('-')[2];
            this.removerProduto(parseInt(produtoId));
        });

        $('#produtosContainer').on('input', '.produto-input', (e) => {
            const $input = $(e.currentTarget);
            const campo = $input.data('campo');
            let valor = $input.val();

            if (campo === 'qtdeEstoque') {
                valor = valor.replace(/[^0-9]/g, '');
            } else if (campo === 'valorUnitario') {
                valor = valor.replace(/[^0-9.]/g, '');
                const [inteiro, decimal] = valor.split('.');
                if (decimal) {
                    valor = `${inteiro}.${decimal.slice(0, 2)}`;
                }
            }

            $input.val(valor);

            const produtoId = $input.closest('.produto-component').data('key').split('-')[2];
            const produto = this.produtos.find(p => p.id == produtoId);

            if (produto) {
                produto.atualizar(campo, valor);
                $input.closest('.produto-component').find('.produto-total').val(produto.valorTotal);
            }
        });
    }

    todosProdutosValidos() {
        return this.produtos.every(produto => produto.isValid());
    }

    adicionarProduto() {
        if (!this.todosProdutosValidos()) {
            alert('Todos os produtos existentes devem estar completamente preenchidos antes de adicionar um novo produto.');
            this.destacarCamposInvalidos();
            return;
        }

        let produto = new Produto(this.id);
        this.produtos.push(produto);
        this.id = this.produtos.length;
        this.renderizarProdutos();
    }

    removerProduto(id) {
        if (this.produtos.length <= 1) {
            alert('Não é possível remover o único produto.');
            return;
        }

        this.produtos = this.produtos.filter(produto => produto.id !== id);
        this.produtos.forEach((produto, index) => produto.id = index);
        this.id = this.produtos.length;
        this.renderizarProdutos();
    }

    destacarCamposInvalidos() {
        this.produtos.forEach(produto => {
            if (!produto.isValid()) {
                const produtoId = `produto-id-${produto.id}`;
                const $produtoComponent = $(`#produtosContainer [data-key="${produtoId}"]`);
                const camposInvalidos = produto.invalidFields();
                
                camposInvalidos.forEach(campo => {
                    $produtoComponent.find(`.produto-input[data-campo="${campo}"]`).focus().css('border', '2px solid red');
                });
            }
        });
    }

    renderizarProdutos() {
        const $container = $('#produtosContainer');
        const $template = $('#produtoTemplate');

        $container.find('.produto-component').not('#produtoTemplate').remove();

        this.produtos.forEach((produto, index) => {
            const produtoId = `produto-id-${produto.id}`;
            let $produtoClone = $container.find(`[data-key="${produtoId}"]`);

            if ($produtoClone.length === 0) {
                $produtoClone = $template.clone().removeAttr('id').removeClass('d-none');
                $produtoClone.attr('data-key', produtoId);
                $container.append($produtoClone);
            }

            $produtoClone.find('.produto-id').text(`${index + 1}`);
            $produtoClone.find('.produto-input[data-campo="nome"]').val(produto.nome);
            $produtoClone.find('.produto-input[data-campo="unidadeMedida"]').val(produto.unidadeMedida);
            $produtoClone.find('.produto-input[data-campo="qtdeEstoque"]').val(produto.qtdeEstoque);
            $produtoClone.find('.produto-input[data-campo="valorUnitario"]').val(produto.valorUnitario);
            $produtoClone.find('.produto-total').val(produto.valorTotal);

            if (this.produtos.length === 1) {
                $produtoClone.find('.produto-input').prop('disabled', false);
                $produtoClone.find('.remove-product-btn').hide();
            } else {
                $produtoClone.find('.produto-input').prop('disabled', false);
                $produtoClone.find('.remove-product-btn').show();
            }
        });
    }
    getProdutos() {
        return this.produtos.map(p => ({
            indice: p.id,
            descricaoProduto: p.nome,
            unidadeMedida: p.unidadeMedida,
            qtdeEstoque: p.qtdeEstoque,
            valorUnitario: p.valorUnitario,
            valorTotal: p.valorTotal
        }));
    }
}

