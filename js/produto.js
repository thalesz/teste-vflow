class Produto {
    constructor(id, nome = '', unidadeMedida = 'Escolha uma opção', qtdeEstoque = '', valorUnitario = '') {
        this.id = id;
        this.nome = nome;
        this.unidadeMedida = unidadeMedida;
        this.qtdeEstoque = qtdeEstoque;
        this.valorUnitario = valorUnitario;
        this.valorTotal = this.calcularValorTotal();
    }

    calcularValorTotal() {
        let quantidade = parseInt(this.qtdeEstoque);
        let valorUnitario = parseFloat(this.valorUnitario);

        if (!isNaN(quantidade) && !isNaN(valorUnitario)) {
            let valorTotal = (quantidade * valorUnitario).toFixed(2);
            return valorTotal;
        }
        return '';
    }

    atualizar(campo, valor) {
        this[campo] = valor;
        this.valorTotal = this.calcularValorTotal();
    }

    isValid() {
        return this.nome !== '' && 
               this.unidadeMedida !== 'Escolha uma opção' && 
               this.qtdeEstoque !== '' && 
               this.valorUnitario !== '';
    }

    invalidFields() {
        const fields = [];
        if (this.nome === '') fields.push('nome');
        if (this.unidadeMedida === 'Escolha uma opção') fields.push('unidadeMedida');
        if (this.qtdeEstoque === '') fields.push('qtdeEstoque');
        if (this.valorUnitario === '') fields.push('valorUnitario');
        return fields;
    }
}
